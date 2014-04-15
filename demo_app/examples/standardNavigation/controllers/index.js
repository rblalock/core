/**
 * @class Controllers.index
 */

// App bootstrap
var App = require("core");

// Make sure we always have a reference to the navigation window for iOS
if(OS_IOS) {
	App.navigationWindow = $.navWindow;
	App.navigationWindow.open();
} else {
	$.indexWindow.open();
}

// Init our app singleton
App.init();

$.label.addEventListener("click", function() {
	App.Navigator.open("screen");
});