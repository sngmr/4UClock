describe("ImageManager", function() {
	/*
	var manager, db, saveDir;
	
	beforeEach(function() {
		manager = require('/app/managers/imageManager');
		db = require('/app/common/dbutil').getDatabase();
		saveDir = require('/app/common/constant').IMAGE_FILE_DIR_NAME;
		
		db.execute('DELETE FROM feeds');
		var dir = Ti.Filesystem.getFile(saveDir);
		if (dir.exists()) {
			dir.deleteDirectory(true);
		}
	});
	
	it('Singleton test', function() {
		var mgr1 = require('/app/managers/imageManager');
		var mgr2 = require('/app/managers/imageManager');
		
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
			rs.close();
			
			rs = db.execute("SELECT * FROM feeds WHERE filename IS NOT NULL");
			expect(rs.rowCount).toBeGreaterThan(0);
			rs.close();
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
	
	it('Check no duplicate data', function() {
		var ready = false;
		var recordCount = 0;
		var rs;
		
		Ti.App.addEventListener(manager.EVENT_COMPLETE, function() { ready = true; });
		manager.init();
		
		waitsFor(function() { return ready; }, 'Never finish async method part1.', 30000);
		
		runs(function() {
			// Get record count for duplicate check
			rs = db.execute('SELECT * FROM feeds');
			recordCount = rs.rowCount;
			
			// init agein
			ready = false;
			manager.init();
			
			waitsFor(function() { return ready; }, 'Never finish async method part2.', 30000);
			
			runs(function() {
				rs = db.execute('SELECT * FROM feeds');
				expect(rs.rowCount).toEqual(recordCount);
			});
		});
	});
	*/
});