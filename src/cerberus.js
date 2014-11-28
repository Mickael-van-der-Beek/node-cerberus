var validator = require('./validator/validator');

module.exports = (function () {
	'use strict';

	function Cerberus () {

		this.validator = validator;

	}

	return new Cerberus();

})();
