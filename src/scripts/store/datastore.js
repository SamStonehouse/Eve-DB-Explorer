angular.module('datastore', ['datastore.marketgroup', 'api']).

factory('MarketGroups', ['MarketGroup', 'apiMethods', function(MarketGroup, apiMethods) {

	var marketGroups = {};

	var marketGroupsLoaded = false;

	var getMarketGroups = function(cb) {
		if (marketGroupsLoaded) {
			cb(marketGroups);
		} else {
			apiMethods.getMarketGroups(function(result) {
				for (var i = 0; i < result.length; i++) {
					marketGroups[result[i].marketGroupID] = new MarketGroup(result[i]);
				}
				marketGroupsLoaded = true;
				cb(marketGroups);
			});
		}
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