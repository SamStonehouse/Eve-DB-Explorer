angular.module('collections.marketgroups', ['api.marketgroups', 'models.marketgroup']).

factory("MarketGroups", ["marketGroupApi", "MarketGroup", function(marketGroupApi, MarketGroup) {

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
			marketGroupApi.getMarketGroupByID(marketGroupID, function(result) {
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
			marketGroupApi.getMarketGroups(function(result) {
				for (var i = 0; i < result.length; i++) {
					self.setMarketGroupByID(new MarketGroup(result[i]));
				}
				self.marketGroupsLoaded = true;
				cb(self.marketGroupsByID);
			});
		}
	};

	return new MarketGroups();
}]);