var app = angular.module('ExplorerApp', ['ui.treeaccordian', 'collections.marketgroups', 'collections.types', 'collections.marketgrouptypes']);

app.controller('marketGroupController',	['$scope', 'MarketGroups', 'Types', 'MarketGroupTypes', 'treeaccordian', function($scope, marketGroups, types, marketGroupTypes, treeaccordian) {
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

	$scope.data.marketGroupAccordian = marketGroupAccordian; // TODO: Filter out unnecessary nodes (or not load them in the first place)

	$scope.typeSelect = function(typeID) {
		types.getTypeByID(typeID, function(type) {
			$scope.data.activeType = type;
		});
	};
}]);

app.controller('typeDisplayController', ['$scope', function($scope) {

}]);