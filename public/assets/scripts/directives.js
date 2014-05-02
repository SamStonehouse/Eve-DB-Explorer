var app = angular.module('app');

app.directive('accordian', function() {
	return {
		restrict: "E",
		replace: true,
		scope: {
			items: '=',
			depth: '='
		},
		template: "<ul class='accordian'><accordianrow depth='depth' class='depth-{{ depth }}' ng-repeat='child in items' member='child'> {{ items }} </accordianrow></ul>"
	};
});

app.directive('accordianrow', function($compile) {
	return {
		restrict: "E",
		replace: true,
		scope: {
			member: '=',
			depth: '='
		},
		template: "<li ng-click='member.click(); $event.stopPropagation();'  class='depth-{{ depth }}'  ><span class='row-content depth-{{ depth }}'>{{ member.name }}</span></li>",
		link: function (scope, element, attrs) {
			if (angular.isArray(scope.member.children)) {
				element.append("<accordian depth='depth + 1' ng-class='{ active: member.visible }' ng-repeat='subacc in member.children' ng-show='member.visible' items='subacc'></accordian>");
			}
			$compile(element.contents())(scope);
		}
	};
});