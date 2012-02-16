describe('Feed', function() {
	var db;
	beforeEach(function() {
		db = require('app/common/dbutil').getDatabase();
		db.execute('DELETE FROM feeds');
	});
	afterEach(function() {
		db.execute('DELETE FROM feeds');
	});
	
	it('Select all test', function() {
		var feed = new (require('app/models/Feed'))();
		
		// Check if private instance value can see
		expect(feed._db).toBeUndefined();
		
		db.execute("INSERT INTO feeds VALUES (null,'title1','image1','20120101','filepath1',0, 0)");
		db.execute("INSERT INTO feeds VALUES (null,'title2','image2','20120102','filepath2',0, 0)");
		
		var rows = feed.selectAll();
		
		expect(rows.length).toEqual(2);
		expect(rows[0].title).toEqual('title1');
		expect(rows[1].image_url).toEqual('image2');
		expect(rows[0].pubdate).toEqual('20120101');
	});
	
	it('Select display test 1', function() {
		var feed = new (require('app/models/Feed'))();
		
		db.execute("INSERT INTO feeds VALUES (null,'title1','image1','20120101','filepath1',0, 0)");
		db.execute("INSERT INTO feeds VALUES (null,'title2','image2','20120102',NULL,0, 0)");
		db.execute("INSERT INTO feeds VALUES (null,'title3','image3','20120103','filepath3',0, 0)");
		
		var rows = feed.selectDisplay();
		
		expect(rows.length).toEqual(2);
		expect(rows[0].title).toEqual('title3');
		expect(rows[1].image_url).toEqual('image1');
		expect(rows[0].pubdate).toEqual('20120103');
	});
	
	it('Select display test 2', function() {
		var feed = new (require('app/models/Feed'))();
		
		db.execute("INSERT INTO feeds VALUES (null,'title1','image1','20120101','filepath1',0, 0)");
		db.execute("INSERT INTO feeds VALUES (null,'title2','image2','20120102',NULL,0, 0)");
		db.execute("INSERT INTO feeds VALUES (null,'title3','image3','20120103','filepath3',0, 0)");
		
		var rows = feed.selectDisplay('20120102');
		
		expect(rows.length).toEqual(1);
		expect(rows[0].title).toEqual('title1');
		expect(rows[0].pubdate).toEqual('20120101');
	});
	
	it('Select only undownload', function() {
		var feed = new (require('app/models/Feed'))();
		
		db.execute("INSERT INTO feeds VALUES (null,'title1','image1','20120101',NULL,0, 0)");
		db.execute("INSERT INTO feeds VALUES (null,'title2','image2','20120102','filepath2',0, 0)");
		
		var rows = feed.selectUndownload();
		
		expect(rows.length).toEqual(1);
		expect(rows[0].title).toEqual('title1');
		expect(rows[0].filename).toEqual(null);
	});
	
	it('Insert test 1', function() {
		var feed = new (require('app/models/Feed'))();
		
		var count = feed.insert([null, 'title1', 'image1', 'pubdate1', 'filepath1', 0, 0]);
		expect(count).toEqual(1);
		
		var rows = feed.selectAll();
		expect(rows.length).toEqual(1);
		expect(rows[0].title).toEqual('title1');
	});
	
	it('Insert test 2', function() {
		var feed = new (require('app/models/Feed'))();
		
		var count = feed.insert([null, 'title1', 'image1', 'pubdate1', 'filepath1', 0, 0]);
		expect(count).toEqual(1);
		var count = feed.insert([null, 'title2', 'image2', 'pubdate2', 'filepath2', 0, 0]);
		expect(count).toEqual(1);
		
		var rows = feed.selectAll();
		expect(rows.length).toEqual(2);
		expect(rows[0].title).toEqual('title1');
		expect(rows[1].title).toEqual('title2');
	});
	
	it('Update file test 1', function() {
		var feed = new (require('app/models/Feed'))();
		
		db.execute("INSERT INTO feeds VALUES (null,'title1','image1','20120101',NULL,0,0)");
		
		var rows = feed.selectAll();
		expect(rows.length).toEqual(1);
		
		var count = feed.updateFileData(rows[0].id, 'hogehoge',100,234);
		expect(count).toEqual(1);
		
		var rows = feed.selectAll();
		expect(rows.length).toEqual(1);
		expect(rows[0].filename).toEqual('hogehoge');
		expect(rows[0].width).toEqual(100);
		expect(rows[0].height).toEqual(234);
	});
	
});
