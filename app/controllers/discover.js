// DEPENDENCIES
var user = Alloy.Collections.user;
var task = Alloy.Collections.task;
user.fetch({url: 'http://markeriksen.dk/test/wp-json/wp/v2/users/'+userID,
    success: function(){
        //console.log(user.models);
        //parse to listView
        _.each(user.models, function(element, index, list){
        	usersAssignedT = element.attributes['acf'].tilmeldte;
    		for(var i=0; i<usersAssignedT.length; i++){
            	usersTasks[i] = usersAssignedT[i].ID;
            }
                    userCats = element.attributes['acf'].interesser;
                    //console.log(userCats);
                    if(userCats.length<1){
						userCats = [-1];
					}
                    
					task.fetch({data: {per_page:99,_embed:"true"},processData:true,success: function(){
						//console.log(task.models);
						
				       		//parse to listView
					        _.each(task.models, function(element, index, list){
								Ti.Geolocation.forwardGeocoder(element.attributes['acf'].adresse,function(e){
									var mountainView = map.createAnnotation({
									    latitude:e.latitude,
									    longitude:e.longitude,
									    title:element.attributes.title.rendered,
									    pincolor:map.ANNOTATION_GREEN,
									    animate:false
									});
									$.map.addAnnotation(mountainView);
								});
				    		});
			    		
				    },
				    error: function(){
				        // something is wrong.. 
				    },
					data: {categories:userCats,_embed:"true"},
				 	processData:true
				 	});
        });
    },
    error: function(){
        // something is wrong.. 
    }
});
function addZ(n){return n<10? '0'+n:''+n;}
function transform(model) {
	//convert the model to a JSON object
	var productObject = model.toJSON();
		var datoformat = new Date(productObject.acf.dato);
		var datoformat = 'd.'+addZ(datoformat.getDate())+'.'+addZ((datoformat.getMonth()+1))+'.'+datoformat.getFullYear().toString().substr(2,2);
		
		var output = {
			"id" : productObject.id,
			"title" : productObject.title.rendered,
			"author" : productObject._embedded.author[0].name,
			"image" : productObject._embedded.author[0].acf.image,
			"dato" : datoformat,
			"cid" : model.cid
		};
		
		//console.log(output);
		return output;
}

$.table.addEventListener('click', function(_event) {

	//get the correct approach
	//
	// The properties synch adapter that is provided by appcelerator does not set the model.id so get
	// will never work. See the appcelerator documentation on Backbone Sync Adapters
	var model = Alloy.Collections.task.getByCid(_event.rowData.taskId);
	//var model = Alloy.Collections.products.get(_event.rowData.modelId);

	//create the controller and pass the model to it
	var detailController = Alloy.createController('taskDetail', {
		data : model
	});
	//get view returns to root view when no view ID is provided
	detailController.getView().open();

});

function gotoAdd(e) {
 	var createTask = Alloy.createController('createTask').getView();
 	createTask.open();
 }

function openAsModal(_view) {
	if (OS_IOS) {
		var navWindow = Titanium.UI.iOS.createNavigationWindow({
			window : _view
		});

		_view.navWindow = navWindow;
		navWindow.open({
			modal : true
		});
	} else {
		_view.open({
			modal : true
		});
	}
}

var map = require('ti.map');
var permissions = require('permissions');

// List of map types to traverse, and our initial index
var mapTypes = [map.NORMAL_TYPE, map.SATELLITE_TYPE, map.HYBRID_TYPE];
var mapType = 0;

// Android has a fourth map type. We use conditional code, which Alloy automatically
// strips as dead code when it builds for other platforms.
if (OS_ANDROID) {
  mapTypes.push(map.TERRAIN_TYPE);
}

/**
 * self-executing function to organize otherwise inline constructor code
 * @param  {Object} args arguments passed to the controller
 */
(function(args) {

  // Use strict mode for this function scope. We can't do this for all of the
  // controller because after Alloy has compiled all of this file is wrapped.
  // FIXME: https://jira.appcelerator.org/browse/ALOY-1263
  'use strict';

  // Open the window. We didn't give it an id in the view, but it defaults to
  // the name of the controller/view.

})(arguments[0] || {});

/**
 * Bound to the Window's open event via XML.
 * Gets our current position and then continues the same process as when you
 * longpress somewhere on the map, which is reverseGeocode().
 */
