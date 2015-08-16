/*
	@license Angular Treeview version 0.1.6
	ⓒ 2013 AHN JAE-HA http://github.com/eu81273/angular.treeview
	License: MIT


	[TREE attribute]
	angular-treeview: the treeview directive
	tree-id : each tree's unique id.
	tree-model : the tree model on $scope.
	node-id : each node's id
	node-label : each node's label
	node-children: each node's children

	<div
		data-angular-treeview="true"
		data-tree-id="tree"
		data-tree-model="roleList"
		data-node-id="roleId"
		data-node-label="roleName"
		data-node-children="children" >
	</div>
*/

(function ( angular ) {
	'use strict';

	angular.module( 'angularTreeview', [] ).directive( 'treeModel', ['$compile', function( $compile ) {
		return {
			restrict: 'A',
			link: function ( scope, element, attrs ) {
				//tree id
				var treeId = attrs.treeId;

				//tree model
				var treeModel = attrs.treeModel;

				//node id
				var nodeId = attrs.nodeId || 'id';

				//node label
				var nodeLabel = attrs.nodeLabel || 'label';

				//children
				var nodeChildren = attrs.nodeChildren || 'children';

				var collapsibility = true;
				if (attrs.collapsibility && attrs.collapsibility === 'false') {
					collapsibility = false;
				}

				//check tree id, tree model
				if( treeId && treeModel ) {

					//root node
					if( attrs.angularTreeview ) {

						//create tree object if not exists
						scope[treeId] = scope[treeId] || {};

						scope[treeId].collapsibility = collapsibility;

						//if node head clicks,
						scope[treeId].selectNodeHead = scope[treeId].selectNodeHead || function( selectedNode ){

							//Collapse or Expand
							console.log(scope[treeId].collapsibility);
							if (scope[treeId].collapsibility) {
								selectedNode.collapsed = !selectedNode.collapsed;
							}
						};

						//if node label clicks,
						scope[treeId].selectNodeLabel = scope[treeId].selectNodeLabel || function( selectedNode ){

							//remove highlight from previous node
							if( scope[treeId].currentNode && scope[treeId].currentNode.selected ) {
								scope[treeId].currentNode.selected = undefined;
							}

							//set highlight to selected node
							selectedNode.selected = 'selected';

							//set currentNode
							scope[treeId].currentNode = selectedNode;
						};
					}

					//tree template
					var defaultNodeTemplate = '<i class="collapsed" data-ng-show="node.' + nodeChildren + '.length && node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
						'<i class="expanded" data-ng-show="node.' + nodeChildren + '.length && !node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
						'<i class="normal" data-ng-hide="node.' + nodeChildren + '.length"></i> ' +
						'<span data-ng-class="node.selected" data-ng-click="' + treeId + '.selectNodeLabel(node)">{{node.' + nodeLabel + '}}</span>';
					var template =
						'<ul>' +
							'<li data-ng-repeat="node in ' + treeModel + '">';
					//root node
					console.log(element.find("root"));
					console.log(element.find("node"));
					var rootElement = element.find("root")[0];
					var rootNodeTemplate = rootElement ? rootElement.innerHTML.trim().replace(/\n/g, "") : undefined;
					var nodeElement = element.find("node")[0];
					var nodeTemplate = nodeElement ? nodeElement.innerHTML.trim().replace(/\n/g, "") : undefined;
					if( attrs.angularTreeview ) {
						if (rootNodeTemplate) {
							template += rootNodeTemplate;
						} else {
							template += defaultNodeTemplate;
						}
					} else {
						if (nodeTemplate) {
							template += nodeTemplate;
						} else {
							template += defaultNodeTemplate;
						}
					}
					template += '<div data-ng-hide="node.collapsed" data-tree-id="' + treeId +
									'" data-tree-model="node.' + nodeChildren +
									'" data-node-id=' + nodeId +
									' data-node-label=' + nodeLabel +
									' data-node-children=' + nodeChildren + '>';
					if (rootNodeTemplate) {
						template += '<root>' + rootNodeTemplate + '</root>';
					}
					if (nodeTemplate) {
						template += '<node>' + nodeTemplate + '</node>';
					}
					template += '</div>' +
							'</li>' +
						'</ul>';

					//Rendering template.
					element.html('').append( $compile( template )( scope ) );
				}
			}
		};
	}]);
})( angular );
