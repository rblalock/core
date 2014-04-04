/**
 * Simple navigation example module
 * @class Navigation
 * @uses core
 */
var App = require("core");

/**
 * The Navigation object
 * @param {Object} _args
 * @constructor
 */
function Navigation(_args) {
	/**
	 * Handle cross platform way of opening a main screen.
	 *
	 * See example:
	 *
	 * 		var login = Alloy.createController("login");
	 * 		App.Navigator.openScreen(login);
	 *
	 * or if you don't need the controller reference:
	 *
	 * 		App.Navigator.openScreen("login");
	 *
	 * This is a simplified, app-wide navigation
	 * example which auto-adds a window to the controller.
	 * More could be added here depending on the navigation requirements.
	 * For instance, if you have a navgroup for handheld, you could open it in that
	 * for iOS and differently in Android, etc.  The point is, managing your
	 * app navigation flow in one spot is a good idea.
	 *
	 * @param {Controllers/String} _controller
	 * @param {Object} _controllerArguments The arguments for the controller (optional)
	 * @return {Controllers} Returns the new controller
	 */
	this.open = function(_controller, _controllerArguments) {
		var controller = null;

		if(typeof _controller === "string") {
			controller = Alloy.createController(_controller, _controllerArguments);
		} else {
			controller = _controller;
		}

		// In this example we add a window to a controller
		// opened via `openScreen`. Keeping windows out of the
		// UI architecture keep the Views flexible.
		controller.window = Ti.UI.createWindow({
			backgroundColor: Alloy.CFG.windowBackgroundColor,
			statusBarStyle: OS_IOS ? Ti.UI.iPhone.StatusBar.LIGHT_CONTENT : null
		});

		controller.window.add(controller.wrapper);

		// Set views for current orientation
		App.setViewsForOrientation(controller);

		// Bind orientation events for this controller instance
		App.bindOrientationEvents(controller);

		controller.window.open();

		return controller;
	};
}

// Calling this module function returns a new navigation instance
module.exports = function(_args) {
	return new Navigation(_args);
};