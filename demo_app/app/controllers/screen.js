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

/**
 * Handle opening a new screen
 */
function handleMenuItem() {
	App.Navigator.open("screen");
}

if(OS_ANDROID) {
	$.window.addEventListener("open", function() {
		var actionBar = $.window.activity.actionBar;
		actionBar.displayHomeAsUp = true;
		actionBar.onHomeIconItemSelected = function () {
			$.window.close();
		};
	});
} else {
	$.label.addEventListener("click", handleMenuItem);
}