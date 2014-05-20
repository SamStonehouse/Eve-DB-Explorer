angular.module('datastore', ['datastore.marketgroup']).

factory('MarketGroupsManager', ['MarketGroups', 'MarketGroup', function(MarketGroups, MarketGroup) {

	var marketGroups = new MarketGroups();

	return marketGroups;
}]).

factory('MarketGroupTypes', function() {
	
});