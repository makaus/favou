// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var months = [ "Januar", "Februar", "Marts", "April", "Maj", "Juni", 
               "Juli", "August", "September", "Oktober", "November", "December" ];

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
	        }
	    }
	});
});

$.createTask.addEventListener("click", function(){
  	var newTask = Alloy.createModel('task');
	var params = {
		type: 'posts', // important to set content type and mandatory fields
		status: 'publish',
		content : $.beskrivelseTask.value,
		title: $.titleTask.value,
		acf: {dato: $.dato.value,
		personbehov: $.personBehovTask.value,
		adresse: $.adresseTask.value},
		categories: $.pickerCategory.value,
		author: 1
		
		/*
		dato: $.dato.value,
		personbehov: $.personBehov.value,
		category: $.pickerCategory.value,
		author: "admin",
		*/
	};
	newTask.save(params, {
		success: function(model, response) {
		Alloy.Collections.instance("task").fetch();
		$.getView().navWindow ? $.getView().navWindow.close() : $.getView().close();
			},
		error: function(err) {alert(err);} 
	});
});

