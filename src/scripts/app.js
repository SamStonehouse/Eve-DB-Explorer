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