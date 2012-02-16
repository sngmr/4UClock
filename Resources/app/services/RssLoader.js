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
					image: item.getElementsByTagName('media:content').item(0).getAttribute('url'),
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
	}
};

// Export
module.exports = RssLoader;
