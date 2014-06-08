angular.module('Shared', []).

factory('activeType', function() {
	var ActiveTypeHolder = function() {
		this.activeType = {};
	};

	ActiveTypeHolder.prototype.setActiveType = function(activeType) {
		this.activeType = activeType;
		console.log("Set active types");
	};

	ActiveTypeHolder.prototype.getActiveTypeData = function() {
		return this;
	};

	return new ActiveTypeHolder();
});