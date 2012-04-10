/**
 * Image Manager
 * 	This object should be acted as like a singleton model.
 * 	Don't create with new!! It cause script error!!
 */

// HACK: Change normal application data directory to other for follow apple's save file guidelines of iCloud
var IMAGE_FILE_DIR_NAME = 
	Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, '../Library/Caches/Images/').nativePath;
var DEFAULT_IMAGE_FILE_DIR_NAME = 
	Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'images', 'defaults').nativePath;
var MAX_CACHED_IMAGE_FILE_COUNT = 70;

var _common;
var _dataManager;
var _fileDownloader;
var _imageDataCurrent;
var _imageDataNext;

/**
 * Initialize imageManager
 * @param {dataManager} dataManager Instance of some dataManager
 */
function init(dataManager) {
	_common = require('/app/common/common');
	_dataManager = dataManager;
	_fileDownloader = new (require('/app/services/FileDownloader'))({ timeout: 15000 });
	
	// Copy default image file to cache directory
	// _copyDefaultImageToCache();
};

/**
 * Return next image data
 * @return {object} Next image data
 */
function getNext() {
	Ti.API.info('[imageManager]getNext start. ' + (new Date()));
	if (!_imageDataNext && !_imageDataNext) {
		// First launch. Use default image for showing beauty as soon as possible.
		_imageDataCurrent = _getDefaultImageData();
	} else if (!_imageDataNext) {
		// If prepare next image is NOT finished yet, use default image.
		Ti.API.warn('[imageManager]getNext was calling, but we do NOT have finished to parepare next image. Use default.');
		if (!_imageDataCurrent.isDefault) {
			_dataManager.setAsDisplayed(_imageDataCurrent);
		}
		_imageDataCurrent = _getDefaultImageData();
	} else {
		// Tell _dataManager, current image file is displayed.
		_dataManager.setAsDisplayed(_imageDataCurrent);
		_imageDataCurrent = _imageDataNext;
	}
	
	// Delete cache image file
	_adjustCacheImageFileCount();
	
	// Prepare next image
	_prepareNextImage();
	
	return _imageDataCurrent;
}

function _prepareNextImage() {
	// TODO This method is possibly launch duplicated. I haven't think about that yet.
	
	// Clear next image data.
	// If some process failed, getNext() use default image data.
	_imageDataNext = null;
	 
	var imageData = _dataManager.getNextImageData();
	if (!imageData) {
		Ti.API.warn('[imageManager]DataManager dose NOT have next image data yet.');
		return;
	}
	
	// Check if image file is already exists
	var imageFile = Ti.Filesystem.getFile(IMAGE_FILE_DIR_NAME, imageData.image_file_name);
	if (imageData.image_file_name && imageFile.exists()) {
		// Set next image data
		_imageDataNext = imageData;
	} else {
		// Download image file
		_download(imageData);
	}
}

function _download(imageData) {
	var hasError = false;
	
	// Check network connectivity
	if (!Ti.Network.online) {
		Ti.API.warn('[imageManager]Network is down.');
		return;
	}
		
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
	
	// If error occured, tell data manager for error
	if (hasError) {
		_dataManager.setAsError(imageData);
		return;
	}
	
	// Create local file name
	var imageFileName = _common.getRandomString() + '.' + extension;
	var imageFileNameFullPath = Ti.Filesystem.getFile(IMAGE_FILE_DIR_NAME, imageFileName).nativePath;
	
	// download
	_fileDownloader.download(url, imageFileNameFullPath, {
		success: function() {
			// Tell data manager image file infomation, and set image data as next
			imageData.image_file_name = imageFileName;
			
			var imageFileInfo = _getImageFileInfo(imageFileNameFullPath);
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
		},
	});
	Ti.API.info('[imageManager]File download start. url = ' + url);
}

function _copyDefaultImageToCache() {
	var imageDir = Ti.Filesystem.getFile(IMAGE_FILE_DIR_NAME);
	if (!imageDir.exists()) {
		imageDir.createDirectory();
	}
	
	// List default image files
	var imageFile;
	var imageSourceFile;
	var defaultImageFiles = Ti.Filesystem.getFile(DEFAULT_IMAGE_FILE_DIR_NAME).getDirectoryListing();
	for (var i = 0, len = defaultImageFiles.length; i < len; i++) {
		imageFile = Ti.Filesystem.getFile(IMAGE_FILE_DIR_NAME, defaultImageFiles[i]);
		if (!imageFile.exists()) {
			imageSourceFile = Ti.Filesystem.getFile(DEFAULT_IMAGE_FILE_DIR_NAME, defaultImageFiles[i]);
			if (imageSourceFile.exists()) {
				imageFile.write(imageSourceFile.read());
			}
		}
		imageSourceFile = null;
		imageFile = null;
	}
}

function _getDefaultImageData() {
	// Search image cache directory to use default image file.
	// At least, there are default files exist
	var cacheImageFiles = Ti.Filesystem.getFile(IMAGE_FILE_DIR_NAME).getDirectoryListing();
	var useImageFileName = cacheImageFiles[Math.floor(Math.random() * cacheImageFiles.length)];
	var useImageFileNameFullPath = Ti.Filesystem.getFile(IMAGE_FILE_DIR_NAME, useImageFileName).nativePath;
	
	var imageInfo = _getImageFileInfo(useImageFileNameFullPath);
	var imageData = {
		image_file_name: useImageFileName,
		width: imageInfo.width,
		height: imageInfo.height,
		isDefault: true,
	};
	
	return imageData;
}

function _getImageFileInfo(imageFileName) {
	var imageFile = Ti.Filesystem.getFile(imageFileName);
	var imageBlob = imageFile.read();
	
	var imageFileInfo = {
		width: imageBlob.width || 0,
		height: imageBlob.height || 0,
	};
	
	imageBlob = null;
	imageFile = null;
	
	return imageFileInfo;
}

function _adjustCacheImageFileCount() {
	var imageData, imageFile;
	
	// If remain cache image file count is less than define count, do nothing
	if (Ti.Filesystem.getFile(IMAGE_FILE_DIR_NAME).getDirectoryListing().length <= MAX_CACHED_IMAGE_FILE_COUNT) {
		return;
	}
	
	var imageDataList = _dataManager.getLowPriorityImageDataList();
	for (var i = 0, len = imageDataList.length; i < len; i++) {
		imageData = imageDataList[i];
		
		// Avoid delete current displaying image
		if (imageData.id === _imageDataCurrent.id) {
			continue;
		}
		
		// Delete cache image file if exists
		imageFile = Ti.Filesystem.getFile(IMAGE_FILE_DIR_NAME, imageData.image_file_name);
		if (imageFile.exists()) {
			imageFile.deleteFile();
		}
		
		// Reset image file data
		imageData.image_file_name = '';
		imageData.width = 0;
		imageData.height = 0;
		_dataManager.setImageFileInfo(imageData);
		
		// If remain cache image file count is less than define count, stop deleting
		if (Ti.Filesystem.getFile(IMAGE_FILE_DIR_NAME).getDirectoryListing().length <= MAX_CACHED_IMAGE_FILE_COUNT) {
			break;
		}
	}
}

// Export
exports.init = init;
exports.getNext = getNext;
exports.IMAGE_FILE_DIR_NAME = IMAGE_FILE_DIR_NAME;