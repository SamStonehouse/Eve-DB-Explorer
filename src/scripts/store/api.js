angular.module('api', []).

factory('MarketGroupApi', function($http) {
	return {
		getMarketGroups: function(cb) {
			var url = "http://localhost:8080/api/inv/marketgroups?callback=JSON_CALLBACK";

			return $http.jsonp(url).then(function(result) {
				console.log("Marketgroups response");
				cb(result.data.result);
			});
		},
		getParentMarketGroups: function() {

			var url = "http://localhost:8080/api/inv/marketgroups/parent/null?callback=JSON_CALLBACK";

			return $http.jsonp(url).then(function(result) {
				console.log("Parent Market Group Response");
				return result.data;
			});
		},
		getTypesByMarketGroupID: function(mgID, cb) {

			var url = "http://localhost:8080/api/inv/types/marketgroup/" + mgID + "?callback=JSON_CALLBACK";

			return $http.jsonp(url).then(function(result) {
				console.log("Types in market group by market group ID response");

				if (result.data.error) {
					throw new Error(result.data.error.message);
				}

				cb(result.data.result);
			});
		},
		getMarketGroupByID: function(mgID, cb) {

			var url = "http://localhost:8080/api/inv/marketgroups/" + mgID + "?callback=JSON_CALLBACK";

			return $http.jsonp(url).then(function(result) {
				console.log("Market group by ID response");

				if (result.data.error) {
					throw new Error(result.data.error.message);
				}

				cb(result.data.result);
				
			});
		}
	};
}).


factory('TypeApi', function($http) {
	return {
		getTypeByID: function(typeID, cb) {

			var url = "http://localhost:8080/api/inv/types/full/" + typeID + "?callback=JSON_CALLBACK";

			return $http.jsonp(url).then(function(result) {
				console.log("Market group by ID response");

				if (result.data.error) {
					throw new Error(result.data.error.message);
				}

				cb(result.data.result);
			});
		}
	};
});
