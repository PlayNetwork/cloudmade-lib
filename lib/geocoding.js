var
	http = require('http'),
	https = require('https'),

	endpoint = '/geocoding/v2/find',
	host = 'geocoding.cloudmade.com',
	secureHost = 'ssl_geocoding.cloudmade.com';


function callbackWrapper (geocode, path, query, parseJson, callback) {
	'use strict';

	var dataWrap = {
		apikey : geocode.options.apikey,
		data : '',
		host : geocode.options.host,
		path : path,
		query : query,
		secure : geocode.options.secure
	};

	return function (res) {
		res.on('data', function (chunk) {
			dataWrap.data += chunk;
		});

		res.on('end', function () {
			if (res.statusCode === 200) {
				if (parseJson) {
					dataWrap.data = JSON.parse(dataWrap.data);
				}

				callback(null, dataWrap);
			} else {
				var error = new Error(dataWrap.data);
				error.statusCode = res.statusCode;
				callback(error);
			}
		});
	};
}


function execRequest(geocode, path, location, parseJson, callback) {
	'use strict';

	if (!location) {
		callback(new Error('location is required'));
		return;
	}

	if (typeof location === 'object') {
		var serialized = '';

		if (location.city) {
			serialized += 'city:' + encodeURIComponent(location.city) + ';';
		}

		if (location.county) {
			serialized += 'county:' + encodeURIComponent(location.county) + ';';
		}

		if (location.country) {
			serialized += 'country:' + encodeURIComponent(location.country) + ';';
		}

		if (location.house) {
			serialized += 'house:' + encodeURIComponent(location.house) + ';';
		}

		if (location.poi) {
			serialized += 'poi:' + encodeURIComponent(location.poi) + ';';
		}

		if (location.postcode) {
			serialized += 'postcode:' + encodeURIComponent(location.postcode) + ';';
		}

		if (location.street) {
			serialized += 'street:' + encodeURIComponent(location.street) + ';';
		}

		if (location.zipcode) {
			serialized += 'zipcode:' + encodeURIComponent(location.zipcode) + ';';
		}

		location = serialized;
	} else {
		location = encodeURIComponent(location);
	}

	var
		protocol = geocode.options.secure ? https : http,
		query = '?query=' + location,
		req = protocol.get({
			host : geocode.options.host,
			path : path + query
		}, callbackWrapper(geocode, path, query, parseJson, callback))
			.on('error', function (e) {
				callback(e);
			});

	return req;
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
		pathPrefix = '/' + geocode.options.apikey + endpoint;

	geocode.get = function (location, callback) {
		var path = pathPrefix + '.js';
		return execRequest(geocode, path, location, true, callback);
	};

	geocode.getGeo = function (location, callback) {
		var path = pathPrefix + '.geojs';
		return execRequest(geocode, path, location, true, callback);
	};

	geocode.getPlist = function (location, callback) {
		var path = pathPrefix + '.plist';
		return execRequest(geocode, path, location, false, callback);
	};

	geocode.getHtml = function (location, callback) {
		var path = pathPrefix + '.html';
		return execRequest(geocode, path, location, false, callback);
	};

	return geocode;
};