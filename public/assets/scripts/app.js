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
		},
		getTypesByMarketGroupID: function(mgID) {
			return $http.jsonp(urls.baseApiURL + "/api/inv/types/marketgroup/" + mgID + "?callback=JSON_CALLBACK").then(function(result) {
				console.log("Types in market group by market group ID response");
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

		var subMarketGroups = [];

		if (result.result) {
			for (var i = 0; i < result.result.length; i++) {
				subMarketGroups.push(new MarketGroup(self.api, result.result[i]));
			}
		}

		self.children[0] = subMarketGroups;

	});

	self.api.getTypesByMarketGroupID(self.data.marketGroupID).then(function(result) {

		var subTypeItems = [];

		if (result.result) {
			for (var i = 0; i < result.result.length; i++) {
				subTypeItems.push(new Type(result.result[i]));
			}
		}

		self.children[1] = subTypeItems;
	});

};

MarketGroup.prototype.click = function() {
	console.log("Marketgroup Toggled");

	if (!this.childrenLoaded) {
		this.childrenLoaded = true;
		this.loadChildren();
	}

	this.visible = !this.visible;
};

var Type = function(data) {
	this.data = data;
	this.name = data.typeName;
};

Type.prototype.click = function() {
	console.log("Type Clicked");
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
		template: "<li ng-click='member.click(); $event.stopPropagation();' >{{ member.name }} {{ member.children[0].length }}</li>",
		link: function (scope, element, attrs) {
			if (angular.isArray(scope.member.children)) {
				element.append("<accordian ng-repeat='subacc in member.children' ng-show='member.visible' items='subacc'></accordian>");
			}
			$compile(element.contents())(scope);
		}
	};
});

