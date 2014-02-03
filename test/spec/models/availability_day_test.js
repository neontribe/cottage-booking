/* jshint unused: false */
/* global describe, it, expect */
define(['fixtures/availabilities', 'models/availability_day', 'underscore', 'utils'], function( fixture, AvailabilityDay, _, utils ) {
    'use strict';

    var chai = requirejs('chai'),
        should = chai.should(),
        now = utils.now().unix(),
        day = AvailabilityDay.model({
            'date': now,
            'class': 'code_a bookingStart'
        }),
        nextDay = AvailabilityDay.model({
            'date': utils.now().add('1D').unix(),
            'class': 'available code_b bookingEnd'
        });

    describe('model: availability day', function () {
        describe('calculate bookingStart', function () {
            it('should calculate using the classes passed to it from the object', function () {

                day.attr('bookingStart').should.be.equal( true );

                nextDay.attr('bookingStart').should.be.equal( false );

            });
        });
    });
});
