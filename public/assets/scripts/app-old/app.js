var app = angular.module('app', []);

app.factory('urls', function() {

	var baseApiURL = "http://localhost:8080";

	return  {
		baseApiURL: baseApiURL
	};

});

app.factory('api', function($http, urls) {
	return {
		getParentMarketGroups: function() {

			var url = urls.baseApiURL + "/api/inv/marketgroups/parent/null?callback=JSON_CALLBACK";

			return $http.jsonp(url).then(function(result) {
				console.log("Parent Market Group Response");
				return result.data;
			});
		},
		getMarketGroupByID: function(mgID) {

			var url = urls.baseApiURL + "/api/inv/marketgroups/parent/" + mgID + "?callback=JSON_CALLBACK";

			return $http.jsonp(url).then(function(result) {
				console.log("Market Group by Parent ID response");
				return result.data;
			});
		},
		getTypesByMarketGroupID: function(mgID) {

			var url = urls.baseApiURL + "/api/inv/types/marketgroup/" + mgID + "?callback=JSON_CALLBACK";

			return $http.jsonp(url).then(function(result) {
				console.log("Types in market group by market group ID response");
				return result.data;
			});
		},
		getFullType: function(typeID) {

			var url = urls.baseApiURL + "/api/inv/types/full/" + typeID + "?callback=JSON_CALLBACK";

			return $http.jsonp(url).then(function(result) {
				console.log("Full type response");
				return result.data;
			});
		}
	};
});


app.factory('TypeCollection', function() {
	var TypeCollection = function() {
		this.types = {};
	};

	TypeCollection.prototype.addTypes = function(types) {
		for (var i = 0; i < types.length; i++) {
			this.addType(types[i]);
		}
	};

	TypeCollection.prototype.addType = function(type) {
		this.types[type.typeID] = type;
	};

	TypeCollection.prototype.getType = function(typeID) {
		return types[typeID];
	};

	var data = {};
	data.typeCollection = new TypeCollection();

	return data;
});


app.factory('TypeLabel', function() {
	var TypeLabel = function(type) {
		this.type = type;
		this.name = name;
		this.extraClasses = 'type-accordian';
	};

	TypeLabel.prototype.click = function() {

	};
});

app.factory('MarketGroupLabel', function() {
	var MarketGroupLabel = function(marketGroup) {
		this.marketGroup = marketGroup;
	};

	MarketGroupLabel.prototype.click = function() {

	};
});

app.factory('TypeManager', function(api) {
	var data = {};

	data.activeType = 0;

	data.typeCollection = new TypeCollection();

	var Type = function(data, typeManager) {
		this.data = data;
		this.loaded = false;

		this.typeManager = typeManager;

		this.extraClasses = 'type-accordian';
	};

	Type.prototype.loadFull = function() {
		var self = this;

		api.getFullType(self.id).then(function(result) {
			console.log(result);
			for (var i = 0; i < result.result.length; i++) {
				self.data = result.result[i];
			}
		});
	};

	// Type.prototype.click = function() {
	// 	data.activeType = this;
	// 	this.loadFull();
	// };

	return {
		data: data,
		Type: Type
	};
});

app.factory('MarketGroupsManager', function(api, TypeManager) {
	var MarketGroups = function() {
		this.marketGroups = [];
	};

	MarketGroups.prototype.loadParentGroups = function() {
		var self = this;

		api.getParentMarketGroups().then(function(result) {
			//Loop through all results creating new
			for (var i = 0; i < result.result.length; i++) {

				var mg = new MarketGroup(result.result[i]);

				self.marketGroups.push(mg);
			}
		});
	};

	var MarketGroup = function(data) {
		this.data = data;
		this.visible = false;

		//Accordian Data
		this.name = this.data.marketGroupName;
		this.children = [];
		this.extraClasses = 'marketgroup-accordian';

		this.childrenLoaded = false;
	};


	MarketGroup.prototype.loadChildren = function() {
		var self = this;

		api.getMarketGroupByID(self.data.marketGroupID).then(function(result) {

			var subMarketGroups = [];

			if (result.result) {
				for (var i = 0; i < result.result.length; i++) {
					subMarketGroups.push(new MarketGroup(result.result[i]));
				}
			}

			self.children[0] = subMarketGroups;

		});

		api.getTypesByMarketGroupID(self.data.marketGroupID).then(function(result) {

			var subTypeItems = [];

			if (result.result) {
				for (var i = 0; i < result.result.length; i++) {
					subTypeItems.push(new TypeManager.Type(result.result[i]));
				}
			}

			self.children[1] = subTypeItems;
		});

	};

	MarketGroup.prototype.click = function() {
		this.toggle();
	};

	MarketGroup.prototype.toggle = function() {
		console.log("Marketgroup Toggled");

		if (!this.childrenLoaded) {
			this.childrenLoaded = true;
			this.loadChildren();
		}

		this.visible = !this.visible;
	};

	return {
		MarketGroups: MarketGroups,
		MarketGroup: MarketGroup
	};
});

app.factory('Accordian', function() {
	var Label = function(name) {
		this.name = name;
		this.visible = false;
		this.children = [];

		this.clickFn = function() {};
	};

	Label.prototype.onClick = function(fn) {
		this.clickFn = fn;
	};

	Label.prototype.click = function() {
		this.clickFn(this);
	};

	Label.prototype.setChildren = function(index, values) {
		this.children[i] = values;
	};
});

var sidebarController = function($scope, Accordian, MarketGroupsManager) {

	var accordianLabels = [];

	api.getParentMarketGroups().then(function(result) {
		for (var i = 0; i < result.result.length; i++) {
			var newMarketGroupLabel = new Label(result.result[i].name)
		}
	});

	var marketGroups = new MarketGroupsManager.MarketGroups();
	marketGroups.loadParentGroups();

	$scope.data = {};
	$scope.data.marketGroups = marketGroups.marketGroups;
};

var typeController = function($scope, TypeManager) {
	$scope.typeManagerData = TypeManager.data;
};


