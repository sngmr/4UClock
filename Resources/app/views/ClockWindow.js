/**
 * Clock Window
 */
// UI components
var _self, _imageViewContainer, _imageViews, _clockLabel, _emergencyView, _emergencyClockLabel;

var _common;
var _imageManager;
var _imageSwitchCounter;
var _isEmergencyMode;

function ClockWindow(imageManager) {
	_common = require('/app/common/common');
	_imageManager = imageManager;
	_imageSwitchCounter = 0;
	_isEmergencyMode = false;
	
	// Build view
	_buildView();
	
	// Add event listener to view components
	_self.addEventListener('click', _toggleEmergencyMode);
	Ti.Gesture.addEventListener('orientationchange', _adjustEmergencyModeWhenRotate);
	
	// Start timer for clock (+1sec is adjustment first launch)
	setTimeout(_startClock, 60000 - ((new Date()).getSeconds() * 1000) + 1000);
	
	// Set initial image and clock
	_change();
	
	return _self;
}

function _startClock() {
	_change();
	setInterval(_change, 60000);
}

function _change() {
	_changeClock();
	_changeImage();
}

function _changeImage() {
	// Detect which image view is currently showing
	var currentImageView = _imageViews[_imageSwitchCounter % 2];
	_imageSwitchCounter++;
	var nextImageView = _imageViews[_imageSwitchCounter % 2];
	
	// Change next image view's image with fade animation
	var imageFileData = _imageManager.getNext();
	if (!imageFileData) {
		Ti.API.error('[ClockWindow]Woops!! ImageManager dose NOT have next image!!! I am waiting...');
		return;
	}
	
	// Set image
	nextImageView.setImage(
		Ti.Filesystem.getFile(_imageManager.IMAGE_FILE_DIR_NAME, imageFileData.image_file_name).nativePath);
	
	// Change image
	currentImageView.animate({ opacity: 0, duration: 750 });
	nextImageView.animate({ opacity: 1, duration: 750 });
}

function _changeClock() {
	var date = new Date();
	var hour = date.getHours();
	var minute = date.getMinutes();
	_clockLabel.setText(_common.twoZeroPadding(hour) + ':' + _common.twoZeroPadding(minute));
	_emergencyClockLabel.setText(_common.twoZeroPadding(hour) + ':' + _common.twoZeroPadding(minute));
}

function _toggleEmergencyMode(event) {
	// Stop animation
	_emergencyView.animate();
	
	if (_isEmergencyMode) {
		// 19 is for height of "warning.png". Want to hide warning.png after animation
		_emergencyView.animate(
			{ top: 0 - Ti.Platform.displayCaps.getPlatformHeight() - 19, duration: 1000 }
		);
		Titanium.App.idleTimerDisabled = true;
	} else {
		_emergencyView.animate({ top: 0, duration: 250 });
		Titanium.App.idleTimerDisabled = false;
	}
	_isEmergencyMode = !_isEmergencyMode;
}

function _adjustEmergencyModeWhenRotate(event) {
	_emergencyView.height = Ti.Platform.displayCaps.getPlatformHeight() + 19;
	if (!_isEmergencyMode) {
		_emergencyView.top = 0 - Ti.Platform.displayCaps.getPlatformHeight() - 19;
	}
}

function _buildView() {
	// Window
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
		textAlign: 'center',
		width: '100%',
		height: 'auto',
		color: '#FFFFFF',
		font: { fontWeight: 'bold', fontSize: 32 },
		opacity: 1,
	});
	header.add(_clockLabel);
	_imageViewContainer.add(header);
	
	_self.add(_imageViewContainer);
	
	// Emergency view
	_emergencyView = Ti.UI.createView({
		top: 0 - Ti.Platform.displayCaps.getPlatformHeight() - 19,
		left: 0,
		width: '100%',
		height: Ti.Platform.displayCaps.getPlatformHeight() + 19,
		backgroundColor: '#000000',
	});
	_emergencyClockLabel = Ti.UI.createLabel({
		text: '',
		textAlign: 'center',
		width: '100%',
		height: 'auto',
		color: '#FFFFFF',
		font: { fontWeight: 'bold', fontSize: 72 },
		opacity: 0.35,
	});
	var warningImage = Ti.UI.createImageView({
		image: '/images/warning.png',
		bottom: 0,
		width: 1024,
		height: 19,
	});
	_emergencyView.add(_emergencyClockLabel);
	_emergencyView.add(warningImage);
	
	_self.add(_emergencyView);
}

// Export
module.exports = ClockWindow;
