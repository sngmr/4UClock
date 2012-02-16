/**
 * File Download Manager
 */
var EVENT_COMPETE = 'app:FileDownloadManager:complete';
var _imageDataQueue, _fileDownloader, _imageData;

function start() {
	_imageDataQueue = [];
	_imageData = null;
	
	var feed = new (require('app/models/Feed'))();
	var rows = feed.selectUndownload();
	for (var i = 0, len = rows.length; i < len; i++) {
		_imageDataQueue.push({
			id: rows[i].id,
			image: rows[i].image,
		});
	}
	
	if (rows.length > 0) {
		if (!_fileDownloader) _fileDownloader = new (require('app/services/FileDownloader'))();
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
		_fileDownloader = null;
		return;
	}
	
	_fileDownloader.download(_imageData.image, {
		success: _downloadSuccessHandler,
		error: _downloadErrorHandler,
	});
}

function _downloadSuccessHandler(filePath) {
	var feed = new (require('app/models/Feed'))();
	feed.updateFilePath(_imageData.id, filePath);
	setTimeout(_download, 100);
}

function _downloadErrorHandler(errorMessage) {
	// TODO Fix error handling
	alert(errorMessage);
	setTimeout(_download, 100);
}

// Export
exports.EVENT_COMPLETE = EVENT_COMPETE;
exports.start = start;
