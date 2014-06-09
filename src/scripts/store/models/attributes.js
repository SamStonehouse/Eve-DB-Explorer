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
}]).

factory('AttributeUnits', function() {

	var getCommas = function(str) {
		var remain = str%1;

		var amount = new String(Math.floor(str));
		amount = amount.split("").reverse();

		var output = [];

		for (var i = 0; i < amount.length; i++) {
			output.push(amount[i]);
			if ((i + 1)%3 === 0) && (i < amount.length -1) {
				output.push(",");
			}
		}

		if (remain === 0) {
			remain = "";
		} else {
			remain = remain + new String(remain).slice(1);
		}

		return output + remain;
	};

	var AttributeUnit = function(name, unit, renderFunction) {
		this.name = name;
		this.unit = unit;
		this.renderFunction = renderFunction;
	};

	var percentUnit = new AttributeUnit("Percent", "%", function(value) {
		return value + "%";
	});

	var lengthUnit = new AttributeUnit("Length", "m", function(value) {
		return value + "m";
	});

	var areaUnit = new AttributeUnit("Area", "m2", function(value) {
		return value + "m<sup>2</sup>";
	});

	var volumeUnit = new AttributeUnit("Volume", "m3", function(value) {
		return value + "m<sup>3</sup>";
	});

	var massUnit = new AttributeUnit("Mass", "kg", function(value) {
		return value + "kg";
	});


});