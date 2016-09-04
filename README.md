# passwordless-sms
The simplest way to add SMS delivery to your [Passwordless](https://passwordless.net) node app.

# AuthJet
passwordless-sms uses [AuthJet](https://authjet.com) to send tokens via SMS. An AuthJet account is required in order to send messages. You can sign up for an account and purchase messages by going to https://AuthJet.com/register . With your registration, you will receive **100 free messages** for testing!

# Installation 
```bash
$ npm install --save passwordless-sms
```

# Usage
Here is a simple example of how to use passwordless-sms
```javascript
const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const passwordless = require('passwordless');
const SMS = require('passwordless-sms');

SMS.init('USERNAME', 'PASSWORD', 'APP_ID'); // initialization
passwordless.init(SMS.store()); // optionally use AuthJet's free cloud TokenStore
passwordless.addDelivery(SMS.delivery(), SMS.options()); // options are all set up for you

// example express setup
app.use(session({resave: true, saveUninitialized: true, secret: 'secret'}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(passwordless.sessionSupport());
app.use(passwordless.acceptToken({allowPost: true, successRedirect: '/account'}));

app.get('/login', SMS.sendLoginForm()); // optionally send default login form
app.post('/login',passwordless.requestToken((phone, delivery, cb, req) => cb(null, phone)), SMS.sendVerifyForm()); // optionally send default verify form

app.get('/account', (req, res) => res.send(`Welcome ${req.user}!`));

app.listen(3000, () => console.log('listening'));
```

# Options
You are only required to use SMS.init() and SMS.deliver() to get up and running. All other functionality is optional.

# Author
[AuthJet](https://github.com/authjet)