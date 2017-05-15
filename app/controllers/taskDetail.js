// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
$.task.set(args.data);
var usersSigned = $.task.attributes.acf.brugere;

function addZ(n){return n<10? '0'+n:''+n;}
var datoformat = new Date($.task.attributes.acf.dato);
$.date.text = datoformat.getDate()+'.'+addZ((datoformat.getMonth()+1))+'.'+datoformat.getFullYear().toString().substr(2,2);

var getUser = [];
var userIDs = [];
var getUserAssigns = [];

var users = Alloy.Collections.user;
users.fetch({url: 'http://markeriksen.dk/test/wp-json/wp/v2/users/',
    success: function(){
        //console.log(user.models);
        //parse to listView
        userObj = [];
        _.each(users.models, function(element, index, list){
                    userObj.unshift(element);
                    if(userID==element.attributes.id){
                    	getUser = element;
                    }
        });
        setUsers();
    },
    error: function(){
        // something is wrong.. 
    }}
);

function setUsers(){
	for(var i=0; i<usersSigned.length; i++){
		userIDs[i] = parseInt(usersSigned[i].ID);
	}
	if($.task.attributes.author!=userID){
		if(userIDs.indexOf(userID)==-1){
			
			$.assign.title = "tilmeld";
		}else{
			$.assign.title = "afmeld";
		}
	}else{
		$.assign.visible = false;
	}
	for(var b=0; b<userObj.length; b++){
		var assignedUser = userIDs.indexOf(userObj[b].attributes.id);
		if($.task.attributes.author!=userObj[b].id){
			
			if(assignedUser!==-1){
				var tempView = Ti.UI.createView({
					width: '32%',
					layout: 'vertical'
				});
				
				var tempImage = Ti.UI.createImageView({
					height: '70',
					image: userObj[b].attributes['acf'].image,
					borderRadius: '80',
					borderWidth: '1',
					top: '10'
				});
				tempView.add(tempImage);
				$.usersImg.add(tempView);
			}
		}else{
		}
	}
}

function updateUser() {
  	var eXists = userIDs.indexOf(getUser.id);
  	if(eXists!==-1){
  		userIDs.splice(eXists,1);
		$.assign.title = "tilmeld";
  	}
  	else{
  		userIDs.unshift(getUser.id);
		$.assign.title = "afmeld";
  	}
  	
  	for(var k=0; k<getUser.attributes['acf'].tilmeldte.length; k++){
  		getUserAssigns[k] = getUser.attributes['acf'].tilmeldte[k].ID;
  	}
  	var eXistsTask = getUserAssigns.indexOf($.task.attributes.id);
  	console.log(getUserAssigns);
  	console.log(eXistsTask);
  	console.log($.task.attributes.id);
  	if(eXistsTask!==-1){
  		getUserAssigns.splice(eXistsTask,1);
  	}
  	else{
  			getUserAssigns.unshift($.task.attributes.id);
  	}
  	console.log(getUserAssigns);
	
	var paramsUser = {
		id: userID,
		fields: {
			tilmeldte: getUserAssigns
		}
	};
  	var newUser = Alloy.createModel('user');
	newUser.save(paramsUser, {
		success: function(model, response) {
		Alloy.Collections.instance("user").fetch();
		//$.getView().navWindow ? $.getView().navWindow.close() : $.getView().close();
		},
		error: function(err) {alert(err);} 
	});
	var paramsTask = {
		id: $.task.attributes.id,
		fields: {
			brugere: userIDs
		}
	};
  	var newTask = Alloy.createModel('task');
	newTask.save(paramsTask, {
		success: function(model, response) {
		Alloy.Collections.instance("task").fetch({data: {categories:userCats,_embed:"true"},processData:true});
		Alloy.Collections.instance("assigned").fetch({data: {_embed:"true"},processData:true});
		
		var user = Alloy.Collections.user; 
		user.fetch({url: 'http://markeriksen.dk/test/wp-json/wp/v2/users/'+userID,
		    success: function(){
		        _.each(user.models, function(element, index, list){
                    usersAssignedT = element.attributes['acf'].tilmeldte;
                    for(var i=0; i<usersAssignedT.length; i++){
                    	usersTasks[i] = usersAssignedT[i].ID;
                    }
		        });
		    },
		    error: function(){
		        // something is wrong.. 
		    }
		});
		
		$.getView().navWindow ? $.getView().navWindow.close() : $.getView().close();
		},
		error: function(err) {alert(err);} 
	});
	
}