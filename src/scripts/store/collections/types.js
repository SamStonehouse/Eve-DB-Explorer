angular.module('collections.types', ['api', 'models.type']).

factory("Types", ["Type", "TypeApi", function(Type, TypeApi) {
	var Types = function() {
		this.typesByID = {};
		this.typesInGroup = {};
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

	Types.prototype.getTypesInGroup = function(groupID, cb) {

	};

	Types.prototype.groupLoaded = function(groupID) {

	};

	Types.prototype.setGroupByID = function(groupID, groupTypes) {
		this.typesInGroup[groupID] = [];

		//Add all types in this group to the type by id reference too
		for (var i = 0; i < groupTypes.length; i++) {
			if (this.typeLoaded.hasOwnProperty(gp)) {
				this.setTypeByID(groupTypes[gp].id, new Type(groupTypes[gp]));
				typesInGroup[groupID] .push();
			}
		}
	};

	return new Types();
}]).

factory("Skills", function() {

});