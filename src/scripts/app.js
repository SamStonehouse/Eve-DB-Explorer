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