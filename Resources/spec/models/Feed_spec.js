describe('Feed', function() {
	var db;
	beforeEach(function() {
		db = require('/app/common/dbutil').getDatabase();
		db.execute('DELETE FROM feeds');
	});
	afterEach(function() {
		db.execute('DELETE FROM feeds');
	});
	
	it('Private value visibility test', function() {
		var feed = new (require('/app/models/Feed'))();
		expect(feed._db).toBeUndefined();
	});
	
	it('select', function() {
		var feed = new (require('/app/models/Feed'))();
		
		db.execute("INSERT INTO feeds VALUES (1,'title1','image1','20120101','filepath1',0, 0)");
		db.execute("INSERT INTO feeds VALUES (2,'title2','image2','20120102','filepath2',0, 0)");
		
		var row = feed.select(1);
		
		expect(row.title).toEqual('title1');
		expect(row.image_url).toEqual('image1');
		expect(row.pubdate).toEqual('20120101');
		
		var row = feed.select(999);
		
		expect(row).toEqual(null);
	});
	
	it('selectByImageUrl', function() {
		var feed = new (require('/app/models/Feed'))();
		
		db.execute("INSERT INTO feeds VALUES (1,'title1','image1','20120101','filepath1',0, 0)");
		db.execute("INSERT INTO feeds VALUES (2,'title2','image2','20120102','filepath2',0, 0)");
		
		var row = feed.selectByImageUrl('image1');
		
		expect(row.title).toEqual('title1');
		expect(row.image_url).toEqual('image1');
		expect(row.pubdate).toEqual('20120101');
		
		var row = feed.selectByImageUrl('imageXXX');
		
		expect(row).toEqual(null);
	});
	
	it('selectAll', function() {
		var feed = new (require('/app/models/Feed'))();
		
		db.execute("INSERT INTO feeds VALUES (null,'title1','image1','20120101','filepath1',0, 0)");
		db.execute("INSERT INTO feeds VALUES (null,'title2','image2','20120102','filepath2',0, 0)");
		
		var rows = feed.selectAll();
		
		expect(rows.length).toEqual(2);
		expect(rows[0].title).toEqual('title1');
		expect(rows[1].image_url).toEqual('image2');
		expect(rows[0].pubdate).toEqual('20120101');
	});
	
	it('selectDisplay with no arguments', function() {
		var feed = new (require('/app/models/Feed'))();
		
		db.execute("INSERT INTO feeds VALUES (null,'title1','image1','20120101','filepath1',0, 0)");
		db.execute("INSERT INTO feeds VALUES (null,'title2','image2','20120102',NULL,0, 0)");
		db.execute("INSERT INTO feeds VALUES (null,'title3','image3','20120103','filepath3',0, 0)");
		
		var rows = feed.selectDisplay();
		
		expect(rows.length).toEqual(2);
		expect(rows[0].title).toEqual('title3');
		expect(rows[1].image_url).toEqual('image1');
		expect(rows[0].pubdate).toEqual('20120103');
	});
	
	it('selectDisplay with arguments', function() {
		var feed = new (require('/app/models/Feed'))();
		
		db.execute("INSERT INTO feeds VALUES (1,'title1','image1','20120101','filepath1',0, 0)");
		db.execute("INSERT INTO feeds VALUES (2,'title2','image2','20120102',NULL,0, 0)");
		db.execute("INSERT INTO feeds VALUES (3,'title3','image3','20120103','filepath3',0, 0)");
		
		var rows = feed.selectDisplay('20120102');
		
		expect(rows.length).toEqual(1);
		expect(rows[0].title).toEqual('title1');
		expect(rows[0].pubdate).toEqual('20120101');
	});
	
	it('selectUndownload', function() {
		var feed = new (require('/app/models/Feed'))();
		
		db.execute("INSERT INTO feeds VALUES (null,'title1','image1','20120101',NULL,0, 0)");
		db.execute("INSERT INTO feeds VALUES (null,'title2','image2','20120102','filepath2',0, 0)");
		
		var rows = feed.selectUndownload();
		
		expect(rows.length).toEqual(1);
		expect(rows[0].title).toEqual('title1');
		expect(rows[0].filename).toEqual(null);
	});
	
	it('insert', function() {
		var feed = new (require('/app/models/Feed'))();
		
		var count = feed.insert([null, 'title1', 'image1', 'pubdate1', 'filepath1', 0, 0]);
		expect(count).toEqual(1);
		var count = feed.insert([null, 'title2', 'image2', 'pubdate2', 'filepath2', 0, 0]);
		expect(count).toEqual(1);
		
		var rows = feed.selectAll();
		expect(rows.length).toEqual(2);
		expect(rows[0].title).toEqual('title1');
		expect(rows[1].title).toEqual('title2');
	});
	
	it('updateFileData', function() {
		var feed = new (require('/app/models/Feed'))();
		
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
	
	it('remove', function() {
		var feed = new (require('/app/models/Feed'))();
		
		db.execute("INSERT INTO feeds VALUES (1,'title1','image1','20120101',NULL,0,0)");
		
		var rows = feed.selectAll();
		expect(rows.length).toEqual(1);
		
		var count = feed.remove(1);
		expect(count).toEqual(1);
		
		var rows = feed.selectAll();
		expect(rows.length).toEqual(0);
	});
	
});
