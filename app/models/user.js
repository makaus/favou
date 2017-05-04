exports.definition = {
	config: {
		"URL": "http://markeriksen.dk/test/wp-json/wp/v2/users",
		"debug": 1,
		"adapter": {
			"type": "restapi",
			"collection_name": "task",
			"idAttribute": "id"
		}
	},
	"headers":{
		"Accept": "application/json",
	},
	extendModel: function(Model) {
		_.extend(Model.prototype,{});
		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {});
		return Collection;
	}
};