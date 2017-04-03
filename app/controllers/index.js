// open tab group
if (Ti.Platform.osname == 'android') {
	$.login.fbProxy = Alloy.Globals.Facebook.createActivityWorker({lifecycleContainer: $.index});
}

var fb = require('facebook');
 fb.permissions = ['email'];
 fb.setLoginBehavior(fb.LOGIN_BEHAVIOR_NATIVE);
 fb.initialize();
 fb.authorize();

var fb = require('facebook');
    fb.addEventListener('login', function(e) {
        // You *will* get this event if loggedIn == false below
        // Make sure to handle all possible cases of this event
        if (e.success) {
            alert('login from uid: '+e.uid+', name: '+JSON.parse(e.data).name);
            label.text = 'Logged In = ' + fb.loggedIn;
        } else if (e.cancelled) {
            // user cancelled 
            alert('cancelled');
        } else {
            alert(e.error);         
        }
    });
    fb.addEventListener('logout', function(e) {
        alert('logged out');
        label.text = 'Logged In = ' + fb.loggedIn;
    });

$.login.open();