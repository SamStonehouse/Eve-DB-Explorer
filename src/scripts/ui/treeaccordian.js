angular.module('ui.treeaccordian', []).

factory('treeaccordian', function() {

	var TreeAccordian = function() {
		this.children = [];
		this.allNodes = {};
		this.parentlessNodes = {};
	};

	TreeAccordian.prototype.addNode = function(node) {
		//Add to all nodes collection
		this.allNodes[node.id] = node;

		if (node.parentID === null) {
			this.children.push(node);
		}

		//Check the parent is already in the tree
		if (this.allNodes.hasOwnProperty(node.parentID)) {

			//The parent is already in the tree, just add it
			this.allNodes[node.parentID].addChild(node);

		} else {

			//The parent is not already in the tree
			if (!this.parentlessNodes.hasOwnProperty(node.parentID)) {
				this.parentlessNodes[node.parentID] = [];
			}

			this.parentlessNodes[node.parentID].push(node);
		}

		//Check there aren't parentless nodes waiting for this node
		if (this.parentlessNodes.hasOwnProperty(node.id)) {
			for (var i = 0; i < this.parentlessNodes[node.id]; i++) {
				node.addChild(this.parentlessNodes[node.parentID]);
			}

			delete this.parentlessNodes[node.id];
		}
	};

	TreeAccordian.prototype.getNode = function(nodeID) {
		console.log("All Nodes:");
		console.dir(this.allNodes);
		console.log("Children");
		console.dir(this.children);
		console.log("This");
		console.dir(this);

		if (this.allNodes.hasOwnProperty(nodeID)) {
			return this.allNodes[nodeID];
		}
		throw new Error("No such node");
	};

	var AccordianNode = function(name, id, parentID) {
		this.children = {};
		this.expanded = false;
		this.name = name;
		this.id = id.toString();
		this.parentID = parentID;
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
		this.clickFn(this.children);
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