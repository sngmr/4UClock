//FirstView Component Constructor
function FirstView() {
	//create object instance, a parasitic subclass of Observable
	var self = Ti.UI.createView();
	
	//label using localization-ready strings from <app dir>/i18n/en/strings.xml
	var label = Ti.UI.createLabel({
		color:'#000000',
		text:String.format(L('welcome'), 'Titanium'),
		height:'auto',
		width:'auto'
	});
	self.add(label);
	
	//Add behavior for UI
	label.addEventListener('click', function(e) {
		alert(e.source.text);
	});
	
	//
	// TEST
	//
	var imageManager = require('app/managers/ImageManager');
	imageManager.init();
	
	// var rss = new (require('app/services/RssLoader'))();
	// rss.load('http://4u-beautyimg.com/rss', {});
// 	
	// var downloader = new (require('app/services/FileDownloader'))();
	// var callback = {
		// success: function(filePath) {
			// self.backgroundImage = filePath;
		// },
		// error: function(errorMsg) {
			// alert(errorMsg);
		// },
	// };
	// downloader.download('http://4u-beautyimg.com/thumb/l/l_f54a50178ac024480a911556407cc7e9.jpg', callback);
	
	return self;
}

module.exports = FirstView;
