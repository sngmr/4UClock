/**
 * RSS loader
 * @constructor
 * @param {object} options Object of options. 
 * @config {integer} [timeout] Timeout milsec. Default is 30000
 * 		
 */
function RssLoader(options) {
	var api = {};
	var xhr;
	
	// Setting options
	options = options || {};
	var timeout = options.timeout || 30000;
	
	/**
	 * Load RSS and return XML object
	 * @param {string} url URL representing file resource
	 * @param {object} o Callback object
	 * @config {function} [success] function when execute download success
	 * @config {function} [error] function when execute download success
	 */
	api.load = function(url, o) {
		if (!xhr) {
			xhr = Ti.Network.createHTTPClient();
			xhr.timeout = timeout;
		}
		xhr.abort();
		
		// Setting HTTPClient
		xhr.onload = function() {
			if (this.status == 200) {
				try {
					var xml = this.responseXML;
					var items = xml.documentElement.getElementsByTagName("item");
					var data = [];
					for (var i = 0; i < items.length; i++) {
						var item = items.item(i);
						data.push({
							title: item.getElementsByTagName('title').item(0).text,
							link: item.getElementsByTagName('link').item(0).text,
							pubdate: _getYYYYMMDDHHMMSS(item.getElementsByTagName('pubDate').item(0).text),
							// Now I decide to download "media:content", but if it will happen a log of error,
							// change to "media:thumbnail" tab and replace "/m/m_" to "/l/l_".
							image_url: item.getElementsByTagName('media:content').item(0).getAttribute('url'),
						});
					}
					if (o.success) {
						o.success(data);	// Pass data.
					}
				} catch (e) {
					_callOnError(o, e.message);
				}
			} else {
				_callOnError(o, 'HTTP status(' + this.status + ') is something wrong');
			}
			_clearXhr(xhr)
		};
		
		xhr.onerror = function(error) {
			_callOnError(o, error.error);	// Pass error message.
			_clearXhr(xhr)
		};
		
		// Go
		xhr.open('GET', url);
		xhr.send();
	};
	
	return api;
};

function _getYYYYMMDDHHMMSS(dateStr) {
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
	
	return year + _twoZeroPadding(month) + _twoZeroPadding(day) + 
		_twoZeroPadding(hour) + _twoZeroPadding(minute) + _twoZeroPadding(second);
}

function _twoZeroPadding(s) {
	return ('0' + s).slice(-2);
}

function _clearXhr(xhr) {
	xhr.onload = null;
	xhr.onerror = null;
	xhr.onreadystatechange = null;
	xhr.ondatastream = null;
}

function _callOnError(o, errorMessage) {
	if (o.error && typeof o.error === 'function') {
		o.error(errorMessage);
	}
}

// Export
module.exports = RssLoader;
