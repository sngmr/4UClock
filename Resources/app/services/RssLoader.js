/**
 * RSS Loader
 */
function RssLoader() {
	this.xhr = Ti.Network.createHTTPClient();
	this.xhr.timeout = 2500;
	
	/**
	 * Send
	 */
	this.load = function(url, o) {
		this.xhr.abort();
		
		if (!Ti.Network.online) {
			if (o.error) o.error('No connection');
			return;
		}
		
		// TODO: Validate url
		
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
					pubdate: _parseDate(item.getElementsByTagName('pubDate').item(0).text),
				});
			}
			
			if (o.success) o.success(data);		// Pass data.
		};
		
		this.xhr.onerror = function(error) {
			if (o.error) o.error(error.error);	// Pass error message.
		};
		
		// Go
		if (o.start) { o.start(); }
		this.xhr.open('GET', url);
		this.xhr.send();
	};
};

function _parseDate(dateStr) {
	var date;
	
	try {
		date = new Date(dateStr);
	} catch (e) {
		date = new Date();
	}
	
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var hour = date.getHours();
	var minute = date.getMinutes();
	var second = date.getSeconds();
	var twoFn = function(str) {
		return (str + '').length == 1 ? '0' + (str + '') : (str + '');
	}
	
	return year + twoFn(month) + twoFn(day) + twoFn(hour) + twoFn(minute) + twoFn(second);
};

// Export
module.exports = RssLoader;
