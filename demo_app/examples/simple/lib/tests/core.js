/**
 * NOTE:  These are sample unit tests using ti.mocha.
 * Like core.js, these are just boilerplates for you to use in your app.
 */

var App = require("core");

require('tests/ti.mocha');
mocha.setup({ reporter: 'ti-spec-studio' });

// Core.js tests
describe("core.js", function () {
	// Device Dimensions
	describe("getDeviceDimensions();", function () {
		it("Returns an object of width / height of device's screen", function() {
			var dimensions = App.getDeviceDimensions();

			if(!dimensions.width && !dimensions.height) {
				throw new Error();
			}
		});

		it("Should populate the App.Device object", function() {
			App.getDeviceDimensions();

			if(!App.Device.width && !App.Device.height) {
				throw new Error();
			}
		});
	});

	// Orientation handling in controllers
	describe("Orientation Handling", function () {
		it("Bind orientation handling to a controller", function () {
			var controller = Alloy.createController("main");
			controller.window = Ti.UI.createWindow();

			if(!controller.handleOrientation) {
				throw new Error("No handleOrientation method available");
			}

			try {
				App.bindOrientationEvents(controller);
				controller.window.open();
			} catch(e) {
				throw new Error(e);
			}
		});

		it("Set views on controller based on orientation", function () {
			var controller = Alloy.createController("main");
			controller.window = Ti.UI.createWindow();

			try {
				App.setViewsForOrientation(controller);
			} catch (e) {
				throw new Error(e);
			}
		});
	});
});

// Navigation tests
describe("navigation.js", function () {
	// Open Screen Routines
	describe("openScreen();", function () {
		it("Opens a controller via a string", function () {
			if(!App.Navigator.openScreen("main")) {
				throw new Error();
			}
		});

		it("Opens a controller via an Alloy controller object", function () {
			var controller = Alloy.createController("main");

			if(!App.Navigator.openScreen(controller)) {
				throw new Error();
			}
		});

		// This is for the specific navigation case we have in this app where
		// we auto add a window to any controller opened via openScreen();
		it("Controller opened via openScreen() should have a window", function () {
			var controller = App.Navigator.openScreen("main");

			if(!controller.window) {
				throw new Error();
			}
		});
	});
});

// run the tests
mocha.run();