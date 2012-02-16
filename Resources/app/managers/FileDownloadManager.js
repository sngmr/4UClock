/**
 * File Download Manager
 */
var _queue, _fileDownloader;
var EVENT_COMPETE = 'app:FileDownloadManager:complete';

function start() {
	_queue = [];
	
	var feed = new (require('app/models/Feed'))();
	var rows = feed.selectUndownload();
	for (var i = 0, len = rows.length; i < len; i++) {
		_queue.push({
			id: rows[i].id,
			image: rows[i].image,
		});
	}
	
	if (rows.length > 0) {
		_fileDownloader = new (require('app/services/FileDownloader'))();
		_download();
		return true;
	} else {
		return false;
	}
}

function _download() {
	var imageData = _queue.shift();
	if (!imageData) {
		Ti.App.fireEvent(EVENT_COMPETE);
		_fileDownloader = null;
		return;
	}
	
	
	_fileDownloader.download(imageData.image, {
		success: _downloadSuccessHandler,
		error: _downloadErrorHandler,
	});
	
	function _downloadSuccessHandler(filePath) {
		var feed = new (require('app/models/Feed'))();
		feed.updateFilePath(imageData.id, filePath);
		setTimeout(_download, 100);
	}
	
	function _downloadErrorHandler(errorMessage) {
		// TODO Fix error handling
		alert(errorMessage);
	}
}

// Export
exports.EVENT_COMPLETE = EVENT_COMPETE;
exports.start = start;
