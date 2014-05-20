var app = angular.module('ExplorerApp', ['ui.treeaccordian', 'datastore.marketgroup']);

app.controller('marketGroupController',	['$scope', 'MarketGroupsManager', 'treeaccordian', function($scope, MarketGroupsManager, treeaccordian) {
	var marketGroupAccordian = new treeaccordian.TreeAccordian();

	$scope.data = {};

	MarketGroupsManager.getMarketGroups(function(marketGroups) {
		for (var i in marketGroups) {
			if (marketGroups.hasOwnProperty(i)) {
				var accNode = new treeaccordian.AccordianNode(marketGroups[i].name, marketGroups[i].id, marketGroups[i].parentID);
				marketGroupAccordian.addNode(accNode, marketGroups[i].parentID);
			}
		}
	});

	$scope.data.marketGroupAccordian = marketGroupAccordian; // TODO: Filter out unnecessary nodes (or not load them in the first place)
}]);

app.controller('typeDisplayController', ['$scope', function($scope) {

}]);
angular.module('api', []).

factory('apiMethods', function($http) {
	return {
		getMarketGroups: function(cb) {
			var url = "http://localhost:8080/api/inv/marketgroups?fields=39&callback=JSON_CALLBACK";

			return $http.jsonp(url).then(function(result) {
				console.log("Marketgroups response");
				cb(result.data.result);
			});
		},
		getParentMarketGroups: function() {

			var url = "http://localhost:8080/api/inv/marketgroups/parent/null?callback=JSON_CALLBACK";

			return $http.jsonp(url).then(function(result) {
				console.log("Parent Market Group Response");
				return result.data;
			});
		},
		getTypesByMarketGroupID: function(mgID) {

			var url = "http://localhost:8080/api/inv/types/marketgroup/" + mgID + "?callback=JSON_CALLBACK";

			return $http.jsonp(url).then(function(result) {
				console.log("Types in market group by market group ID response");
				return result.data;
			});
		}
	};
}).

factory('MarketGroupApi', function($http) {
	return {
		getMarketGroups: function(cb) {
			var url = "http://localhost:8080/api/inv/marketgroups?fields=39&callback=JSON_CALLBACK";

			return $http.jsonp(url).then(function(result) {
				console.log("Marketgroups response");
				cb(result.data.result);
			});
		},
		getParentMarketGroups: function() {

			var url = "http://localhost:8080/api/inv/marketgroups/parent/null?callback=JSON_CALLBACK";

			return $http.jsonp(url).then(function(result) {
				console.log("Parent Market Group Response");
				return result.data;
			});
		},
		getTypesByMarketGroupID: function(mgID, cb) {

			var url = "http://localhost:8080/api/inv/types/marketgroup/" + mgID + "?callback=JSON_CALLBACK";

			return $http.jsonp(url).then(function(result) {
				console.log("Types in market group by market group ID response");

				if (result.data.error) {
					throw new Error(result.data.error.message);
				}

				cb(result.data.result);
			});
		},
		getMarketGroupByID: function(mgID, cb) {

			var url = "http://localhost:8080/api/inv/marketgroups/" + mgID + "?callback=JSON_CALLBACK";

			return $http.jsonp(url).then(function(result) {
				console.log("Market group by ID response");

				if (result.data.error) {
					throw new Error(result.data.error.message);
				}

				cb(result.data.result);
				
			});
		}
	};
});

var SetupQuery = function(urlCreator) {

	return function() {

	}
};
angular.module('datastore', ['datastore.marketgroup']).

factory('MarketGroupsManager', ['MarketGroups', 'MarketGroup', function(MarketGroups, MarketGroup) {

	var marketGroups = new MarketGroups();

	return marketGroups;
}]).

factory('MarketGroupTypes', function() {
	
});
angular.module('datastore.marketgroup', ["api"]).

