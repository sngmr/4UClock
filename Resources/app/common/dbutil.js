/**
 * Database utility
 */
var _db;
var _constant = require('/app/common/constant');

exports.getDatabase = function() {
	if (!_db) {
		_db = Ti.Database.install('empty.sql', _constant.DB_NAME);
		_db.execute(
			'CREATE TABLE IF NOT EXISTS feeds (' +
				'id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,' +
				'title TEXT,' +
				'image_url TEXT,' +
				'pubdate TEXT,'+
				'filename TEXT,' +
				'width INTEGER,' +
				'height INTEGER' +
			')'
		);
	}
	return _db;
}
