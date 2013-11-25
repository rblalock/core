/**
 * The main app singleton used throughout the app.
 * @class core
 * @singleton
 */
var Alloy = require("alloy");

var App = {
	/**
	 * Current orientation state
	 * @type {String} portrait | landscape
	 */
	currentOrientation: Ti.Gesture.orientation == Ti.UI.LANDSCAPE_LEFT || Ti.Gesture.orientation == Ti.UI.LANDSCAPE_RIGHT ? "landscape" : "portrait",
	/**
	 * Device width dimension
	 * @type {Number}
	 */
	deviceWidth: Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight ? Ti.Platform.displayCaps.platformHeight : Ti.Platform.displayCaps.platformWidth,
	/**
	 * Device height dimension
	 * @type {Number}
	 */
	deviceHeight: Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight ? Ti.Platform.displayCaps.platformWidth : Ti.Platform.displayCaps.platformHeight,
	/**
	 * Device DPI value
	 * @type {Number}
	 */
	deviceDpi: Ti.Platform.displayCaps.dpi,
	/**
	 * Device OS version information
	 * @type {Number}
	 */
	version: Titanium.Platform.version,
	/**
	 * Sets up the app singleton and all it's child dependencies.
	 * **NOTE: This should only be fired in index controller file and only once.**
	 */
	init: function() {
		// Global system Events
		Ti.Network.addEventListener("change", App.networkChange);
		Ti.App.addEventListener("pause", App.exit);
		Ti.App.addEventListener("close", App.exit);
		Ti.App.addEventListener("resumed", App.resume);
		Ti.Gesture.addEventListener('orientationchange', App.orientationChange);

		// Modify display dimensions, taking into account DPI
		if(OS_ANDROID) {
			Ti.Android.currentActivity.addEventListener("resume", App.resume);
			App.convertAndroidDimensions();
		}
	},
	/**
	 * Handle cross platform way of opening a main screen.
	 *
	 * See example:
	 *      var login = Alloy.createController("login");
	 *      App.openScreen(login);
	 *
	 * or if you don't need the controller reference:
	 *      App.openScreen("login");
	 *
	 * This is a simplified, app-wide navigation
     * example which auto-adds a window to the controller.
	 * More could be added here depending on the navigation requirements.
	 * For instance, if you have a navgroup for handheld, you could open it in that
	 * for iOS and differently in Android, etc.
	 *
	 * @param {Controllers/String} _controller
	 * @param {Object} _controllerArguments The arguments for the controller (optional)
	 */
	openScreen: function(_controller, _controllerArguments) {
		var controller = null;
		if(typeof _controller === "string") {
			controller = Alloy.createController(_controller, _controllerArguments);
		} else {
			controller = _controller;
		}

		// In this example we add a window to a controller
		// opened via `openScreen`.  Keeping windows out of the
		// UI architecture keep the Views flexible.
		controller.window = Ti.UI.createWindow({
			backgroundColor: Alloy.CFG.windowBackgroundColor
		});
		controller.window.add( controller.wrapper );

		// Set views for current orientation
		App.setViewsForOrientation(controller);

		// Bind orientation events for this controller instance
		App.bindOrientationEvents(controller);

		controller.window.open();
	},
	/**
	 * Helper to bind the orientation events to a controller.  These get added automatically
	 * for every controller opened via {@link core#openScreen} which have a public `handleOrientation` method.
	 *
	 * **NOTE** It is VERY important this is
	 * managed right because we're adding global events.  They must be removed
	 * or a leak can happen because of all the closures.  We could slightly
	 * reduce the closures if we placed these in the individual controllers
	 * but then we're duplicating code.  This keeps the controllers clean.  Currently,
	 * this method will _add_ and _remove_ the global events, so things should go
	 * out of scope and GC'd correctly.
	 *
	 * @param {Controllers} _controller The controller to bind the orientation events
	 */
	bindOrientationEvents: function(_controller) {
		_controller.window.addEventListener("close", function() {
			if(_controller.handleOrientation) {
				Ti.App.removeEventListener("orientationChange", _controller.handleOrientation);
			}
		});
		_controller.window.addEventListener("open", function() {
			Ti.App.addEventListener("orientationChange", function(_event) {
				if(_controller.handleOrientation) {
					_controller.handleOrientation(_event);
				}
				App.setViewsForOrientation(_controller);
			});
		});
	},
	/**
	 * Update views for current orientation helper
	 *
	 * We're doing this because Alloy does not have support for
	 * orientation support in tss files yet.  In order not to duplicate
	 * a ton of object properties, hardcode them, etc. we're using this method.
	 *
	 * Once Alloy has orientation support (e.g. `#myElement[orientation=landscape]`), this
	 * can be removed and the tss reworked.
	 *
	 * All that has to be done is implement the following structure in a `.tss` file:
	 *      "#myElement": {
	 *          landscape: { backgroundColor: "red" },
	 *          portrait: { backgroundColor: "green" }
	 *      }
	 *
	 * @param {Controllers} _controller
	 */
	setViewsForOrientation: function(_controller) {
		if(!App.currentOrientation) {
			return;
		}
		// restricted the UI for portrait and landscape orientation
		if(App.currentOrientation == 'portrait' || App.currentOrientation == 'landscape') {
			for(var view in _controller.__views) {
				if(_controller.__views[view][App.currentOrientation] && typeof _controller.__views[view].applyProperties == "function") {
					_controller.__views[view].applyProperties(_controller.__views[view][App.currentOrientation]);
				} else if(_controller.__views[view].wrapper && _controller.__views[view].wrapper[App.currentOrientation] && typeof _controller.__views[view].applyProperties == "function") {
					_controller.__views[view].applyProperties(_controller.__views[view].wrapper[App.currentOrientation]);
				}
			}
		}
	},
	/**
	 * Global network event handler
	 * @param  {Object} _event Standard Ti callback
	 */
	networkChange: function(_event) {},
	/**
	 * Exit event observer
	 */
	exit: function() {},
	/**
	 * Resume event observer
	 */
	resume: function() {},
	/**
	 * Handle the orientation change event callback
	 * @param {Object} _event Standard Ti Callback
	 */
	orientationChange: function(_event) {
		// ignore FaceUp, Face down and Unknown orientation
		if(_event.orientation === Titanium.UI.FACE_UP || _event.orientation === Titanium.UI.FACE_DOWN || _event.orientation === Titanium.UI.UNKNOWN) {
			return;
		}

		App.currentOrientation = (_event.source.isLandscape()) ? "landscape" : "portrait";

		// set device height and width based on orientation
		switch(App.currentOrientation) {
			case "portrait":
				App.deviceWidth = Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight ? Ti.Platform.displayCaps.platformHeight : Ti.Platform.displayCaps.platformWidth;
				App.deviceHeight = Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight ? Ti.Platform.displayCaps.platformWidth : Ti.Platform.displayCaps.platformHeight;
				break;
			case "landscape":
				App.deviceWidth = Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight ? Ti.Platform.displayCaps.platformWidth : Ti.Platform.displayCaps.platformHeight;
				App.deviceHeight = Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight ? Ti.Platform.displayCaps.platformHeight : Ti.Platform.displayCaps.platformWidth;
				break;
		}

		if(OS_ANDROID) {
			App.convertAndroidDimensions();
		}

		/**
		 * Fires an event for orientation change handling throughout the app
		 * @event orientationChange
		 */
		Ti.App.fireEvent("orientationChange", {
			orientation: App.currentOrientation
		});
	},
	/**
	 * Converts device dimensions from DP to PX for Android
	 */
	convertAndroidDimensions: function() {
		if(OS_ANDROID) {
			App.deviceWidth = (App.deviceWidth / (App.deviceDpi / 160));
			App.deviceHeight = (App.deviceHeight / (App.deviceDpi / 160));
		}
	}
};

module.exports = App;