var app = angular.module('ExplorerApp', ['ui.treeaccordian', 'datastore']);

app.controller('marketGroupController',	['$scope', 'MarketGroups', 'treeaccordian', function($scope, MarketGroups, treeaccordian) {
	var marketGroupAccordian = new treeaccordian.TreeAccordian();

	$scope.data = {};

	MarketGroups.getMarketGroups(function(result) {
		for (var i in result) {
			if (result.hasOwnProperty(i)) {
				var accNode = new treeaccordian.AccordianNode(result[i].name, result[i].id, result[i].parentID);
				marketGroupAccordian.addNode(accNode, result[i].parentID);
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

factory('marketgroupapi', function($http) {
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
});
angular.module('datastore', ['datastore.marketgroup', 'api']).

factory('MarketGroups', ['MarketGroup', 'apiMethods', function(MarketGroup, apiMethods) {

	var marketGroups = {};

	var marketGroupsLoaded = false;

	var getMarketGroups = function(cb) {
		if (marketGroupsLoaded) {
			cb(marketGroups);
		} else {
			apiMethods.getMarketGroups(function(result) {
				for (var i = 0; i < result.length; i++) {
					marketGroups[result[i].marketGroupID] = new MarketGroup(result[i]);
				}
				marketGroupsLoaded = true;
				cb(marketGroups);
			});
		}
	};

	var getMarketGroup = function(id) {

	};

	var marketGroupExists = function(id) {

	};

	var setMarketGroup = function(mg) {

	};

	return {
		getMarketGroups: getMarketGroups,
		getMarketGroup: getMarketGroup,
		marketGroupExists: marketGroupExists,
		setMarketGroup: setMarketGroup
	};
}]).

factory('MarketGroupTypes', function() {
	
});
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