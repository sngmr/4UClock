/**
 * MAIN
 */
function main() {
	// Global Settings
	Ti.App.idleTimerDisabled = true;
	Ti.UI.backgroundColor = '#000000';
	
	// Let's roll
	var win;
	Titanium.App.addEventListener(require('app/managers/ImageManager').EVENT_READY, function() {
		win.open();
	});
	win = new (require('app/ui/ClockWindow'))();
}

// Export
exports.main = main;