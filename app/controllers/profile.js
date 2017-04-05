// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

function outputState(){
    Ti.API.info('Switch value: ' + $.music.value);
    Ti.API.info('Switch value: ' + $.handwork.value);
    Ti.API.info('Switch value: ' + $.entertainment.value);
    Ti.API.info('Switch value: ' + $.animals.value);
    Ti.API.info('Switch value: ' + $.gardenwork.value);
    Ti.API.info('Switch value: ' + $.socialwork.value);
    Ti.API.info('Switch value: ' + $.cooking.value);
    Ti.API.info('Switch value: ' + $.mechanics.value);
    Ti.API.info('Switch value: ' + $.nature.value);
    Ti.API.info('Switch value: ' + $.art.value);
    Ti.API.info('Switch value: ' + $.sport.value);
    Ti.API.info('Switch value: ' + $.fashion.value);
}
