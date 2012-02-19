describe("ImageManager", function() {
	var manager, db, saveDir;
	
	beforeEach(function() {
		manager = require('app/managers/imageManager');
		db = require('app/common/dbutil').getDatabase();
		saveDir = require('app/common/constant').IMAGE_FILE_DIR_NAME;
	});
	
	it('Singleton test', function() {
		var mgr1 = require('app/managers/imageManager');
		var mgr2 = require('app/managers/imageManager');
		
		// Check the private value is not public
		expect(mgr1._readPage).toBeUndefined();
		expect(mgr2._readPage).toBeUndefined();
		
		// Check both manager should point same object
		expect(mgr1).toBe(mgr2);
	});
	
	it('Init test', function(){
		var ready = false;
		
		Ti.App.addEventListener(manager.EVENT_COMPLETE, function() { ready = true; });
		manager.init();
		
		waitsFor(function() { return ready; }, 'Never finish async method.', 30000);
		
		runs(function() {
			var rs;
			
			rs = db.execute('SELECT * FROM feeds');
			expect(rs.rowCount).toBeGreaterThan(10);
			
			rs = db.execute("SELECT * FROM feeds WHERE filename IS NOT NULL");
			expect(rs.rowCount).toBeGreaterThan(0);
		});
	});
	
	it('Get image model test', function() {
		var ready = false;
		
		Ti.App.addEventListener(manager.EVENT_COMPLETE, function() { ready = true; });
		manager.init();
		
		waitsFor(function() { return ready; }, 'Never finish async method.', 30000);
		
		runs(function() {
			// At least 5 data can get
			expect(Titanium.Filesystem.getFile(saveDir, manager.getNext().filename).exists()).toBeTruthy();
			expect(Titanium.Filesystem.getFile(saveDir, manager.getNext().filename).exists()).toBeTruthy();
			expect(Titanium.Filesystem.getFile(saveDir, manager.getNext().filename).exists()).toBeTruthy();
			expect(Titanium.Filesystem.getFile(saveDir, manager.getNext().filename).exists()).toBeTruthy();
			expect(Titanium.Filesystem.getFile(saveDir, manager.getNext().filename).exists()).toBeTruthy();
		});
	});
});