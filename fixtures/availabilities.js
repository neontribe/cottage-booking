define(['can/util/string', 'can/util/fixture'], function(can){
    'use strict';
    // TODO: This availability data may be worth randomizing/ only using a fixture if told to

    can.fixture({
        'GET tabs_property/{propRef}/availability': require.toUrl('fixtures/availabilities/availability_{propRef}.json')
    });

});