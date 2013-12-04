define(['can/util/string', 'can/util/fixture'], function(can){
    'use strict';
    // TODO: This availability data may be worth randomizing/ only using a fixture if told to

    var $ = can.$,
        avails;

    $.ajax({
        url: require.toUrl('fixtures/availability.json'),
        async: false
    }).done(function( data ) {
        avails = data;
    });

    var store = can.fixture.store( avails );

    can.fixture({
        'GET tabs_property/{propref}/availability': require.toUrl('fixtures/availability.json')
    });

    return store;

});