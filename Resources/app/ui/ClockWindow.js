/**
 * Clock Window
 */
var _self, _imageManager, _imageView, _clockLabel;

function ClockWindow() {
	_self = Titanium.UI.createWindow({
		fullscreen: true,
		navBarHidden: true,
		exitOnClose: true,
		orientationModes: [Titanium.UI.PORTRAIT],
	});
	
	var container = Titanium.UI.createView({
		width: '100%',
		height: '100%',
	});
	
	_imageView = Titanium.UI.createImageView({
		width: '100%',
		height: '100%',
	});
	container.add(_imageView);
	
	var header = Titanium.UI.createView({
		width: '100%',
		height: 'auto',
		top: 0,
		backgroundColor: '#000000',
		opacity: 0.35,
	});
	_clockLabel = Titanium.UI.createLabel({
		text: _getTime(),
		width: '100%',
		textAlign: 'center',
		height: 'auto',
		color: '#FFFFFF',
		font: { fontWeight: 'bold', fontSize: 24 },
	});
	header.add(_clockLabel);
	container.add(header);
	
	_self.add(container);
	
	_imageManager = require('app/managers/ImageManager');
	Titanium.App.addEventListener(_imageManager.EVENT_READY, _imageManagerReadyHandler);
	_imageManager.init();
	
	_imageView.addEventListener('doubletap', _imageDoubleTapHander);
	Titanium.Gesture.addEventListener('shake', _shakeHandler);
	
	setInterval(_timerHadler, 2000);
	
	return _self;
}

function _imageManagerReadyHandler() {
	Titanium.App.removeEventListener(_imageManager.EVENT_READY, _imageManagerReadyHandler);
	_changeImage();
}

function _changeImage() {
	var data = _imageManager.getNext();
	if (!data) {
		Titanium.API.error('[ClockWindow]Woops!! ImageManager dose NOT have next image!!! I am waiting...');
		return;
	}
	_imageView.setImage(Titanium.Filesystem.getFile(require('app/common/constant').IMAGE_FILE_DIR_NAME, data.filename).nativePath);
}

function _getTime() {
	var common = require('app/common/common');
	var date = new Date();
	var hour = date.getHours();
	var minute = date.getMinutes();
	
	return common.twoZeroPadding(hour) + ':' + common.twoZeroPadding(minute);
}

function _timerHadler() {
	var date = new Date();
	if (0 <= date.getSeconds() && date.getSeconds() <= 2) {
		_clockLabel.setText(_getTime());
		_changeImage();
	}
}

function _imageDoubleTapHander(e) {
	_changeImage();
}

function _shakeHandler(e) {
	_imageView.visible = !_imageView.visible;
} 

// Export
module.exports = ClockWindow;
