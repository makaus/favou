// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var months = [ "Januar", "Februar", "Marts", "April", "Maj", "Juni", 
               "Juli", "August", "September", "Oktober", "November", "December" ];
var realdate = 0;

function addZ(n){return n<10? '0'+n:''+n;}

Alloy.Collections.instance("category").fetch({data: {per_page:99},processData:true});
$.date.addEventListener('click', function() {
	var picker = Ti.UI.createPicker( {
	    type : Ti.UI.PICKER_TYPE_DATE
	});
	 
	picker.showDatePickerDialog({
	    callback: function(e) {
	        if (e.cancel) {
	            Ti.API.info('user canceled dialog');
	        } else {
	            Ti.API.info('user selected date: ' + e.value);
				var selectedMonthName = months[(e.value.getMonth())];
	            //console.log((e.value.getMonth() + 1) + '/' + e.value.getDate() + '/' + e.value.getFullYear());
	            $.dato.text = ' ' + e.value.getDate() + ' ' + selectedMonthName + ' ' + e.value.getFullYear();
	            realdate = e.value.getFullYear()+','+addZ((e.value.getMonth()+1))+','+e.value.getDate();
	            //console.log(realdate);
				//console.log($.pickerCategory.getSelectedRow(0).value);
	        }
	    }
	});
});

$.createTask.addEventListener("click", function(){
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
	
  	var newTask = Alloy.createModel('task');
	var params = {
		type: 'posts', // important to set content type and mandatory fields
		status: 'publish',
		content : $.beskrivelseTask.value,
		title: $.titleTask.value,
		fields: {
			dato: realdate,
			personbehov: $.personBehovTask.value,
			adresse: $.adresseTask.value,
			brugere: userID
		},
		categories: $.pickerCategory.getSelectedRow(0).value,
		author: userID
	};
	newTask.save(params, {
		success: function(model, response) {
			Alloy.Collections.instance('task').fetch({data: {_embed:"true"},processData:true});
			Alloy.Collections.instance("assigned").fetch({data: {_embed:"true"},processData:true});
			//Alloy.createController("discover");
		},
		error: function(err) {alert(err);} 
	});
	var tasks = Alloy.Collections.task;
	
	tasks.fetch({
		success: function(){
						console.log(tasks.models);	
	    _.each(tasks.models, function(element, index, list){
			if(element.attributes.title.rendered==$.titleTask.value && element.attributes.content.rendered==$.beskrivelseTask.value){
				usersTasks.unshift(element.attributes.id);
				console.log(usersTasks);
				console.log("det passer");
			}
			console.log(element.attributes.title.rendered + ', ' + $.titleTask.value);
			console.log(element.attributes.content.rendered + ', ' + $.beskrivelseTask.value);
				console.log(usersTasks);
				console.log("det passer IKKE");
		});
    },
    error: function(){
		console.log("test");
    },
	data: {_embed:"true"},
 	processData:true
 	});
 	
 	var newUser = Alloy.createModel('user');
	var paramsUser = {
		id: userID,
		fields: {
			tilmeldte: usersTasks
		}
	};
	console.log(paramsUser);
	newUser.save(paramsUser, {
		success: function(model, response) {
			Alloy.Collections.instance('task').fetch({data: {categories:userCats,_embed:"true"},processData:true});
			Alloy.Collections.instance("assigned").fetch({data: {_embed:"true"},processData:true});
			Alloy.Collections.instance("user").fetch();
			$.getView().navWindow ? $.getView().navWindow.close() : $.getView().close();
		},
		error: function(err) {alert(err);} 
	});
});