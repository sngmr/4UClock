/**
 * MAIN
 */
function main() {
	// Global Settings
	Titanium.App.idleTimerDisabled = true;
	Titanium.UI.backgroundColor = '#000000';
	
	// Let's roll
	var win;
	var completeEvent = require('app/managers/imageManager').EVENT_COMPLETE;
	var imageManagerReadyHandler = function(e) {
		win.open();
		Titanium.App.removeEventListener(completeEvent, imageManagerReadyHandler);
	};
	Titanium.App.addEventListener(completeEvent, imageManagerReadyHandler);
	win = new (require('app/ui/ClockWindow'))();
}

// Export
exports.main = main;