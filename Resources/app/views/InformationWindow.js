/**
 * Information Window
 */
var _window;

function InformationWindow() {
	var initTransform = Ti.UI.create2DMatrix();
	initTransform = initTransform.scale(0);
	
	_window = Ti.UI.createWindow({
		orientationModes: [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT, Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT],
		backgroundColor: '#000000',
		borderWidth: 3,
		borderColor: '#666666',
		borderRadius: 8,
		opacity: 0.7,
		width: 300,
		height: Ti.Platform.displayCaps.getPlatformHeight() - 25,
		transform: initTransform,
	});
	
	var container = Ti.UI.createScrollView({
		contentWidth:'auto',
		contentHeight:'auto',
		showVerticalScrollIndicator:true,
		top: 0,
	});
	
	var infoImage = Ti.UI.createImageView({
		width: 300,
		height: 450,
		image: '/images/information_en.png',
		top: 0,
	});
	container.add(infoImage);
	
	var closeButton = Ti.UI.createButton({
		title: L('close'),
		height: 30,
		width: 150,
		top: 410,
	});
	closeButton.addEventListener('click', _closeHandler);
	container.add(closeButton);
	
	_window.add(container);
	
	_window.createOpenAnimation = _createOpenAnimation;

	Ti.Gesture.addEventListener('orientationchange', _orientationChangeHandler);
	
	return _window;
}

function _orientationChangeHandler(event) {
	_window.height = Ti.Platform.displayCaps.getPlatformHeight() - 25;
}

function _closeHandler(event) {
	Ti.Gesture.removeEventListener('orientationchange', _orientationChangeHandler);
	
	var t = Ti.UI.create2DMatrix();
	t = t.scale(0);
	var a = Ti.UI.createAnimation();
	a.transform = t;
	a.duration = 250;
	
	_window.animate(a, function() {
		_window.close();
		_window = null;
	});
}

function _createOpenAnimation() {
	var t = Ti.UI.create2DMatrix();
	t = t.scale(1);
	var a = Ti.UI.createAnimation();
	a.transform = t;
	a.duration = 250;
	return a;
}

// Export
module.exports = InformationWindow;
