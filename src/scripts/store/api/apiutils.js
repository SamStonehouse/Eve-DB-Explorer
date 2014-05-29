angular.module('apiutils', []).

factory("ApiUtilities", function() {
	
	var baseURL = "http://localhost:8000";

	var apiCall = function(url, cb) {
		var responsePromise = $http.jsonp(url, {callback: JSON_CALLBACK});

		responsePromise.success(function(result) {
			if (result.data.error) {
				throw new Error(result.data.error.message);
			}

			cb(result.data.result);
		});

		responsePromise.error(function(result) {
			throw new Error("Unknown AJAX error");
		});
	};

	return {
		baseURL: baseURL,
		apiCall: apiCall
	};
});