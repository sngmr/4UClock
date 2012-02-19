/**
 * Common Function
 */
function twoZeroPadding(s) {
	return ('0' + s).slice(-2);
}

function getYYYYMMDDHHMMSS(dateStr) {
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
	
	return year + twoZeroPadding(month) + twoZeroPadding(day) + 
		twoZeroPadding(hour) + twoZeroPadding(minute) + twoZeroPadding(second);
}

function getRandomString() {
	var base = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	base = base.split('');
	
	// First charactor should not be numerical.
	var result = base[Math.floor(Math.random() * 52)];
	for (var i = 0, len = 31; i < len; i++) {
		result += base[Math.floor(Math.random() * base.length)];
	}
	return result;
}

function isUrl(s) {
	var regexp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
	return regexp.test(s);
}

function getFileExtension(url) {
	if (!url) {
		return null;
	}
	
	var path = url.split('/');
	var s = path[path.length - 1].split('.');
	if (s.length < 2) {
		return null;
	} else {
		return s[s.length - 1];
	}
}

function checkFileExtension(extension) {
	return /^(jpg|jpeg|png)$/.test(extension);
}

// Export
exports.twoZeroPadding = twoZeroPadding;
exports.getYYYYMMDDHHMMSS = getYYYYMMDDHHMMSS;
exports.isUrl = isUrl;
exports.getRandomString = getRandomString;
exports.getFileExtension = getFileExtension;
exports.checkFileExtension = checkFileExtension;