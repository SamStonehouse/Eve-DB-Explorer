var app = angular.module('app', []);

app.factory('urls', function() {

	var baseApiURL = "http://localhost:8080";

	return  {
		baseApiURL: baseApiURL
	};

});

app.factory('api', function($http, urls) {
	return {
		getParentMarketGroups: function() {
			return $http.jsonp(urls.baseApiURL + "/api/inv/marketgroups/parent/null?callback=JSON_CALLBACK").then(function(result) {
				console.log("Parent Market Group Response");
				return result.data;
			});
		},
		getMarketGroupByID: function(mgID) {
			return $http.jsonp(urls.baseApiURL + "/api/inv/marketgroups/parent/" + mgID + "?callback=JSON_CALLBACK").then(function(result) {
				console.log("Market Group by Parent ID response");
				return result.data;
			});
		}
	};
});

var sidebarController = function($scope, api) {
	$scope.data = {};

	var marketGroups = new MarketGroups(api);
	marketGroups.loadParentGroups();

	$scope.data.marketGroups = marketGroups.marketGroups;
};

var MarketGroups = function(api) {
	this.api = api;
	this.marketGroups = [];
};

MarketGroups.prototype.loadParentGroups = function() {
	var self = this;

	self.api.getParentMarketGroups().then(function(result) {
		//Loop through all results creating new
		for (var i = 0; i < result.result.length; i++) {
			self.marketGroups.push(new MarketGroup(self.api, result.result[i]));
		}
	});
};


var MarketGroup = function(api, data) {
	this.api = api;
	this.data = data;
	this.isToggled = false;

	this.name = this.data.marketGroupName;
	this.children = [];

	this.showChildren = false;
	this.childGroups = [];
	this.types = [];
};


MarketGroup.prototype.loadChildren = function() {
	var self = this;

	self.api.getMarketGroupByID(self.data.marketGroupID).then(function(result) {
		for (var i = 0; i < result.result.length; i++) {
			self.children.push(new MarketGroup(self.api, result.result[i]));
		}
	});
};

MarketGroup.prototype.toggle = function() {
	console.log("Toggled");
	this.isToggled = !this.isToggled;
};


app.directive('accordian', function() {
	return {
		restrict: "E",
		replace: true,
		scope: {
			items: '='
		},
		template: "<ul class='accordian'><accordianrow ng-repeat='child in items' member='child'></accordianrow></ul>"
	};
});

app.directive('accordianrow', function($compile) {
	return {
		restrict: "E",
		replace: true,
		scope: {
			member: '='
		},
		template: "<li ng-click='member.loadChildren()'>{{ member.name }} {{ member.children.length }}</li>",
		link: function (scope, element, attrs) {
			console.log("rendering");
			console.log(scope);
			if (angular.isArray(scope.member.children)) {
				element.append("<accordian items='member.children'></accordian>");
				$compile(element.contents())(scope);
			}
		}
	};
});


app.directive('marketgroup', function() {
	return {
		restrict: "E",
		replace: true,
		scope: {
			groups: '='
		},
		template: "<div ng-repeat='mg in groups' ng-click='mg.toggle()'>{{ mg.data.marketGroupName }} <div ng-show='mg.isToggled'></div></div>",
		link: function (scope, element, attrs) {
			console.log("Here");
			if (angular.isArray(scope.groups.children) && (scope.groups.children.length > 0)) {
				console.log("Wat");
				element.append("<marketgroup groups='mg.childGroups'></collection>");
				$compile(element.contents())(scope);
			}
		}
	};
});

