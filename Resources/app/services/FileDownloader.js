/**
 * File downloader from internet
 */
function FileDownloader() {
	this.xhr = Ti.Network.createHTTPClient();
	this.xhr.timeout = 5000;
	
	/**
	 * Send
	 */
	this.download = function(url, o) {
		this.xhr.abort();
		
		if (!Ti.Network.online) {
			if (o.error) o.error('No connection');
			return;
		}
		
		// Check url's extension
		var extension = _getFileExtension(url);
		if (!extension) {
			if (o.error) o.error('Invalid file extension');
			return;
		} else if (!_checkFileExtension(extension)) {
			if (o.error) o.error('Unsupported file extension');
			return;
		}
		
		// TODO: Validate url
		
		// Setting HTTPClient
		this.xhr.onload = function() {
			if (this.status == 200 && !this.responseData.text) {	// Check if the response is html
				var saveFile = _createSaveFile(url);
				saveFile.write(this.responseData);
				if (o.success) { o.success(saveFile.getName()); }	// Pass saved file name.
				saveFile = null;
			} else {
				if (o.error) { o.error('HTTP status OR response data is something wrong'); }
			}
		};
		
		this.xhr.onerror = function(error) {
			var errorMsg;
			if (error.error) {
				errorMsg = error.error;
			} else {
				errorMsg = this.getStatus() + ':' + this.getStatusText();
			}
			if (o.error) { o.error(errorMsg); }	// Pass error message.
		};
		
		// Go
		if (o.start) { o.start(); }
		this.xhr.open('GET', url);
		this.xhr.send();
	};
}

function _createSaveFile(url) {
	var file;
	var fileDirName = require('app/common/constant').IMAGE_FILE_DIR_NAME;
	
	var fileDir = Ti.Filesystem.getFile(fileDirName);
	if (!fileDir.exists()) fileDir.createDirectory();
	
	while (true) {
		file = Ti.Filesystem.getFile(fileDirName, _getRandomString() + '.' + _getFileExtension(url));
		if (!file.exists()) break;
	}
	return file;
}

function _getRandomString() {
	var base = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	base = base.split('');
	
	// First charactor should not be numerical.
	var result = base[Math.floor(Math.random() * 52)];
	for (var i = 0, len = 31; i < len; i++) {
		result += base[Math.floor(Math.random() * base.length)];
	}
	return result;
}

function _getFileExtension(url) {
	if (!url) return null;
	var path = url.split('/');
	var s = path[path.length - 1].split('.');
	if (s.length < 2) return null;
	return s[s.length - 1];
}

function _checkFileExtension(extension) {
	return /^(jpg|jpeg|png)$/.test(extension);
}

// Export
module.exports = FileDownloader;