function showCurrentPosition() {
  'use strict';

  // Use library to handle run-time permissions
  permissions.requestLocationPermissions(Ti.Geolocation.AUTHORIZATION_WHEN_IN_USE, function(e) {

    if (!e.success) {

      // In some cases the library will already have displayed a dialog, in other cases we receive a message to alert
      if (e.error) {
        alert(e.error);
      }

      return;
    }

    // Get our current position
    Ti.Geolocation.getCurrentPosition(function(e) {

      // FIXME: https://jira.appcelerator.org/browse/TIMOB-19071
      if (!e.success || e.error) {
        return alert(e.error || 'Could not find your position.');
      }

      console.log(e.coords);
      centerMap(e.coords);
      
    });
  });
}

/**
 * Receives a position, reverse geocodes it and then calls setAnnotation()
 * @param  {Object}  coords            Event or other object that has:
 * @param  {Float}   coords.latitude   Latitude
 * @param  {Float}   coords.longitude  Longitude
 * @param  {boolean} center            Set to true to center the map on the position
 */

/**
 * Adds the location to the collection, triggering data-binding to update the map.
 * @param  {Object}  location            Data for the model:
 * @param  {Float}   location.latitude   Latitude
 * @param  {Float}   location.longitude  Longitude
 * @param  {string}  location.title      Title
 */
function setAnnotation(location) {
  'use strict';

  // create the annotation
  var annotation = map.createAnnotation({
    title: location.title,
    subtitle: location.latitude + ', ' + location.longitude,
    latitude: location.latitude,
    longitude: location.longitude,
    draggable: true
  });

  // replace previous annotation
  $.map.setAnnotations([annotation]);
}

/**
 * Callback bound to the SearchView and SearchBar in the view. Forward geocodes an address
 * and uses addLocation() to add it to the collection, triggering data-binding for the UI.
 * @param  {Object} event Event
 */
function geocodeLocation(e) {
  'use strict';

  // Reference to the SearchView or SearchBar
  var source = e.source;

  // On iOS we have e.value, but on Android we don't. This always works.
  var address = source.value;

  // Forward geocode the address
  Ti.Geolocation.forwardGeocoder(address, function(e) {

    if (!e.success || e.error) {
      return alert(e.error || 'Could not geocode the location.');
    }

    if (OS_ANDROID) {

      // Collapse the ActionView, which also clears the value and hides the keyboard
      $.searchMenu.collapseActionView();

    } else {

      // Clear the value
      source.value = '';

      // Hide keyboard
      source.blur();
    }

    // Let addLocation() add it to the collection and update the UI
    setAnnotation({
      title: address,
      latitude: e.latitude,
      longitude: e.longitude
    });

    // Center the map on the location
    centerMap(e);
  });
}

/**
 * Callback bound to the button overlay to switch map types.
 */
function changeMapType() {

  // Increment our mapType index or move back to 0 if we reached the end
  mapType = (mapType === mapTypes.length - 1) ? 0 : mapType + 1;

  // Set it
  $.map.mapType = mapTypes[mapType];
}

/**
 * Center the map on a location.
 */
function centerMap(location) {
  $.map.region = {
    latitude: location.latitude,
    longitude: location.longitude,

    latitudeDelta: 0,
    longitudeDelta: 0,
    latitudeDelta: 0.022,
    longitudeDelta: 0.022
  };
}

/*$.map.region = {
	latitude:55.403756,
	longitude:10.40237,
	latitudeDelta:0.022,
	longitudeDelta:0.022
};*/


/*
var mountainView = map.createAnnotation({
    latitude:55.413,
    longitude:10.405,
    title:"Appcelerator Headquarters",
    subtitle:'Mountain View, CA',
    pincolor:map.ANNOTATION_RED,
    animate:true,
    myid:1 // Custom property to uniquely identify this annotation.
});

var mountainView1 = map.createAnnotation({
    latitude:55.409,
    longitude:10.402,
    title:"Headquarters",
    subtitle:'Mountain View, CA',
    pincolor:map.ANNOTATION_RED,
    animate:true,
    myid:2 // Custom property to uniquely identify this annotation.
});
var mountainView2 = map.createAnnotation({
    latitude:55.412,
    longitude:10.409,
    title:"Appcelerator",
    subtitle:'Mountain View, CA',
    pincolor:map.ANNOTATION_RED,
    animate:true,
    myid:3 // Custom property to uniquely identify this annotation.
});

$.map.addAnnotation(mountainView);
$.map.addAnnotation(mountainView1);
$.map.addAnnotation(mountainView2);
*/