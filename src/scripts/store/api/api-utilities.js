angular.module('api.utilities', []).

factory("apiUtilities", ['$http', function($http) {
	
	var baseURL = "http://localhost:8080";

	var jsonpExtension = "callback=JSON_CALLBACK";

	var callApi = function(url, cb) {
		var responsePromise = $http.jsonp(baseURL + url + '?' + jsonpExtension);

		responsePromise.success(function(result) {
			if (result && result.error) {
				throw new Error(result.error.message);
			}
			
			cb(result.result);
		});

		responsePromise.error(function(result) {
			throw new Error("Unknown AJAX error");
		});
	};

	return {
		baseURL: baseURL,
		callApi: callApi
	};
}]);