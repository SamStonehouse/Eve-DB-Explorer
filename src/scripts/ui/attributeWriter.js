angular.module('ui.attributes', []).

factory('attributeWriter', function() {
	var AttributeWriter = function) {

		//Maps attributeGroupID to AttributeGroups
		this.attributeGroups = {};
	};

	AttributeWriter.prototype.addAttribute = function(attribute) {
		var group = attributeUIGroupMap[attribute.id];



	};

	AttributeWriter.prototype.hasGroup = function(group) {
		for (var currentGroup in this.attributeGroups) {
			if (this.attributeGroups.hasOwnProperty(currentGroup)) {

			}
		}
	};

	var AttributeUIGroup = function(name) {

	};

	//Map the attributes to their group
	var attributeUIGroupMap = {

	};


});