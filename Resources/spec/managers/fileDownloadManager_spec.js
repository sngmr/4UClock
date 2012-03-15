describe("FileDownloadManager", function() {
	/*
	var manager, db, saveDir;
	
	beforeEach(function() {
		manager = require('/app/managers/fileDownloadManager');
		db = require('/app/common/dbutil').getDatabase();
		db.execute('DELETE FROM feeds');
		saveDir = require('/app/common/constant').IMAGE_FILE_DIR_NAME;
	});
	afterEach(function() {
		db.execute('DELETE FROM feeds');
	});
	
	it('Singleton test', function() {
		var mgr1 = require('/app/managers/fileDownloadManager');
		var mgr2 = require('/app/managers/fileDownloadManager');
		
		// Check the private value is not public
		expect(mgr1.rssLoader).toBeUndefined();
		expect(mgr2.rssLoader).toBeUndefined();
		
		// Check both manager should point same object
		expect(mgr1).toBe(mgr2);
	});
	
	it('No Download', function() {
		expect(manager.start()).toBeFalsy();
	});
	
	it('Download 1', function() {
		var complete = false;
		db.execute("INSERT INTO feeds VALUES (null, 'title1', 'http://livedoor.blogimg.jp/sugumiru18/imgs/1/6/168c9465.jpg', '20120101', NULL, 0, 0)");
		
		Ti.App.addEventListener(manager.EVENT_COMPLETE, function() { complete = true; });
		manager.start();
		
		waitsFor(function() { return complete; }, 'Never finish async method.', 30000);
		
		runs(function() {
			var feed = new (require('/app/models/Feed'))();
			var rows = feed.selectAll();
			expect(Ti.Filesystem.getFile(saveDir, rows[0].filename).exists()).toBeTruthy();
		});
	});
	
	it('Download', function() {
		var complete = false;
		db.execute("INSERT INTO feeds VALUES (null, 'title1', 'http://livedoor.blogimg.jp/sugumiru18/imgs/3/2/3202beef.jpg', '20120101', NULL, 0, 0)");
		db.execute("INSERT INTO feeds VALUES (null, 'title1', 'image1', '20120102', 'filepath1', 0, 0)");
		db.execute("INSERT INTO feeds VALUES (null, 'title1', 'http://livedoor.blogimg.jp/captaintorepan/imgs/5/1/517f25c7-s.jpg', '20120103', NULL, 0, 0)");
		
		Ti.App.addEventListener(manager.EVENT_COMPLETE, function() { complete = true; });
		manager.start();
		
		waitsFor(function() { return complete; }, 'Never finish async method.', 30000);
		
		runs(function() {
			var feed = new (require('/app/models/Feed'))();
			var rows = feed.selectAll();
			expect(Ti.Filesystem.getFile(saveDir, rows[0].filename).exists()).toBeTruthy();
			expect(Ti.Filesystem.getFile(saveDir, rows[2].filename).exists()).toBeTruthy();
		});
	});
	*/
});