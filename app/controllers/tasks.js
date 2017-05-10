// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

function gotoAdd(e) {
 	var createTask = Alloy.createController('createTask').getView();
 	createTask.open();
}


var assigned = Alloy.Collections.instance("assigned");
var user = Alloy.Collections.instance("user");

user.fetch({url: 'http://markeriksen.dk/test/wp-json/wp/v2/users/'+userID,
    success: function(){
        //console.log(user.models);
        //parse to listView
        _.each(user.models, function(element, index, list){
                    usersAssigned = element.attributes['acf'].tilmeldte;
                    usersTasks = [];
                    for(var i=0; i<usersAssigned.length; i++){
                    	usersTasks[i] = usersAssigned[i].ID;
                    }
                    if(usersAssigned.length<1){
						usersAssigned = [-1];
					}
                    
					assigned.fetch({success: function(){
						//console.log(assigned.models);
						
				       		//parse to listView
					        _.each(assigned.models, function(element, index, list){
								//var exists = usersAssigned.indexOf(element.attributes.id);
								var userExists = usersTasks.indexOf(element.attributes.id);
								if(userExists!==-1){
									console.log("hej");
									console.log(element.attributes.title.rendered + '+' + element.attributes._embedded.author[0].name);
									var datoformat = new Date(element.attributes['acf'].dato);
									var datoformat = 'd.'+datoformat.getDate()+'.'+addZ((datoformat.getMonth()+1))+'.'+datoformat.getFullYear().toString().substr(2,2);
									console.log(datoformat);
									console.log(assigned.models);
								}
				    		});
			    		
				    },
				    error: function(){
				        // something is wrong.. 
				    },
					data: {_embed:"true"},
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
	var datoformat = 'd.'+datoformat.getDate()+'.'+addZ((datoformat.getMonth()+1))+'.'+datoformat.getFullYear().toString().substr(2,2);
	
	var output = {
		"id" : productObject.id,
		"title" : productObject.title.rendered,
		"author" : productObject._embedded.author[0].name,
		"image" : productObject._embedded.author[0].acf.image,
		"dato" : datoformat,
		"cid" : model.cid,
		
	};
	
	//console.log(output);
	return output;
	
}

function functionFilter(collection){
	var showModels = [];
	collection.each(function(model){
		var userExists = usersTasks.indexOf(model.get('id'));
		if(userExists!==-1){
			showModels.push(model);
			console.log(model);
		}
	});
	return showModels;
}

$.table.addEventListener('click', function(_event) {

	//get the correct approach
	//
	// The properties synch adapter that is provided by appcelerator does not set the model.id so get
	// will never work. See the appcelerator documentation on Backbone Sync Adapters
	var model = Alloy.Collections.assigned.getByCid(_event.rowData.taskId);
	//var model = Alloy.Collections.products.get(_event.rowData.modelId);

	//create the controller and pass the model to it
	var detailController = Alloy.createController('settings', {
		data : model
	});
	
	//get view returns to root view when no view ID is provided
	openAsModal(detailController.getView());

});


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