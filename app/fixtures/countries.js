define(['can/util/string', 'can/util/string/deparam', 'can/util/fixture'], function(can){
    'use strict';
    /* globals location */
    var queryObj = can.deparam( location.search.slice(1) ),
        fixture = !queryObj.noFixture ?
            require.toUrl('fixtures/countries/countries.json') :
            'http://localhost/NeonTABS/demosite/property/country';
    can.fixture({
        'GET property/country': fixture
    });

});