/**
 * MAIN
 */
function main() {
	// Global Settings
	Titanium.App.idleTimerDisabled = true;
	Titanium.UI.backgroundColor = '#000000';
	
	// Initialize managers
	var fuDataManager = require('/app/managers/fuDataManager');
	var imageManager = require('/app/managers/imageManager');
	
	fuDataManager.init();
	imageManager.init(fuDataManager);
	
	// Let's roll
	var win = new (require('/app/views/ClockWindow'))();
	win.open();
}

// Export
exports.main = main;