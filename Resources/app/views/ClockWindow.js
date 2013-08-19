/**
 * Clock Window
 */
var WARNING_IMAGE_WIDTH = 19;
var TOOLBAR_HEIGHT = 44;

// UI components
var _window, _imageViewContainer, _imageViews, _clockLabel, _footer, _emergencyView, _emergencyClockLabel, _loading;

var _helper;
var _imageSwitchCounter;
var _isEmergencyMode;
var _isShowingToolbar;
var _currentImageData;

function ClockWindow() {
	_imageSwitchCounter = 0;
	_isEmergencyMode = false;
	_isShowingToolbar = false;
	_currentImageData = null;
	
	// build view
	_buildView();
	
	// Add event listener to view components and etc...
	_window.addEventListener('swipe', _toggleEmergencyMode);
	_window.addEventListener('singletap', _toggleToolBar);
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
	_imageViewContainer = Ti.UI.createView({
		top: 0,
		left: 0,
	});
	
	// Image views
	_imageViews = [];
	for (var i = 0; i < 2; i++) {
		_imageViews.push(Ti.UI.createImageView({
			backgroundColor: '#000000',
			opacity: 0,
			preventDefaultImage: true,
		}));
	}
	_imageViewContainer.add(_imageViews[0]);
	_imageViewContainer.add(_imageViews[1]);
	
	// Header
	var header = Ti.UI.createView({
		width: Ti.UI.FILL,
		height: Ti.UI.SIZE,
		top: 0,
		backgroundColor: '#000000',
		opacity: 0.45,
	});
	_clockLabel = Ti.UI.createLabel({
		text: '',
		textAlign: 'center',
		width: Ti.UI.FILL,
		height: Ti.UI.SIZE,
		color: '#FFFFFF',
		font: { fontWeight: 'bold', fontSize: 32 },
		opacity: 1,
	});
	header.add(_clockLabel);
	_imageViewContainer.add(header);
	
	// Loading
	_loading = Ti.UI.createActivityIndicator({
		style: Ti.UI.iPhone.ActivityIndicatorStyle.BIG,
		width: 20,
		height: 20,
		top: Ti.Platform.displayCaps.getPlatformHeight() / 2 - 10,
		left: Ti.Platform.displayCaps.getPlatformWidth() / 2 - 10,
	});
	_imageViewContainer.add(_loading);
	
	_window.add(_imageViewContainer);
	
	// Footer
	var actionButton = Ti.UI.createButton({
		systemButton: Ti.UI.iPhone.SystemButton.ACTION,
	});
	actionButton.addEventListener('click', _actionButtonClickHandler);
	var spacer = Ti.UI.createButton({
		systemButton: Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE,
	});
	var infoButton = Ti.UI.createButton({
		systemButton: Ti.UI.iPhone.SystemButton.INFO_LIGHT,
	});
	infoButton.addEventListener('click', _infoButtonClickHandler);
	_footer = Ti.UI.iOS.createToolbar({
		items: [actionButton, spacer, infoButton],
		bottom: -9999,
		borderTop: false,
		borderBottom: false,
		translucent: true,
		opacity: 0.6,
		barColor: '#666666',
    });
	_footer.bottom = 0 - TOOLBAR_HEIGHT;
	
	_window.add(_footer);
	
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
function _setImage(imageData) {
	// If imageData is unset, show loading image.
	if (!imageData) {
		_loading.show();
		_currentImageData = null;
		return;
	} else {
		_loading.hide();
	}
	
	// Detect which image view is currently showing
	var currentImageView = _imageViews[_imageSwitchCounter % 2];
	_imageSwitchCounter++;
	var nextImageView = _imageViews[_imageSwitchCounter % 2];
	
	nextImageView.setImage(imageData.imageFilePath);
	
	// Change image animation
	currentImageView.animate({ opacity: 0, duration: 750 });
	nextImageView.animate({ opacity: 1, duration: 750 });
	
	_currentImageData = imageData;
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

function _toggleToolBar(event) {
	if (_isEmergencyMode) {
		return;
	}
	
	if (_isShowingToolbar) {
		_footer.animate({ bottom: 0 - TOOLBAR_HEIGHT, duration: 250 });
	} else {
		_footer.animate({ bottom: 0, duration: 250 });
	}
	_isShowingToolbar = !_isShowingToolbar;
}

function _actionButtonClickHandler(event) {
	if (!_currentImageData) {
		return;
	}
	
	var options = [];
	if (_currentImageData.imageFilePath) {
		options.push(L('save_image'));
	}
	if (_currentImageData.link) {
		options.push(L('open_safari'));
	}
	if (options.length === 0) {
		return;
	}
	options.push(L('cancel'));
	
	var optionDialog = Ti.UI.createOptionDialog({
		title: '',
		options: options,
		destructive: -1,
		cancel: options.length - 1,
		imageData: _currentImageData,
		cancelButtonIndex: options.length - 1,
	});
	optionDialog.addEventListener('click', _optionDialogClickHandler);
	optionDialog.show();
}

function _optionDialogClickHandler(event) {
	if (event.index === event.source.cancelButtonIndex) {
		return;
	} else if (event.index === 0) {
		// Save image file
		Ti.Media.saveToPhotoGallery(Ti.Filesystem.getFile(event.source.imageData.imageFilePath));
	} else if (event.index === 1) {
		// Open 4U in safari
		Ti.Platform.openURL(event.source.imageData.link);
	}
}

function _infoButtonClickHandler(event) {
	var infoWindow = new (require('/app/views/InformationWindow'))();
	infoWindow.open(infoWindow.createOpenAnimation());
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
