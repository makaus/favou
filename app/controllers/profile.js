// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var userTemp = Alloy.Collections.user;
userTemp.fetch({url: 'http://markeriksen.dk/test/wp-json/wp/v2/users/'+userID,
    success: function(){
        //console.log(user.models);
        //parse to listView
        _.each(userTemp.models, function(element, index, list){
                    userCats = element.attributes['acf'].interesser;
                    //console.log(userCats);
                    if(userCats.length<1){
						userCats = [-1];
					}
                    var category = Alloy.Collections.instance("category");
					category.fetch({data: {per_page:99},processData:true,success: function(){
						//console.log(task.models);
				        //parse to listView
				        var newRow = 0;
				        _.each(category.models, function(element, index, list){
							var exists = userCats.indexOf(element.attributes.id);
							if(index % 3 === 0) {
								var tempRow = Ti.UI.createTableViewRow({
									id: 'tableRow',
									layout: 'horizontal'
								});
								$.tableviewCat.appendRow(tempRow);
								newRow++;
							}else{
								var tempRow = $.tableviewCat.data[0].rows[newRow-1];
							}
							if(exists!==-1){
								var tempSwitch = Ti.UI.createSwitch({
									id: element.attributes.id,
									name: element.attributes.name,
									value: 'true',
									style: Ti.UI.Android.SWITCH_STYLE_CHECKBOX
								});
								var tempLabel = Ti.UI.createLabel({
									class: 'text2',
									font: {
										fontFamily: "Roboto-Light",
										fontSize: "14dp"
									},
									width: '23%',
									color: 'white',
									touchEnabled: 'false',
									text: element.attributes.name
								});
							}
							else{
								var tempSwitch = Ti.UI.createSwitch({
									id: element.attributes.id,
									name: element.attributes.name,
									value: 'false',
									style: Ti.UI.Android.SWITCH_STYLE_CHECKBOX
								});
								var tempLabel = Ti.UI.createLabel({
									class: 'text2',
									font: {
										fontFamily: "Roboto-Light",
										fontSize: "14dp"
									},
									width: '23%',
									color: 'white',
									touchEnabled: 'false',
									text: element.attributes.name
								});
							}	
								tempRow.add(tempSwitch);
								tempRow.add(tempLabel);
			    		});
				    },
					    error: function(){
					        // something is wrong.. 
					    }
				 	});
        });
    },
    error: function(){
        // something is wrong.. 
    }}
);
$.row1.addEventListener("click",function(e){
    obj = e.source;
    if(userCats[0]==-1){
    	userCats=[];
    }    
    var doExist = userCats.indexOf(e.source.id);
	if(doExist!==-1){
		if(e.source.value==false){
			userCats.splice(doExist,1);
		}
	}else{
		if(e.source.value==true){
			userCats.unshift(e.source.id);
		}
	}
    if(userCats.length<1){
    	userCats=[-1];
    }
    
    var newCat = Alloy.createModel('user');
	var params = {
		id: userID,
		fields: {
			interesser: userCats
		}
	};
	newCat.save(params, {
		success: function(model, response) {
		Alloy.Collections.user.fetch({data: {per_page:99},processData:true}/*{url: 'http://markeriksen.dk/test/wp-json/wp/v2/users/'+userID}*/);
		Alloy.Collections.task.fetch({data: {categories:userCats,per_page:99,_embed:"true"},processData:true});
		//Alloy.createController("discover");
		
		
		
		},
		error: function(err) {alert(err);} 
	});
});

function transform(model) {
	//convert the model to a JSON object
	var productObject = model.toJSON();
	var output = {
		"id" : productObject.id,
		"name" : productObject.name,
		"image" : productObject.acf.image,
		"alder" : productObject.acf.alder,
		"by" : productObject.acf.by,
		"cid" : model.cid
	};
	//console.log(output);
	return output;
}
function functionFilter(collection){
	var showUser = [];
	collection.each(function(model){
		if(userID==model.get('id')){
			showUser.push(model);
		}
	});
	return showUser;
}