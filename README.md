# Google Shopping List


Scrapes the shopping list from shoppinglist.google.com as Google does not seem to have an API for this.

It is recommened to make a new Google account, share your shopping list and make it the primary list.

## Usage 

	const googleshoppinglist = require('google-shopping-list');

	let creds = {
		email: 'email',
		password: 'password'
	};

	googleshoppinglist.getList(creds).then(res => {
		console.log(res);
	});

------------------

## API

**googleShoppingList.getList(credentials)**

* credentials <[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)>
	* email: <[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)> A Google email
	* password: <[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)> The password for your google email


* returns: <[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)>> Promise which resolves an array containing the list items

## Dependencies

[puppeteer](https://www.npmjs.com/package/puppeteer)