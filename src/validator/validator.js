var formatValidators = require('./validators/formats');
var typeValidators = require('./validators/types');

var util = require('util');

module.exports = (function () {
	'use strict';

	function Validator () {
		this.typeValidators = typeValidators;
		this.formatValidators = formatValidators;

		this.options = {
			wildcardKey: '$',

			typeStrict: true,
			formatStrict: true,
			existenceStrict: true,

			nullAsExistence: true,
			undefinedAsExistence: false
		};
	}

	Validator.prototype.configure = function (config) {
		config = config || {};

		/**
		 * I will replace the native private _extend() method in the future. 
		 */

		util._extend(this.options, config.options);
		util._extend(this.typeValidators, config.typeValidators);
		util._extend(this.formatValidators, config.formatValidators);
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

		if ((this.typeValidators.Object(object) || this.typeValidators.Array(object)) && schema.keys) {
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

		var isArray = this.typeValidators.Array(object);

		var diffMissmatch =  Math.abs(len - Object.keys(object).length);
		var hasDiffMissmatch = !isArray && diffMissmatch !== 0;

		while (len-- && valid) {
			key = keys[len];

			if (isArray && key === this.options.wildcardKey) {
				valid = this.loopArray(schema[key], object);
			}
			else if (!(key in object)) {
				valid = schema[key].optional || !this.options.existenceStrict;

				if (valid) {
					diffMissmatch -= 1;
				}
			}
			else if ((val = object[key]) == null) {
				if (val === undefined && this.options.undefinedAsExistence) {
					valid = true;
				}
				else if (val === null && this.options.nullAsExistence) {
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
		else if (this.options.typeStrict) {
			throw new Error(
				'Type missing for value ' + JSON.stringify(value) + '.'
			);
		}

		if ('formats' in schema) {
			valid &= this.validateFormats(schema.formats, value);
		}
		/**
		 * Temporary hack.
		 * I'll have to think about format specifications in arrays and objects.
		 */
		else if (this.options.formatStrict && schema.type !== 'Array' && schema.type !== 'Object') {
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
		else if (type in this.typeValidators) {
			typeValidator = this.typeValidators[type];
		}
		else if (typeof type === 'string') {
			throw new Error(
				'No validators for type: "' + JSON.stringify(type) + '".'
			);
		}
		else {
			throw new TypeError('Type should be a function or a string.');
		}

		/**
		 * This part has been commented for the moment but might get
		 * reintroduced when applied to the Node.js core API specs.
		 * It is used to validate values thanks to their constructor. 
		 */

		// var validatorNameInitial = typeValidator.name.charCodeAt(0);
		// var valid = true;

		// if (validatorNameInitial > 64 && validatorNameInitial < 91) {
		// 	valid = value instanceof typeValidator;
		// }
		// else {
		// 	valid = typeValidator(value);
		// }

		var valid = typeValidator(value);

		return valid || !this.options.typeStrict;
	};

	Validator.prototype.validateFormats = function (formats, value) {
		var valid = true;
		var len = formats.length;
		var format;

		while (len-- && valid) {
			format = formats[len];

			valid &= this.validateFormat(format, value);
		}

		return !!valid || !this.options.formatStrict;
	};

	Validator.prototype.validateFormat = function (format, value) {
		var formatValidator;

		if (typeof format === 'function') {
			formatValidator = format;
		}
		else if (format in this.formatValidators) {
			formatValidator = this.formatValidators[format];
		}
		else if (typeof format === 'string') {
			throw new Error(
				'No validators for format: "' + JSON.stringify(format) + '".'
			);
		}
		else if (Object.prototype.toString.call(format) === '[object Object]') {
			var _format = Object.keys(format)[0];
			return this.validateFormat(_format, [].concat(format[_format], value));
		}
		else if (typeof format !== 'object') {
			throw new TypeError('Format should be a function, string or object.');
		}

		if (Array.isArray(value) === false) {
			value = [value];
		}

		return formatValidator.apply(this.formatValidators, value);
	};

	return new Validator();

})();
