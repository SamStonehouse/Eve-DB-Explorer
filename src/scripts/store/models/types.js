angular.module('datastore.type', ["api"]).

factory("Type", function() {
	var Type = function(typeData) {
		this.id = typeData.typeID;
		this.name = typeData.typeName;
		this.description = typeData.description;
		this.attributes = typeData.attributes;
	};

	return Type;
}).

factory("Types", ["Type", "TypeApi", function(Type, TypeApi) {
	var Types = function() {
		this.typesByID = {};
	};

	Types.prototype.getTypeByID = function(typeID, cb) {
		var self = this;

		if (self.typeLoaded(typeID)) {
			if (self.typesByID[typeID] === false) {
				throw new Error("No such type with id: " + typeID);
			} else {
				cb(self.typesByID[typeID]);
			}
		} else {
			TypeApi.getTypeByID(typeID, function(result) {
				if (result.length === 0) {
					self.setTypeByID(typeID, false);
					throw new Error("No such type with id: " + typeID);
				} else {
					var type = new Type(result[0]);
					self.setTypeByID(type.id, type);
					cb(type);
				}
			});
		}
	};

	Types.prototype.typeLoaded = function(typeID) {
		return this.typesByID.hasOwnProperty(typeID);
	};

	Types.prototype.setTypeByID = function(typeID, type) {
		this.typesByID[typeID] = type;
	};

	return Types;
}]);