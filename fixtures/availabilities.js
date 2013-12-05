define(['can/util/string', 'can/util/fixture'], function(can){
    'use strict';
    // TODO: This availability data may be worth randomizing/ only using a fixture if told to
can.fixture.delay = 50000;
    can.fixture({
        'GET tabs_property/{propref}/availability': require.toUrl('fixtures/availability.json')
    });

});