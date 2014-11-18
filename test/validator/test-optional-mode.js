var assert = require('assert');

var Validator = require('../coverage/instrument/src/validator/validator');

module.exports = function () {
	'use strict';

	before('initialize and configure', function () {
		Validator.configure({
			typeStrict: true,
			formatStrict: false,
			existenceStrict: true,
			nullAsExistence: false,
			undefinedAsExistence: false
		});
	});

	it('specified value', function () {
		assert.deepEqual(Validator.validate({
			a: {
				type: 'String',
				optional: true
			}
		}, {
			a: 'hello world'
		}), true);
	});

	it('unspecified undefined value', function () {
		Validator.configure({
			undefinedAsExistence: false
		});

		assert.deepEqual(Validator.validate({
			a: {
				type: 'String',
				optional: true
			}
		}, {
			a: undefined
		}), true);
	});

	it('unspecified undefined value', function () {
		Validator.configure({
			nullAsExistence: false
		});

		assert.deepEqual(Validator.validate({
			a: {
				type: 'String',
				optional: true
			}
		}, {
			a: undefined
		}), true);
	});

	it('unspecified key', function () {
		assert.deepEqual(Validator.validate({
			a: {
				type: 'String',
				optional: true
			}
		}, {}), true);
	});

	it('nested, unspecified parent key', function () {
		assert.deepEqual(Validator.validate({
			a: {
				type: 'Object',
				optional: true,
				value: {
					b: {
						type: 'String'
					}
				}
			}
		}, {}), true);
	});

};
