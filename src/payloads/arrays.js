var list = ['a'];

module.exports = [
	[],
	[1, 'a'],
	(list['test'] = 1) && list,
	new Array(),
	new Array(5)
];
