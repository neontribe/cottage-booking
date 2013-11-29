/**
 * This AMD module will return the template render map
 */
define([
	'ejs!./views/init'
], function() {
	'use strict';
	return {
		'init': arguments[0]
	};
});