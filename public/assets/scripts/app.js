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

			var mg = new MarketGroup(self.api, result.result[i]);
			//mg.visible = true;

			self.marketGroups.push(mg);
		}
	});
};


var MarketGroup = function(api, data) {
	this.api = api;
	this.data = data;
	this.visible = false;

	this.name = this.data.marketGroupName;
	this.children = [];
	this.childrenLoaded = false;
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

	if (!this.childrenLoaded) {
		this.childrenLoaded = true;
		this.loadChildren();
	}

	this.visible = !this.visible;
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
		template: "<li ng-click='member.toggle(); $event.stopPropagation();' >{{ member.name }} {{ member.children.length }}</li>",
		link: function (scope, element, attrs) {
			if (angular.isArray(scope.member.children)) {
				element.append("<accordian ng-show='member.visible' items='member.children'></accordian>");
				$compile(element.contents())(scope);
			}
		}
	};
});

