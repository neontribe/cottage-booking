/**
 * This AMD module will return the template render map
 * Questioning the usefulness of such a pattern
 */
define([
	'ejs!./views/init'
], function() {
	'use strict';
	return {
		'init': arguments[0]
	};
});