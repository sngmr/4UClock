/**
 * Feed model
 */
function Feed() {
	var _db = require('app/common/dbutil').getDatabase();
	
	this.selectAll = function() {
		return _select('SELECT * FROM feeds ORDER BY pubdate DESC');
	}
	
	this.selectUndownload = function() {
		return _select('SELECT * FROM feeds WHERE filepath IS NULL ORDER BY id');
	}
	
	this.insert = function(allValues) {
		_db.execute('INSERT INTO feeds VALUES (?,?,?,?,?,?)', allValues);
		return _db.getRowsAffected();
	}
	
	this.updateFilePath = function(id, filePath) {
		_db.execute('UPDATE feeds SET filepath=? WHERE id=?', filePath, id);
		return _db.getRowsAffected();
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
		return rows;
	}
}

// Export
module.exports = Feed;