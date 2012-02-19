/**
 * File Download Manager
 */
var EVENT_COMPETE = 'app:fileDownloadManager:complete';
var _imageDataQueue, _fileDownloader, _imageData;

function start() {
	_imageDataQueue = [];
	_imageData = null;
	
	var that = this;
	
	var feed = new (require('app/models/Feed'))();
	var rows = feed.selectUndownload();
	for (var i = 0, len = rows.length; i < len; i++) {
		_imageDataQueue.push({
			id: rows[i].id,
			image_url: rows[i].image_url,
		});
	}
	
	if (rows.length > 0) {
		if (!_fileDownloader) {
			_fileDownloader = new (require('app/services/FileDownloader'))();
		}
		_download();
		return true;
	} else {
		return false;
	}
}

function _download() {
	_imageData = _imageDataQueue.shift();
	if (!_imageData) {
		Ti.App.fireEvent(EVENT_COMPETE);
		return;
	}
	
	_fileDownloader.download(_imageData.image_url, {
		success: _downloadSuccessHandler,
		error: _downloadErrorHandler,
	});
}

function _downloadSuccessHandler(fileName) {
	var constant = require('app/common/constant');
	var feed = new (require('app/models/Feed'))();
	
	// Check image orientation
	var orientation = constant.ORIENTATION_UNKNOWN;
	var imageFile = Ti.Filesystem.getFile(constant.IMAGE_FILE_DIR_NAME, fileName);
	var imageBlob = imageFile.read();
	var width = imageBlob.width;
	var height = imageBlob.height;
	imageBlob = null;
	imageFile = null;
	
	feed.updateFileData(_imageData.id, fileName, width, height);
	setTimeout(_download, 100);
}

function _downloadErrorHandler(errorMessage) {
	Ti.API.error('[fileDownloadManager]' + errorMessage);
	
	var feed = new (require('app/models/Feed'))();
	feed.remove(_imageData.id);
	setTimeout(_download, 100);
}

// Export
exports.EVENT_COMPLETE = EVENT_COMPETE;
exports.start = start;
