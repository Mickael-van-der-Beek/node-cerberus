module.exports = (function () {
	'use strict';

	var Formats = {

		lenEquals10: function (str) {
			return str.length === 10;
		},

		notEmpty: function (str) {
			return str.match(/^\s*$/) === null;
		}

	};

	return Formats;

})();
