describe("rss", function() {
	var rss;
	beforeEach(function() {
		rss = new (require('app/services/RssLoader'))();
	});
	
	// Private method test
	it('DateTime format', function() {
		expect(_parseDate('Fri, 21 Oct 2011 12:26:24 +0900')).toEqual('20111021122624');
		expect(_parseDate('Sat, 4 Feb 2012 01:04:03 +0900')).toEqual('20120204010403');
	});
	
	it('Getting feed success', function() {
		var receiveData;
		var complete = false;
		
		rss.load('http://4u-beautyimg.com/rss?page=1', {
			success: function(data) {
				receiveData = data;
				complete = true;
			},
		});
		
		waitsFor(function() {
			return complete;
		}, 'Feed never get', 5000);
		
		runs(function() {
			expect(receiveData).toBeDefined();
			expect(receiveData.length).toBeGreaterThan(0);
		});
	});
	
	it('Getting feed fail', function() {
		var errorMsg;
		var complete = false;
		
		rss.load('http://hogehogehogehogehogehoge.co', {
			success: function(data) {},
			error: function(error) {
				errorMsg = error;
				complete = true;
			},
		});
		
		waitsFor(function() {
			return complete;
		}, 'Never kick error', 5000);
		
		runs(function() {
			expect(errorMsg).toBeDefined();
			expect(errorMsg.length).toBeGreaterThan(0);
		});
	});
});
