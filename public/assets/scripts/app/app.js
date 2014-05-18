var app = angular.module('ExplorerApp', ['ui.treeaccordian', 'api']);

app.factory('typeDisplayFactory', function() {
	var data = {};

	data.activeType = {};

	return data;
});

app.controller('marketGroupController',	['$scope', 'apiMethods', 'treeaccordian', function($scope, apiMethods, treeaccordian) {
	var marketGroupAccordian = new treeaccordian.TreeAccordian();

	$scope.data = {};
	$scope.data.marketGroupAccordian = marketGroupAccordian;

	apiMethods.getMarketGroups(function(result) {
		for (var i = 0; i < result.length; i++) {
			var accNode = new treeaccordian.AccordianNode(result[i].marketGroupName, result[i].marketGroupID, result[i].parentGroupID);
			marketGroupAccordian.addNode(accNode, result[i].parentGroupID);
		}
	});
}]);

app.controller('typeDisplayController', ['$scope', function($scope) {

}]);
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
});
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