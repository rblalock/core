/**
 * @class Controllers.index
 */

// App bootstrap
var App = require("core");

// Make sure we always have a reference to the root window
App.globalWindow = $.window;
App.globalWindow.open();

// Init our app singleton
App.init();

// Open the first screen
App.Navigator.open("screen", {
	backgroundColor: "white",
	text: "Home Screen"
});