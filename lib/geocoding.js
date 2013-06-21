var
	http = require('http'),
	https = require('https'),

	endpoint = '/geocoding/v2/find',
	host = 'geocoding.cloudmade.com',
	secureHost = 'ssl_geocoding.cloudmade.com';


function callbackWrapper (geocode, path, location, callback) {
	'use strict';

	return function (err, data) {
		if (err) {
			return callback(err);
		}

		var dataWrap = {
			apikey : geocode.options.apikey,
			data : data,
			host : geocode.options.host,
			location : location,
			path : path,
			secure : geocode.options.secure
		};

		callback(err, dataWrap);
	};
}


function execRequest(geocode, path, location, callback) {
	'use strict';

	if (!location) {
		callback(new Error('location is required'));
	}

	if (typeof location === 'object') {
		var serialized = '';

		if (location.city) {
			serialized += 'city:' + location.city + ';';
		}

		if (location.county) {
			serialized += 'county:' + location.county + ';';
		}

		if (location.country) {
			serialized += 'country:' + location.country + ';';
		}

		if (location.house) {
			serialized += 'house:' + location.house + ';';
		}

		if (location.poi) {
			serialized += 'poi:' + location.poi + ';';
		}

		if (location.postcode) {
			serialized += 'postcode:' + location.postcode + ';';
		}

		if (location.street) {
			serialized += 'street:' + location.street + ';';
		}

		if (location.zipcode) {
			serialized += 'zipcode:' + location.zipcode + ';';
		}

		location = serialized;
	}

	var req = geocode.options.secure ? https : http;
	return req.get({
			host : geocode.options.host,
			path : path + '?query=' + encodeURIComponent(location)
		},
		callbackWrapper(geocode, path, location, callback));
}


exports.initialize = function (options) {
	'use strict';

	options = options || {};

	var
		geocode = {
			options : {
				apikey : options.apikey || '8ee2a50541944fb9bcedded5165f09d9',
				host : options.host || options.secure ? secureHost : host,
				secure : options.secure || false
			}
		},
		pathPrefix = '/' + geocode.apikey + endpoint;

	geocode.get = function (location, callback) {
		var path = pathPrefix + '.js';
		return execRequest(geocode, path, location, callback);
	};

	geocode.getGeo = function (location, callback) {
		var path = pathPrefix + '.geojs';
		return execRequest(geocode, path, location, callback);
	};

	geocode.getPlist = function (location, callback) {
		var path = pathPrefix + '.plist';
		return execRequest(geocode, path, location, callback);
	};

	geocode.getHtml = function (location, callback) {
		var path = pathPrefix + '.html';
		return execRequest(geocode, path, location, callback);
	};

	return geocode;
};