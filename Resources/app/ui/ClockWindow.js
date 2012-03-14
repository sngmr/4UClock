/**
 * Clock Window
 */
var _self, _imageManager, _imageView, _clockLabel;

function ClockWindow() {
	// Setting UI components
	_self = Ti.UI.createWindow({
		fullscreen: true,
		navBarHidden: true,
		exitOnClose: true,
		orientationModes: [Ti.UI.PORTRAIT],
	});
	
	var container = Ti.UI.createView({
		width: '100%',
		height: '100%',
	});
	
	_imageView = Ti.UI.createImageView({
		width: '100%',
		height: '100%',
	});
	container.add(_imageView);
	
	var header = Ti.UI.createView({
		width: '100%',
		height: 'auto',
		top: 0,
		backgroundColor: '#000000',
		opacity: 0.35,
	});
	_clockLabel = Ti.UI.createLabel({
		text: '',
		width: '100%',
		textAlign: 'center',
		height: 'auto',
		color: '#FFFFFF',
		font: { fontWeight: 'bold', fontSize: 32 },
	});
	header.add(_clockLabel);
	container.add(header);
	_self.add(container);
	
	// Execute when ImageManager get ready
	_imageManager = require('/app/managers/imageManager');
	Ti.App.addEventListener(_imageManager.EVENT_COMPLETE, _imageManagerReadyHandler);
	_imageManager.init();
	
	// Event listener on doble tap and shake
	_imageView.addEventListener('doubletap', _imageDoubleTapHander);
	Ti.Gesture.addEventListener('shake', _shakeHandler);
	
	// Start timer for change clock and image
	// TODO Ummmmh. It's not good for the clock. Need to change.
	var date = new Date();
	_clockLabel.setText(_getTime());
	setTimeout(_startClockTimer, 60000 - (date.getSeconds() * 1000 + date.getMilliseconds()));
	
	return _self;
}

function _changeImage() {
	var data = _imageManager.getNext();
	if (!data) {
		Ti.API.error('[ClockWindow]Woops!! ImageManager dose NOT have next image!!! I am waiting...');
		return;
	}
	_imageView.setImage(Ti.Filesystem.getFile(require('/app/common/constant').IMAGE_FILE_DIR_NAME, data.filename).nativePath);
}

function _startClockTimer() {
	_timerHadler();
	setInterval(_timerHadler, 60000);
}

function _timerHadler() {
	_clockLabel.setText(_getTime());
	_changeImage();
}

function _getTime() {
	var common = require('/app/common/common');
	var date = new Date();
	var hour = date.getHours();
	var minute = date.getMinutes();
	
	return common.twoZeroPadding(hour) + ':' + common.twoZeroPadding(minute);
}

function _imageManagerReadyHandler() {
	Ti.App.removeEventListener(_imageManager.EVENT_COMPLETE, _imageManagerReadyHandler);
	_changeImage();
}

function _imageDoubleTapHander(e) {
	_changeImage();
}

function _shakeHandler(e) {
	_imageView.visible = !_imageView.visible;
} 

// Export
module.exports = ClockWindow;
