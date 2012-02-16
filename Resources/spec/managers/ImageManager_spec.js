describe("ImageManager", function() {
	var manager, db;
	
	beforeEach(function() {
		manager = require('app/managers/ImageManager');
		db = require('app/common/dbutil').getDatabase();
	});
	
	it('Singleton test', function() {
		var mgr1 = require('app/managers/ImageManager');
		var mgr2 = require('app/managers/ImageManager');
		
		// Check the private value is not public
		expect(mgr1._readPage).toBeUndefined();
		expect(mgr2._readPage).toBeUndefined();
		
		// Check both manager should point same object
		expect(mgr1).toBe(mgr2);
	});
	
	it('Init test', function(){
		var ready = false;
		
		Ti.App.addEventListener(manager.EVENT_READY, function() { ready = true; });
		manager.init();
		
		waitsFor(function() { return ready; }, 'Never finish async method.', 30000);
		
		runs(function() {
			var rs;
			
			rs = db.execute('SELECT * FROM feeds');
			expect(rs.rowCount).toBeGreaterThan(10);
			
			rs = db.execute("SELECT * FROM feeds WHERE filepath IS NOT NULL");
			expect(rs.rowCount).toBeGreaterThan(0);
		});
	});
});