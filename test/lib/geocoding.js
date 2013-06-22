var
	geocoding = requireWithCoverage('geocoding');

	apikey = 'ab9312b78ae64ab791291edf676b2c9b';


describe('geocode', function () {
	'use strict';

	// set timeout
	this.timeout(5000);

	describe('#initialize', function () {
		it ('should have proper default settings when initialized without options', function () {
			var geocode = geocoding.initialize();
			should.exist(geocode);
			should.exist(geocode.options);
			geocode.options.secure.should.equals(false);
			geocode.options.host.should.equals('geocoding.cloudmade.com');
		});

		it ('should set correct URL when secure is true', function () {
			var geocode = geocoding.initialize({
				secure : true
			});
			should.exist(geocode);
			should.exist(geocode.options);
			geocode.options.secure.should.equals(true);
			geocode.options.host.should.equals('ssl_geocoding.cloudmade.com');
		});

		it ('should use apikey when supplied', function () {
			var geocode = geocoding.initialize({
				apikey : 'testing'
			});
			should.exist(geocode);
			should.exist(geocode.options);
			geocode.options.secure.should.equals(false);
			geocode.options.apikey.should.equals('testing');
		});
	});

	describe('#execRequest', function () {
		it ('should return error if key is invalid', function (done) {
			var
				geocode = geocoding.initialize({
					apikey : 'invalid_api_key'
				}),
				location = '8727 148th Ave NE, Redmond, WA 98052';

			geocode.get(location, function (err, data) {
				should.exist(err);
				should.not.exist(data);

				done();
			});
		});

		it ('should return error if location is not supplied', function (done) {
			var geocode = geocoding.initialize();

			geocode.get(null, function (err, data) {
				should.exist(err);
				should.not.exist(data);

				done();
			});
		});

		it ('should return HTTP error if one occurs', function (done) {
			var
				geocode = geocoding.initialize({
					host : 'invalidhost.testing'
				}),
				location = '8727 148th Ave NE, Redmond, WA 98052';

			geocode.get(location, function (err, data) {
				should.exist(err);
				err.statusCode.should.equals(404);
				should.not.exist(data);

				done();
			});
		});

		it ('should properly handle location as an object', function (done) {
			var
				geocode = geocoding.initialize({
					apikey : apikey
				}),
				location = {
					city : 'Redmond',
					country : 'US',
					house : '8727',
					state : 'WA',
					street : '148th Ave NE', // not supported by Cloudmade Geocoding API
					zipcode : '98052'
				};

			geocode.get(location, function (err, data) {
				should.not.exist(err);
				should.exist(data);
				data.data.found.should.not.equals(0);

				var queryItems = data.query.substring(7, data.query.length - 1).split(';');
				queryItems.should.have.length(5);

				done();
			});
		});

		it ('should properly handle location as a POI', function (done) {
			var
				geocode = geocoding.initialize({
					apikey : apikey
				}),
				location = {
					poi : 'Statue of Liberty',
					country : 'US'
				};

			geocode.get(location, function (err, data) {
				should.not.exist(err);
				should.exist(data);
				data.data.found.should.not.equals(0);

				var queryItems = data.query.substring(7, data.query.length - 1).split(';');
				queryItems.should.have.length(2);

				done();
			});
		});

		it ('should properly handle county', function (done) {
			var
				geocode = geocoding.initialize({
					apikey : apikey
				}),
				location = {
					county : 'King',
					country : 'US'
				};

			geocode.get(location, function (err, data) {
				should.not.exist(err);
				should.exist(data);
				data.data.found.should.not.equals(0);

				var queryItems = data.query.substring(7, data.query.length - 1).split(';');
				queryItems.should.have.length(2);

				done();
			});
		});

		it ('should support postcode', function (done) {
			var
				geocode = geocoding.initialize({
					apikey : apikey
				}),
				location = {
					postcode : '98052'
				};

			geocode.get(location, function (err, data) {
				should.not.exist(err);
				should.exist(data);
				data.data.found.should.not.equals(0);

				var queryItems = data.query.substring(7, data.query.length - 1).split(';');
				queryItems.should.have.length(1);

				done();
			});
		});

		it ('should support optional parameters on request', function (done) {
			var
				geocode = geocoding.initialize({
					apikey : apikey
				}),
				location = {
					city : 'Redmond'
				},
				options = {
					results : 100
				};

			geocode.get(options, location, function (err, data) {
				should.not.exist(err);
				should.exist(data);
				data.data.found.should.not.equals(0);
				data.query.indexOf('&results=100').should.not.equals(-1);

				done();
			});
		});
	});

	describe('#get', function () {
		it ('should return JSON payload', function (done) {
			var
				geocode = geocoding.initialize({
					apikey : apikey
				}),
				location = '8727 148th Ave NE, Redmond, WA 98052';

			geocode.get(location, function (err, data) {
				should.not.exist(err);
				should.exist(data);
				data.data.found.should.not.equals(0);

				done();
			});
		});
	});

	describe('#getGeo', function () {
		it ('should return JSON payload', function (done) {
			var
				geocode = geocoding.initialize({
					apikey : apikey
				}),
				location = '8727 148th Ave NE, Redmond, WA 98052';

			geocode.getGeo(location, function (err, data) {
				should.not.exist(err);
				should.exist(data);
				data.data.found.should.not.equals(0);

				done();
			});
		});
	});

	describe('#getPlist', function () {
		it ('should return Plist payload', function (done) {
			var
				geocode = geocoding.initialize({
					apikey : apikey
				}),
				location = '8727 148th Ave NE, Redmond, WA 98052';

			geocode.getPlist(location, function (err, data) {
				should.not.exist(err);
				should.exist(data);
				data.data.should.be.a('string');

				done();
			});
		});
	});

	describe('#getHtml', function () {
		it ('should return HTML payload', function (done) {
			var
				geocode = geocoding.initialize({
					apikey : apikey
				}),
				location = '8727 148th Ave NE, Redmond, WA 98052';

			geocode.getHtml(location, function (err, data) {
				should.not.exist(err);
				should.exist(data);
				data.data.should.be.a('string');

				done();
			});
		});
	});
});