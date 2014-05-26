angular.module('datastore', ['datastore.marketgroup', 'datastore.type']).

factory('MarketGroupsManager', ['MarketGroups', function(MarketGroups, MarketGroup) {
	var marketGroups = new MarketGroups();

	return marketGroups;
}]).

factory('MarketGroupTypesManager', ['MarketGroupTypes', function(MarketGroupTypes) {
	var marketGroupTypes = new MarketGroupTypes();

	return marketGroupTypes;
}]).

factory('TypesManager', ['Types', function(Types) {
	var types = new Types();

	return types;
}]);