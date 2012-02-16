describe('Feed', function() {
	var db;
	beforeEach(function() {
		db = require('app/common/dbutil').getDatabase();
		db.execute('DELETE FROM feeds');
	});
	afterEach(function() {
		db.execute('DELETE FROM feeds');
	});
	
	it('Select test', function() {
		var feed = new (require('app/models/Feed'))();
		
		// Check if private instance value can see
		expect(feed._db).toBeUndefined();
		
		db.execute("INSERT INTO feeds VALUES (null,'title1','image1','20120101','filepath1',0)");
		db.execute("INSERT INTO feeds VALUES (null,'title2','image2','20120102','filepath2',1)");
		
		var rows = feed.selectAll();
		
		expect(rows.length).toEqual(2);
		expect(rows[0].title).toEqual('title2');
		expect(rows[1].image).toEqual('image1');
		expect(rows[0].pubdate).toEqual('20120102');
	});
	
	it('Select only undownload', function() {
		var feed = new (require('app/models/Feed'))();
		
		db.execute("INSERT INTO feeds VALUES (null,'title1','image1','20120101',NULL,0)");
		db.execute("INSERT INTO feeds VALUES (null,'title2','image2','20120102','filepath2',1)");
		
		var rows = feed.selectUndownload();
		
		expect(rows.length).toEqual(1);
		expect(rows[0].title).toEqual('title1');
		expect(rows[0].filepath).toEqual(null);
	});
	
	it('Insert test 1', function() {
		var feed = new (require('app/models/Feed'))();
		
		var count = feed.insert([null, 'title1', 'image1', 'pubdate1', 'filepath1', 0]);
		expect(count).toEqual(1);
		
		var rows = feed.selectAll();
		expect(rows.length).toEqual(1);
		expect(rows[0].title).toEqual('title1');
	});
	
	it('Insert test 2', function() {
		var feed = new (require('app/models/Feed'))();
		
		var count = feed.insert([null, 'title1', 'image1', 'pubdate1', 'filepath1', 0]);
		expect(count).toEqual(1);
		var count = feed.insert([null, 'title2', 'image2', 'pubdate2', 'filepath2', 1]);
		expect(count).toEqual(1);
		
		var rows = feed.selectAll();
		expect(rows.length).toEqual(2);
		expect(rows[0].title).toEqual('title2');
		expect(rows[1].title).toEqual('title1');
	});
	
	it('Update filepath test 1', function() {
		var feed = new (require('app/models/Feed'))();
		
		db.execute("INSERT INTO feeds VALUES (null,'title1','image1','20120101',NULL,0)");
		
		var rows = feed.selectAll();
		expect(rows.length).toEqual(1);
		
		var count = feed.updateFilePath(rows[0].id, 'hogehoge');
		expect(count).toEqual(1);
		
		var rows = feed.selectAll();
		expect(rows.length).toEqual(1);
		expect(rows[0].filepath).toEqual('hogehoge');
	});
	
});
