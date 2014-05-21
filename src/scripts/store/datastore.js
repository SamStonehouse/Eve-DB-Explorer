angular.module('datastore', ['datastore.marketgroup']).

factory('MarketGroupsManager', ['MarketGroups', function(MarketGroups, MarketGroup) {
	var marketGroups = new MarketGroups();

	return marketGroups;
}]).

factory('MarketGroupTypesManager', ['MarketGroupTypes', function(MarketGroupTypes) {
	var marketGroupTypes = new MarketGroupTypes();

	return marketGroupTypes;
}]);