function loadRssFeed(url, o) {
	var xhr = Titanium.Network.createHTTPClient();	
	xhr.open('GET', url);
	xhr.onload = function() {
		var xml = this.responseXML;
		var items = xml.documentElement.getElementsByTagName("item");
		var data = [];

		for (var i = 0; i < items.length; i++) {
			var item = items.item(i);
			data.push({
				title: item.getElementsByTagName('title').item(0).text,
				image: item.getElementsByTagName('media:content').item(0).getAttribute('url'),
			});
		}
		if (o.success) { o.success(data); }
	};
	xhr.onerror = function() {
		if (o.error) { o.error(); }
	};

	if (o.start) { o.start(); }
	xhr.send();	
};

// Export
exports.loadRssFeed = loadRssFeed;
