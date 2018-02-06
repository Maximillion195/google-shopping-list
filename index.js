const puppeteer = require('puppeteer');
let exp = module.exports;

exp.getList = function(creds) {
	return new Promise((resolve,reject) => {

		if(!creds) {
			reject(new Error('Credentials not supplied'));
		} else if(!('email' in creds)) {
			reject(new Error('Email not supplied'));
		} else if (!('password' in creds)) {
			reject(new Error('Password not supplied'));
		} else {
			get();
		}

		function get() {
			const ERROR_CHECK = 'body > div > div.main.content.clearfix > div'
			const USERNAME_SELECTOR = '#Email';
			const EMAIL_NEXT_BUTTON = '#next';
			const PASSWORD_SELECTOR = '#Passwd';
			const PASSWORD_NEXT_BUTTON = '#signIn';
			const SHOPPINGLIST_ITEMS = '.listItemTitle';

			(async () => {
				const browser = await puppeteer.launch({
			  		headless: true // Turn this to false to debug
				});
				const page = await browser.newPage();
				await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/65.0.3312.0 Safari/537.36') // Have to set this because some pages display differently for Headless Chrome
				await page.goto('https://shoppinglist.google.com', {waitUntil: 'networkidle0'});
				await page.click(USERNAME_SELECTOR);
				await page.keyboard.type(creds.email);
				await page.click(EMAIL_NEXT_BUTTON);
				await page.waitForNavigation();
				await page.keyboard.type(creds.password);
				await page.click(PASSWORD_NEXT_BUTTON);
				await page.waitForNavigation({waitUntil: 'networkidle0'});

				let list = await page.evaluate(selector => {
					let items = [];
					let allItems = document.querySelectorAll(selector);
					allItems.forEach(res => items.push(res.innerHTML)); // Must use a forEach as it is a nodeList not an array, convert to array
					items.pop(); // Removes last element from array as it is not a list item
					return items;
				}, SHOPPINGLIST_ITEMS)

			 	await browser.close();

			 	resolve(list);
			})();
		}
	})
}