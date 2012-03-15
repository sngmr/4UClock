/**
 * Image Manager
 * 	This object should be acted as like a singleton model.
 * 	Don't create with new!! It cause script error!!
 */
// TODO Need to think about delete old files.

// HACK: Change normal application data directory to other for follow apple's save file guidelines of iCloud
var IMAGE_FILE_DIR_NAME = 
	Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, '../Library/Caches/Images/').nativePath;

var _dataManager;
var _fileDownloader;
var _common;

var _imageDataCurrent;
var _imageDataNext;

/**
 * Initialize imageManager
 * @param {dataManager} dataManager Instance of some dataManager
 */
function init(dataManager) {
	_dataManager = dataManager;
	_fileDownloader = new (require('/app/services/FileDownloader'))({ timeout: 15000 });
	_common = require('/app/common/common');
};

/**
 * Return next image data
 * @return {object} Next image data
 */
function getNext() {
	// TODO Require implement when _imageDataNext is NOT ready
	
	if (_imageDataCurrent === null && _imageDataNext === null) {
		// First launch 
		_prepareFirstLaunch();
	} else {
		// Tell _dataManager, current image file is displayed
		_dataManager.setAsDisplayed(_imageDataCurrent);
		_imageDataCurrent = _imageDataNext;
		_imageDataNext = null;
	}
	
	// Prepare next image
	_prepareNextImage();
	
	return _imageDataCurrent;
}

function _prepareFirstLaunch() {
	// If there are cached image file, use that for first and second image
	// If not, use default image
	// TODO Find local image file
	var imageFileName;
	var imageInfo;
	
	// Current
	imageFileName = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'images/default_1.jpg').nativePath;
	imageInfo = _getImageFileInfo(imageFileName);
	_imageDataCurrent = {
		image_file_name: imageFileName,
		width: imageInfo.width,
		height: imageInfo.height,
	};
	
	// Next
	imageFileName = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'images/default_2.jpg').nativePath;
	imageInfo = _getImageFileInfo(imageFileName);
	_imageDataNext = {
		image_file_name: imageFileName,
		width: imageInfo.width,
		height: imageInfo.height,
	};
} 

function _prepareNextImage() {
	var imageData = _dataManager.getNextImageData();
	
	// Check if image file is already exists
	var imageFile = Ti.Filesystem.getFile(imageData.image_file_name);
	if (!imageFile.exists()) {
		// Set next image data
		_imageDataNext = imageData;
	} else {
		// Download image file
		_download(imageData);
	}
}

function _download(imageData) {
	var hasError = false;
	
	// Check url & extension
	var url = imageData.image_url;
	if (!_common.isUrl(url)) {
		Ti.API.warn('[imageManager]Given url is invalid. url = ' + url);
		hasError = true;
	}
	var extension = _common.getFileExtension(url);
	if (!extension) {
		Ti.API.warn('[imageManager]Given url extension is invalid. url = ' + url);
		hasError = true;
	} else if (!_common.checkFileExtension(extension)) {
		Ti.API.warn('[imageManager]Given url extension is unsuppoted. url = ' + url);
		hasError = true;
	}
	
	// If error occured, tell data manager for error and try another image file
	if (hasError) {
		_dataManager.setAsError(imageData);
		setTimeout(_prepareNextImage, 500);
		return;
	}
	
	// Create local file name
	var imageFileName = 
		Ti.Filesystem.getFile(IMAGE_FILE_DIR_NAME, _common.getRandomString() + '.' + extension).nativePath;
	
	// download
	_fileDownloader.download(url, imageFileName, {
		success: function() {
			// Tell data manager image file infomation, and set image data as next
			imageData.image_file_name = imageFileName;
			
			var imageFileInfo = _getImageFileInfo(imageFileName);
			imageData.width = imageFileInfo.width;
			imageData.height = imageFileInfo.height;
			
			_dataManager.setImageFileInfo(imageData);
			
			// Set working image data as next image data
			_imageDataNext = imageData;
		},
		error: function(errorMessage) {
			// Tell data manager for error and try another image file
			Ti.API.warn('[imageManager]File download error. msg = ' + errorMessage);
			_dataManager.setAsError(imageData);
			setTimeout(_prepareNextImage, 500);
		},
	});
	Ti.API.info('[imageManager]File download start. url = ' + url);
}

function _getImageFileInfo(imageFileName) {
	var imageFile = Ti.Filesystem.getFile(imageFileName);
	var imageBlob = imageFile.read();
	
	var imageFileInfo = {
		width: imageBlob.width,
		height: imageBlob.height,
	};
	imageBlob = null;
	imageFile = null;
	
	return imageFileInfo;
}

// Export
exports.init = init;
exports.getNext = getNext;
