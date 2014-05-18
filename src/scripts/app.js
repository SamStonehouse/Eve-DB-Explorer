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