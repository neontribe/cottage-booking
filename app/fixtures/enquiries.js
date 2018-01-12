define(['fixtures/fixtures', 'moment'], function(can, moment){
    'use strict';

    can.wrapFixture('POST property/enquiry', 'fixtures/enquiries/', function( data, status, def, originalAjax ) {

        if( can.useFixtures ) {

            var fromDate = moment( originalAjax.data.fromDate, 'YYYY-MM-DD' );

            if( (fromDate.get('M') + 1) % 2 === 0 ) {
                // This is a little clunky, TODO: investigate integrating this behaviour into the fixtures/fixtures file
                can.$.ajax({
                    url: require.toUrl('fixtures/enquiries/property-enquiry_error.json'),
                    async: false,
                    success: function( errorData ) {
                        data = errorData;
                    }
                });
            }

        }

        return data;
    });

    return can.fixture;

});
