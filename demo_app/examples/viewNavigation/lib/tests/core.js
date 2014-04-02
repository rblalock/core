/**
 * NOTE:  These are sample unit tests using ti.mocha.
 * Like core.js, these are just boilerplates for you to use in your app.
 */

var App = require("core");

require('tests/ti.mocha');
mocha.setup({ reporter: 'ti-spec-studio' });

// Navigation tests
describe("navigation.js", function () {
	// Open controller test
	it("open(); Opens a controller via a string", function () {
		var window = Ti.UI.createWindow({ backgroundColor: "#eee" });
		window.open();

		// Require in the navigation module
		var navigator = require("navigation")({
			parent: window
		});

		navigator.open("screen");

		if(navigator.controllers.length < 1) {
			throw new Error();
		}
	});

	// Close controller test
	it("close(); Closes a controller", function (done) {
		var window = Ti.UI.createWindow({ backgroundColor: "#eee" });
		window.open();

		// Require in the navigation module
		var navigator = require("navigation")({
			parent: window
		});

		navigator.open("screen");

		// Make sure the navigator isn't busy, then run the test
		var interval = setInterval(function() {
			if(!navigator.isBusy) {
				navigator.close(function() {
					if(navigator.controllers.length > 0) {
						throw new Error();
					}

					done();
				});

				clearInterval(interval);
			}
		}, 100);
	});

	// Go to home controller text
	it("closeToHome(); Closes all but first controller", function (done) {
		var window = Ti.UI.createWindow({ backgroundColor: "#eee" });
		window.open();

		// Require in the navigation module
		var navigator = require("navigation")({
			parent: window
		});

		navigator.open("screen");
		navigator.open("screen");

		// Make sure the navigator isn't busy, then run the test
		var interval = setInterval(function() {
			if(!navigator.isBusy) {
				navigator.closeToHome(function() {
					if(navigator.controllers.length !== 1) {
						throw new Error();
					}

					done();
				});

				clearInterval(interval);
			}
		}, 100);
	});

	// Close all controllers
	it("closeAll(); Closes all controllers", function () {
		var window = Ti.UI.createWindow({ backgroundColor: "#eee" });
		window.open();

		// Require in the navigation module
		var navigator = require("navigation")({
			parent: window
		});

		navigator.open("screen");
		navigator.open("screen");
		navigator.open("screen");
		navigator.open("screen");

		navigator.closeAll();

		if(navigator.controllers.length > 0) {
			throw new Error();
		}
	});
});

// run the tests
mocha.run();