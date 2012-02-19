/**
 * File downloader from internet
 */
var common = require('app/common/common');

function FileDownloader() {
	this.xhr = Ti.Network.createHTTPClient();
	this.xhr.timeout = require('app/common/constant').TIMEOUT_FILE_DOWNLOAD;
	
	/**
	 * Send
	 */
	this.download = function(url, o) {
		this.xhr.abort();
		
		if (!Ti.Network.online) {
			_callOnError(o, 'No connection');
			return;
		}
		
		// Check url &  extension
		if (!common.isUrl(url)) {
			_callOnError(o, 'Invalid url');
			return;
		}
		
		var extension = common.getFileExtension(url);
		if (!extension) {
			_callOnError(o, 'Invalid file extension');
			return;
		} else if (!common.checkFileExtension(extension)) {
			_callOnError(o, 'Unsupported file extension');
			return;
		}
		
		// Setting HTTPClient
		this.xhr.onload = function() {
			if (this.status == 200 && !this.responseData.text) {	// Check if the response is html
				var saveFile = _createSaveFile(url);
				saveFile.write(this.responseData);
				if (o.success) {
					o.success(saveFile.getName());	// Pass saved file name.
				}
				saveFile = null;
			} else {
				_callOnError(o, 'HTTP status OR response data is something wrong');
			}
		};
		
		this.xhr.onerror = function(error) {
			var errorMsg;
			if (error.error) {
				errorMsg = error.error;
			} else {
				errorMsg = this.getStatus() + ':' + this.getStatusText();
			}
			_callOnError(o, errorMsg);	// Pass error message.
		};
		
		// Go
		if (o.start) {
			o.start();
		}
		this.xhr.open('GET', url);
		this.xhr.send();
	};
}

function _createSaveFile(url) {
	var file;
	var fileDirName = require('app/common/constant').IMAGE_FILE_DIR_NAME;
	
	var fileDir = Ti.Filesystem.getFile(fileDirName);
	if (!fileDir.exists()) {
		fileDir.createDirectory();
	}
	
	while (true) {
		file = Ti.Filesystem.getFile(fileDirName, common.getRandomString() + '.' + common.getFileExtension(url));
		if (!file.exists()) {
			break;
		}
	}
	return file;
}

function _callOnError(o, errorMessage) {
	if (o.error && typeof o.error === 'function') {
		o.error(errorMessage);
	}
}

// Export
module.exports = FileDownloader;