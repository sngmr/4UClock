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
	_showWelcome();
}

function _showWelcome() {
	if (Ti.App.Properties.hasProperty('launchflag') && Ti.App.Properties.getBool('launchflag')) {
		return;
	}
	
	var alertDialog = Ti.UI.createAlertDialog({
		title: L('welcome_alert_title'),
		message: L('welcome_alert_message'),
	});
	alertDialog.show();
	
	Ti.App.Properties.setBool('launchflag', true);
}

// Export
exports.main = main;