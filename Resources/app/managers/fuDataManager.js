/**
 * 4U data Manager
 * 	This object should be acted as like a singleton model.
 * 	Don't create with new!! It cause script error!!
 */
var RSS_FEEDS_BASE_URL = 'http://4u-beautyimg.com/rss?page=';

var _rssLoader;
var _lastLoadRssPageNo;
var _noMoreUnreadRssFlag;

/**
 * Initialize 4UDataManager
 */
function init() {
	_rssLoader = new (require('/app/services/RssLoader'))({ timeout: 7500 });
	_lastLoadRssPageNo = 0;
	_noMoreUnreadRssFlag = false;
	
	// Start collecting feeds
	_startCollectRssFeedsLoop();
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

function _startCollectRssFeedsLoop() {
	// Check network connectivity
	if (!Ti.Network.online) {
		Ti.API.warn('[fuDataManager]Network is down.');
		return;
	}
		
	// Collect feeds slowly until enough feed it has got
	// Finish condition:
	//   Saved feeds count is more than 3,000 AND Reach the feed already we have
	var feedModel = new (require('/app/models/Feed'))();
	var feedsCount = feedModel.availableFeedCount();
	if (feedsCount >= 3000 && _noMoreUnreadRssFlag) {
		return;
	}
	
	if (feedsCount <= 5) {
		// Load RSS immediately
		_loadRss();
	} else {
		// Load RSS once a 5min
		setTimeout(_loadRss, 300000);
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
			
			_startCollectRssFeedsLoop();
		},
		error: function(errorMessage) {
			Ti.API.error('[fuDataManager]Failed load RSS. errorMessage = ' + errorMessage);
			_lastLoadRssPageNo--;
			_startCollectRssFeedsLoop();
		},
	});
	Ti.API.info('[fuDataManager]Loading RSS start. url = ' + url);
}

// Export
exports.init = init;
exports.getNextImageData = getNextImageData;
exports.setImageFileInfo = setImageFileInfo;
exports.setAsDisplayed = setAsDisplayed;
exports.setAsError = setAsError;
exports.getLowPriorityImageDataList = getLowPriorityImageDataList;
