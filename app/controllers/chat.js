// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var chat = Alloy.Collections.chat;
var validateSender = function(model) {
    return model.get('emitter') == userID;
};
getMoreMessages();

$.chat.init({
    messages: chatCol, // required
    validateSender: validateSender, // required
    delay: 700,
    backgroundColor: '#192935',
    backgroundColorLeft: '#FFFFFF',
    backgroundColorRight: '#FFFFFF',
    colorLeft: '#000000',
    colorRight: '#000000',
    backgroundColorBottomBar: '#FFFFFF',
    sendButton: {
        title: 'Send',
        color: "#000000",
        borderRadius: 5,
        backgroundColor:         '#FFFFFF',
        backgroundFocusedColor:  '#192935',
        backgroundSelectedColor: '#192935'
    },
    typingArea: {
        color: '#192935',
        backgroundColor: '#FFFFFF'
    }
});

$.chat.on('newMessage', function (newMessageEvent) {
    /*var message = Alloy.createModel('Message', {
         content: newMessageEvent.message,
         emitter: userID,
         created_at: newMessageEvent.created_at
     });
    chatCol.add(message);*/
   
    var newComment = Alloy.createModel('chat');
	var paramsC = {
		post: args.data,
		content : newMessageEvent.message,
		author: userID
	};
	newComment.save(paramsC, {
		success: function(model, response) {
			getMoreMessages();
		},
		error: function(err) {alert(err);} 
	});
   
    newMessageEvent.success(); // Mandatory, to acknowledge sending the message successfully
});

$.chat.on('moremessages', function () {
	getMoreMessages();
 });
 
function getMoreMessages(){
	var rex = /(<([^>]+)>)/ig;
	chat.fetch({data: {post:args.data},
		success: function(){
			chatCol.reset();
	        _.each(chat.models, function(element, index, list){
	        	var stripped = element.attributes.content.rendered;
	                    var message = Alloy.createModel('Message', {
						     content: stripped.replace(/<\/?[^>]+(>|$)/g, ""),
						     emitter: element.attributes.author,
						     created_at: new Date(element.attributes.date)
						});
	    	chatCol.add(message);
	        });
    	},
	    error: function(){
	        
			console.log("error");
	    }
	});
}