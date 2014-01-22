define([
    'can/util/string',
    'jquery',
    'can/util/string/deparam',
    'can/util/fixture'
], function( can, $ ) {
    'use strict';

    var queryObj = can.deparam( window.location.search.slice(1) );

    // TODO: if a we want to use fixtures && it 404's, fetch the fixture from the public location and save to disk!
    // EXCITING

    // Return our helpfully wrapped can, with extra fixture helpers
    return can.extend({

        publicApiRoot: 'http://public2.neontribe.co.uk/NeonTABS/demosite/',
        queryObj:      queryObj,
        useFixtures:   !queryObj.noFixture,

        wrapFixture:   function( fixturePath, jsonPath, pipe ) {
            var pathParts = fixturePath.split(' '),
                type = this.useFixtures ? 'GET' : pathParts[0];

            this.fixture( fixturePath, can.proxy(function( options, reply, headers, fullOptions ) {

                var url, ajaxObj;

                if( this.useFixtures ) {
                    url = require.toUrl( jsonPath + fullOptions.url.replace(/\//g, '-') + '.json' );
                } else {
                    url = this.publicApiRoot + fullOptions.url;
                }
                ajaxObj = can.extend({}, options, {

                    type: type,
                    url: url,
                    // Yay for jsonp
                    dataType: this.useFixtures ? 'json' : 'jsonp'

                });

                if( this.useFixtures ) {
                    delete ajaxObj.data;
                }

                can.fixture.on = false;

                $.ajax( ajaxObj )
                    .pipe( pipe )
                    .always( reply );
                
                can.fixture.on = true;
            }, this) );
        }

    }, can);

});