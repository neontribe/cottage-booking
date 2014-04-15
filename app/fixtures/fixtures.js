define([
    'can/util/string',
    'jquery',
    'can/util/string/deparam',
    'can/util/fixture'
], function( can, $ ) {
    'use strict';

    var slice = Array.prototype.slice,
        queryObj = can.deparam( window.location.search.slice(1) );

    // TODO: if a we want to use fixtures && it 404's, fetch the fixture from the public location and save to disk!
    // EXCITING

    can.fixture.delay = queryObj.delay || can.fixture.delay;

    // Return our helpfully wrapped can, with extra fixture helpers
    return can.extend({

        publicApiRoot: queryObj.local ? 'http://localhost/zz_booking_fix-responses_site/NeonTABS/demosite/' : 'http://public3.neontribe.co.uk/demosite/',
        queryObj:      queryObj,
        useFixtures:   !queryObj.noFixture,

        wrapFixture:   function( fixturePath, jsonPath, pipe, fixtureOverride ) {
            var pathParts = fixturePath.split(' '),
                type = this.useFixtures ? 'GET' : pathParts[0];

            this.fixture( fixturePath, can.proxy(function( options, reply, headers, fullOptions ) {

                var args = slice.call( arguments ),
                    url, ajaxObj;

                if( this.useFixtures ) {
                    url = require.toUrl( jsonPath + ( fixtureOverride || fullOptions.url.replace(/\//g, '-') + '.json' ) );
                } else {
                    url = this.publicApiRoot + fullOptions.url;
                }
                ajaxObj = can.extend({}, fullOptions, {

                    type: type,
                    url: url,
                    // Yay for jsonp
                    //dataType: this.useFixtures ? 'json' : 'jsonp'
                    dataType: 'json'

                });

                if( this.useFixtures ) {
                    delete ajaxObj.data;
                }

                can.fixture.on = false;

                $.ajax( ajaxObj )
                    // I _fucking_ love javascript
                    .pipe(can.isFunction( pipe ) && function() {
                        return pipe.apply( this, slice.call( arguments ).concat( args ) );
                    })
                    .done( reply )
                    .fail( reply );
                
                can.fixture.on = true;
            }, this) );
        }

    }, can);

});