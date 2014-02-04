/* jshint unused: false */
/* global describe, it, expect */
define([
    'fixtures/bookings',
    'models/booking',
    'underscore',
    'utils'
], function( fixture, Booking, _, utils ) {
    'use strict';

    var chai = requirejs('chai'),
        should = chai.should();

    describe('model: booking', function () {
        describe('booking model validation', function () {

            it('should have validation errors when values are empty', function () {

                var booking = new Booking();

                assert.isFunction( Booking, 'The booking constructor is a function' );

                assert.isObject( booking, 'The booking model is correctly an object' );

                expect( booking ).to.be.an.instanceof( Booking );

            });
        });
    });
});
