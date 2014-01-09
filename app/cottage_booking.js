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
    'can/control/route',
    'jqueryui/jquery.ui.tabs'
], function(can, views,enquiry, book, stages ) {
    'use strict';

    // TODO:Move this to a better place
    can.$.datepicker.setDefaults({
        dateFormat: 'dd/mm/yy',
        firstDay: 1
    });

    var init = false,
        BookingPath;
    /* -==== router and main controller ====- */
    BookingPath = can.Control({
        pluginName: 'bookingPath',

        defaults: {
            enquiry: enquiry,
            book: book,
            stages: stages,
            route: can.route
        }

    }, {
        init: function() {
            this.options.enquiry.attr( 'propRef', this.options.propRef );

            this.element.addClass('booking-path');

            this.element.html( views.init({
                control: this,
                tabsOptions: {
                    beforeActivate: function() {
                        debugger;
                    }
                }
            }) );

            can.route(':page/:booking');

            can.route.ready();
        },

        changeStage: function( newStage, oldPage ) {
            var chosenStage = this.options.stages.attr( newStage ) || this.options.stages.attr('calendar');

            if( chosenStage.content && chosenStage.Control ) {

            }

            if( oldPage ) {

            }
        },

        // Empty route
        'route': function() {
            can.route.attr('page', 'calendar');
        },

        // We only have a page on the hash-bang, _usually_ only happens when we don't have a booking
        // ':page route': function( routeData ) {
        //     this.changeStage( routeData.page );
        // },

        '{route} page': function( route, evt, newPage, oldPage ) {
            this.changeStage( newPage, oldPage );
        },

        '{route} booking': function( route, evt, newId, oldId ) {
            if( newId ) {

                if( this.options.book.attr('bookingId') !== newId ) {
                    this.options.book.fetchBooking( newId ).fail(function() {
                        // We assume all failures are due to booking not found
                        can.route.removeAttr('booking');
                    });
                }

                // if this is a newly created booking, auto advance
                if( !oldId ) {
                    can.route.attr('page', 'details');
                }

            } else {
                this.options.book.reset();
                can.route.removeAttr('booking');
            }
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