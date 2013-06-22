# Cloudmade Lib

A node library for consuming Cloudmade APIs. Currently only supports Geocoding.

[![Build Status](https://travis-ci.org/PlayNetwork/cloudmade-lib.png?branch=develop)](https://travis-ci.org/PlayNetwork/cloudmade-lib) [![Coverage Status](https://coveralls.io/repos/PlayNetwork/cloudmade-lib/badge.png?branch=develop)](https://coveralls.io/r/PlayNetwork/cloudmade-lib?branch=develop)

## Features

* Geocoding
	* Output types for JSON, GeoJSON, Property list and HTML

## Install

This module is currently under development and has not been published to NPM yet.

```Bash
npm install cloudmade-lib
```

## Usage

### JSON

To retrieve results in JSON format, see the following example:

```Javascript
var
	cloudmade = require('cloudmade'),
	geocoding = cloudmade.geocoding.initialize({
		apikey : 'your_api_key_here'
	});

geocoding.get('8727 148th Ave NE, Redmond, WA 98052', function (err, data) {
	// work with results here...
});
```

### GeoJSON

To retrieve results in GeoJSON format, see the following example:

```Javascript
var
	cloudmade = require('cloudmade'),
	geocoding = cloudmade.geocoding.initialize({
		apikey : 'your_api_key_here'
	});

geocoding.getGeo('8727 148th Ave NE, Redmond, WA 98052', function (err, data) {
	// work with results here...
});
```

### Propert list

To retrieve results in Plist format, see the following example:

```Javascript
var
	cloudmade = require('cloudmade'),
	geocoding = cloudmade.geocoding.initialize({
		apikey : 'your_api_key_here'
	});

geocoding.getPlist('8727 148th Ave NE, Redmond, WA 98052', function (err, data) {
	// work with results here...
});
```

### HTML

To retrieve results in HTML format, see the following example:

```Javascript
var
	cloudmade = require('cloudmade'),
	geocoding = cloudmade.geocoding.initialize({
		apikey : 'your_api_key_here'
	});

geocoding.getHtml('8727 148th Ave NE, Redmond, WA 98052', function (err, data) {
	// work with results here...
});
```

### Optional Parameters

Additional parameters, as outlined at <http://developers.cloudmade.com/projects/show/geocoding-http-api#Parameters>, can be supplied easily during the request.

```Javascript
var
	cloudmade = require('cloudmade'),
	geocoding = cloudmade.geocoding.initialize({
		apikey : 'your_api_key_here'
	}),
	options = {
		around : '47.6742,122.1203'
		results : 100,
		skip : 100
	};

geocoding.get(options, '8727 148th Ave NE, Redmond, WA 98052', function (err, data) {
	// work with results here...
});
```

### Response Data

The results returned from the cloudmade API are wrapped with the following fields:

```JSON
{
	"apikey" : "your_api_key_here",
	"data" : { /* Cloudmade Response Here */ },
	"host" : "geocoding.cloudmade.com",
	"path" : "/geocoding/v2/find.js",
	"query" : "?query=8727%20148th%20Ave%20NE%2C%20Redmond%2C%20WA%2098052",
	"secure" : false
}
```

For more information about cloudmade's response data: <http://developers.cloudmade.com/projects/show/geocoding-http-api#Geocoding-responses>

## License

MIT, see LICENSE