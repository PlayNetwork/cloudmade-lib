global.requireWithCoverage = function (libName) {
	'use strict';

	if (process.env.CLOUDMADE_LIB_COVERAGE) {
		return require('../lib-cov/' + libName + '.js');
	}

	if (libName === 'index') {
		return require('../lib');
	} else {
		return require('../lib/' + libName + '.js');
	}
};


var chai = require('chai');
global.should = chai.should();