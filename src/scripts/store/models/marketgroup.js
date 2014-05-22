angular.module('datastore.marketgroup', ["api"]).

factory("MarketGroup", function() {
	var MarketGroup = function(mgdata) {
		this.id = mgdata.marketGroupID;
		this.name = mgdata.marketGroupName;
		this.parentID = mgdata.parentGroupID;
		this.hasTypes = mgdata.hasTypes;
	};

	return MarketGroup;
}).

factory("MarketGroups", ["MarketGroupApi", "MarketGroup", function(MarketGroupApi, MarketGroup) {
	var MarketGroups = function() {
		this.marketGroupsByID = {};

		this.marketGroupsLoaded = false;
	};

	MarketGroups.prototype.getMarketGroupByID = function(marketGroupID, cb) {
		var self = this;

		if (self.marketGroupLoaded(marketGroupID)) {
			console.log("Already stored this marketgroup");
			//Check it's not an invalid ID which has already been loaded
			if (self.marketGroupsByID[marketGroupID] === false) {
				throw new Error("No such marketGroup");
			}

			cb(self.marketGroupsByID[marketGroupID]);
		} else {
			//Attempt to load through API
			MarketGroupApi.getMarketGroupByID(marketGroupID, function(result) {
				if (result.length === 0) {
					marketGroupsByID[marketGroupID] = false;
					throw new Error("No such marketGroup");
				} else {
					console.log("Market Group loaded succesfully");
					self.setMarketGroupByID(new MarketGroup(result[0]));
					cb(marketGroupsByID[marketGroupID]);
				}
			});
		}
	};

	MarketGroups.prototype.marketGroupLoaded = function(marketGroupID) {
		return this.marketGroupsByID.hasOwnProperty(marketGroupID);
	};

	MarketGroups.prototype.allMarketGroupsLoaded = function(){
		return this.marketGroupsLoaded;
	};

	MarketGroups.prototype.setMarketGroupByID = function(marketGroup) {
		this.marketGroupsByID[marketGroup.id] = marketGroup;
	};

	MarketGroups.prototype.getAllMarketGroups = function(cb) {
		var self = this;

		if (this.allMarketGroupsLoaded()) {
			cb(this.marketGroupsByID);
		} else {
			MarketGroupApi.getMarketGroups(function(result) {
				for (var i = 0; i < result.length; i++) {
					self.setMarketGroupByID(new MarketGroup(result[i]));
				}
				self.marketGroupsLoaded = true;
				cb(self.marketGroupsByID);
			});
		}
	};

	return MarketGroups;
}]).

factory("MarketGroupType", function() {
	var MarketGroupType = function(mgtdata) {
		this.id = mgtdata.typeID;
		this.name = mgtdata.typeName;
	};

	return MarketGroupType;
}).

factory("MarketGroupTypes", ["MarketGroupApi", "MarketGroupType", function(MarketGroupApi, MarketGroupType) {
	var MarketGroupTypes = function() {
		this.marketGroupTypes = {};
	};

	MarketGroupTypes.prototype.getMarketGroupTypesByIDs = function(marketGroupID, cb) {
		var self = this;

		if (self.marketGroupTypesLoaded(marketGroupID)) {

			//Check it's not an invalid ID which has already been loaded
			cb(self.marketGroupTypes[marketGroupID]);

		} else {
			//Attempt to load through API
			MarketGroupApi.getTypesByMarketGroupID(marketGroupID, function(result) {
				var types = [];

				for (var i = 0; i < result.length; i++) {
					types.push(new MarketGroupType(result[i]));
				}

				cb(types);
				self.setMarketGroupTypes(marketGroupID, types);
			});
		}
	};

	MarketGroupTypes.prototype.marketGroupTypesLoaded = function(marketGroupID) {
		return this.marketGroupTypes.hasOwnProperty(marketGroupID);
	};


	MarketGroupTypes.prototype.setMarketGroupTypes = function(marketGroupID, types) {
		this.marketGroupTypes[marketGroupID] = types;
	};

	return MarketGroupTypes;
}]);



var loadByID = function(refObj, APIFn) {


	return function(IDs, cb) {

		//If IDs is array, join with comma

		if (this.marketGroupsByID.hasOwnProperty(marketGroupID)) {
			console.log("Already stored this marketgroup");
			//Check it's not an invalid ID which has already been loaded
			if (this.marketGroupsByID[marketGroupID] === false) {
				throw new Error("No such marketGroup");
			}

			cb(this.marketGroupsByID[marketGroupID]);
		} else {
			//Attempt to load through API
			MarketGroupApi.getMarketGroupByID(marketGroupID, function(result) {
				if (result.length === 0) {
					marketGroupsByID[marketGroupID] = false;
					throw new Error("No such marketGroup");
				} else {
					console.log("Market Group loaded succesfully");
					marketGroupsByID[marketGroupID] = result[0];
					cb(result[0]);
				}
			});
		}
	};
};