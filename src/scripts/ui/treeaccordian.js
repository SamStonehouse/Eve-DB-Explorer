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
		template: "<li ng-click='node.click(); $event.stopPropagation();'><span class='node-name' ng-class='{ haschildren: node.hasChildren, expanded: node.expanded }' >{{ node.name }}</span></li>",
		link: function (scope, element, attrs) {
			if (Object.keys(scope.node.children).length > 0) {
				element.append("<accordiancontainer ng-class='{ active: node.expanded }' ng-show='node.expanded' children='node.children'></accordiancontainer>");
			}
			$compile(element.contents())(scope);
		}
	};
});