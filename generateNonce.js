generateNonce.js;
const cryptoRandomString = require('crypto-random-string');

const generateNonce = () => {
	return cryptoRandomString.randomBytes(16).toString('base64');
};

module.exports = generateNonce;
