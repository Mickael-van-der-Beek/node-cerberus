var coreUtilIs = require('core-util-is');
var util = require('util');

module.exports = (function () {
	'use strict';

	var Types = {

		Undefined: util.isUndefined || coreUtilIs.isUndefined,

		Function: util.isFunction || coreUtilIs.isFunction,

		Boolean: util.isBoolean || coreUtilIs.isBoolean,

		Object: util.isObject || coreUtilIs.isObject,

		Number: util.isNumber || coreUtilIs.isNumber,

		String: util.isString || coreUtilIs.isString,

		Buffer: util.isBuffer || coreUtilIs.isBuffer,

		RegExp: util.isRegExp || coreUtilIs.isRegExp,

		Error: util.isError || coreUtilIs.isError,

		Array: util.isArray || coreUtilIs.isArray,

		Date: util.isDate || coreUtilIs.isDate,

		Null: util.isNull || coreUtilIs.isNull

	};

	return Types;

})();
