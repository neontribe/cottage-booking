/* jshint unused: false */
/* global describe, it, expect */
define([
    'fixtures/availabilities',
    'models/availability',
    'models/availability_day',
    'underscore',
    'utils',
    'moment'
], function( fixture, Availability, AvailabilityDay, _, utils, moment ) {
    'use strict';

    var chai = requirejs('chai'),
        should = chai.should(),
        // In our mox utils .now() returns a moment object 01/01/2014
        now = utils.now(),
        availabilityList = {
            '2013-12-29': {
                'date': now.subtract(2, 'day').unix(),
                'available': false,
                'class': 'available bookingStart'
            },
            '2013-12-30': {
                'date': now.subtract(1, 'day').unix(),
                'available': false,
                'class': 'available bookingStart'
            },
            '2014-01-01': {
                'date': now.unix(),
                'available': true,
                'class': 'available bookingStart'
            },
            '2014-01-02': {
                'date': now.add(1, 'day').unix(),
                'available': true,
                'class': 'available bookingStart'
            },
            '2014-01-03': {
                'date': now.add(2, 'day').unix(),
                'available': true,
                'class': 'available bookingStart'
            }
        };

    availabilityList = Availability.model( availabilityList );

    describe('model: availability', function () {
        describe('collection of availability days', function () {

            it('should be of the correct type', function () {

                availabilityList.should.have.property('constructor').be.equal( Availability );

                availabilityList.should.have.property('attr').be.equal( Availability.prototype.attr );

                availabilityList.attr('2014-01-01').should.have.property('constructor').be.equal( AvailabilityDay );

            });

            it('be able to get an availability day using a date object and string', function () {

                var dateTypeDate = new Date( now.valueOf() ),
                    temp;

                dateTypeDate.should.have.property('constructor').be.equal( Date );

                dateTypeDate.valueOf().should.be.equal( 1388534400000 );

                temp = availabilityList.attr( dateTypeDate );
                temp.should.have.property('constructor').be.equal( AvailabilityDay );

                availabilityList.attr( now.format('YYYY-MM-DD') ).should.be.equal( temp );

            });

            it('correctly returns the first available date in a list', function () {

                var date = availabilityList.attr('firstAvailableDate');

                date.should.have.property('format').be.equal( moment().format );

                date.format('YYYYMMDD').should.be.equal('20140101');
                
                availabilityList.attr( date._d ).should.have.property('attr').be.equal( AvailabilityDay.prototype.attr );

                availabilityList.attr( date._d ).attr('available').should.be.equal( true );

            });
        });
    });
});
