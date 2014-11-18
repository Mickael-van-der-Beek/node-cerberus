var testNegativeCommon = require('./negative-test-common');
var testOptionalMode = require('./test-optional-mode');
var testStrictMode = require('./test-strict-mode');
var testCommon = require('./test-common');

module.exports = function () {
	'use strict';

	describe('Common functionality tests:', function () {
		testCommon();
	});

	describe('Negative common functionality tests:', function () {
		testNegativeCommon();
	});

	describe('Optional mode tests:', function () {
		testOptionalMode();
	});

	describe('Strict mode tests:', function () {
		testStrictMode();
	});

};
