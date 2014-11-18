var Validator = require('./validator/validator');
var Fuzzer = require('./fuzzer/fuzzer');

module.exports = (function () {
	'use strict';

	function Cerberus () {}

	Cerberus.prototype.init = function (config) {

		config = config || {};

	};

	return Cerberus;

})();
