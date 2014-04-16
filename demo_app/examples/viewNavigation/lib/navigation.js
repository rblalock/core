/**
 * Stack-based navigation module which manages the navigation state and such for an app.
 * This particular module manages a stack of views added to a specific parent
 * most common in a one-window architecture.
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
	 * Whether or not the navigation module is busy opening/closing a screen
	 * @type {Boolean}
	 */
	this.isBusy = false;

	/**
	 * The controller stack
	 * @type {Array}
	 */
	this.controllers = [];

	/**
	 * The current controller object reference
	 * @type {Controllers}
	 */
	this.currentController = null;

	/**
	 * The parent object all screen controllers are added to
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
		if(that.isBusy) {
			return;
		}

		that.isBusy = true;

		var controller = Alloy.createController(_controller, _controllerArguments);

		// Handle removing the current controller from the screen
		if(that.currentController) {
			that.animateOut(that.currentController, "left");
		}

		that.controllers.push(controller);

		that.currentController = controller;

		that.parent.add(that.currentController.getView());

		// Handle if the current controller has an override way of opening itself
		if(that.currentController.open) {
			that.currentController.open();

			that.isBusy = false;
		} else {
			that.animateIn(this.currentController, "right");
		}

		// that.testOutput();

		return that.currentController;
	};

	/**
	 * Close the controller at the top of the stack
	 * @param {Function} _callback
	 */
	this.close = function(_callback) {
		if(that.isBusy) {
			return;
		}

		that.isBusy = true;

		var outgoingController = that.currentController;
		var incomingController = that.controllers[that.controllers.length - 2];

		// Animate in the previous controller
		if(incomingController) {
			that.parent.add(incomingController.getView());

			if(incomingController.open) {
				incomingController.open();

				that.isBusy = false;
			} else {
				that.animateIn(incomingController, "left");
			}
		}

		that.animateOut(outgoingController, "right", function() {
			that.controllers.pop();

			outgoingController = null;

			// Assign the new current controller from the stack
			that.currentController = that.controllers[that.controllers.length - 1];

			if(_callback) {
				_callback();
			}

			// that.testOutput();
		});
	};

	/**
	 * Close all controllers except the first in the stack
	 * @param {Function} _callback
	 */
	this.closeToHome = function(_callback) {
		if(that.isBusy) {
			return;
		}

		that.isBusy = true;

		var outgoingController = that.currentController;
		var incomingController = that.controllers[0];

		// Animate in the previous controller
		if(incomingController) {
			that.parent.add(incomingController.getView());

			if(incomingController.open) {
				incomingController.open();

				that.isBusy = false;
			} else {
				that.animateIn(incomingController, "left");
			}
		}

		that.animateDisappear(outgoingController, function() {
			that.controllers.splice(1, that.controllers.length - 1);

			outgoingController = null;

			// Assign the new current controller from the stack
			that.currentController = that.controllers[0];

			if(_callback) {
				_callback();
			}

			// that.testOutput();
		});
	};

	/**
	 * Close all controllers
	 */
	this.closeAll = function() {
		for(var i = 0, x = that.controllers.length; i < x; i++) {
			that.parent.remove(that.controllers[i].getView());
		}

		that.controllers = [];
		that.currentController = null;

		// that.testOutput();
	};

	/**
	 * Animate out a screen controller using opacity
	 * @param {Controllers} _controller
	 * @param {Function} _callback
	 */
	this.animateDisappear = function(_controller, _callback) {
		var animation = Ti.UI.createAnimation({
			transform: Ti.UI.create2DMatrix({
				scale: 0
			}),
			opacity: 0,
			curve: Ti.UI.ANIMATION_CURVE_EASE_IN,
			duration: 300
		});

		animation.addEventListener("complete", function onComplete() {
			for(var i = 0, x = that.controllers.length; i > 1 && i < x; i++) {
				that.parent.remove(that.controllers[i].getView());
			}

			if(_callback) {
				_callback();
			}

			animation.removeEventListener("complete", onComplete);
		});

		_controller.getView().animate(animation);
	};

	/**
	 * Animate in a screen controller
	 * @param {Controllers} _controller
	 * @param {String} _direction left || right
	 * @param {Function} _callback
	 */
	this.animateIn = function(_controller, _direction, _callback) {
		var animation = Ti.UI.createAnimation({
			opacity: 1,
			duration: 300
		});

		animation.addEventListener("complete", function onComplete() {
			if(_callback) {
				_callback();
			}

			that.isBusy = false;

			animation.removeEventListener("complete", onComplete);
		});

		// WEIRD hack to ensure the animation below works on iOS.
		Ti.API.trace(that.parent.size.width);

		if(OS_IOS) {
			_controller.getView().left = (_direction === "left") ? -that.parent.size.width : that.parent.size.width;

			animation.left = 0;
		}

		_controller.getView().animate(animation);
	};

	/**
	 * Animate out a screen controller
	 * @param {Controllers} _controller
	 * @param {String} _direction left || right
	 * @param {Function} _callback
	 */
	this.animateOut = function(_controller, _direction, _callback) {
		var animation = Ti.UI.createAnimation({
			opacity: 0,
			duration: 300
		});

		animation.addEventListener("complete", function onComplete() {
			that.parent.remove(_controller.getView());

			if(_callback) {
				_callback();
			}

			animation.removeEventListener("complete", onComplete);
		});

		animation.left = (_direction === "left") ? -that.parent.size.width : that.parent.size.width;

		_controller.getView().animate(animation);
	};

	/**
	 * Spits information about the navigation stack out to console
	 */
	this.testOutput = function() {
		var stack = [];

		for(var i = 0, x = that.controllers.length; i < x; i++) {
			if(that.controllers[i].getView().controller) {
				stack.push(that.controllers[i].getView().controller);
			}
		}

		Ti.API.debug("Stack Length: " + that.controllers.length);
		Ti.API.debug(JSON.stringify(stack));
	};
}

// Calling this module function returns a new navigation instance
module.exports = function(_args) {
	return new Navigation(_args);
};