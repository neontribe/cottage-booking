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

        describe('booking model looks like a Booking model', function () {

            it('should have have the correct properties', function () {

                var booking = new Booking();

                assert.isFunction( Booking, 'The booking constructor is a function' );

                assert.isObject( booking, 'The booking model is correctly an object' );

                expect( booking ).to.be.an.instanceof( Booking );

            });
        });

        describe('booking model validation', function () {

            it('should have validation errors when values are empty', function () {

                var booking = new Booking();

                booking.should.have.property('errors');

                _.toArray( booking.errors() ).should.have.length( 20 );

                booking.errors('customer.name.firstName').should.have.property('customer.name.firstName').to.be.an.instanceof( Array );

            });
            
            it('can save validation', function () {

                var booking = new Booking();

                booking.should.have.property('canSave');

                assert.isNull( booking.canSave(), 'empty booking can be saved' );

                booking.attr('customer.email', 'notanemail.com');

                booking.attr('customer.email').should.be.equal( 'notanemail.com' );

                assert.isNotNull( booking.canSave(), 'because our email is invalid we cannot save any more' );

                booking.canSave().should.have.property('customer.email');

                booking.attr('customer.email', 'valid@email.com');

                expect( booking.canSave() ).be.equal( null );

                _.each(['daytimePhone', 'eveningPhone', 'mobilePhone'], function( item ) {
                    booking.attr('customer.' + item, 111);

                    expect( booking.canSave() ).not.be.equal( null );

                    assert( _.size( booking.canSave() ) === 1, 'we expect to have an error just for customer.' + item );

                    booking.canSave().should.have.property('customer.' + item);

                    booking.attr('customer.' + item, 1111111111111);

                    assert( booking.canSave() === null, 'after setting customer.' + item + ' to a valid number we no longer have errors');
                });

            });
        });

        ////// TODO:
        describe('sub models', function () {

            var booking = new Booking({
                bookingId: 'full',
                price: {}
            });

            it('price maintains paymentType between submissions', function ( done ) {

                booking.attr('price').should.be.an.instanceof( require('models/price') );

                booking.attr('price.paymentType', 'deposit');

                booking.attr('price.paymentType').should.be.not.equal( undefined );

                booking.save().done(function() {
                    assert.isDefined( booking.attr('price.paymentType'), 'we should have a value here' );
                    assert.strictEqual( booking.attr('price.paymentType'), 'deposit', 'should be deposit' );
                    done();
                });

            });
        });
    });
});
