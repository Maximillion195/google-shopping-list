const googleshoppinglist = require('./index'),
     to = require('./lib/to');

const creds = {
	email: '',
	password: ''
};

getList = async () => {
    const [err, res] = await to ( googleshoppinglist.getList(creds, { cookies: true }) );
    if(err) throw err;
    
    console.log(res);
}

getList();
