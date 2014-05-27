angular.module('datastore.attribute', ["api"]).

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

		console.log("New Attribute");
		console.dir(newAttr);

		this.attributesByID[newAttr.id] = newAttr;
		this.attributesByName[newAttr.name] = newAttr;
	};

	Attributes.prototype.hasAttributeWithID = function(attributeID) {
		if (this.attributesByID.hasOwnProperty(attributesID)) {
			return true;
		}

		return false;
	};

	Attributes.prototype.getAttributeByID = function(attributeID) {
		if (this.hasAttributeWithID(attributeID)) {
			return this.attributesByID[attributeID];
		}

		return null;
	};

	Attributes.prototype.hasAttributeWithName = function(attributeName) {
		if (this.attributesByName.hasOwnProperty(attributeName)) {
			return true;
		}

		return false;
	};

	Attributes.prototype.getAttributeByName = function(attributeName) {
		if (this.hasAttributeWithName(attributeName)) {
			return this.attributesByName[attributeName];
		}

		return null;
	};

	return Attributes;
}]);