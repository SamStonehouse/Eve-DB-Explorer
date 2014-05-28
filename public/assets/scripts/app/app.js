var app = angular.module('ExplorerApp', ['ui.treeaccordian', 'datastore']);

app.controller('marketGroupController',	['$scope', 'MarketGroupsManager', 'MarketGroupTypesManager', 'TypesManager', 'treeaccordian', function($scope, marketGroups, marketGroupTypes, typesManager, treeaccordian) {
	var marketGroupAccordian = new treeaccordian.TreeAccordian();

	$scope.data = {};
	$scope.data.activeMarketGroupTypes = [];

	$scope.data.activeType = {};

	var nodeSelect = function(node) {
		console.log(node);
		if (node.nodeData.hasTypes) {
			marketGroupTypes.getMarketGroupTypesByIDs(node.id, function(types) {
				$scope.data.activeMarketGroupTypes = types;
			});
		}
	};

	marketGroups.getAllMarketGroups(function(marketGroups) {
		console.log(marketGroups);
		for (var i in marketGroups) {
			if (marketGroups.hasOwnProperty(i)) {
				var accNode = new treeaccordian.AccordianNode(marketGroups[i].name, marketGroups[i].id, marketGroups[i].parentID, marketGroups[i]);

				accNode.onClick(nodeSelect);

				marketGroupAccordian.addNode(accNode, marketGroups[i].parentID);
			}
		}

		marketGroupAccordian.createTree();
	});

	$scope.data.marketGroupAccordian = marketGroupAccordian; // TODO: Filter out unnecessary nodes (or not load them in the first place)

	$scope.typeSelect = function(typeID) {
		typesManager.getTypeByID(typeID, function(type) {
			console.log("Type response");
			console.log(type);
			$scope.data.activeType = type;
		});
	};
}]);

app.controller('typeDisplayController', ['$scope', function($scope) {

}]);
angular.module('Init', []).

factory('init', function() {

	//Load types in group skills
	
});
angular.module('api', []).

factory('MarketGroupApi', function($http) {
	return {
		getMarketGroups: function(cb) {
			var url = "http://localhost:8080/api/inv/marketgroups?callback=JSON_CALLBACK";

			return $http.jsonp(url).then(function(result) {
				console.log("Marketgroups response");
				cb(result.data.result);
			});
		},
		getParentMarketGroups: function() {

			var url = "http://localhost:8080/api/inv/marketgroups/parent/null?callback=JSON_CALLBACK";

			return $http.jsonp(url).then(function(result) {
				console.log("Parent Market Group Response");
				return result.data;
			});
		},
		getTypesByMarketGroupID: function(mgID, cb) {

			var url = "http://localhost:8080/api/inv/types/marketgroup/" + mgID + "?callback=JSON_CALLBACK";

			return $http.jsonp(url).then(function(result) {
				console.log("Types in market group by market group ID response");

				if (result.data.error) {
					throw new Error(result.data.error.message);
				}

				cb(result.data.result);
			});
		},
		getMarketGroupByID: function(mgID, cb) {

			var url = "http://localhost:8080/api/inv/marketgroups/" + mgID + "?callback=JSON_CALLBACK";

			return $http.jsonp(url).then(function(result) {
				console.log("Market group by ID response");

				if (result.data.error) {
					throw new Error(result.data.error.message);
				}

				cb(result.data.result);
				
			});
		}
	};
}).


factory('TypeApi', function($http) {
	return {
		getTypeByID: function(typeID, cb) {

			var url = "http://localhost:8080/api/inv/types/full/" + typeID + "?callback=JSON_CALLBACK";

			return $http.jsonp(url).then(function(result) {
				console.log("Market group by ID response");

				if (result.data.error) {
					throw new Error(result.data.error.message);
				}

				cb(result.data.result);
			});
		}
	};
});

angular.module('datastore', ['datastore.marketgroup', 'datastore.type']).

factory('MarketGroupsManager', ['MarketGroups', function(MarketGroups, MarketGroup) {
	var marketGroups = new MarketGroups();

	return marketGroups;
}]).

factory('MarketGroupTypesManager', ['MarketGroupTypes', function(MarketGroupTypes) {
	var marketGroupTypes = new MarketGroupTypes();

	return marketGroupTypes;
}]).

factory('TypesManager', ['Types', function(Types) {
	var types = new Types();

	return types;
}]);
angular.module('models.attribute', ["api"]).

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
angular.module('models.marketgroup', ["api"]).

factory("MarketGroup", function() {
	var MarketGroup = function(mgdata) {
		this.id = mgdata.marketGroupID;
		this.name = mgdata.marketGroupName;
		this.parentID = mgdata.parentGroupID;
		this.hasTypes = mgdata.hasTypes;
	};

	return MarketGroup;
}).

