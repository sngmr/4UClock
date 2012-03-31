/**
 * Clock Window
 */
var WARNING_IMAGE_WIDTH = 19;

// UI components
var _window, _imageViews, _clockLabel, _emergencyView, _emergencyClockLabel;

var _helper;
var _imageSwitchCounter;
var _isEmergencyMode;

function ClockWindow() {
	_imageSwitchCounter = 0;
	_isEmergencyMode = false;
	
	// build view
	_buildView();
	
	// Add event listener to view components and etc...
	_window.addEventListener('swipe', _toggleEmergencyMode);
	Ti.Gesture.addEventListener('orientationchange', _adjustEmergencyModeWhenRotate);
	
	// create helper
	var toHelper = {
		setClock: _setClock,
		setImage: _setImage,
	};
	_helper = new (require('/app/views/helpers/ClockWindowHelper'))(toHelper);
	
	return _window;
}

function _buildView() {
	// Window
	_window = Ti.UI.createWindow({
		fullscreen: true,
		orientationModes: [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT, Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT],
	});
	
	// Image container
	var imageViewContainer = Ti.UI.createView({
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
	imageViewContainer.add(_imageViews[0]);
	imageViewContainer.add(_imageViews[1]);
	
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
	imageViewContainer.add(header);
	
	_window.add(imageViewContainer);
	
	// Emergency view
	_emergencyView = Ti.UI.createView({
		top: 0,
		left: -9999,
		width: Ti.Platform.displayCaps.getPlatformWidth() + WARNING_IMAGE_WIDTH * 2,
		height: Ti.Platform.displayCaps.getPlatformHeight(),
		backgroundColor: '#000000',
	});
	_emergencyClockLabel = Ti.UI.createLabel({
		text: '',
		textAlign: 'center',
		top: 0,
		width: Ti.Platform.displayCaps.getPlatformWidth(),
		height: Ti.Platform.displayCaps.getPlatformHeight(),
		color: '#FFFFFF',
		font: { fontWeight: 'bold', fontSize: 72 },
		opacity: 0.35,
	});
	var warningImage1 = Ti.UI.createImageView({
		image: '/images/warning.png',
		width: WARNING_IMAGE_WIDTH,
		height: 1024,
		left: 0,
	});
	var warningImage2 = Ti.UI.createImageView({
		image: '/images/warning.png',
		width: WARNING_IMAGE_WIDTH,
		height: 1024,
		right: 0,
	});
	_emergencyView.add(_emergencyClockLabel);
	_emergencyView.add(warningImage1);
	_emergencyView.add(warningImage2);
	
	_window.add(_emergencyView);
}

// Call by helper
function _setClock(clockString) {
	_clockLabel.setText(clockString);
	_emergencyClockLabel.setText(clockString);
}

// Call by helper
function _setImage(imageFilePath) {
	// Detect which image view is currently showing
	var currentImageView = _imageViews[_imageSwitchCounter % 2];
	_imageSwitchCounter++;
	var nextImageView = _imageViews[_imageSwitchCounter % 2];
	
	nextImageView.setImage(imageFilePath);
	
	// Change image animation
	currentImageView.animate({ opacity: 0, duration: 750 });
	nextImageView.animate({ opacity: 1, duration: 750 });
}

function _toggleEmergencyMode(event) {
	// Stop animation
	_emergencyView.animate();
	
	if (_isEmergencyMode) {
		// To normal mode
		if (event.direction === 'left') {
			_emergencyView.animate({ left: 0 - (Ti.Platform.displayCaps.getPlatformWidth() + WARNING_IMAGE_WIDTH * 2), duration: 200 });
		} else {
			_emergencyView.animate({ left: Ti.Platform.displayCaps.getPlatformWidth(), duration: 200 });
		} 
	} else {
		// To emergency mode
		if (event.direction === 'left') {
			_emergencyView.left = Ti.Platform.displayCaps.getPlatformWidth();
		} else {
			_emergencyView.left = 0 - (Ti.Platform.displayCaps.getPlatformWidth() + WARNING_IMAGE_WIDTH * 2);
		}
		_emergencyView.animate({ left: 0 - WARNING_IMAGE_WIDTH, duration: 200 });
	}
	_isEmergencyMode = !_isEmergencyMode;
}

function _adjustEmergencyModeWhenRotate(event) {
	_emergencyView.width = Ti.Platform.displayCaps.getPlatformWidth() + WARNING_IMAGE_WIDTH * 2;
	_emergencyView.height = Ti.Platform.displayCaps.getPlatformHeight();
	_emergencyClockLabel.height = Ti.Platform.displayCaps.getPlatformHeight();
	if (!_isEmergencyMode) {
		_emergencyView.left = -9999;
	}
}

// Export
module.exports = ClockWindow;
