var util = require('util');

module.exports = (function () {
	'use strict';

	var Types = {

		Undefined: util.isUndefined,

		Function: util.isFunction,

		Boolean: util.isBoolean,

		Object: util.isObject,

		Number: util.isNumber,

		String: util.isString,

		Buffer: util.isBuffer,

		RegExp: util.isRegExp,

		Error: util.isError,

		Array: util.isArray,

		Date: util.isDate,

		Null: util.isNull

	};

	return Types;

})();
