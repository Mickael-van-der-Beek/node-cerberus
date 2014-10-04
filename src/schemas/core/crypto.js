var crypto = require('crypto');

module.exports = {

	// createCredentials: {
	// 	input: [{
	// 		name: 'pfx',
	// 		type: 'String' // or Buffer
	// 	}, {
	// 		name: 'key',
	// 		type: 'String'
	// 	}, {
	// 		name: 'passphrase',
	// 		type: 'String'
	// 	}, {
	// 		name: 'cert',
	// 		type: 'String'
	// 	}, {
	// 		name: 'ca',
	// 		type: 'String',
	// 		optional: true
	// 	}, {
	// 		name: 'crl',
	// 		type: 'String'
	// 	}, {
	// 		name: 'ciphers',
	// 		type: 'String'
	// 	}],
	// 	output: [{
	// 		type: 'String'
	// 	}]
	// },

	createDiffieHellman: {
		input: [{
			name: 'prime_length',
			type: 'Number'
		}],
		output: [{
			type: crypto.Cipher
		}]
	},

	createDiffieHellman: {
		input: [{
			name: 'prime',
			type: 'Number'
		}, {
			name: 'encoding',
			type: 'String'
		}],
		output: [{
			type: 'String'
		}]
	},

	createHash: {
		input: [{
			name: 'algorithm',
			type: 'String'
		}],
		output: [{
			type: 'String'
		}]
	},

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
