var app = angular.module('ExplorerApp', []);

app.factory('typeDisplayFactory', function() {
	var data = {};

	data.activeType = {};

	return data;
});

app.controller('marketGroupController',	['$scope', 'api', 'MarketGroup', function($scope, api, MarketGroup) {
	$scope.data = {};

	$scope.data.marketGroups = [];

	var marketGroupRef = {};

	api.getMarketGroups(function(response) {
		var loadedGroups = [];

		for (var i = 0; i < response.result.length; i++) {
			var currentMg = response.result[i];
			var mg = new MarketGroup(currentMg.marketGroupID, currentMg.marketGroupName, currentMg.parentGroupID);
			marketGroupRef[currentMg.marketGroupID] = mg;
			loadedGroups.push(mg);
		}

		for (var j = 0; j < loadedGroups.length; j++) {
			var parentID = loadedGroups[j].parentGroupID;
			if (parentID === null) {
				$scope.data.marketGroups.push(loadedGroups[j]);
			} else if (marketGroupRef.hasOwnProperty(parentID)) {
				marketGroupRef[parentID].addChild(loadedGroups[j]);
			}
		}
	});
}]);

app.controller('typeDisplayController', ['$scope', function($scope) {

}]);

app.factory('api', function($http) {
	return {
		getMarketGroups: function(cb) {
			var url = "http://localhost:8080/api/inv/marketgroups?fields=39&callback=JSON_CALLBACK";

			return $http.jsonp(url).then(function(result) {
				console.log("Marketgroups response");
				cb(result.data);
			});
		}
	};
});

app.factory('Type', function() {
	var Type = function() {

	};

	return Type;
});

app.factory('MarketGroup', function() {
	var MarketGroup = function(id, name, parentGroupID) {
		this.id = id;
		this.name = name;
		this.parentGroupID = parentGroupID;

		this.children = [];
		this.visibleChildren = false;
	};

	MarketGroup.prototype.addChild = function(child) {
		this.children.push(child);
	};

	MarketGroup.prototype.click = function() {
		this.visibleChildren = !this.visibleChildren;
	};

	return MarketGroup;
});


app.directive('accordian', function() {
	return {
		restrict: "E",
		replace: true,
		scope: {
			items: '=',
			depth: '='
		},
		template: "<ul class='accordian'><accordianrow depth='depth' class='depth-{{ depth }}' ng-repeat='child in items' member='child'> {{ items }} </accordianrow></ul>"
	};
});

app.directive('accordianrow', function($compile) {
	return {
		restrict: "E",
		replace: true,
		scope: {
			member: '=',
			depth: '='
		},
		template: "<li ng-click='member.click(); $event.stopPropagation();'  class='depth-{{ depth }}'  ><span class='row-content depth-{{ depth }}'>{{ member.name }}</span></li>",
		link: function (scope, element, attrs) {
			if (angular.isArray(scope.member.children)) {
				element.append("<accordian depth='depth + 1' ng-class='{ active: member.visible }' ng-show='member.visibleChildren' items='member.children'></accordian>");
			}
			$compile(element.contents())(scope);
		}
	};
});