factory("MarketGroup", function() {
	var MarketGroup = function(mgdata) {
		this.id = mgdata.marketGroupID;
		this.name = mgdata.marketGroupName;
		this.parentID = mgdata.parentGroupID;
	};

	return MarketGroup;
}).

factory("MarketGroups", ["MarketGroupApi", "MarketGroup", function(MarketGroupApi, MarketGroup) {
	var MarketGroups = function() {
		this.marketGroupsByID = {};

		this.marketGroupsLoaded = false;
	};

	MarketGroups.prototype.getMarketGroupByID = function(marketGroupID, cb) {
		if (this.marketGroupLoaded(marketGroupID)) {
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
					this.setMarketGroupByID(new MarketGroup(result[0]));
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
		if (this.allMarketGroupsLoaded()) {
			cb(this.marketGroupsByID);
		} else {
			MarketGroupApi.getMarketGroups(function(result) {
				for (var i = 0; i < result.length; i++) {
					this.setMarketGroupByID(new MarketGroup(result[i]));
				}
				this.marketGroupsLoaded = true;
				cb(marketGroups);
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
angular.module('ui.treeaccordian', []).

factory('treeaccordian', function() {

	var TreeAccordian = function() {
		this.children = [];
		this.allNodes = {};
		this.parentlessNodes = {};
	};

	TreeAccordian.prototype.addNode = function(node) {
		//Add to all nodes collection
		this.allNodes[node.id] = node;

		if (node.parentID === null) {
			this.children.push(node);
		}

		//Check the parent is already in the tree
		if (this.allNodes.hasOwnProperty(node.parentID)) {

			//The parent is already in the tree, just add it
			this.allNodes[node.parentID].addChild(node);

		} else {

			//The parent is not already in the tree
			if (!this.parentlessNodes.hasOwnProperty(node.parentID)) {
				this.parentlessNodes[node.parentID] = [];
			}

			this.parentlessNodes[node.parentID].push(node);
		}

		//Check there aren't parentless nodes waiting for this node
		if (this.parentlessNodes.hasOwnProperty(node.id)) {
			for (var i = 0; i < this.parentlessNodes[node.id]; i++) {
				node.addChild(this.parentlessNodes[node.parentID]);
			}

			delete this.parentlessNodes[node.id];
		}
	};

	TreeAccordian.prototype.getNode = function(nodeID) {
		if (this.allNodes.hasOwnProperty(nodeID)) {
			return this.allNodes[nodeID];
		}
		throw new Error("No such node");
	};

	var AccordianNode = function(name, id, parentID) {
		this.children = {};
		this.expanded = false;
		this.name = name;
		this.id = id;
		this.parentID = parentID;
		this.clickFn = function() {};
		this.hasChildren = false;
	};

	AccordianNode.prototype.addChild = function(child) {
		this.children[child.id] = child;
		this.hasChildren = true;
	};

	AccordianNode.prototype.onClick = function(fn) {
		this.clickFn = fn;
	};

	AccordianNode.prototype.click = function() {
		this.expanded = !this.expanded;
		this.clickFn(this.children);
	};

	return {
		TreeAccordian: TreeAccordian,
		AccordianNode: AccordianNode
	};

}).

directive('accordiancontainer', function() {
	return {
		restrict: "E",
		replace: true,
		scope: {
			children: '='
		},
		template: "<ul class='accordian'><node ng-repeat='node in children' node='node'></node></ul>"
	};
}).

directive('node', function($compile) {
	return {
		restrict: "E",
		replace: true,
		scope: {
			node: '='
		},
		template: "<li ng-click='node.click(); $event.stopPropagation();'><span class='node-name' ng-class='{ haschildren: node.hasChildren, expanded: node.expanded }' >{{ node.name }}</span></li>",
		link: function (scope, element, attrs) {
			if (Object.keys(scope.node.children).length > 0) {
				element.append("<accordiancontainer ng-class='{ active: node.expanded }' ng-show='node.expanded' children='node.children'></accordiancontainer>");
			}
			$compile(element.contents())(scope);
		}
	};
});