angular.module('collections.marketgrouptypes', ["api.marketgroups"]).

factory("MarketGroupTypes", ["marketGroupApi", "MarketGroupType", function(marketGroupApi, MarketGroupType) {
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
			marketGroupApi.getTypesByMarketGroupID(marketGroupID, function(result) {
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

	return new MarketGroupTypes();
}]);