angular.module('api.typeApi', ['api.utilities']).

factory('typeApi', ['apiUtilities', function(apiUtilities) {

	return {
		getTypeByID: function(typeID, cb) {
			apiUtilities.callApi("/api/inv/types/full/" + typeID, cb);

		}
	};

}]);