define([
    'can/util/string',
    './views',
    'resources/enquiry',
    'resources/book',
    'resources/stages',
    'utils',
    'underscore',
    // All the rest
    'controls/calculator/calculator',
    'can/control',
    'can/control/plugin',
    'can/control/route',
    'jqueryui/jquery.ui.tabs'
], function(can, views, enquiry, book, stages, utils, _ ) {
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
                'checkerFn': function() {
                    // This function is executed before each click reaches the url
                    // If we are not disabled, allow the change to happen
                    if( !this.parent().is('[aria-disabled="true"]') ) {
                        return true;
                    }
                }
            }) );

            // We expect this.content to be set as part of the render, TODO: is this too fragile?
            // This _can't_ happen in the template as the fragment hasn't entered the dom yet
            this.content.tabs({
                'show': {
                    'effect': 'blind',
                    'duration': 500
                },
                'hide': {
                    'effect': 'blind',
                    'duration': 500
                },
                'beforeActivate': utils.bindWithThis( this.beforeActivate, this ),
                'disabled': _.range( this.options.stages.length ).slice(1),
                // set the event to empty string, so that we don't change tab on click,
                // So everything gets routed through the url bar
                'event': ''
            });

            /** init the route */
            can.route(':page');
            can.route(':page/:booking');
            can.route.ready();
        },

        // Need to think about initial state, no tabs have been activated
        // So this needs to happen once by itself
        beforeActivate: function() {

        },

        changeStage: function( newStage, oldPage ) {
            var index = this.options.stages.indexOf( newStage ),
                chosenStage = this.options.stages.attr( index ),
                disabled = can.inArray(index, this.content.tabs('option', 'disabled')) > -1;

            if( index > -1 && !disabled ) {
                this.content.tabs('option', {
                    active: index
                });

            } else {
                // just navigate somewhere safe
                can.route.attr( 'page', 'calendar' );
            }
        },

        // Empty route
        'route': function() {
            can.route.attr('page', 'calendar');
        },

        '{route} page': function( route, evt, newPage, oldPage ) {
            // Before we change route check if we need to disable stuff
            if( !route.attr('booking') ) {
                this.content.tabs('option', {
                    'disabled': _.range( this.options.stages.length ).slice(1)
                });
            }

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
            }
        },

        '{book} bookingId': function( obj, evt, newVal ) {
            if( newVal ) {
                can.route.attr('booking', newVal);
            } else {
                can.route.removeAttr('booking');
            }
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