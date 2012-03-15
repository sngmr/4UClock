/**
 * Database utility
 */

// HACK:
// I don't want to get rejected by Apple because of broken law policy stored file,
// so customize database file location to Libraly/Caches
var DB_NAME = '../Caches/fuclock';

var _db;

exports.getDatabase = function() {
	if (!_db) {
		_db = Ti.Database.install('empty.sql', DB_NAME);
		_db.execute(
			'CREATE TABLE IF NOT EXISTS feeds (' +
				'id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,' +
				'title TEXT,' +
				'link TEXT,' +
				'image_url TEXT,' +
				'pubdate TEXT,'+
				'image_file_name TEXT,' +
				'width INTEGER,' +
				'height INTEGER,' +
				'display_count INTEGER,' +
				'error INTEGER' +
			')'
		);
	}
	return _db;
}
