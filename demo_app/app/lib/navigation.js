/**
 * Standard, native navigation (ActionBar for Android and NavigationWindow for iOS)
 *
 * This is a simple example of handling opening new windows in a cross platform
 * fashion.  If you want to manage the stack yourself, do things like close all
 * windows, etc. Reference some of the other examples on managing your own
 * stack of views or windows.  Those examples can be mixed here with the concept below.
 *
 * @class Navigation
 */

/**
 * The Navigation object
 * @param {Object} _args
 * @param {Object} _args.parent The parent which this navigation stack will belong
 * @constructor
 */
function Navigation(_args) {
	var that = this;

	_args = _args || {};

	/**
	 * The parent navigation window (iOS only)
	 * @type {Object}
	 */
	this.parent = _args.parent;

	/**
	 * Open a screen controller
	 * @param {String} _controller
	 * @param {Object} _controllerArguments The arguments for the controller (optional)
	 * @return {Controllers} Returns the new controller
	 */
	this.open = function(_controller, _controllerArguments) {
		var controller = Alloy.createController(_controller, _controllerArguments);

		// Some other things you could do here:
		// 1.  Add the open event on the window and manage the action bar back button
		// automatically instead of defining it in the controller.
		//
		// 2.  You could have a View as the top level item for your controllers
		// and add the window here.  This keeps your views / controllers flexible
		// without having to be bound by a window (useful for tablet architecture)

		if(OS_IOS) {
			that.parent.openWindow(controller.getView());
		} else {
			controller.getView().open();
		}

		return controller;
	};
}

// Calling this module function returns a new navigation instance
module.exports = function(_args) {
	return new Navigation(_args);
};