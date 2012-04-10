/**
 * Clock Window Helper
 */
var _fromView;
var _imageManager;
var _common;
var _clockTimerList;	// It dosen't need to be a list, but for duplicate launch in case

function ClockWindowHelper(fromView) {
	_fromView = fromView;
	_imageManager = require('/app/managers/imageManager');
	_common = require('/app/common/common');
	_clockTimerList = [];
	
	// Add event listener to view components and etc...
	Ti.App.addEventListener('resume', _startClock);
	Ti.App.addEventListener('pause', _stopClock);
	
	// Prepare initial view and start clock
	_startClock();
	
	// API
	var api = {};
	
	return api;
}

function _startClock(resumeEvent) {
	Ti.API.info('[ClockWindowHelper]Clock start. time = ' + (new Date()));
	
	if (!resumeEvent) {
		_changeImage();
	}
	_changeClock();
	
	// +100ms is for insurance of 00sec has definitely passed
	_stopClock();
	_clockTimerList.push(setTimeout(_startClock, 60000 - ((new Date()).getSeconds() * 1000) + 100));
}

function _stopClock(pauseEvent) {
	while (_clockTimerList.length) {
		clearTimeout(_clockTimerList.pop());
	}
	
	if (pauseEvent) {
		Ti.API.info('[ClockWindowHelper]Pause called. time = ' + (new Date()));
	}
}

function _changeClock() {
	var date = new Date();
	var hour = date.getHours();
	var minute = date.getMinutes();
	_fromView.setClock(_common.twoZeroPadding(hour) + ':' + _common.twoZeroPadding(minute));
}

function _changeImage() {
	var data = null;
	var imageFileData = _imageManager.getNext();
	if (imageFileData) {
		data = {
			imageFilePath: Ti.Filesystem.getFile(_imageManager.IMAGE_FILE_DIR_NAME, imageFileData.image_file_name).nativePath,
			link: imageFileData.link,
		};
	} else {
		// Try again
		setTimeout(_changeImage, 1500);
	}
	_fromView.setImage(data);
}

// Export
module.exports = ClockWindowHelper;
