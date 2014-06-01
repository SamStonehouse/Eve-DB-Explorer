angular.module('models.attribute', []).

factory('Attribute', function() {
	var Attribute = function(attributeData) {
		this.id = attributeData.attributeID;
		this.name = attributeData.attributeName;
		this.value = attributeData.value;
	};

	return Attribute;
}).

factory('Attributes', ['Attribute', function(Attribute) {
	var Attributes = function() {
		this.attributesByID = {};
		this.attributesByName = {};
	};

	Attributes.prototype.addAttribute = function(attributeData) {
		var newAttr = new Attribute(attributeData);

		this.attributesByID[newAttr.id] = newAttr;
		this.attributesByName[newAttr.name] = newAttr;
	};

	Attributes.prototype.hasAttributeWithID = function(attributeID) {
		return this.attributesByID.hasOwnProperty(attributesID);
	};

	Attributes.prototype.getAttributeByID = function(attributeID) {
		if (this.hasAttributeWithID(attributeID)) {
			return this.attributesByID[attributeID];
		}

		return null;
	};

	Attributes.prototype.hasAttributeWithName = function(attributeName) {
		return this.attributesByName.hasOwnProperty(attributeName);
	};

	Attributes.prototype.getAttributeByName = function(attributeName) {
		return this.hasAttributeWithName(attributeName);
	};

	return Attributes;
}]);