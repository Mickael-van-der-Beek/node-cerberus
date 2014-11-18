var util = require('util');

var formatValidators = require('./validators/formats');
var typeValidators = require('./validators/types');

module.exports = (function () {
	'use strict';

	function Validator () {
		this.config = {
			wildcardKey: '$',

			typeStrict: true,
			formatStrict: true,
			existenceStrict: true,

			nullAsExistence: true,
			undefinedAsExistence: false
		};
	}

	Validator.prototype.configure = function (config) {
		var val;

		for (var key in (config || {})) {
			val = config[key];
			if (typeof this.config[key] === typeof val) {
				this.config[key] = val;
			}
		}
	};

	Validator.prototype.validate = function (schema, object) {
		return !!this.routeObject({
			formats: [],
			type: 'Object',
			keys: schema
		}, object);
	};

	Validator.prototype.routeObject = function (schema, object) {
		var valid = this.validateValue(schema, object);

		if ((util.isObject(object) || util.isArray(object)) && schema.keys) {
			valid &= this.loopObject(schema.keys, object);
		}

		return valid;
	};

	Validator.prototype.loopObject = function (schema, object) {
		var valid = true;
		var keys = Object.keys(schema);
		var len = keys.length;
		var key;
		var val;

		var isArray = util.isArray(object);

		var diffMissmatch =  Math.abs(len - Object.keys(object).length);
		var hasDiffMissmatch = !isArray && diffMissmatch !== 0;

		while (len-- && valid) {
			key = keys[len];

			if (isArray && key === this.config.wildcardKey) {
				valid = this.loopArray(schema[key], object);
			}
			else if (!(key in object)) {
				valid = schema[key].optional || !this.config.existenceStrict;

				if (valid) {
					diffMissmatch -= 1;
				}
			}
			else if ((val = object[key]) == null) {
				if (val === undefined && this.config.undefinedAsExistence) {
					valid = true;
				}
				else if (val === null && this.config.nullAsExistence) {
					valid = true;
				}
				else {
					valid = schema[key].optional || false;
				}
			}
			else {
				valid = this.routeObject(schema[key], val);
			}
		}

		return (!hasDiffMissmatch || diffMissmatch === 0) && valid;
	};

	Validator.prototype.loopArray = function (schema, array) {
		var valid = true;
		var len = array.length;
		var val;

		while (len-- && valid) {
			val = array[len];

			valid = this.routeObject(schema, val);
		}

		return valid;
	};

	Validator.prototype.validateValue = function (schema, value) {
		var valid = true;

		if ('type' in schema) {
			valid = this.validateType(schema.type, value);
		}
		else if (this.config.typeStrict) {
			throw new Error(
				'Type missing for value ' + JSON.stringify(value) + '.'
			);
		}

		if ('formats' in schema) {
			valid &= this.validateFormats(schema.formats, value);
		}
		else if (this.config.formatStrict) {
			throw new Error(
				'Formats missing for value ' + JSON.stringify(value) + '.'
			);
		}

		return valid;
	};

	Validator.prototype.validateType = function (type, value) {
		var typeValidator;

		if (typeof type === 'function') {
			typeValidator = type;
		}
		else if (type in typeValidators) {
			typeValidator = typeValidators[type];
		}
		else if (typeof type === 'string') {
			throw new Error(
				'No validators for type: "' + JSON.stringify(type) + '".'
			);
		}
		else {
			throw new TypeError('Type should be a function or a string.');
		}

		var validatorNameInitial = typeValidator.name.charCodeAt(0);
		var valid = true;

		if (validatorNameInitial > 64 && validatorNameInitial < 91) {
			valid = value instanceof typeValidator;
		}
		else {
			valid = typeValidator(value);
		}

		return valid || !this.config.typeStrict;
	};

	Validator.prototype.validateFormats = function (formats, value) {
		var valid = true;
		var len = formats.length;
		var format;

		while (len-- && valid) {
			format = formats[len];

			valid = this.validateFormat(format, value);
		}

		return valid || !this.config.formatStrict;
	};

	Validator.prototype.validateFormat = function (format, value) {
		var formatValidator;

		if (typeof format === 'function') {
			formatValidator = format;
		}
		else if (format in formatValidators) {
			formatValidator = formatValidators[format];
		}
		else if (typeof format === 'string') {
			throw new Error(
				'No validators for format: "' + JSON.stringify(format) + '".'
			);
		}
		else {
			throw new TypeError('Format should be a function or a string.');
		}

		return formatValidator(value);
	};

	return new Validator();

})();
