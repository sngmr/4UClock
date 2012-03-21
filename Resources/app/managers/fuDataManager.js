/**
 * 4U data Manager
 * 	This object should be acted as like a singleton model.
 * 	Don't create with new!! It cause script error!!
 */
var RSS_FEEDS_BASE_URL = 'http://localhost:3000/rss?page=';
// var RSS_FEEDS_BASE_URL = 'http://4u-beautyimg.com/rss?page=';

var _rssLoader;
var _lastLoadRssPageNo;
var _noMoreUnreadRssFlag;
var _timeoutList;

/**
 * Initialize 4UDataManager
 */
function init() {
	_rssLoader = new (require('/app/services/RssLoader'))({ timeout: 7500 });
	_lastLoadRssPageNo = 0;
	_noMoreUnreadRssFlag = false;
	_timeoutList = [];
	
	Ti.App.addEventListener('resume', _startLoadRss);
	Ti.App.addEventListener('pause', _stopLoadRss);
	
	// Start collecting feeds
	_startLoadRss();
};

/**
 * Get next image data
 * @return {object} null when there are no data available
 */
function getNextImageData() {
	var feedModel = new (require('/app/models/Feed'))();
	
	var imageData = null;
	var candidates = feedModel.getNextDisplayFeedCandidates(20);
	if (candidates.length > 0) {
		// If there are data which display count is minimum, use them first.
		var displayCandidates = [];
		var minDisplayCount = candidates[0].display_count;
		for (var i = 0, len = candidates.length; i < len; i++) {
			if (candidates[i].display_count === minDisplayCount) {
				displayCandidates.push(candidates[i]);
			}
		}
		
		if (displayCandidates.length > 0) {
			imageData = displayCandidates[Math.floor(Math.random() * displayCandidates.length)];
		} else {
			imageData = candidates[Math.floor(Math.random() * candidates.length)];
		}
	}
	return imageData;
}

/**
 * Set image file information to feeds like local file name, width and height.
 * @param {object} imageData Feed object want to set
 */
function setImageFileInfo(imageData) {
	var feedModel = new (require('/app/models/Feed'))();
	feedModel.updateFeedFileInfo(
		imageData.id,
		imageData.image_file_name,
		imageData.width,
		imageData.height
	);
}

/**
 * Set feed as displayed. Increment display count
 * @param {object} imageData Feed object want to increment display count
 */
function setAsDisplayed(imageData) {
	var feedModel = new (require('/app/models/Feed'))();
	feedModel.updateFeedAsDisplayed(imageData.id);
}

/**
 * Set feed as error.
 * @param {object} imageData Feed object
 */
function setAsError(imageData) {
	var feedModel = new (require('/app/models/Feed'))();
	feedModel.updateFeedAsError(imageData.id);
}

/**
 * Return low priority (might be not showed up short while) image data
 */
function getLowPriorityImageDataList() {
	var feedModel = new (require('/app/models/Feed'))();
	return feedModel.getLowPriorityFeedCandidates(20);
}

function _startLoadRss(resumeEvent) {
	Ti.API.info('[4uDataManager]Start load RSS. time = ' + (new Date()));
	
	// Check network connectivity
	if (!Ti.Network.online) {
		Ti.API.warn('[4uDataManager]Network is down.');
		return;
	}
		
	// Collect feeds slowly until enough feed it has got
	// Finish condition:
	//   Saved feeds count is more than 3,000 AND Reach the feed already we have
	var feedModel = new (require('/app/models/Feed'))();
	var feedsCount = feedModel.availableFeedCount();
	if (feedsCount >= 3000 && _noMoreUnreadRssFlag) {
		Ti.API.info('[4uDataManager]No more unsaved RSS. Stop loading. Feed count = ' + feedsCount);
		return;
	}
	
	_loadRss();
	
	_stopLoadRss();
	_timeoutList.push(setTimeout(_startLoadRss, 300000));
}

function _stopLoadRss(pauseEvent) {
	while (_timeoutList.length) {
		clearTimeout(_timeoutList.pop());
	}
	if (pauseEvent) {
		Ti.API.info('[4uDataManager]Pause called. time = ' + (new Date()));
	}
}

function _loadRss() {
	_lastLoadRssPageNo++;
	
	// Load RSS
	var url = RSS_FEEDS_BASE_URL + _lastLoadRssPageNo;
	_rssLoader.load(url, {
		success: function(feeds) {
			var feed, hasSameFeed;
			var feedModel = new (require('/app/models/Feed'))();
			
			if (feeds.length === 0) {
				_noMoreUnreadRssFlag = true;
			}
			for (var i = 0, len = feeds.length; i < len; i++) {
				// Check if there are data feeds already have
				hasSameFeed = feedModel.hasSameFeedData(feeds[i].link);
				if (!hasSameFeed) {
					feed = [null, feeds[i].title, feeds[i].link, feeds[i].image_url, feeds[i].pubdate, '', 0, 0, 0, 0];
					feedModel.insert(feed);
				} else {
					// Okay, reach the feed already we have
					_noMoreUnreadRssFlag = true;
					break;
				}
			}
		},
		error: function(errorMessage) {
			Ti.API.error('[4uDataManager]Failed load RSS. errorMessage = ' + errorMessage);
			_lastLoadRssPageNo--;
		},
	});
	Ti.API.info('[4uDataManager]Loading RSS start. url = ' + url);
}

// Export
exports.init = init;
exports.getNextImageData = getNextImageData;
exports.setImageFileInfo = setImageFileInfo;
exports.setAsDisplayed = setAsDisplayed;
exports.setAsError = setAsError;
exports.getLowPriorityImageDataList = getLowPriorityImageDataList;
