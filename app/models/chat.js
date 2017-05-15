exports.definition = {
    config: {
		"URL": "http://markeriksen.dk/test/wp-json/wp/v2/comments",
		"debug": 1,
		"adapter": {
			"type": "restapi",
			"collection_name": "assigned",
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
		_.extend(Collection.prototype, {
            // Keep this collection sorted by
            // http://stackoverflow.com/questions/5013819/reverse-sort-order-with-backbone-js
			initialize: function () {
                this.sortField = "created_at"; // Default sort field
                this.sortDirection = "ASC"; // Default sort direction
            },

            comparator: function(a, b) {
                left = a.get(this.sortField);
                right = b.get(this.sortField);
                if (left < right)
                    ret = -1;
                else if (left > right)
                    ret = 1;
                else
                    ret = 0;

                if (this.sortDirection === "DESC")
                    ret = -ret;

                return ret;
            },
						
        });
        return Collection;
	}
};