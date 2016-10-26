/* jshint unused: false */
/* global describe, it, expect */
define(['fixtures/availabilities', 'resources/avail', 'underscore'], function( fixture, avail, _ ) {
    'use strict';

    var chai = requirejs('chai'),
        should = chai.should();

    avail( 'MERLIN_BR' );

    describe('resource: the state of the avail resource', function () {
        describe('require works', function () {
            it('completes successfully and has expected data', function () {
                var availability = avail();

                _.size( availability.attr() ).should.be.equal(458);

                availability.attr('2016-10-01').should.have.property('available').be.equal( false );

            });
        });
    });
});
