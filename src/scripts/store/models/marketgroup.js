angular.module('datastore.marketgroup', []).

factory("MarketGroup", function() {
	var MarketGroup = function(mgdata) {
		this.id = mgdata.marketGroupID;
		this.name = mgdata.marketGroupName;
		this.parentID = mgdata.parentGroupID;
	};

	return MarketGroup;
}).

factory("MarketGroups", function() {
	var MarketGroups = function() {
		this.marketGroupsByID = {};

		this.marketGroupsLoaded = false;
	};

	MarketGroups.prototype.getMarketGroupByID = function() {
		if (this.marketGroupsByID.hasOwnProperty(marketGroupID)) {
			return this.marketGroupsByID[marketGroupID];
		}
		
		throw new Error("No such marketGroup");
	};

	MarketGroups.prototype.marketGroupLoaded = function(marketGroupID) {
		return this.marketGroupsByID.hasOwnProperty(marketGroupID);
	};

	MarketGroups.prototype.setMarketGroupByID = function(marketGroup) {
		this.marketGroupsByID[marketGroup.id] = marketGroup;
	};

	return MarketGroups;
}).

factory("MarketGroupType", function() {
	var MarketGroupType = function(mgtdata) {
		this.id = mgtdata.typeID;
		this.name = mgtdata.typeName;
	};

	return MarketGroupType;
}).

factory("MarketGroupTypes", function() {
	var MarketGroupTypes = function() {

	};

	MarketGroupTypes.prototype.getMarketGroupTypesByMarketGroupID = function() {

	};

	MarketGroupTypes.prototype.getAllMarketGroupTypes = function() {

	};

	MarketGroupTypes.prototype.setMarketGroupTypesByParentID = function(parentID, types) {

	};

	MarketGroupTypes.prototype.setAllMarketGroupTypes = function() {

	};

	return MarketGroupTypes;
});