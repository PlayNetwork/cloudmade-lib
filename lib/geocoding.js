var
	http = require('http'),
	https = require('https'),

	endpoint = '/geocoding/v2/find',
	host = 'geocoding.cloudmade.com',
	secureHost = 'ssl_geocoding.cloudmade.com',

	DEFAULT_TIMEOUT = 5000;


function callbackWrapper (geocode, path, parseJson, options, query, callback) {
	'use strict';

	var dataWrap = {
		apikey : geocode.options.apikey,
		data : '',
		host : geocode.options.host,
		options : options,
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


function getParamsFromOptions (options) {
	'use strict';

	var
		key = '',
		params = '',
		val = '';

	if (typeof options === 'object') {
		for (key in options) {
			if (options.hasOwnProperty(key)) {
				val = options[key];
				params += '&' + key + '=' + encodeURIComponent(val);
			}
		}
	}

	return params;
}


function execRequest (geocode, path, parseJson, options, location, callback) {
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
		params = getParamsFromOptions(options),
		protocol = geocode.options.secure ? https : http,
		query = '?query=' + location,
		req = protocol.get({
			host : geocode.options.host,
			path : path + query + params
		}, callbackWrapper(geocode, path, parseJson, options, query + params, callback))
			.on('error', function (e) {
				callback(e);
			})
			.on('socket', function (socket) {
				socket.setTimeout(options.timeout || DEFAULT_TIMEOUT);
				socket.on('timeout', function () {
					req.abort();
				});
			});

	return req;
}


exports.initialize = function (config) {
	'use strict';

	config = config || {};

	var
		geocode = {
			options : {
				apikey : config.apikey || '8ee2a50541944fb9bcedded5165f09d9',
				host : config.host || config.secure ? secureHost : host,
				secure : config.secure || false
			}
		},
		pathPrefix = '/' + geocode.options.apikey + endpoint;

	function get(path, parseJson, options, location, callback) {
		if (!callback && typeof location === 'function') {
			callback = location;
			location = options;
			options = {};
		}

		return execRequest(geocode, path, parseJson, options, location, callback);
	}

	geocode.get = function (options, location, callback) {
		return get(pathPrefix + '.js', true, options, location, callback);
	};

	geocode.getGeo = function (options, location, callback) {
		return get(pathPrefix + '.geojs', true, options, location, callback);
	};

	geocode.getPlist = function (options, location, callback) {
		return get(pathPrefix + '.plist', false, options, location, callback);
	};

	geocode.getHtml = function (options, location, callback) {
		return get(pathPrefix + '.html', false, options, location, callback);
	};

	return geocode;
};