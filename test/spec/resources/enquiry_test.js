/* jshint unused: false */
/* global describe, it, expect */
define([
    'fixtures/enquiries',
    'resources/enquiry',
    'underscore',
    'moment'
], function( fixture, enq, _, moment ) {
    'use strict';

    var chai = requirejs('chai'),
        should = chai.should();

    enq.attr('propRef', 'A223_ZZ');

    describe('the state of the enquiry resource', function () {
        describe('enquire produces correct render array', function () {
            it('completes successfully', function () {
                var date = new Date( 2014, 4, 17),
                    arr = enq.generateCalendarRenderArray(date);

                enq.should.have.property('avail');

                arr.should.have.property('length').be.equal(3);

                expect( arr[0] ).to.be.a('boolean');

                arr[0].should.be.equal(true);

                arr[1].should.be.equal('code-_ changeover');

                enq.attr('fromDate', moment( date ) );
                enq.attr('toDate', moment( new Date( 2014, 4, 18) ));

                arr = enq.generateCalendarRenderArray( date );

                arr[1].should.contain('selected');

            });
        });

        describe('enquiry object reports errors', function () {
            it('should error with bad data', function () {



            });
        });
    });
});
