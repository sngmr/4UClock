describe("FileDownloader", function() {
	var downloader;
	var url = 'http://4u-beautyimg.com/thumb/l/l_f54a50178ac024480a911556407cc7e9.jpg';
	var saveFileName = require('/app/common/constant').IMAGE_FILE_DIR_NAME + Ti.Filesystem.separator + 'hoge.jpg';
	
	beforeEach(function() {
		downloader = new (require('/app/services/FileDownloader'))();
	});
	
	it('Download success', function() {
		var _success = false;
		var _error = false;
		var _errorMsg;
		
		var callback = {
			success: function() {
				_success = true; 
			},
			error: function(errorMsg) {
				_errorMsg = errorMsg;
				_error = true;
			},
		};
		downloader.download(url, saveFileName, callback);
		
		waitsFor(function() { return _success; }, 'Never finish async method.', 10000);
		
		runs(function() {
			expect(Ti.Filesystem.getFile(saveFileName).exists()).toBeTruthy();
		});
	});
	
	it('Download file not found', function() {
		var _success = false;
		var _error = false;
		var _errorMsg;
		
		var callback = {
			success: function() {
				_success = true; 
			},
			error: function(errorMsg) {
				_errorMsg = errorMsg;
				_error = true;
			},
		};
		downloader.download(url + '.hoge', saveFileName, callback);
		
		waitsFor(function() { return _error; }, 'Never finish async method.', 10000);
		
		runs(function() {
			expect(_error).toBeTruthy();
			expect(/404/.test(_errorMsg)).toBeTruthy();
		});
	});
	
	it('Timeout test', function() {
		var _success = false;
		var _error = false;
		var _errorMsg;
		
		// Set timeout
		var options = { timeout: 10 };
		downloader = new (require('/app/services/FileDownloader'))(options);
		
		var callback = {
			success: function() {
				_success = true; 
			},
			error: function(errorMsg) {
				_errorMsg = errorMsg;
				_error = true;
			},
		};
		downloader.download(url, saveFileName, callback);
		
		waitsFor(function() { return _error; }, 'Timeout value dose NOT efficent.', 10000);
		
		runs(function() {
			expect(_error).toBeTruthy();
			expect(/timed out/.test(_errorMsg)).toBeTruthy();
		});
	});
});
