var geocoding = requireWithCoverage('geocoding');


describe('geocode', function () {
	'use strict';

	after(function () {

	});

	before(function () {

	});

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
});