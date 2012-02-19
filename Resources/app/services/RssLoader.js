/**
 * RSS Loader
 */
function RssLoader() {
	this.xhr = Ti.Network.createHTTPClient();
	this.xhr.timeout = require('app/common/constant').TIMEOUT_RSS_DOWNLOAD;
	var common = require('app/common/common');
	
	/**
	 * Send
	 */
	this.load = function(url, o) {
		this.xhr.abort();
		
		if (!Ti.Network.online) {
			_callOnError(o, 'No connection');
			return;
		}
		
		// Validate url
		if (!common.isUrl(url)) {
			_callOnError(o, 'Invalid url');
			return;
		}
		
		// Setting HTTPClient
		this.xhr.onload = function() {
			var xml = this.responseXML;
			var items = xml.documentElement.getElementsByTagName("item");
			var data = [];
	
			for (var i = 0; i < items.length; i++) {
				var item = items.item(i);
				data.push({
					title: item.getElementsByTagName('title').item(0).text,
					// Now I decide to download "media:content", but if it will happen a log of error,
					// change to "media:thumbnail" tab and replace "/m/m_" to "/l/l_".
					image_url: item.getElementsByTagName('media:content').item(0).getAttribute('url'),
					pubdate: common.getYYYYMMDDHHMMSS(item.getElementsByTagName('pubDate').item(0).text),
				});
			}
			
			if (o.success) {
				o.success(data);	// Pass data.
			}
		};
		
		this.xhr.onerror = function(error) {
			_callOnError(o, error.error);	// Pass error message.
		};
		
		// Go
		if (o.start) {
			o.start();
		}
		this.xhr.open('GET', url);
		this.xhr.send();
	};
};

function _callOnError(o, errorMessage) {
	if (o.error && typeof o.error === 'function') {
		o.error(errorMessage);
	}
}

// Export
module.exports = RssLoader;
