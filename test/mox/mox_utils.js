define(['jquery', 'utilities/utils', 'moment'], function(  $, oldUtils, moment ) {
	var warn = true;
	return $.extend( oldUtils, {
		now: function() {
			warn && console && console.warn && console.warn('Using Mox\'d version of now()' + (warn=false?'':''));
            return moment( '01-01-2014', 'DD-MM-YYYY' );
        }
	});

});