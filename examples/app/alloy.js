// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.

// For tests
if(Alloy.CFG.mochaTesting) {
	require("tests/core");
}