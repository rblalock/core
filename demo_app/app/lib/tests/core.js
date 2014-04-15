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
	it("open(); Opens a controller / window via a string", function () {
		if(OS_IOS) {
			var navWindow = Ti.UI.iOS.createNavigationWindow({
				window: Ti.UI.createWindow()
			});
			navWindow.open();
		}

		// Require in the navigation module
		var navigator = require("navigation")({
			parent: navWindow || null
		});

		var controller = navigator.open("screen");

		if(!controller.window) {
			throw new Error();
		}
	});
});

// run the tests
mocha.run();