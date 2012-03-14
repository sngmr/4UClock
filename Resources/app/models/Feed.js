/**
 * Feed model
 */
function Feed() {
	var _db = require('/app/common/dbutil').getDatabase();
	
	this.select = function(id) {
		var rows = _select('SELECT * FROM feeds WHERE id = ?', id);
		if (rows.length > 0) {
			return rows[0];
		} else {
			return null;
		}
	}
	
	this.selectByImageUrl = function(imageUrl) {
		var rows = _select('SELECT * FROM feeds WHERE image_url = ?', imageUrl);
		if (rows.length > 0) {
			return rows[0];
		} else {
			return null;
		}
	}
	
	this.selectAll = function() {
		return _select('SELECT * FROM feeds ORDER BY id');
	}
	
	this.selectDisplay = function(pubdate) {
		if (pubdate) {
			return _select('SELECT * FROM feeds WHERE filename IS NOT NULL AND pubdate < ? ORDER BY pubdate DESC', pubdate);
		} else {
			return _select('SELECT * FROM feeds WHERE filename IS NOT NULL ORDER BY pubdate DESC');
		}
	}
	
	this.selectUndownload = function() {
		return _select('SELECT * FROM feeds WHERE filename IS NULL ORDER BY id');
	}
	
	this.insert = function(allValues) {
		_db.execute('INSERT INTO feeds VALUES (?,?,?,?,?,?,?)', allValues);
		return _db.getRowsAffected();
	}
	
	this.updateFileData = function(id, filePath, width, height) {
		_db.execute('UPDATE feeds SET filename=?,width=?,height=? WHERE id=?', filePath, width, height, id);
		return _db.getRowsAffected();
	}
	
	this.remove = function(id) {
		_db.execute('DELETE FROM feeds WHERE id = ?', id);
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
		rs.close();
		return rows;
	}
}

// Export
module.exports = Feed;