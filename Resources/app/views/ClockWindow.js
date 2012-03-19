/**
 * Clock Window
 * It's way to implement...
 */
var _self, _imageViewContainer, _imageViews, _clockLabel, _emergencyView;
var _imageManager;
var _switchCounter;
var _showEmergency;

function ClockWindow(imageManager) {
	_imageManager = imageManager;
	_switchCounter = 0;
	_showEmergency = false;
	
	// Setting UI components
	_self = Ti.UI.createWindow({
		fullscreen: true,
		orientationModes: [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT, Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT],
	});
	
	// Image container
	_imageViewContainer = Ti.UI.createView({
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
	});
	
	// Image views
	_imageViews = [];
	for (var i = 0; i < 2; i++) {
		_imageViews.push(Ti.UI.createImageView({
			width: '100%',
			height: '100%',
			backgroundColor: '#000000',
			opacity: 0,
		}));
	}
	_imageViewContainer.add(_imageViews[0]);
	_imageViewContainer.add(_imageViews[1]);
	
	// Header
	var header = Ti.UI.createView({
		width: '100%',
		height: 'auto',
		top: 0,
		backgroundColor: '#000000',
		opacity: 0.45,
	});
	_clockLabel = Ti.UI.createLabel({
		text: '',
		width: '100%',
		textAlign: 'center',
		height: 'auto',
		color: '#FFFFFF',
		font: { fontWeight: 'bold', fontSize: 32 },
		opacity: 1,
	});
	header.add(_clockLabel);
	_imageViewContainer.add(header);
	
	_self.add(_imageViewContainer);
	_imageViewContainer.addEventListener('click', _toggleEmergencyMode);
	
	// Emergency view
	_emergencyView = Ti.UI.createView({
		top: -1,
		left: 0,
		width: '100%',
		height: 1,
		backgroundColor: '#000000',
	});
	var warningImage = Ti.UI.createImageView({
		image: '/images/warning.png',
		bottom: 0,
		width: 1024,
		height: 19,
	});
	_emergencyView.add(warningImage);
	_self.add(_emergencyView);
	_emergencyView.addEventListener('click', _toggleEmergencyMode);
	
	// Start timer for change clock and image
	_changeDisplay();
	
	// TODO Uhhhhhmmm. It's not good for the clock. Need to change.
	var date = new Date();
	setTimeout(_startClockTimer, 10000);
	// setTimeout(_startClockTimer, 60000 - (date.getSeconds() * 1000 + date.getMilliseconds()));
	
	return _self;
}

function _startClockTimer() {
	_changeDisplay();
	setInterval(_changeDisplay, 10000);
}

function _changeDisplay() {
	// Set time
	_clockLabel.setText(_getTime());
	
	// Detect which image view is currently showing
	var currentImageView = _imageViews[_switchCounter % 2];
	_switchCounter++;
	var nextImageView = _imageViews[_switchCounter % 2];
	
	// Change next image view's image with fade animation
	var imageFileData = _imageManager.getNext();
	if (!imageFileData) {
		Ti.API.error('[ClockWindow]Woops!! ImageManager dose NOT have next image!!! I am waiting...');
		return;
	}
	
	nextImageView.setImage(Ti.Filesystem.getFile(_imageManager.IMAGE_FILE_DIR_NAME, imageFileData.image_file_name).nativePath);
	currentImageView.animate({ opacity: 0, duration: 750 });
	nextImageView.animate({ opacity: 1, duration: 750 });
}

function _getTime() {
	var common = require('/app/common/common');
	var date = new Date();
	var hour = date.getHours();
	var minute = date.getMinutes();
	
	return common.twoZeroPadding(hour) + ':' + common.twoZeroPadding(minute);
}

function _toggleEmergencyMode(event) {
	if (_showEmergency) {
		_emergencyView.animate({ height: 1, duration: 1000 }, function() { _emergencyView.height = 1; });
	} else {
		// 20 is for "top: -1" AND "warning.png"
		_emergencyView.animate({ height: Ti.Platform.displayCaps.platformHeight + 20, duration: 250 }, function() { _emergencyView.height = Ti.Platform.displayCaps.platformHeight + 20; });
	}
	_showEmergency = !_showEmergency;
}

// Export
module.exports = ClockWindow;
