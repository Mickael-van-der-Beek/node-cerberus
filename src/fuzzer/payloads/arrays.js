var array = ['a'];

module.exports = [
	[],
	[1, 'a'],
	(array.a = 1) && array,
	new Array(),
	new Array(5)
];