factory("MarketGroups", ["MarketGroupApi", "MarketGroup", function(MarketGroupApi, MarketGroup) {
	var MarketGroups = function() {
		this.marketGroupsByID = {};

		this.marketGroupsLoaded = false;
	};

	MarketGroups.prototype.getMarketGroupByID = function(marketGroupID, cb) {
		var self = this;

		if (self.marketGroupLoaded(marketGroupID)) {
			console.log("Already stored this marketgroup");
			//Check it's not an invalid ID which has already been loaded
			if (self.marketGroupsByID[marketGroupID] === false) {
				throw new Error("No such marketGroup");
			}

			cb(self.marketGroupsByID[marketGroupID]);
		} else {
			//Attempt to load through API
			MarketGroupApi.getMarketGroupByID(marketGroupID, function(result) {
				if (result.length === 0) {
					marketGroupsByID[marketGroupID] = false;
					throw new Error("No such marketGroup");
				} else {
					console.log("Market Group loaded succesfully");
					self.setMarketGroupByID(new MarketGroup(result[0]));
					cb(marketGroupsByID[marketGroupID]);
				}
			});
		}
	};

	MarketGroups.prototype.marketGroupLoaded = function(marketGroupID) {
		return this.marketGroupsByID.hasOwnProperty(marketGroupID);
	};

	MarketGroups.prototype.allMarketGroupsLoaded = function(){
		return this.marketGroupsLoaded;
	};

	MarketGroups.prototype.setMarketGroupByID = function(marketGroup) {
		this.marketGroupsByID[marketGroup.id] = marketGroup;
	};

	MarketGroups.prototype.getAllMarketGroups = function(cb) {
		var self = this;

		if (this.allMarketGroupsLoaded()) {
			cb(this.marketGroupsByID);
		} else {
			MarketGroupApi.getMarketGroups(function(result) {
				for (var i = 0; i < result.length; i++) {
					self.setMarketGroupByID(new MarketGroup(result[i]));
				}
				self.marketGroupsLoaded = true;
				cb(self.marketGroupsByID);
			});
		}
	};

	return MarketGroups;
}]).

factory("MarketGroupType", function() {
	var MarketGroupType = function(mgtdata) {
		this.id = mgtdata.typeID;
		this.name = mgtdata.typeName;
	};

	return MarketGroupType;
}).

factory("MarketGroupTypes", ["MarketGroupApi", "MarketGroupType", function(MarketGroupApi, MarketGroupType) {
	var MarketGroupTypes = function() {
		this.marketGroupTypes = {};
	};

	MarketGroupTypes.prototype.getMarketGroupTypesByIDs = function(marketGroupID, cb) {
		var self = this;

		if (self.marketGroupTypesLoaded(marketGroupID)) {

			//Check it's not an invalid ID which has already been loaded
			cb(self.marketGroupTypes[marketGroupID]);

		} else {
			//Attempt to load through API
			MarketGroupApi.getTypesByMarketGroupID(marketGroupID, function(result) {
				var types = [];

				for (var i = 0; i < result.length; i++) {
					types.push(new MarketGroupType(result[i]));
				}

				cb(types);
				self.setMarketGroupTypes(marketGroupID, types);
			});
		}
	};

	MarketGroupTypes.prototype.marketGroupTypesLoaded = function(marketGroupID) {
		return this.marketGroupTypes.hasOwnProperty(marketGroupID);
	};


	MarketGroupTypes.prototype.setMarketGroupTypes = function(marketGroupID, types) {
		this.marketGroupTypes[marketGroupID] = types;
	};

	return MarketGroupTypes;
}]);



var loadByID = function(refObj, APIFn) {


	return function(IDs, cb) {

		//If IDs is array, join with comma

		if (this.marketGroupsByID.hasOwnProperty(marketGroupID)) {
			console.log("Already stored this marketgroup");
			//Check it's not an invalid ID which has already been loaded
			if (this.marketGroupsByID[marketGroupID] === false) {
				throw new Error("No such marketGroup");
			}

			cb(this.marketGroupsByID[marketGroupID]);
		} else {
			//Attempt to load through API
			MarketGroupApi.getMarketGroupByID(marketGroupID, function(result) {
				if (result.length === 0) {
					marketGroupsByID[marketGroupID] = false;
					throw new Error("No such marketGroup");
				} else {
					console.log("Market Group loaded succesfully");
					marketGroupsByID[marketGroupID] = result[0];
					cb(result[0]);
				}
			});
		}
	};
};
angular.module('models.skill', ["api"]).

