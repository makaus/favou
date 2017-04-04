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
	            $.dato.text = ' ' + selectedMonthName + ' ' + e.value.getDate() + ' ' + e.value.getFullYear();
	        }
	    }
	});
});