angular.module('datastore.marketgroup', []).

factory("MarketGroup", function() {
	var MarketGroup = function(mgdata) {
		this.id = mgdata.MarketGroupID;
		this.name = mgdata.marketGroupName;
		this.parentGroupID = mgdata.parentGroupID;
	};

	return MarketGroup;
}).

factory("MarketGroupType", function() {
	var MarketGroupType = function(mgtdata) {
		this.id = mgtdata.typeID;
		this.name = mgtdata.typeName;
	};

	return MarketGroupType;
});