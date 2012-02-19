describe("FileDownloader", function() {
	var downloader, saveDir;
	var url = 'http://4u-beautyimg.com/thumb/l/l_f54a50178ac024480a911556407cc7e9.jpg';
	
	beforeEach(function() {
		downloader = new (require('app/services/FileDownloader'))();
		saveDir = require('app/common/constant').IMAGE_FILE_DIR_NAME;
	});
	
	it('Download success', function() {
		var _success = false;
		var _error = false;
		var _fileName;
		var _errorMsg;
		
		var callback = {
			success: function(fileName) {
				_fileName = fileName;
				_success = true; 
			},
			error: function(errorMsg) {
				_errorMsg = errorMsg;
				_error = true;
			},
		};
		downloader.download(url, callback);
		
		waitsFor(function() { return _success; }, 'Never finish async method.', 10000);
		
		runs(function() {
			expect(Ti.Filesystem.getFile(saveDir, _fileName).exists()).toBeTruthy();
		});
	});
	
	it('Invalid url', function() {
		var _success = false;
		var _error = false;
		var _fileName;
		var _errorMsg;
		
		var callback = {
			success: function(fileName) {
				_fileName = fileName;
				_success = true; 
			},
			error: function(errorMsg) {
				_errorMsg = errorMsg;
				_error = true;
			},
		};
		downloader.download('hogehoge', callback);
		
		waitsFor(function() { return _error; }, 'Never finish async method.', 10000);
		
		runs(function() {
			expect(_errorMsg).toEqual('Invalid url');
		});
	});
	
	it('Download file not found', function() {
		var _success = false;
		var _error = false;
		var _fileName;
		var _errorMsg;
		
		var callback = {
			success: function(fileName) {
				_fileName = fileName;
				_success = true; 
			},
			error: function(errorMsg) {
				_errorMsg = errorMsg;
				_error = true;
			},
		};
		downloader.download('http://4u-beautyimg.com/thumb/l/HOGEHOGE.jpg', callback);
		
		waitsFor(function() { return _error; }, 'Never finish async method.', 10000);
		
		runs(function() {
			expect(/404/.test(_errorMsg)).toBeTruthy();
		});
	});
	
	it('File extension error', function() {
		var _success = false;
		var _error = false;
		var _fileName;
		var _errorMsg;
		
		var callback = {
			success: function(fileName) {
				_fileName = fileName;
				_success = true; 
			},
			error: function(errorMsg) {
				_errorMsg = errorMsg;
				_error = true;
			},
		};
		downloader.download('http://google.com/hogehoge', callback);
		
		waitsFor(function() { return _error; }, 'Never finish async method.', 10000);
		
		runs(function() {
			expect(_errorMsg).toEqual('Invalid file extension');
		});
	});
});
