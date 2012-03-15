/**
 * 4U data Manager
 * 	This object should be acted as like a singleton model.
 * 	Don't create with new!! It cause script error!!
 */
var RSS_FEEDS_BASE_URL = 'http://4u-beautyimg.com/rss?page=';
var _readPage, _rssLoader, _feedQueue, _inDownload;

function getNextImageData() {}
function setImageFileInfo() {}
function setAsDisplayed() {}
function setAsError() {}

function init() {
	_readPage = 1;
	_rssLoader = new (require('/app/services/RssLoader'))({ timeout: 7500 });
	_feedQueue = [];
	_inDownload = false;
	
	_loadRss();
};

// TODO 2012/3/15 ここまで

function _loadRss() {
	_inDownload = true;
	
	var url = RSS_FEEDS_BASE_URL + _readPage;
	_rssLoader.load(url, {
		success: _rssLoaderSuccessHandler,
		error: _rssLoaderErrorHandler,
	});
	Ti.API.info('[fuDataManager]Loading RSS start. url = ' + url);
}

function _rssLoaderSuccessHandler(feedsData) {
	var rowData, checkRecord;
	var feed = new (require('/app/models/Feed'))();
	
	for (var i = 0, len = feedsData.length; i < len; i++) {
		// Check if there are data already have.
		checkRecord = feed.selectByImageUrl(feedsData[i].image_url);
		if (checkRecord === null) {
			rowData = [null, feedsData[i].title, feedsData[i].image_url, feedsData[i].pubdate, null, 0, 0];
			feed.insert(rowData);
		}
	}
	
	setTimeout(_downloadImage, 100);
}

function _rssLoaderErrorHandler(errorMessage) {
	// TODO Fix error handling
	alert(errorMessage);
	_inDownload = false;
}

// Export
exports.init = init;
exports.getNext = getNext;
exports.EVENT_COMPLETE = EVENT_COMPLETE;
