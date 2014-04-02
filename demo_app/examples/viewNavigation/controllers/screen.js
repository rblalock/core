/**
 * Controllers.screen
 * @uses core
 */

var App = require("core");

/**
 * Args passed to this controller
 * @type {Object}
 */
$.params = arguments[0] || {};

// Set UI based on params passed to controller
$.wrapper.backgroundColor = $.params.backgroundColor || "white";
$.label.text = $.params.text || "Unnamed Screen";

// Tapping opens a new screen controller
$.wrapper.addEventListener("click", function() {
	var colors = ["red", "green", "white", "navy"];

	App.Navigator.open("screen", {
		backgroundColor: colors[Math.floor(Math.random() * colors.length)],
		text: "Sub Screen"
	});
});

// Swiping right closes the current screen
$.wrapper.addEventListener("swipe", function(_event) {
	if(_event.direction === "right") {
		App.Navigator.close();
	}
});

// Pinching jumps to home
$.wrapper.addEventListener("pinch", function onPinch(_event) {
	if(_event.scale < 0.6) {
		App.Navigator.closeToHome();
	}
});