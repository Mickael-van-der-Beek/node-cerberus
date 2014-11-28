var assert = require('assert');

var Validator = require('../coverage/instrument/src/validator/validator');

module.exports = function () {
	'use strict';

	before('initialize and configure', function () {
		Validator.configure({
			options: {
				typeStrict: true,
				formatStrict: true,
				existenceStrict: true,
				nullAsExistence: false,
				undefinedAsExistence: false
			}
		});
	});

	it('non existant key', function () {
		assert.deepEqual(Validator.validate({
			a: {
				type: 'String',
				formats: ['notEmpty', 'lenEquals10']
			}
		}, {}), false);
	});

	it('non existant key with existenceStrict config set to false', function () {
		Validator.configure({
			options: {
				existenceStrict: false
			}
		});

		assert.deepEqual(Validator.validate({
			a: {
				type: 'String',
				formats: ['notEmpty', 'lenEquals10']
			}
		}, {}), true);

		Validator.configure({
			options: {
				existenceStrict: true
			}
		});
	});

	it('wrong type value', function () {
		assert.deepEqual(Validator.validate({
			a: {
				type: 'String',
				formats: ['notEmpty', 'lenEquals10']
			}
		}, {
			a: 1
		}), false);
	});

	it('wrong type value typeStrict config set to false', function () {
		Validator.configure({
			options: {
				typeStrict: false
			}
		});

		assert.deepEqual(Validator.validate({
			a: {
				type: 'String',
				formats: []
			}
		}, {
			a: 1
		}), true);

		Validator.configure({
			options: {
				typeStrict: true
			}
		});
	});

	it('value with wrong format', function () {
		assert.deepEqual(Validator.validate({
			a: {
				type: 'String',
				formats: ['notEmpty', 'lenEquals10']
			}
		}, {
			a: '01234567890'
		}), false);
	});

	it('value with wrong format formatStrict config set to false', function () {
		Validator.configure({
			options: {
				formatStrict: false
			}
		});

		assert.deepEqual(Validator.validate({
			a: {
				type: 'String',
				formats: ['notEmpty', 'lenEquals10']
			}
		}, {
			a: '01234567890'
		}), true);

		Validator.configure({
			options: {
				formatStrict: true
			}
		});
	});

};
