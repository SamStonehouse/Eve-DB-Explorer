angular.module('models.type', ['models.attribute']).

factory("Type", ["Attributes", function(Attributes) {
	var Type = function(typeData) {
		this.id = typeData.typeID;
		this.name = typeData.typeName;
		this.description = typeData.description;

		//Create and populate attributes
		this.attributes = new Attributes();

		for (var i = 0; i < typeData.attributes. length; i++) {
			this.attributes.addAttribute(typeData.attributes[i]);
		}
	};

	return Type;
}]);

