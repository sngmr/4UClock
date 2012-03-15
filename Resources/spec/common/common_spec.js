describe('common', function() {
	var common;
	beforeEach(function() {
		common = require('/app/common/common');
	});
	
	it('isUrl', function() {
		expect(common.isUrl('http://hogehoge.com')).toBeTruthy();
		expect(common.isUrl('http://hogehoge.com/')).toBeTruthy();
		expect(common.isUrl('http://hogehoge.com/hoge?hoge=value')).toBeTruthy();
		expect(common.isUrl('http://hogehoge.com/hoge/hoge.png')).toBeTruthy();
		expect(common.isUrl('http://')).not.toBeTruthy();
	});
	
	it('Two zero padding', function() {
		expect(common.twoZeroPadding(0)).toEqual('00');
		expect(common.twoZeroPadding(1)).toEqual('01');
		expect(common.twoZeroPadding('00')).toEqual('00');
		expect(common.twoZeroPadding('01')).toEqual('01');
	});
	
	it('getRandomString', function() {
		var str, firstChar;
		for (var i = 0; i < 10000; i++) {
			str = common.getRandomString();
			expect(/^[a-zA-Z][a-zA-Z0-9]{31}$/.test(str)).toBeTruthy();
		}
	});
	
	it('getFileExtension', function() {
		expect(common.getFileExtension('hoge.xls')).toEqual('xls');
		expect(common.getFileExtension('http://hogehoge.com/hoge.jpg')).toEqual('jpg');
		expect(common.getFileExtension('hogehoge')).toEqual(null);
		expect(common.getFileExtension('')).toEqual(null);
		expect(common.getFileExtension(null)).toEqual(null);
	});
	
	it('checkFileExtension', function() {
		expect(common.checkFileExtension('jpg')).toBeTruthy();
		expect(common.checkFileExtension('jpeg')).toBeTruthy();
		expect(common.checkFileExtension('png')).toBeTruthy();
		expect(common.checkFileExtension()).toBeFalsy();
		expect(common.checkFileExtension('gif')).toBeFalsy();
		expect(common.checkFileExtension('hoge.png?hogehoge')).toBeFalsy();
	});
	
});
