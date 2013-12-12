define([
	'can/util/fixture',
	// Makes console.save available
	'bower_components/devtools-snippets/snippets/console-save/console-save'
], {
	'load': function( name, req, onload, config ) {
		'use strict';

		onload();
	}
});