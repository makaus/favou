// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

function termsPage(e) {
 
 		var termsPage = Alloy.createController('terms').getView();
 		termsPage.open();
}
var fb = require('facebook');
fb.initialize();
fb.addEventListener('logout', function(e) {
		var index = Alloy.createController('index').getView();
		index.open();
	
        alert('logged out');
    });