var app = angular.module('ExplorerApp', ['ui.treeaccordian', 'api']);

app.controller('marketGroupController',	['$scope', 'apiMethods', 'treeaccordian', function($scope, apiMethods, treeaccordian) {
	var marketGroupAccordian = new treeaccordian.TreeAccordian();

	$scope.data = {};

	apiMethods.getMarketGroups(function(result) {
		for (var i = 0; i < result.length; i++) {
			var accNode = new treeaccordian.AccordianNode(result[i].marketGroupName, result[i].marketGroupID, result[i].parentGroupID);
			marketGroupAccordian.addNode(accNode, result[i].parentGroupID);
		}
	});

	$scope.data.marketGroupAccordian = marketGroupAccordian; // TODO: Filter out unnecessary nodes (or not load them in the first place)
}]);

app.controller('typeDisplayController', ['$scope', function($scope) {

}]);