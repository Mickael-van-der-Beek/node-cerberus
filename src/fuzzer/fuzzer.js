var crypto = require('crypto');

var Validator = require('./validator');

var Functions = require('./payloads/functions');
var Booleans = require('./payloads/booleans');
var Objects = require('./payloads/objects');
var Numbers = require('./payloads/numbers');
var Strings = require('./payloads/strings');
var Buffers = require('./payloads/buffers');
var RegExps = require('./payloads/regexps');
var Errors = require('./payloads/errors');
var Arrays = require('./payloads/arrays');
var Dates = require('./payloads/dates');

var CryptoSchema = require('./schemas/core/crypto');

module.exports = (function () {
	'use strict';

	function Fuzzer () {
		Validator.configure({
			typeStrict: true,
			formatStrict: true,
			existenceStrict: true,
			nullAsExistence: false,
			undefinedAsExistence: false
		});

		this.payloads = [].concat(
			[
				undefined
			],
			Functions,
			Booleans,
			Objects,
			Numbers,
			Strings,
			Buffers,
			RegExps,
			Errors,
			Arrays,
			Dates,
			[
				null
			]
		);

		this.modules = {
			crypto: crypto
		};

		this.schemas = {
			crypto: CryptoSchema
		};
	}

	Fuzzer.prototype.fuzzModules = function () {
		var schema;
		var module;

		for(var moduleName in this.schemas) {
			schema = this.schemas[moduleName];
			module = this.modules[moduleName];

			this.fuzzModule(schema, module);
		}
	};

	Fuzzer.prototype.fuzzModule = function (schema, module) {
		for(var methodName in schema) {
			this.fuzzMethod(schema, module, methodName);
		}
	};

	Fuzzer.prototype.fuzzMethod = function (schema, module, methodName) {
		var outputSchema = schema[methodName].output;
		var inputSchema = schema[methodName].input;

		var overload = [];
		for(var i = 0; i < inputSchema.length; i++) {
			overload.push(this.payloads);
		}

		var payloads = this.generatePayloads(overload);
		var len = payloads.length;
		var output;
		var input;

		var errors = {};

		while(len--) {
			input = payloads[len];

			console.log('1 INPUT:', input);
			console.log('1 NAME:', methodName);

			try {
				output = module[methodName].apply(module, input);
			}
			catch(e) {
				output = e;
			}

			if(output instanceof Error) {
				if(!errors[output]) {
					errors[output] = output;
					console.log('\n---------------------');
					console.log('1 OUTPUT:', output);
					console.log('1 ERROR:', input);
				}
			}
			else if(!Validator.validate(outputSchema, output)) {
				console.log('\n---------------------');
				console.log('2 OUTPUT:', output);
				console.log('2 CORRUPT:', input);
			}
		}
	};

	Fuzzer.prototype.generatePayloads = function (payloads) {
		var inputs = [];
		var max = payloads.length - 1;
		function getCombinations(array, i) {
			for (var j = 0, l = payloads[i].length; j < l; j++) {
				var combination = array.slice(0);
				combination.push(payloads[i][j]);
				if (i === max) {
					inputs.push(combination);
				}
				else {
					getCombinations(combination, i + 1);
				}
			}
		}
		getCombinations([], 0);
		return inputs;
	};

	return new Fuzzer();

})();
