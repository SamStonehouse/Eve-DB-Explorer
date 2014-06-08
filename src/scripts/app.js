var app = angular.module('ExplorerApp', ['ui.treeaccordian', 'collections.marketgroups', 'collections.types', 'collections.marketgrouptypes', 'Shared']);

app.controller('marketGroupController',	['$scope', 'MarketGroups', 'Types', 'MarketGroupTypes', 'treeaccordian', 'activeType', function($scope, marketGroups, types, marketGroupTypes, treeaccordian, activeType) {
	var marketGroupAccordian = new treeaccordian.TreeAccordian();

	$scope.data = {};
	$scope.data.activeMarketGroupTypes = [];

	$scope.data.activeType = {};

	var nodeSelect = function(node) {
		if (node.nodeData.hasTypes) {
			marketGroupTypes.getMarketGroupTypesByIDs(node.id, function(currentTypes) {
				$scope.data.activeMarketGroupTypes = currentTypes;
			});
		}
	};

	//Todo: Maybe build this in init? Spawn off to worker thread? *shrug*

	marketGroups.getAllMarketGroups(function(marketGroups) {
		console.log(marketGroups);
		for (var i in marketGroups) {
			if (marketGroups.hasOwnProperty(i)) {
				var accNode = new treeaccordian.AccordianNode(marketGroups[i].name, marketGroups[i].id, marketGroups[i].parentID, marketGroups[i]);

				accNode.onClick(nodeSelect);

				marketGroupAccordian.addNode(accNode, marketGroups[i].parentID);
			}
		}

		marketGroupAccordian.createTree();
	});

	$scope.data.marketGroupAccordian = marketGroupAccordian;

	$scope.typeSelect = function(typeID) {
		types.getTypeByID(typeID, function(type) {
			activeType.setActiveType(type);
		});
	};
}]);

app.controller('typeDisplayController', ['$scope', 'activeType', function($scope, activeType) {
	$scope.data = {derp: "DERP", name: "Dog"};
	$scope.data.activeTypeHolder = activeType;
}]);