angular.module('msg', []).

factory('MarketGroups', function() {
	var marketgroups = {};
});

factory('MarketGroup', function() {
	var MarketGroup = function(resultrow) {
		this.id = resultrow.MarketGroupID;
		this.name = resultrow.marketGroupName;
		this.parentGroupID = resultrow.parentGroupID;
	};

	return MarketGroup;
});