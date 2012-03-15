describe("rss", function() {
	var rss;
	beforeEach(function() {
		rss = new (require('/app/services/RssLoader'))({ timeout: 5000 });
	});
	
	it('@private: getYYYYMMDDHHMMSS', function() {
		expect(_getYYYYMMDDHHMMSS('Fri, 21 Oct 2011 12:26:24 +0900')).toEqual('20111021122624');
		expect(_getYYYYMMDDHHMMSS('Sat, 4 Feb 2012 01:04:03 +0900')).toEqual('20120204010403');
	});
	
	it('@private: Two zero padding', function() {
		expect(_twoZeroPadding(0)).toEqual('00');
		expect(_twoZeroPadding(1)).toEqual('01');
		expect(_twoZeroPadding('00')).toEqual('00');
		expect(_twoZeroPadding('01')).toEqual('01');
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
		}, 'Feed never get', 7000);
		
		runs(function() {
			expect(receiveData).toBeDefined();
			expect(receiveData.length).toBeGreaterThan(0);
		});
	});
	
	it('Getting feed fail', function() {
		var errorMsg;
		var complete = false;
		
		rss.load('http://4u-beautyimg.com/XSS', {
			success: function(data) {},
			error: function(error) {
				errorMsg = error;
				complete = true;
			},
		});
		
		waitsFor(function() {
			return complete;
		}, 'Never kick error', 7000);
		
		runs(function() {
			expect(errorMsg).toBeDefined();
			expect(errorMsg.length).toBeGreaterThan(0);
		});
	});
	
	it('Timeout test', function() {
		var errorMsg;
		var complete = false;
		
		// Setting options
		rss = new (require('/app/services/RssLoader'))({ timeout: 100 });
				
		rss.load('http://hogehogehogehogehogehoge.co', {
			success: function(data) {},
			error: function(error) {
				errorMsg = error;
				complete = true;
			},
		});
		
		waitsFor(function() {
			return complete;
		}, 'Never kick error', 1000);
		
		runs(function() {
			expect(/timed out/.test(errorMsg)).toBeTruthy();
		});
	});
});
