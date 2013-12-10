/* global describe, it, expect */
define(['fixtures/availabilities', 'resources/avail', 'underscore'], function( fixture, avail, _ ) {
    'use strict';

    var chai = requirejs('chai'),
        should = chai.should();

    describe('the state of the avail resource', function () {
        describe('require works', function () {
            it('completes successfully and has expected data', function () {
                var availability = avail();

                _.size( availability.attr() ).should.be.equal(423);

                availability.attr('2013-12-01').should.have.property('available').be.equal( false );

            });
        });
    });
});
