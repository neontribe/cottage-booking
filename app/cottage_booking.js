/**!
 * This is the main javascript file which controls the booking path
 * @param  {Object}         can     The canJS object
 * @param  {Object}         views   The views object which contains references to the render function for the views
 * @param  {can.compute}    enquiry The compute containing the enquiry used by the app
 * @param  {can.Model}      book    The booking model which is globally available
 * @param  {can.List}       stages  The list of stages used by the app
 * @param  {Object}         utils   The utils object with helper functions
 * @return {can.control}            The BookingPath constructor
 */
define([
    'can/util/string',
    './views',
    'resources/enquiry',
    'resources/book',
    'resources/stages',
    'utils',
    'dd',
    // All the rest
    'controls/calculator/calculator',
    'can/control',
    'can/control/plugin',
    'can/control/route',
    'jqueryui/tabs',
], function( can, views, enquiry, book, stages, utils, debug ) {
    'use strict';

    // TODO:Move this to a better place
    can.$.datepicker.setDefaults({
        dateFormat: 'dd/mm/yy',
        firstDay: 1
    });

    var init = false,
        baseUrl, BookingPath;
    /* -==== router and main controller ====- */
    BookingPath = can.Control({
        pluginName: 'bookingPath',

        defaults: {
            enquiry: enquiry,
            book: book,
            stages: stages,
            route: can.route,
            baseUrl: utils.baseUrl,
            triggerOnGlobal$: true
        }

    }, {
        setup: function( el, options ) {
            can.Control.prototype.setup.call( this, el );
            this.update( options );
        },

        init: function() {
            var index,
                hash = window.location.hash ? window.location.hash.replace(/#|!/g, '') : '',
                current;

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

            if( this.options.debug ) {
                debug( debug, true );
            }

            // Because the route could be unready at this point, we need to extract
            // data from the url ourselves... TODO: investigate alternative
            current = can.route.deparam( hash );
            index = this.options.stages.indexOf( current.page );

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
                'active': 0//index > -1 ? index : 0
            });

            /** init the route */
            can.route.ready();
        },

        '{book} confirmation': function( model, evt, newVal ) {
            if( newVal ) {
                can.route.attr('page', 'confirmation');
            }
        },

        '{book} saving': function() {
            debug('saving booking');
        },

        // Whenever the booking object changes, check for errors and
        // Enable/disable stages
        lastBatchNum: null,
        '{book} change': function( model, evt ) {
            // Check we haven't already done this
            if( this.lastBatchNum !== evt.batchNum ) {

                var newDisabledArr = this.disabledArray(),
                    index = this.options.stages.indexOf( can.route.attr('page') );

                this.content.tabs( 'option', 'disabled', newDisabledArr );

                // If we can change to the page now, make the change
                if( index !== -1 && can.inArray( index, newDisabledArr ) === -1 ) {
                    this.changeStage( can.route.attr('page') );
                }

                //Finally assign the batch num
                this.lastBatchNum = evt.batchNum || null;

            }
        },

        /**
         * Build array of stages to disable
         * @return {Array} The Array of tabs to disable (e.g. [1, 2, 3])
         */
        'disabledArray': function() {
            var disabled = [],
                b = this.options.book;

            // calendar
            if( b.attr('confirmation') ) {
                disabled.push( 0 );
            }

            // details
            if( !b.attr('bookingId') || b.attr('confirmation') ) {
                disabled.push( 1 );
            }

            // payment
            if( !b.attr('bookingId') || b.errors() || b.attr('confirmation') ) {
                disabled.push( 2 );
            }

            // confirmation
            if( !b.attr('confirmation') ) {
                disabled.push( 3 );
            }

            return disabled;
        },

        stageIsDisabled: function( stage ) {
            if( !isNaN( stage ) && stage.constructor === can.Map ) {
                stage = this.options.indexOf( stage );
            }

            return can.inArray( stage, this.disabledArray() ) !== -1;
        },

        // We expect that the elements are in the order and the only children of the parent
        // This is slightly brittle
        'getStageFor': function( $el ) {
            var index = $el.index(), // Get the index in the dom of this element
                stage = this.options.stages.attr( index );
            return stage;
        },

        'destroyStages': function() {
            this.options.stages.each(function( val, key ) {
                if( key ) {
                    this.destroyStage( val );
                }
            }, this);
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
                index = this.options.stages.indexOf( stage );

            if( stage && $newContent && $newContent.length ) {
                if( can.inArray( index, this.disabledArray() ) === -1 ) {
                    this.renderStage( stage, $newContent );
                } else {
                    return false;
                }
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
                oldControl = oldStage && oldStage.attr('control');

            if( oldStage && oldControl && ( oldStage.attr('destroy') || this.stageIsDisabled( oldStage ) ) ) {
                this.destroyStage( oldStage );
            }

            // we trust that the global jQuery is _not_ the same as our $
            if( this.options.triggerOnGlobal$ && window.jQuery ) {
                var tab = this.options.route.attr('page') || 'calendar';
                // jQuery('body').on('cottage_booking.confirmation', function(el, evt, args){ console.log(arguments); });
                jQuery( this.element[0] ).trigger('cottage_booking.' + tab, [ this.options.book ] );
            }

        },

        ' error': function ( $el, evt, model, errors ) {
          // we trust that the global jQuery is _not_ the same as our $
          if( this.options.triggerOnGlobal$ && window.jQuery ) {
              jQuery( this.element[0] ).trigger('cottage_booking.error', [ $el, evt, model, errors ] );
          }
        },

        destroyStage: function( stage ) {
            if( stage.attr('control') ) {
                stage.attr('control').element.empty();
                stage.attr('control').destroy();
                stage.removeAttr('control');
            }
        },

        renderStage: function( stage, $el, reRender ) {
            var Control = stage.attr('Control');

            if( reRender && stage.attr('control') ) {
                this.destroyStage( stage );
            }

            if( Control && !stage.attr('control') ) {
                stage.attr('control', new Control( $el, stage.attr('options') ));
            }
        },

        changeStage: function( newStage/*, prevStage*/ ) {
            var index = this.options.stages.indexOf( newStage ),
                disabled = can.inArray(index, this.content.tabs('option', 'disabled')) > -1;

            if( index > -1 ) {

                if( !disabled ) {

                    if( this.content.tabs('option', 'active') !== index ) {

                        this.content.tabs('option', {
                            active: index
                        });

                    }

                }

            } else {
                // Maybe it's an id?

            }
        },

        // Empty route
        'route': function( routeObj ) {
            if( !routeObj.page ) {
                this.changeStage( 'calendar' );
            }
        },

        '{route} booking': function( route, evt, newId, prevId ) {
            var stage;
            if( newId ) {

                if( this.options.book.attr('bookingId') !== newId ) {
                    this.options.book.fetchBooking( newId ).fail(function() {
                        // We assume all failures are due to booking not found
                        can.route.removeAttr('booking');
                        this.options.route.attr( 'page', 'calendar' );
                    });
                }

                if( !prevId ) {
                    this.options.route.attr( 'page', 'details' );
                }

                if( !this.options.route.attr('page') ) {
                    stage = this.options.stages.attr( this.content.tabs('option', 'active') );

                    if( stage ) {
                        this.options.route.attr( 'page', stage.attr('id') );
                    }
                }

            } else {
                // Just clear booking id, so details don't need to be re-entered
                this.options.book.removeAttr('bookingId');
                this.options.book.reset();
                this.destroyStages();
                //this.options.enquiry.reset();
            }
        },

        '{book} bookingId': function( obj, evt, newVal ) {
            if( newVal ) {
                if( newVal !== can.route.attr('booking') ) {
                    can.route.attr('booking', newVal);
                }
            } else {
                can.route.removeAttr('booking');
            }
        },

        '{route} page': function( route, evt, newPage, oldPage ) {
            this.changeStage( newPage, oldPage );
        },

        '{route.data} next': function( route, evt, routeObj ) {
            var nextStg, ind;
            // if we don't have a page we should have the next one
            if( !routeObj.page ) {
                ind = 1;
            } else {
                ind = this.options.stages.next( routeObj.page );

                if( ind === -1 ) {
                    return;
                }
            }

            // I suppose we could just say > 0
            if( can.inArray( ind, this.disabledArray() ) === -1 ) {
                nextStg = this.options.stages.attr( ind );
                can.route.attr( 'page', nextStg.attr('id') );
            }
        },

        '{route.data} restart': function( /*route, evt, routeObj*/ ) {
            this.options.route.attr({
                'page': 'calendar',
                'booking': ''
            });
        },

        '{route.data} back': function( route, evt, routeObj ) {
            var prevStg, ind;
            // if we don't have a page we should choose the first one
            if( !routeObj.page ) {
                ind = 0;
            } else {
                ind = this.options.stages.prev( routeObj.page );

                if( ind === -1 ) {
                    return;
                }
            }

            // I suppose we could just say > 0
            if( can.inArray( ind, this.disabledArray() ) === -1 ) {
                prevStg = this.options.stages.attr( ind );
                can.route.attr( 'page', prevStg.attr('id') );
            }
        },

        /**
         * This function exposes an api to modify the settings
         * attached to this top level controller, importantly it is possible
         * to make changes to the settings used to launch each of the components
         * TODO: add a shorthand for this
         * For example:
         * @codestart
         *
         *      $( element containing booking path ).bookingPath({
         *
         *          'stages': {
         *              'details': {
         *                  'options': {
         *                      'titles': [
         *                          ['value', 'display string'],
         *                          ['master', 'Head Master']
         *                      ]
         *                  }
         *              }
         *          }
         *
         *      });
         *
         * @codeend
         *
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
                            if( stage.attr('control') ) {
                                this.renderStage( stage, stage.attr('control').element, true );
                            }
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

    can.$('[data-base-url]').each(function() {
        baseUrl = can.$(this).data('baseUrl');

        utils.baseUrl( baseUrl );
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

    if( console && console.warn ) {
        if( !init ) {
            // TODO: investigate a different approach
            // So the user can execute the plugins manually if they want
            // Or maybe just show a warning ( if ( !init && console.warn ) ...)
            // throw new Error('This App expected markup that wasn\'t found!');
            console.warn('In order to initialize the app run the bookingPath and bookingCalculator plugin functions');
        }

        if( !baseUrl && baseUrl !== '' ) {
            console.warn('Base url not set (data-base-url="/some/path")');
        }
    }

    // Return the booking path to match amd format
    return BookingPath;
});
