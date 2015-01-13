var http = require('http');

var Validator = require('../validator/validator');

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

var HttpSamples = require('../samples/core/http');

var HttpSchema = require('../schemas/core/http');

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
			http: http
		};

		this.samples = {
			http: HttpSamples
		};

		this.schemas = {
			http: HttpSchema
		};

		this.mutationChance = 0.05;
		this.turns = 10000;
	}

	Fuzzer.prototype.fuzzModules = function () {
		var schemas;
		var samples;
		var module;

		for (var moduleName in this.schemas) {
			schemas = this.schemas[moduleName];
			module = this.modules[moduleName];
			samples = this.samples[moduleName];

			this.fuzzModule(schemas, samples, module);
		}
	};

	Fuzzer.prototype.fuzzModule = function (schemas, samples, module) {
		var schema;
		var sample;

		for (var methodName in schemas) {
			schema = schemas[methodName];
			sample = samples[methodName];

			this.fuzzMethod(schema, sample, module, methodName);
		}
	};

	Fuzzer.prototype.fuzzMethod = function (schema, sample, module, methodName) {
		var errorMap = {};
		var callback;
		var payloads;
		var results;

		for (var i = 0; i < this.turns; i++) {
			payloads = this.generatePayloads(schema, sample);

			callback = (function () {
				return function (e) {
					if (e instanceof Error && !(e in errorMap)) {
						console.log('(', i, ') ERROR:', e);
						// errorMap[e] = {
						// 	payloads: payloads,
						// 	error: e,
						// 	stack: e.stack
						// };

						errorMap[e] = payloads[0];
					}
				};
			})();

			try {
				// console.log('(', i, ') INPUT:', payloads);
				payloads.push(callback);
				results = module[methodName].apply(module, payloads);
				results.on('error', callback);
				results.on('close', callback);
				results.on('end', callback);
				results.on('finish', callback);
				results.end();
			}
			catch (e) {
				results = e;
			}

			if (results instanceof Error) {
				if (!(results in errorMap)) {
					// errorMap[results] = {
					// 	payloads: payloads[0],
					// 	error: results,
					// 	stack: results.stack
					// };
					errorMap[results] = payloads[0];

					// console.log('(', i, ') ERROR:', results);
					// console.log('(', i, ') ERROR:', results.stack);
					// console.log('(', i, ') INPUT:', payloads);
				}
			}
			else {
				// console.log('(', i, ') CORRUPT:', results);
				// console.log('(', i, ') INPUT:', payloads);
			}
		}

		console.log(new Array(81).join('-'));
		console.log(errorMap);
	};

	Fuzzer.prototype.generatePayloads = function (schema, sample) {
		var hasMutated = false;
		var payloads = Array.isArray(schema) ? [] : {};
		var keys = Object.keys(schema);
		var len = keys.length;
		var subschema;
		var subsample;
		var key;

		while (len--) {
			key = keys[len];
			subschema = schema[key];
			subsample = sample[key];

			if ('keys' in subschema) {
				payloads[key] = this.generatePayloads(subschema.keys, subsample);
			}
			else if (hasMutated === false && Math.random() <= this.mutationChance) {
				hasMutated = true;
				payloads[key] = this.generatePayload(subschema);
			}
			else  if (key in sample) {
				payloads[key] = subsample;
			}
		}

		return payloads;
	};

	Fuzzer.prototype.generatePayload = function (schema) {
		var random = Math.floor(Math.random() * ((this.payloads.length - 1) + 1));
		var payload = this.payloads[random];

		return Validator.validate(payload) ? this.generatePayload(schema) : payload;
	};

	var fuzzer = new Fuzzer();
	fuzzer.fuzzModules();
})();
