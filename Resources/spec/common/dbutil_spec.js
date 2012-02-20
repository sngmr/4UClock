describe('dbutil', function() {
	var dbutil;
	beforeEach(function() {
		dbUtil = require('/app/common/dbutil');
	});
	
	it('Get database', function() {
		var db = dbUtil.getDatabase();
		expect(db.getName()).toEqual(require('/app/common/constant').DB_NAME);
	});
	
	it('Check database', function() {
		var db = dbUtil.getDatabase();
		var rs = db.execute('SELECT * FROM feeds');
		expect(rs).toBeDefined();
		expect(rs.rowCount).toBeGreaterThan(-1);
	});
});
