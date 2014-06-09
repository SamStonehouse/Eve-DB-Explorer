angular.module('api.unitApi', ['api.utilities']).

factory('unitApi', ['apiUtilities', function(apiUtilities) {

	return {
		getAllUnits: function(cb) {
			apiUtilities.callApi("/api/eve/units", cb);
		},
		getUnitByID: function(unitID, cb) {
			apiUtilities.callApi("/api/eve/units/" + unitID, cb);
		}
	};

}]);