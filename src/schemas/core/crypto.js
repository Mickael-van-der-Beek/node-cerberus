var crypto = require('crypto');

module.exports = {

	createCipher: {
		input: [{
			name: 'algorithm',
			type: 'String'
		}, {
			name: 'password',
			type: ['String', 'Buffer']
		}],
		output: [{
			type: crypto.Cipher
		}]
	}

};
