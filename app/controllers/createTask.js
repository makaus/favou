// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var months = [ "Januar", "Februar", "Marts", "April", "Maj", "Juni", 
               "Juli", "August", "September", "Oktober", "November", "December" ];
var realdate = 0;

Alloy.Collections.instance("category").fetch();

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
	            realdate = e.value.getDate()+''+(e.value.getMonth()+1)+''+e.value.getFullYear();
	            console.log(realdate);
				console.log($.pickerCategory.getSelectedRow(0).value);
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
		fields: {
			dato: realdate,
			personbehov: $.personBehovTask.value,
			adresse: $.adresseTask.value
		},
		categories: $.pickerCategory.getSelectedRow(0).value,
		author: 1
	};
	newTask.save(params, {
		success: function(model, response) {
		Alloy.Collections.instance("task").fetch();
		$.getView().navWindow ? $.getView().navWindow.close() : $.getView().close();
			},
		error: function(err) {alert(err);} 
	});
});

