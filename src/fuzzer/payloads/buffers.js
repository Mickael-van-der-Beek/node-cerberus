module.exports = [
	new Buffer(0),
	new Buffer(1),
	new Buffer('ﬂ∂∏', 'utf8'),
	new Buffer('ﬂ∂∏', 'ucs2'),
	new Buffer('ﬂ∂∏', 'utf16le'),
	new Buffer('HelloWorld', 'base64'),
	new Buffer('Hello World!', 'ascii'),
	new Buffer('Hello World!', 'ascii'),
	new Buffer('0123456789abcdef', 'hex')
];
