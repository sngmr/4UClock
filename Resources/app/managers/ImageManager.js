/**
 * Image Manager
 * 	This object should be acted as like a singleton model.
 * 	Don't create with new!! It cause script error!!
 */
var EVENT_READY = 'app:ImageManager:ready';
var _readPage, _rssLoader, _feedQueue, _inDownload;

function init() {
	_readPage = 1;
	_rssLoader = new (require('app/services/RssLoader'))();
	_feedQueue = [];
	_inDownload = false;
	
	Ti.App.addEventListener(
		require('app/managers/FileDownloadManager').EVENT_COMPLETE,
		_fileDownloadManagerCompleteHandler);
	
	_loadRss();
};

function getNext() {
	var data = _feedQueue.shift();
	
	Ti.API.info('[ImageManager]Queue length = ' + _feedQueue.length);
	if (_feedQueue.length <= 5 && !_inDownload) {
		_readPage++;
		setTimeout(_loadRss, 100);
	}
	
	return data;
}

function _loadRss() {
	_inDownload = true;
	
	var url = require('app/common/constant').RSS_FEEDS_BASE_URL + _readPage;
	_rssLoader.load(
		url,
		{
			success: _rssLoaderSuccessHandler,
			error: _rssLoaderErrorHandler,
		}
	);
	
	Ti.API.info('[ImageManager]Reading RSS => ' + url);
}

function _rssLoaderSuccessHandler(feedsData) {
	var rowData;
	var feed = new (require('app/models/Feed'))();
	
	for (var i = 0, len = feedsData.length; i < len; i++) {
		rowData = [null, feedsData[i].title, feedsData[i].image_url, feedsData[i].pubdate, null, 0, 0];
		feed.insert(rowData);
	}
	
	setTimeout(_downloadImage, 100);
}

function _rssLoaderErrorHandler(errorMessage) {
	// TODO Fix error handling
	alert(errorMessage);
	_inDownload = false;
}

function _downloadImage() {
	require('app/managers/FileDownloadManager').start();
}

function _fileDownloadManagerCompleteHandler() {
	// TODO Needs to think if there is no image file available
	// TODO Needs to think editing queue block
	
	// Add queue
	var lastId;
	if (_feedQueue.length > 0) {
		lastId = _feedQueue[_feedQueue.length - 1].id;
	}
	// var lastPubdate;
	// if (_feedQueue.length > 0) {
		// lastPubdate = _feedQueue[_feedQueue.length - 1].pubdate;
		// Ti.API.info('[ImageManager]Last pubdate is = ' + lastPubdate);
	// }
	
	var feed = new (require('app/models/Feed'))();
	var rows = feed.selectDisplay(lastId);
	// var rows = feed.selectDisplay(lastPubdate);
	for (var i = 0, len = rows.length; i < len; i++) {
		_feedQueue.push(rows[i]);
	}
	Ti.API.info('[ImageManager]FileDownloadManager Complete Add Count = ' + rows.length);
	Ti.API.info('[ImageManager]FileDownloadManager Complete Queue Count = ' + _feedQueue.length);
	
	_inDownload = false;
	Ti.App.fireEvent(EVENT_READY);
}

// Export
exports.init = init;
exports.getNext = getNext;
exports.EVENT_READY = EVENT_READY;
