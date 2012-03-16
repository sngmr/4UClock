/**
 * File downloader
 * @constructor
 * @param {object} options Object of options. 
 * @config {integer} [timeout] Timeout milsec. Default is 30000
 * 		
 */
function FileDownloader(options) {
	var api = {};
	var xhr;
	
	// Setting options
	options = options || {};
	var timeout = options.timeout || 30000;
	
	/**
	 * Download file from internet
	 * @param {string} url URL representing file resource
	 * @param {string} saveFileName Full-path of file name saved
	 * @param {object} o Callback object
	 * @config {function} [success] function when execute download success
	 * @config {function} [error] function when execute download success
	 */
	api.download = function(url, saveFileName, o) {
		if (!xhr) {
			xhr = Ti.Network.createHTTPClient();
			xhr.timeout = timeout;
		}
		xhr.abort();
		
		// Setting HTTPClient
		xhr.onload = function() {
			if (this.status == 200 && !this.responseData.text) {	// Check if the response is html (when error)
				var saveFile = _createSaveFile(saveFileName);
				saveFile.write(this.responseData);
				if (o.success) {
					o.success();	// Pass saved file name.
				}
				saveFile = null;
			} else {
				_callOnError(o, 'HTTP status OR response data is something wrong');
			}
			_clearXhr(xhr);
		};
		
		xhr.onerror = function(error) {
			var errorMsg;
			if (error.error) {
				errorMsg = error.error;
			} else {
				errorMsg = this.getStatus() + ':' + this.getStatusText();
			}
			_callOnError(o, errorMsg);	// Pass error message.
			_clearXhr(xhr);
		};
		
		// Go
		xhr.open('GET', url);
		xhr.send();
	};
	
	return api;
}

function _createSaveFile(saveFileName) {
	var saveFile = Ti.Filesystem.getFile(saveFileName);
	if (saveFile.exists()) {
		saveFile.deleteFile();
	}
	return saveFile;
}

function _clearXhr(xhr) {
	xhr.onload = null;
	xhr.onerror = null;
	xhr.onreadystatechange = null;
	xhr.ondatastream = null;
}

function _callOnError(o, errorMessage) {
	if (o.error && typeof o.error === 'function') {
		o.error(errorMessage);
	}
}

// Export
module.exports = FileDownloader;