factory("Skill", function() {

	var REQ_SKILL_1_ID = 182;
	var REQ_SKILL_2_ID = 183;
	var REQ_SKILL_3_ID = 184;

	var REQ_LEVEL_1_ID = 277;
	var REQ_LEVEL_2_ID = 277;
	var REQ_LEVEL_3_ID = 277;

	var Skill = function(typeData) {
		this.name = typeData.typeName;
		this.id = typeData.typeID;

		this.requirements = [];

	};

	Skill.prototype.parseAttribute = function(attributes, skillAttributeID, levelAttributeID) {
		if (attributes.hasOwnProperty(skillAttributeID)) {
			this.addRequirement(attributes[skillAttributeID].value, attributes[levelAttributeID].value);
		}
	};

	Skill.prototype.addRequirement = function(skillID, level) {
		this.requirements[skill.id] = {skillID: skillID, level: level, skill: {}};
	};

	Skill.prototype.addSkillReference = function(skill) {
		this.requirements[skill.id].skill = skill;
	};


	return Skill;
}).

factory("SkillTree", function() {
	var SkillTree = function() {
		this.skills = {};
	};

	SkillTree.prototype.addSkill = function(skill) {
		this.skills[skill.id] = skill;
	};

	SkillTree.prototype.setupTree = function() {
		for (var skillID in this.skills) {
			if (this.skills.hasOwnProperty(skillID)) {

				var currentSkill = this.skills[skillID];
				var currentSkillReqs = currentSkill.requirements;

				for (var i = 0; i < currentSkillReqs.length; i++) {

					if (this.skills.hasOwnProperty(currentSkillReqs[i].skillID)) {
						currentSkill.addSkillReference(this.skills[currentSkillReqs[i].skillID]);
					} else {
						console.log("No skill found for skill requirement for: " + currentSkill.name + "; req skill ID: " + currentSkillReqs[i].skillID);
					}
		
				}
			}
		}
	};

	SkillTree.prototype.loadSkills = function() {

	};

	return SkillTree;
});
angular.module('models.type', ['datastore.attribute', 'api']).

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
}]).

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
angular.module('ui.sidebar.attributes', []).

factory('attributesDisplay', function() {

});
angular.module('ui.treeaccordian', []).

factory('treeaccordian', function() {

	var TreeAccordian = function() {
		this.children = [];
		this.allNodes = {};
		//this.parentlessNodes = {};
	};

	TreeAccordian.prototype.addNode = function(node) {
		//Add to all nodes collection
		this.allNodes[node.id] = node;
	};

	TreeAccordian.prototype.createTree = function() {
		for (var i in this.allNodes) {
			var node = this.allNodes[i];

			if (this.allNodes.hasOwnProperty(i)) {
				var parentID = node.parentID;

				if (parentID === null) {
					this.children.push(node);
				} else if (this.allNodes.hasOwnProperty(parentID)) {
					this.allNodes[parentID].addChild(node);
				} else {
					console.log("No parent, ahh!");
				}
			}
		}
	};

	TreeAccordian.prototype.getNode = function(nodeID) {
		if (this.allNodes.hasOwnProperty(nodeID)) {
			return this.allNodes[nodeID];
		}
		throw new Error("No such node");
	};

	var AccordianNode = function(name, id, parentID, data) {
		this.children = {};
		this.expanded = false;
		this.name = name;
		this.id = id;
		this.parentID = parentID;
		this.nodeData = data;

		this.clickFn = function() {};
		this.hasChildren = false;
		this.active = false;
	};

	AccordianNode.prototype.addChild = function(child) {
		this.children[child.id] = child;
		this.hasChildren = true;
	};

	AccordianNode.prototype.onClick = function(fn) {
		this.clickFn = fn;
	};

	AccordianNode.prototype.click = function() {
		this.expanded = !this.expanded;
		this.active = this.expanded && this.hasChildren;
		this.clickFn(this);
	};

	return {
		TreeAccordian: TreeAccordian,
		AccordianNode: AccordianNode
	};

}).

directive('accordiancontainer', function() {
	return {
		restrict: "E",
		replace: true,
		scope: {
			children: '='
		},
		template: "<ul class='accordian'><node ng-repeat='node in children' node='node'></node></ul>"
	};
}).

directive('node', function($compile) {
	return {
		restrict: "E",
		replace: true,
		scope: {
			node: '='
		},
		template: "<li class='node' ng-click='node.click(); $event.stopPropagation();'><span class='node-name' ng-class='{ haschildren: node.hasChildren, expanded: node.active }' >{{ node.name }}</span></li>",
		link: function (scope, element, attrs) {
			if (Object.keys(scope.node.children).length > 0) {
				element.append("<accordiancontainer ng-class='{ active: node.active }' ng-show='node.expanded' children='node.children'></accordiancontainer>");
			}
			$compile(element.contents())(scope);
		}
	};
});