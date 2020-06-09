const 	puppeteer = require('puppeteer'),
		fs = require('fs-extra'),
		logger = require('./lib/logger');
		to = require('./lib/to');

const ERROR_CHECK = 'body > div > div.main.content.clearfix > div',
	USERNAME_SELECTOR = '#Email',
	EMAIL_NEXT_BUTTON = '#next',
	PASSWORD_SELECTOR = '#Passwd',
	PASSWORD_NEXT_BUTTON = '#submit',
	SHOPPINGLIST_ITEMS = '.listItemTitle';

let exp = module.exports;

exp.getList = async (creds, options = { cookies: false }) => {
	let err, list, browser, page;

	if(!creds) {
		return Error('Credentials not supplied');
	} else if(!('email' in creds)) {
		return Error('Email not supplied');
	} else if (!('password' in creds)) {
		return Error('Password not supplied');
	}

	// Turn headless to false to debug
	[err, browser] = await to( puppeteer.launch({ headless: true }) );
	if(err) return Error("Unable to launch the browser");

	[err, page] = await to( browser.newPage() );
	if(err) return Error("Unable to create a new page");

	// Have to set this because some pages display differently for Headless Chrome
	[err] = await to( page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/65.0.3312.0 Safari/537.36'));
	if(err) return Error("Unable to set the user agent");

	// If cookies option is enabled
	if(options.cookies) {
		let loadedCookies;
		[err, loadedCookies] = await to( loadCookies() );
		if(err) logger.verbose("No cookie file.")

		if(loadedCookies) {
			if(creds.email in loadedCookies) { // Check cookies file contains cookies for the specified email if true, set cookies
				[err] = await to( page.setCookie(...loadedCookies[creds.email]) );
				if(err) logger.Error("Unable to set cookies in browser");
			}
		}
	}

	[err] = await to( page.goto('https://shoppinglist.google.com', {waitUntil: 'domcontentloaded'}) );
	if(err) return Error("Unable to go to url https://shoppinglist.google.com");

	logger.verbose("Go to https://shoppinglist.google.com")

	// If you are not logged in google redirects you to a different url
	if(page.url() !== 'https://shoppinglist.google.com/') {
		logger.verbose("Not logged in")
		await logIn(page, creds);
	}

	logger.verbose("Logged in")

	[err] = await to( page.waitFor(SHOPPINGLIST_ITEMS) );
	if(err) return Error("Unable to see the shopping list");

	logger.verbose("Found the shopping list");

	if(options.cookies) { // If cookies option is enabled
		const cookies = await page.cookies();
		await saveCookies(creds.email, cookies);
	}	

	[err, list] = await to( page.evaluate(selector => {
		let items = [];
		let allItems = document.querySelectorAll(selector);
		allItems.forEach(res => items.push(res.innerHTML.trim())); // Must use a forEach as it is a nodeList not an array, convert to array
		// If the end of array is the 'checked off' list item remove it
		if(items[items.length - 1].includes("checked off")) items.pop();
		return items;
	}, SHOPPINGLIST_ITEMS) );
	if(err) return Error("Unable to get the shopping list items");

	await browser.close();

	return list;
}

async function logIn(page, creds) {
	[err] = await to( page.click(USERNAME_SELECTOR) );
	if(err) return Error("Unable to find the username field");

	logger.verbose('Clicked username');

	[err] = await to( page.keyboard.type(creds.email) );
	if(err) return Error("Unable to enter email");

	logger.verbose('Entered email');

	[err] = await to( page.click(EMAIL_NEXT_BUTTON) );
	if(err) return Error(err, "Unable to click the next button");

	logger.verbose('Click next button');

	[err] = await to( page.waitFor(PASSWORD_NEXT_BUTTON) );
	if(err) return Error(err, "Unable to see the password page");

	logger.verbose("Sign in button seen");

	[err] = await to( page.keyboard.type(creds.password) );
	if(err) return Error(err, "Unable to enter the password");

	logger.verbose("Entered password");

	[err] = await to( page.click(PASSWORD_NEXT_BUTTON) );
	if(err) return Error(err, "Unable to click the signin button");

	logger.verbose("Clicked sign in");
}

async function saveCookies(email, cookies) {
	cookies = {[email]: cookies}

	const [err] = await to ( fs.writeJson('./cookies.json', cookies) )
	if(err) {
		logger.error(Error(err));
		return Error(err);
	}

	logger.verbose('Cookies written to file');
	return true;
}

async function loadCookies() {
	const [err, cookies] = await to ( fs.readJson('./cookies.json') )
	if(err) {
		logger.error(Error(err));
		return Error(err);
	}

	logger.verbose('Cookies read from file');
	return cookies;
}
