var app = angular.module('ExplorerApp', ['ui.treeaccordian', 'collections.marketgroups', 'collections.types', 'collections.marketgrouptypes']);

app.controller('marketGroupController',	['$scope', 'MarketGroups', 'Types', 'MarketGroupTypes', 'treeaccordian', function($scope, marketGroups, types, marketGroupTypes, treeaccordian) {
	var marketGroupAccordian = new treeaccordian.TreeAccordian();

	$scope.data = {};
	$scope.data.activeMarketGroupTypes = [];

	$scope.data.activeType = {};

	var nodeSelect = function(node) {
		if (node.nodeData.hasTypes) {
			marketGroupTypes.getMarketGroupTypesByIDs(node.id, function(currentTypes) {
				$scope.data.activeMarketGroupTypes = currentTypes;
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
		types.getTypeByID(typeID, function(type) {
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
angular.module('api.utilities', []).

factory("apiUtilities", ['$http', function($http) {
	
	var baseURL = "http://localhost:8080";

	var jsonpExtension = "callback=JSON_CALLBACK";

	var callApi = function(url, cb) {
		var responsePromise = $http.jsonp(baseURL + url + '?' + jsonpExtension);

		responsePromise.success(function(result) {
			if (result && result.error) {
				throw new Error(result.error.message);
			}
			
			cb(result.result);
		});

		responsePromise.error(function(result) {
			throw new Error("Unknown AJAX error");
		});
	};

	return {
		baseURL: baseURL,
		callApi: callApi
	};
}]);
angular.module('api.marketgroups', ['api.utilities']).

factory('marketGroupApi', ['apiUtilities', function(apiUtilities) {
	return {
		getMarketGroups: function(cb) {
			apiUtilities.callApi("/api/inv/marketgroups", cb);
		},
		getParentMarketGroups: function() {
			apiUtilities.callApi("http://localhost:8080/api/inv/marketgroups/parent/null", cb);
		},
		getTypesByMarketGroupID: function(mgID, cb) {
			apiUtilities.callApi("/api/inv/types/marketgroup/" + mgID, cb);
		},
		getMarketGroupByID: function(mgID, cb) {
			apiUtilities.callApi("http://localhost:8080/api/inv/marketgroups/" + mgID, cb);
		}
	};
}]);
angular.module('api.typeApi', ['api.utilities']).

factory('typeApi', ['apiUtilities', function(apiUtilities) {

	return {
		getTypeByID: function(typeID, cb) {
			apiUtilities.callApi("/api/inv/types/full/" + typeID, cb);

		}
	};

}]);
angular.module('collections.marketgroups', ['api.marketgroups', 'models.marketgroup']).

factory("MarketGroups", ["marketGroupApi", "MarketGroup", function(marketGroupApi, MarketGroup) {

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
			marketGroupApi.getMarketGroupByID(marketGroupID, function(result) {
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
			marketGroupApi.getMarketGroups(function(result) {
				for (var i = 0; i < result.length; i++) {
					self.setMarketGroupByID(new MarketGroup(result[i]));
				}
				self.marketGroupsLoaded = true;
				cb(self.marketGroupsByID);
			});
		}
	};

	return new MarketGroups();
}]);
angular.module('collections.marketgrouptypes', ["api.marketgroups"]).

factory("MarketGroupTypes", ["marketGroupApi", "MarketGroupType", function(marketGroupApi, MarketGroupType) {
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
			marketGroupApi.getTypesByMarketGroupID(marketGroupID, function(result) {
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

	return new MarketGroupTypes();
}]);
angular.module('collections.types', ['api.typeApi', 'models.type']).

factory("Types", ["Type", "typeApi", function(Type, typeApi) {
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
			typeApi.getTypeByID(typeID, function(result) {
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
				this.setTypeByID(groupTypes[gp].id, new Type(groupTypes[gp]))	;
				typesInGroup[groupID] .push();
			}
		}
	};

	return new Types();
}]).

factory("Skills", function() {

});
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
angular.module('models.marketgroup', []).

factory("MarketGroup", function() {
	var MarketGroup = function(mgdata) {
		this.id = mgdata.marketGroupID;
		this.name = mgdata.marketGroupName;
		this.parentID = mgdata.parentGroupID;
		this.hasTypes = mgdata.hasTypes;
	};

	return MarketGroup;
}).


factory("MarketGroupType", function() {
	var MarketGroupType = function(mgtdata) {
		this.id = mgtdata.typeID;
		this.name = mgtdata.typeName;
	};

	return MarketGroupType;
});



// var loadByID = function(refObj, APIFn) {


// 	return function(IDs, cb) {

// 		//If IDs is array, join with comma

// 		if (this.marketGroupsByID.hasOwnProperty(marketGroupID)) {
// 			console.log("Already stored this marketgroup");
// 			//Check it's not an invalid ID which has already been loaded
// 			if (this.marketGroupsByID[marketGroupID] === false) {
// 				throw new Error("No such marketGroup");
// 			}

// 			cb(this.marketGroupsByID[marketGroupID]);
// 		} else {
// 			//Attempt to load through API
// 			MarketGroupApi.getMarketGroupByID(marketGroupID, function(result) {
// 				if (result.length === 0) {
// 					marketGroupsByID[marketGroupID] = false;
// 					throw new Error("No such marketGroup");
// 				} else {
// 					console.log("Market Group loaded succesfully");
// 					marketGroupsByID[marketGroupID] = result[0];
// 					cb(result[0]);
// 				}
// 			});
// 		}
// 	};
// };
angular.module('models.skill', []).

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