/**
 * Feed model
 */
var _db = require('/app/common/dbutil').getDatabase();

function Feed() {
	var api = {};
	
	api.availableFeedCount = function() {
		var rows = _select('SELECT COUNT(1) as count FROM feeds WHERE error = 0');
		if (rows.length > 0) {
			return rows[0].count;
		} else {
			return 0;
		}
	}
	
	api.hasSameFeedData = function(link) {
		var rows = _select('SELECT * FROM feeds WHERE link = ?', link);
		if (rows.length > 0) {
			return true;
		} else {
			return false;
		}
	}
	
	api.getNextDisplayFeedCandidates = function(count) {
		return _select('SELECT * FROM feeds WHERE error = 0 ORDER BY display_count ASC, pubdate DESC LIMIT ?', count);
	}
	
	api.getLowPriorityFeedCandidates = function(count) {
		return _select("SELECT * FROM feeds WHERE image_file_name != '' ORDER BY display_count DESC, pubdate ASC LIMIT ?", count);
	}
	
	api.insert = function(allValues) {
		_db.execute('INSERT INTO feeds VALUES (?,?,?,?,?,?,?,?,?,?)', allValues);
		return _db.getRowsAffected();
	}
	
	api.updateFeedFileInfo = function(id, imageFileName, width, height) {
		_db.execute('UPDATE feeds SET image_file_name=?, width=?, height=? WHERE id=?', imageFileName, width, height, id);
		return _db.getRowsAffected();
	}
	
	api.updateFeedAsDisplayed = function(id) {
		_db.execute('UPDATE feeds SET display_count=display_count+1 WHERE id=?', id);
		return _db.getRowsAffected();
	}
	
	api.updateFeedAsError = function(id) {
		_db.execute('UPDATE feeds SET error=1 WHERE id=?', id);
		return _db.getRowsAffected();
	}
	
	return api;
}

function _select(sql, placeHolders) {
	var rs;
	if (placeHolders) {
		rs = _db.execute(sql, placeHolders);
	} else {
		rs = _db.execute(sql);
	}
	
	var rows = [];
	var row;
	while (rs.isValidRow()) {
		row = {};
		for (var i = 0, len = rs.fieldCount(); i < len; i++) {
			row[rs.fieldName(i)] = rs.field(i);
		}
		rows.push(row);
		rs.next();
	}
	rs.close();
	return rows;
}

// Export
module.exports = Feed;