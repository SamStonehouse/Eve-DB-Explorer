var app = angular.module('ExplorerApp', ['ui.treeaccordian', 'datastore']);

app.controller('marketGroupController',	['$scope', 'MarketGroupsManager', 'MarketGroupTypesManager', 'TypesManager', 'treeaccordian', function($scope, marketGroups, marketGroupTypes, typesManager, treeaccordian) {
	var marketGroupAccordian = new treeaccordian.TreeAccordian();

	$scope.data = {};
	$scope.data.activeMarketGroupTypes = [];

	$scope.data.activeType = {};

	var nodeSelect = function(node) {
		console.log(node);
		if (node.nodeData.hasTypes) {
			marketGroupTypes.getMarketGroupTypesByIDs(node.id, function(types) {
				$scope.data.activeMarketGroupTypes = types;
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
		typesManager.getTypeByID(typeID, function(type) {
			console.log("Type response");
			console.log(type);
			$scope.data.activeType = type;
		});
	};
}]);

app.controller('typeDisplayController', ['$scope', function($scope) {

}]);