# Google Shopping List

Scrapes the shopping list from shoppinglist.google.com as Google does not seem to have an API for this.

It is recommened to make a new Google account, share your shopping list and make it the primary list. Make sure not to set any extra security features other than a password, this will cause the script to break.

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

**googleshoppinglist.getList(credentials[, options])**

* `credentials` <[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)>
  * `email` <[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)> A Google email
  * `password` <[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)> The password for your google email
* `options` <[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)>
  * `cookies` <[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)> Will store the cookies from the first session in a json file and use them in consequent connections until they expire. This speeds up the return. Defaults to `false`

* returns: <[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)>> Promise which resolves an array containing the list items

## Dependencies

[puppeteer](https://www.npmjs.com/package/puppeteer)
[fs-extra"](https://www.npmjs.com/package/fs-extra)
[winston](https://www.npmjs.com/package/winston)
