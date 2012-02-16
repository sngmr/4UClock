/**
 * CONSTANT
 */

exports.RSS_FEEDS_BASE_URL = 'http://4u-beautyimg.com/rss?page=';

exports.IMAGE_FILE_DIR_NAME = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, '../Library/Caches/').nativePath;

// HACK:
// I don't want to get rejected by Apple because of broken law policy stored file,
// so customize database file location to Libraly/Caches
exports.DB_NAME = '../Caches/_4uclock';

exports.ORIENTATION_UNKNOWN = 0;	// ex. square
exports.ORIENTATION_PORTRAIT = 1;
exports.ORIENTATION_LANDSCAPE = 2;