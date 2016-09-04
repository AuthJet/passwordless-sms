const https = require('https');
const url = require('url');

const request = (href, cb) => {
	let out = '';
	let statusCode;
	const req = https.get(url.parse(href), res => {
		statusCode = res.statusCode;
		res.on('data', data => out += data);
	});
	req.on('close', () => {
		if (statusCode == 200){
			try {
				return cb(null, JSON.parse(out));
			} catch (e){
				return cb(null, out);
			}
		} else if (statusCode == 401){
			return cb(new Error('AuthJet Not Authenticated'));
		} else if (statusCode == 500){
			return cb(new Error('Internal AuthJet Server Error'));
		} else if (statusCode == 404){
			return cb(new Error('AuthJet app not found'));
		} else {
			return cb(new Error(out));
		}
	});
	req.on('error', cb);
};

module.exports = request;