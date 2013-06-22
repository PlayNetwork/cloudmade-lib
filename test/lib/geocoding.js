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

		it ('should return HTTP error if one occurs', function (done) {
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

				done();
			});
		});
	});
});