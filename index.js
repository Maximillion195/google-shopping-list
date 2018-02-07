const 	puppeteer = require('puppeteer'),
		fs = require('fs-extra'),
		logger = require('./lib/logger');

let exp = module.exports;

exp.getList = function(creds, options) {
	return new Promise((resolve,reject) => {

		if(options === undefined) { // Set default options
			options = {
				cookies: false
			}
		}

		if(!creds) {
			reject(new Error('Credentials not supplied'));
		} else if(!('email' in creds)) {
			reject(new Error('Email not supplied'));
		} else if (!('password' in creds)) {
			reject(new Error('Password not supplied'));
		} else {
			get();
		}
		logger.error('test')
		async function get() {
			const ERROR_CHECK = 'body > div > div.main.content.clearfix > div'
			const USERNAME_SELECTOR = '#Email';
			const EMAIL_NEXT_BUTTON = '#next';
			const PASSWORD_SELECTOR = '#Passwd';
			const PASSWORD_NEXT_BUTTON = '#signIn';
			const SHOPPINGLIST_ITEMS = '.listItemTitle';

			const browser = await puppeteer.launch({
		  		headless: true // Turn this to false to debug
			});
			const page = await browser.newPage();
			await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/65.0.3312.0 Safari/537.36') // Have to set this because some pages display differently for Headless Chrome
			
			if(options.cookies) { // If cookies option is enabled
				let loadedCookies = await loadCookies();
				if(creds.email in loadedCookies) { // Check cookies file contains cookies for the specified email if true, set cookies
					await page.setCookie(...loadedCookies[creds.email]);
				}
			}

			await page.goto('https://shoppinglist.google.com', {waitUntil: 'networkidle0'});

			if(page.url() != 'https://shoppinglist.google.com/') { // If you are not logged in google redirects you to a different url
				await page.click(USERNAME_SELECTOR);
				await page.keyboard.type(creds.email);
				await page.click(EMAIL_NEXT_BUTTON);
				await page.waitForNavigation();
				await page.keyboard.type(creds.password);
				await page.click(PASSWORD_NEXT_BUTTON);
				await page.waitForNavigation({waitUntil: 'networkidle0'});

				if(options.cookies) { // If cookies option is enabled
					let cookies = await page.cookies();
					await saveCookies(creds.email, cookies);
				}	
			}

			let list = await page.evaluate(selector => {
				let items = [];
				let allItems = document.querySelectorAll(selector);
				allItems.forEach(res => items.push(res.innerHTML)); // Must use a forEach as it is a nodeList not an array, convert to array
				items.pop(); // Removes last element from array as it is not a list item
				return items;
			}, SHOPPINGLIST_ITEMS)

		 	await browser.close();

		 	resolve(list);
		}
	})
}

async function saveCookies(email, cookies) {
	cookies = {[email]: cookies}
	try {
	    await fs.writeJson('./cookies.json', cookies)
	 	logger.verbose('Cookies written to file');
	 	return;
	 } catch (err) {
	 	logger.error(new Error(err));
	 	return new Error(err);
	 }
}

async function loadCookies() {
	try {
	    let cookies = await fs.readJson('./cookies.json')
	 	logger.verbose('Cookies read from file');
	 	return cookies;
	 } catch (err) {
	 	logger.error(new Error(err));
	 	return new Error(err);
	 }
}
