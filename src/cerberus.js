var Fuzzer = require('./fuzzer');

module.exports = (function () {
	'use strict';

	function Cerberus () {}

	Cerberus.prototype.init = function (config) {

		config = config || {};

	};

	Fuzzer.fuzzModules();
	// console.log(Fuzzer.generatePayloads());

	return Cerberus;

})();
