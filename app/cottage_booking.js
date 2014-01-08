define([
    'can/util/string',
    './views',
    'resources/enquiry',
    'resources/book',
    'resources/stages',
    // All the rest
    'controls/calculator/calculator',
    'can/control',
    'can/control/plugin',
    'can/control/route'
], function(can, views,enquiry, book, stages ) {
    'use strict';

    var init = false,
        BookingPath;
    /* -==== router and main controller ====- */
    BookingPath = can.Control({
        pluginName: 'booking',

        defaults: {
            enquiry: enquiry,
            book: book,
            stages: stages
        }

    }, {

        init: function() {
            this.options.enquiry.attr( 'propRef', this.options.propRef );

            this.element.html( views.init({
                control: this
            }) );

            //
            this.options.stages.each(function( stage, stageName ) {
                // We expect the content to be set as part of the render of the init template
                this.content.append(views.stage({
                    stage: stage,
                    name: stageName
                }));
            }, this);

            can.route.ready();
        },

        changeStage: function( newStage ) {
            var chosenStage = this.options.stages.attr( newStage ) || this.options.stages.attr('details');


        },

        // Empty route
        'route': function() {
            can.route.attr('page', 'details');
        },

        // We only have a page on the hash-bang, _usually_ only happens when we don't have a booking
        ':page route': function( routeData ) {
            this.changeStage( routeData.page );
        },

        '{can.route} booking': function( routeAttr ) {
            var id = routeAttr.booking;

            if( id ) {

                if( this.options.book.attr('bookingId') !== id ) {
                    this.options.book.fetchBooking( id ).fail(function() {
                        // We assume all failures are due to booking not found
                        can.route.removeAttr('booking');
                    });

                    can.route.attr('page', 'details');
                }

            } else {
                this.options.book.reset();
            }

        },

        ':page/:booking route': function( routeAttr ) {

        },

        '{book} bookingId': function( obj, evt, newVal ) {
            can.route.attr('booking', newVal);
        },

        /**
         * This function exposes an api to modify the settings
         * attached to this top level controller, importantly it is possible
         * to make changes to the settings used to launch each of the components
         * @param  {Object} settingsObj The object to change the settings
         * @return {undefined}
         */
        'setOptions': function( settingsObj ) {
            can.each( settingsObj, function( value, key ) {
                if( this.options[key] ) {
                    if( this.options[key].attr ) {
                        this.options[key].attr( value );
                    } else {
                        can.extend( true, this.options[key], value );
                    }
                } else {
                    this.options[key] = value;
                }
            }, this);
        }
    });

    // Initialise app on the cottage-booking element
    // Plugin initialization
    can.$('[data-bplugin]').each(function() {
        var $this = can.$( this ),
            plugin = $this.data('bplugin');

        init = $this[ plugin ];

        if( init ) {
            init.call( $this, $this.data() );
        }
    });

    if( !init ) {
        // TODO: investigate a different approach
        // So the user can execute the plugins manually if they want
        // Or maybe just show a warning ( if ( !init && console.warn ) ...)
        throw new Error('This App expected markup that wasn\'t found!');
    }

    // Return the booking path to match amd format
    return BookingPath;
});