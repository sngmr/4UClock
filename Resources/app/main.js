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
	
	// Welcome message
	setTimeout(_showWelcome, 750);
}

function _showWelcome() {
	if (Ti.App.Properties.hasProperty('launchflag') && Ti.App.Properties.getBool('launchflag')) {
		return;
	} else {
		Ti.App.Properties.setBool('launchflag', true);
	}
	
	var infoWindow = new (require('/app/views/InformationWindow'))();
	infoWindow.open(infoWindow.createOpenAnimation());
}

// Export
exports.main = main;