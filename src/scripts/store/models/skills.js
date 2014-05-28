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