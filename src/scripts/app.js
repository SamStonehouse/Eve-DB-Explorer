var app = angular.module('ExplorerApp', ['ui.treeaccordian', 'datastore']);

app.controller('marketGroupController',	['$scope', 'MarketGroupsManager', 'MarketGroupTypesManager', 'treeaccordian', function($scope, marketGroups, marketGroupTypes, treeaccordian) {
	var marketGroupAccordian = new treeaccordian.TreeAccordian();

	$scope.data = {};
	$scope.data.activeMarketGroupTypes = [];

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
}]);

app.controller('typeDisplayController', ['$scope', function($scope) {

}]);