// open tab group
if (Ti.Platform.osname == 'android') {
	$.login.fbProxy = Alloy.Globals.Facebook.createActivityWorker({lifecycleContainer: $.login});
}

var fb = require('facebook');
 fb.permissions = ['public_profile','email'];
 fb.initialize();
 fb.authorize();
  
var fb = require('facebook');
fb.requestWithGraphPath('me', {}, 'GET', function(e) {
	if (e.success) {
        //alert(e.result);
        var results = JSON.parse(e.result);
        var fbID = results.id;
        fbImageURL= 'http://graph.facebook.com/'+fbID+'/picture';
        console.log(fbImageURL);
        
		
    	var main = Alloy.createController('main').getView();
		main.open();
        }else {
    }
});

    fb.addEventListener('login', function(event) {
        // You *will* get this event if loggedIn == false below
        // Make sure to handle all possible cases of this event
        if (event.success) {
        	var main = Alloy.createController('main').getView();
 			$.login.close();
 			main.open();
            // alert('login from uid: '+event.uid+', name: '+JSON.parse(event.data).name);
            // label.text = 'Logged In = ' + fb.loggedIn;
            
            fb.requestWithGraphPath('me', {}, 'GET', function(e) {
	        	if (e.success) {
		            //alert(e.result);
		            var results = JSON.parse(e.result);
		            var fbID = results.id;
		            fbImageURL= 'http://graph.facebook.com/'+fbID+'/picture';
		            console.log(fbImageURL);
		            } else if (e.error) {
		            	alert(e.error);
		            } else {
		            	alert('Unknown response');
		        }
	        });
            
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

$.login.open();
