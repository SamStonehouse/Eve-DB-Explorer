var api = app.module('api', ['apiCache', 'apiMethods']);

api.factory('typeApi', function(typeCache, typeMethods) {
	var Type = function(data, full) {
		this.data = data;

		this.fullData = full;
	};

	var getType = function(typeID) {

	};

	var loadFullType = function(typeID) {
		typeMethods.getFullType

		
	};
});