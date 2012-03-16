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
			"CREATE TABLE IF NOT EXISTS feeds (" +
				"id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
				"title TEXT NOT NULL DEFAULT ''," +
				"link TEXT NOT NULL DEFAULT ''," +
				"image_url TEXT NOT NULL DEFAULT ''," +
				"pubdate TEXT NOT NULL DEFAULT '',"+
				"image_file_name TEXT NOT NULL DEFAULT ''," +
				"width INTEGER DEFAULT 0," +
				"height INTEGER DEFAULT 0," +
				"display_count INTEGER DEFAULT 0," +
				"error INTEGER DEFAULT 0" +
			")"
		);
	}
	return _db;
}
