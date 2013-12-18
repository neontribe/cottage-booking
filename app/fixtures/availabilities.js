define(['can/util/string', 'can/util/string/deparam', 'can/util/fixture'], function(can){
    'use strict';
    // TODO: This availability data may be worth randomizing/ only using a fixture if told to
    /* globals location */
    var queryObj = can.deparam( location.search.slice(1) ),
        fixture = !queryObj.noFixture ?
            require.toUrl('fixtures/availabilities/availability_{propRef}.json') :
            'http://localhost/NeonTABS/demosite/property/availability/{propRef}';
    can.fixture({
        'GET property/availability/{propRef}': fixture
    });

});