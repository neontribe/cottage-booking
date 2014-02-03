/* jshint unused: false */
/* global describe, it, expect */
define([
    'fixtures/availabilities',
    'models/availability',
    'models/availability_day',
    'underscore',
    'utils'
], function( fixture, Availability, AvailabilityDay, _, utils ) {
    'use strict';

    var chai = requirejs('chai'),
        should = chai.should(),
        now = utils.now(),
        data = {
            '2014-01-01': {
                'date': now.unix(),
                'available': true,
                'class': 'available bookingStart'
            }
        };

    data = Availability.model( data );

    describe('model: availability', function () {
        describe('collection of availability days', function () {

            it('should be of the correct type', function () {

                data.should.have.property('constructor').be.equal( Availability );

                data.should.have.property('attr').be.equal( Availability.prototype.attr );

                data.attr('2014-01-01').should.have.property('constructor').be.equal( AvailabilityDay );

            });

            it('be able to get an availability day using a date object and string', function () {

                var dateTypeDate = new Date( now.valueOf() ),
                    temp;

                dateTypeDate.should.have.property('constructor').be.equal( Date );

                dateTypeDate.valueOf().should.be.equal( 1388534400000 );

                temp = data.attr( dateTypeDate );
                temp.should.have.property('constructor').be.equal( AvailabilityDay );

                data.attr( now.format('YYYY-MM-DD') ).should.be.equal( temp );

            });
        });
    });
});
