/* jshint unused: false */
/* global describe, it, expect */
define(['fixtures/availabilities', 'resources/avail', 'underscore'], function( fixture, avail, _ ) {
    'use strict';

    var chai = requirejs('chai'),
        should = chai.should();

    avail( 'A223_ZZ' );

    describe('the state of the avail resource', function () {
        describe('require works', function () {
            it('completes successfully and has expected data', function () {
                var availability = avail();

                _.size( availability.attr() ).should.be.equal(335);

                availability.attr('2014-02-01').should.have.property('available').be.equal( false );

            });
        });
    });
});
