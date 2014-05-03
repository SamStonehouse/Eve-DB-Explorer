var apiMethods = app.module('apiMethods', []);

var baseApiURL = "http://localhost:8080";

apiMethods.factory('typeMethods', function($http) {
	return {
		getTypesByMarketGroupID: function(mgID) {

			var url = baseApiURL + "/api/inv/types/marketgroup/" + mgID + "?callback=JSON_CALLBACK";

			return $http.jsonp(url).then(function(result) {
				console.log("Types in market group by market group ID response");
				return result.data;
			});
		},
		getFullType: function(typeID) {

			var url = baseApiURL + "/api/inv/types/full/" + typeID + "?callback=JSON_CALLBACK";

			return $http.jsonp(url).then(function(result) {
				console.log("Full type response");
				return result.data;
			});
		}
	};
});

apiMethods.factory('marketGroupMethods', function($http) {
	return {
		getParentMarketGroups: function() {

			var url = baseApiURL + "/api/inv/marketgroups/parent/null?callback=JSON_CALLBACK";

			return $http.jsonp(url).then(function(result) {
				console.log("Parent Market Group Response");
				return result.data;
			});
		},
		getMarketGroupByID: function(mgID) {

			var url = baseApiURL + "/api/inv/marketgroups/parent/" + mgID + "?callback=JSON_CALLBACK";

			return $http.jsonp(url).then(function(result) {
				console.log("Market Group by Parent ID response");
				return result.data;
			});
		}
	};
});