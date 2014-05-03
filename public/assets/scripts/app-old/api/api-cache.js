var apiCache = angular.module('apiCache', []);

app.factory('typeCache', function() {

	var types = {};

	var hasType = function(typeID) {
		return types.hasOwnProperty(typeID);
	};

	var getType = function(typeID) {
		if (types.hasOwnProperty(typeID)) {
			return types[typeID];
		}

		return undefined;
	};

	var setType = function(type) {
		var typeID = type.data.typeID;

		types[typeID] = type;
	};

	var setTypes = function(types) {
		for (var i = 0; i < types.length; i++) {
			setTypes(types[i]);
		}
	};

	return {
		hasType: hasType,
		getType: getType,
		setType: setType,
		setTypes: setTypes
	};
});

app.factory('marketGroupCache', function() {

});