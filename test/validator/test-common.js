var assert = require('assert');

var Validator = require('../coverage/instrument/src/validator');
// var Validator = require('../../src/Validator');

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

	it('single-key', function () {
		assert.deepEqual(Validator.validate({
			a: {
				type: 'String',
				formats: ['notEmpty', 'lenEquals10']
			}
		}, {
			a: 'HelloWorld'
		}), true);
	});

	it('multi-key, single-type', function () {
		assert.deepEqual(Validator.validate({
			a: {
				type: 'String'
			},
			b: {
				type: 'String'
			}
		}, {
			a: 'hello world',
			b: 'world hello'
		}), true);
	});

	it('multi-key, multi-type', function () {
		assert.deepEqual(Validator.validate({
			a: {
				type: 'String'
			},
			b: {
				type: 'Number'
			}
		}, {
			a: 'hello world',
			b: 1
		}), true);
	});

	it('nested-key, single-key', function () {
		assert.deepEqual(Validator.validate({
			a: {
				type: 'Object',
				keys: {
					b: {
						type: 'Object',
						keys: {
							c: {
								type: 'String'
							}
						}
					}
				}
			}
		}, {
			a: {
				b: {
					c: 'hello world'
				}
			}
		}), true);
	});

	it('nested-key, symetric, multi-key', function () {
		assert.deepEqual(Validator.validate({
			a: {
				type: 'Object',
				keys: {
					b: {
						type: 'Object',
						keys: {
							c: {
								type: 'String'
							},
							d: {
								type: 'String'
							}
						}
					}
				}
			}
		}, {
			a: {
				b: {
					c: 'hello world',
					d: 'world hello'
				}
			}
		}), true);
	});

	it('nested-key, asymetric, multi-key', function () {
		assert.deepEqual(Validator.validate({
			a: {
				type: 'Object',
				keys: {
					b: {
						type: 'Object',
						keys: {
							c: {
								type: 'String'
							}
						}
					},
					d: {
						type: 'String'
					}
				}
			}
		}, {
			a: {
				b: {
					c: 'hello world'
				},
				d: 'world hello'
			}
		}), true);
	});

	it('array', function () {
		assert.deepEqual(Validator.validate({
			a: {
				type: 'Array'
			}
		}, {
			a: [
				'hello world'
			]
		}), true);
	});

	it('array, numeric-selector, single-key', function () {
		assert.deepEqual(Validator.validate({
			a: {
				type: 'Array',
				keys: {
					0: {
						type: 'String'
					}
				}
			}
		}, {
			a: [
				'hello world'
			]
		}), true);
	});

	it('array, numeric-selector, multi-key', function () {
		assert.deepEqual(Validator.validate({
			a: {
				type: 'Array',
				keys: {
					0: {
						type: 'String'
					},
					1: {
						type: 'String'
					}
				}
			}
		}, {
			a: [
				'hello world',
				'world hello'
			]
		}), true);
	});

	it('array, $-selector, multi-key', function () {
		assert.deepEqual(Validator.validate({
			a: {
				type: 'Array',
				keys: {
					$: {
						type: 'String'
					}
				}
			}
		}, {
			a: [
				'hello world',
				'world hello'
			]
		}), true);
	});

	it('array, embedded', function () {
		assert.deepEqual(Validator.validate({
			a: {
				type: 'Array',
				keys: {
					$: {
						type: 'Object'
					}
				}
			}
		}, {
			a: [{
				b: 'hello world'
			}]
		}), true);
	});

	it('array, embedded, multi-occurence, single-key', function () {
		assert.deepEqual(Validator.validate({
			a: {
				type: 'Array',
				keys: {
					$: {
						type: 'Object',
						keys: {
							b: {
								type: 'String'
							}
						}
					}
				}
			}
		}, {
			a: [{
				b: 'hello world'
			}, {
				b: 'world hello'
			}]
		}), true);
	});

	it('array, embedded, multi-occurence, multi-key', function () {
		assert.deepEqual(Validator.validate({
			a: {
				type: 'Array',
				keys: {
					$: {
						type: 'Object',
						keys: {
							b: {
								type: 'String'
							},
							c: {
								type: 'String'
							}
						}
					}
				}
			}
		}, {
			a: [{
				b: 'hello world',
				c: 'world hello'
			}, {
				b: 'world hello',
				c: 'hello world'
			}]
		}), true);
	});

	it('array, embedded, nested, multi-occurence', function () {
		assert.deepEqual(Validator.validate({
			a: {
				type: 'Array',
				keys: {
					$: {
						type: 'Object',
						keys: {
							b: {
								type: 'Object',
								keys: {
									c: {
										type: 'String'
									}
								}
							}
						}
					}
				}
			}
		}, {
			a: [{
				b: {
					c: 'hello world'
				}
			}, {
				b: {
					c: 'world hello'
				}
			}]
		}), true);
	});

};
