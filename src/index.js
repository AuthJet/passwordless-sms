const request = require('./request.js');
const fs = require('fs');
const path = require('path');
const AuthJetStore = require('passwordless-authjetstore');
const random = require('random-gen');

const loginForm = fs.readFileSync(path.join(__dirname, '../views/login.html')).toString();
const verifyForm = fs.readFileSync(path.join(__dirname, '../views/verify.html')).toString();
let appUrl, _store, ttl = 5 * 60 * 1000, tokenAlgorithm = () => random.upper(4);

function delivery(){
	return (token, uid, recipient, cb) => {
		const sendUrl = `${appUrl}/deliver?token=${token}&uid=${encodeURIComponent(uid)}&recipient=${recipient}`;
		request(sendUrl, cb);
	};
}

function init(username, password, appId){
	if (appUrl){
		throw new Error('password-sms has already been initialized');
	} else if (!username || !password || !appId){
		throw new Error('password-sms must be initialized with username, password, and appId');
	} else {
		appUrl = `https://${username}:${password}@authjet.com/api/passwordless/${appId}`;
		_store = AuthJetStore(username, password, appId);
		request(`${appUrl}/details`, (err, app) => {
			ttl = app.minutesValid * 60 * 1000;
			tokenAlgorithm = () => random[app.pattern](app.length);
		});
	}
}

module.exports = {
	init,
	delivery,
	store: () => _store,
	sendLoginForm: () => (req, res) => res.send(loginForm),
	sendVerifyForm: () => (req, res) => res.send(verifyForm.replace('{{uid}}', req.passwordless.uidToAuth)),
	options: () => Object({ttl, tokenAlgorithm: () => tokenAlgorithm()})
};