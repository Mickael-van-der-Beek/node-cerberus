module.exports = {

	request: [{
		type: 'Object',
		keys: {
			host: {
				type: 'String'
			},
			hostname: {
				type: 'String'
			},
			port: {
				type: 'Number'
			},
			localAddress: {
				type: 'String'
			},
			socketPath: {
				type: 'String'
			},
			method: {
				type: 'String'
			},
			path: {
				type: 'String'
			},
			headers: {
				optional: true,
				type: 'Object'
			},
			auth: {
				type: 'String'
			}
		}
	}/*, {
		type: 'Function',
		formats: []
	}*/]

};
