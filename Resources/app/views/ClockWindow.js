/**
 * Clock Window
 */
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
	_window.addEventListener('click', _toggleEmergencyMode);
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
		top: 0 - Ti.Platform.displayCaps.getPlatformHeight() - 19,	// 19 is for warningImage
		width: '100%',
		height: Ti.Platform.displayCaps.getPlatformHeight() + 19,
		backgroundColor: '#000000',
	});
	_emergencyClockLabel = Ti.UI.createLabel({
		text: '',
		textAlign: 'center',
		top: 0,
		width: '100%',
		height: Ti.Platform.displayCaps.getPlatformHeight(),
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
		// 19 is for height of "warning.png". Want to hide warning.png after animation
		_emergencyView.animate(
			{ top: 0 - Ti.Platform.displayCaps.getPlatformHeight() - 19, duration: 1000 }
		);
	} else {
		_emergencyView.animate({ top: 0, duration: 250 });
	}
	_isEmergencyMode = !_isEmergencyMode;
}

function _adjustEmergencyModeWhenRotate(event) {
	_emergencyView.height = Ti.Platform.displayCaps.getPlatformHeight() + 19;
	_emergencyClockLabel.height = Ti.Platform.displayCaps.getPlatformHeight();
	if (!_isEmergencyMode) {
		_emergencyView.top = 0 - Ti.Platform.displayCaps.getPlatformHeight() - 19;
	}
}

// Export
module.exports = ClockWindow;
