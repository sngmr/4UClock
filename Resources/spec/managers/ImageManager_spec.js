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
	
	/*
	it('Init test', function(){
		
		manager.init();
		
		waitsFor(function() { return manager.isReady(); }, 'Never finish async method.', 30000);
		
		runs(function() {
			var rs = db.execute('SELECT * FROM feeds');
			expect(rs.rowCount).toBeGreaterThan(10);
		});
	});
	*/
});