/**
 * Image Manager
 * 	This object should be acted as like a singleton model.
 * 	Don't create with new!! It cause script error!!
 */
var EVENT_READY = 'app:ImageManager:ready';
var _readPage, _rssLoader;

function init() {
	_readPage = 1;
	_rssLoader = new (require('app/services/RssLoader'))();
	Ti.App.addEventListener(
		require('app/managers/FileDownloadManager').EVENT_COMPLETE, 
		_fileDownloadManagerCompleteHandler);
	
	_loadRss(_readPage);
};

function _loadRss(pageNumber) {
	_rssLoader.load(
		require('app/common/constant').RSS_FEEDS_BASE_URL + pageNumber,
		{
			success: _rssLoaderSuccessHandler,
			error: _rssLoaderErrorHandler,
		}
	);
}

function _rssLoaderSuccessHandler(feedsData) {
	var rowData;
	var feed = new (require('app/models/Feed'))();
	
	for (var i = 0, len = feedsData.length; i < len; i++) {
		rowData = [null, feedsData[i].title, feedsData[i].image, null, null, 0];
		feed.insert(rowData);
	}
	
	setTimeout(_downloadImage, 100);
}

function _rssLoaderErrorHandler(errorMessage) {
	// TODO Fix error handling
	alert(errorMessage);
}

function _downloadImage() {
	require('app/managers/FileDownloadManager').start();
}

function _fileDownloadManagerCompleteHandler() {
	// TODO Think about if there is no image file available
	Ti.App.fireEvent(EVENT_READY);
}

// Export
exports.init = init;
exports.EVENT_READY = EVENT_READY;
