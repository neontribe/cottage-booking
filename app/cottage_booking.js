define([
    'can/util/string',
    './views',
    'resources/enquiry',
    'resources/book',
    'resources/stages',
    'utils',
    // All the rest
    'controls/calculator/calculator',
    'can/control',
    'can/control/plugin',
    'can/control/route',
    'jqueryui/jquery.ui.tabs'
], function( can, views, enquiry, book, stages, utils ) {
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
            var index;

            can.route(':page');
            can.route(':page/:booking');

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

            index = this.options.stages.indexOf( can.route.attr('page') );

            // TODO: implement an accordion equivalent
            // We expect this.content to be set as part of the render, TODO: is this too fragile?
            // This _can't_ happen in the template as the fragment hasn't entered the dom yet
            this.content.tabs({
                // 'show': {
                //     'effect': 'blind',
                //     'duration': 500
                // },
                // 'hide': {
                //     'effect': 'blind',
                //     'duration': 500
                // },

                // Bind to these events so we do stuff on tab changes
                'create': utils.bindWithThis( this.beforeActivate, this ),
                'beforeActivate': utils.bindWithThis( this.beforeActivate, this ),
                'activate': utils.bindWithThis( this.activate, this ),
                // Set the rest of the tabs to disabled by default
                'disabled': this.disabledArray(),
                // set the event to empty string, so that we don't change tab on click,
                // So everything gets routed through the url bar
                'event': '',
                'active': index
            });

            /** init the route */
            can.route.ready();
        },

        // Whenever the booking object changes, check for errors and
        // Enable/disable stages
        '{book} change': (function() {
            var lastBatchNum = null;
            return function( model, evt ) {
                // Check we haven't already done this
                if( lastBatchNum !== evt.batchNum ) {

                    this.content.tabs( 'option', 'disabled', this.disabledArray() );

                    //Finally assign the batch num
                    lastBatchNum = evt.batchNum;

                }
            };
        })(),

        /**
         * Build array of stages to disable
         * @return {Array} The Array of tabs to disable (e.g. [1, 2, 3])
         */
        'disabledArray': function() {
            var disabled = [],
                hash = window.location.hash ? window.location.hash.split('#!')[1] : '',
                // Because the route could be unready at this point, we need to extract
                // data from the url ourselves... TODO: investigate alternative
                current = can.route.deparam( hash );

            if( !current.booking && !this.options.book.attr('bookingId') ) {
                disabled.push( 1 );
            }

            if( true ) {
                disabled.push( 2 );
            }

            if( true ) {
                disabled.push( 3 );
            }

            return disabled;
        },

        'getStageFor': function( $el ) {
            var index = $el.index(), // Get the index in the dom of this element
                stage = this.options.stages.attr( index );
            return stage;
        },

        /**
         * This function is executed before we start changing to a tab
         * so lets initialize the new tab
         *
         * This function can also be executed on the creation of the tabs
         *
         * @param  {HTMLElement} el  The tab element
         * @param  {Event} evt       The jquery event
         * @param  {Object} tabState The object containing the state of the tabs
         * @return {undefined}
         */
        'beforeActivate': function( el, evt, tabState ) {
            var $newContent = tabState.newPanel || tabState.panel,
                stage = this.getStageFor( $newContent ),
                Control = stage ? stage.attr('Control') : null;

            if( Control && !stage.attr('activeControl') ) {
                stage.attr('control', new Control( $newContent, stage.attr('options') ));
            }

        },

        /**
         * This function is executed when the tabs have finished changing to a tab
         * so we should tidy up after ourselves
         *
         * This should happen when animation finishes
         *
         * @param  {HTMLElement} el  The tab element
         * @param  {Event} evt       The jquery event
         * @param  {Object} tabState The object containing the state of the tabs
         * @return {undefined}
         */
        'activate': function( el, evt, tabState ) {
            var $old = tabState.oldPanel,
                oldStage = this.getStageFor( $old ),
                oldControl = $old.control();
                // oldControlls = $old.controls();

            // for( var i = 0; i < oldControlls.length; i++ ) {
            //     oldControlls[i].destroy();
            // }

            oldStage.attr( 'activeControl', oldControl );

        },

        changeStage: function( newStage/*, oldPage*/ ) {
            var index = this.options.stages.indexOf( newStage ),
                disabled = can.inArray(index, this.content.tabs('option', 'disabled')) > -1;

            if( index > -1 ) {

                if( !disabled ) {

                    this.content.tabs('option', {
                        active: index
                    });

                }

            } else {
                // just navigate somewhere safe
                //can.route.attr( 'page', oldPage );
            }
        },

        // Empty route
        'route': function( routeObj ) {
            if( !routeObj.page ) {
                this.changeStage( 'calendar' );
            }
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
                    //can.route.attr('page', 'details');
                }

            } else {
                // Just clear booking id, so details don't need to be re-entered
                this.options.book.removeAttr('bookingId');
                //this.options.book.reset();
            }
        },

        '{book} bookingId': function( obj, evt, newVal ) {
            if( newVal ) {
                if( newVal !== can.route.attr('bookg') ) {
                    can.route.attr('booking', newVal);
                }
            } else {
                can.route.removeAttr('booking');
            }
        },

        '{route} page': function( route, evt, newPage, oldPage ) {
            this.changeStage( newPage, oldPage );
        },

        '{stages} 1.options': function( stages, evt, attr, type ) {
            console.log();
        },

        /**
         * This function exposes an api to modify the settings
         * attached to this top level controller, importantly it is possible
         * to make changes to the settings used to launch each of the components
         * @param  {Object} options The object to change the settings
         * @return {undefined}
         */
        'update': function( options ) {
            can.each( options, function( value, key ) {

                if( key === 'stages' ) {

                    can.each( value, function( settings, id ) {
                        var stage = this.options.stages.getById( id );
                        if( stage ) {
                            stage.attr( settings );
                        }
                    }, this );

                } else {
                    if( this.options[key] ) {
                        if( this.options[key].attr ) {
                            this.options[key].attr( value );
                        } else {
                            can.extend( true, this.options[key], value );
                        }
                    } else {
                        this.options[key] = value;
                    }
                }

            }, this);

            this.on();
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