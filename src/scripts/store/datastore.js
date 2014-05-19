angular.module('datastore', ['datastore.marketgroups']).

factory('MarketGroups', ['MarketGroup', function() {

	var mgIDReference = {};

	var marketGroupsLoaded = false;

	var getMarketGroups = function() {

	};

	var getMarketGroup = function(id) {

	};

	var marketGroupExists = function(id) {

	};

	var setMarketGroup = function(mg) {

	};

	return {
		getMarketGroups: getMarketGroups,
		getMarketGroup: getMarketGroup,
		marketGroupExists: marketGroupExists,
		setMarketGroup: setMarketGroup
	};
}]).

factory('MarketGroupTypes', function() {
	
});