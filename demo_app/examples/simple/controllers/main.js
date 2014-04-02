/**
 * Sample controller
 * @class Controllers.main
 */

/**
 * Public method to handle orientation if this controller
 * is opened via {@link core#openScreen} or if
 * {@link core#bindOrientationEvents} is applied to this controller
 * @param {Object} _event
 */
$.handleOrientation = function(_event) {
	Ti.API.debug(_event.orientation);
};