// open tab group
if (Ti.Platform.osname == 'android') {
	$.login.fbProxy = Alloy.Globals.Facebook.createActivityWorker({lifecycleContainer: $.login});
}

var fb = require('facebook');
 fb.permissions = ['email'];
 fb.initialize();
 fb.authorize();
  
var fb = require('facebook');
    fb.addEventListener('login', function(event) {
        // You *will* get this event if loggedIn == false below
        // Make sure to handle all possible cases of this event
        if (event.success) {

        //	var main = Alloy.createController('main').getView();
 		//	main.open();
        	var main = Alloy.createController('main').getView();
 			$.login.close();
 			main.open();
            // alert('login from uid: '+event.uid+', name: '+JSON.parse(event.data).name);
            // label.text = 'Logged In = ' + fb.loggedIn;
        } else if (event.cancelled) {
            // user cancelled 
            alert('cancelled');
        } else {
            alert(event.error);         
        }
    });
    fb.addEventListener('logout', function(e) {
        alert('logged out');
    });

 		var main = Alloy.createController('main').getView();
 			main.open();

	
//$.login.open();