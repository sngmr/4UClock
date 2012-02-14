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
	
	// テスト
	var rss = require('app/services/rss');
	rss.loadRssFeed('http://4u-beautyimg.com/rss?page=1', {
		success: function(data) {
			Ti.API.info(data);
		}
	});
	
	return self;
}

module.exports = FirstView;
