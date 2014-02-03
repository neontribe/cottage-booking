define(['jquery', 'utilities/utils', 'moment'], function(  $, oldUtils, moment ) {

	return $.extend( oldUtils, {
		now: function() {
            return moment( '01-01-2014', 'DD-MM-YYYY' );
        }
	});

});