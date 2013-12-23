define([
    'can/util/string',
    './views',
    'moment',
    'underscore',
    'can/control',
    'can/control/plugin',
    'jqueryui/jquery.ui.core',
    'jqueryui/jquery.ui.datepicker'
], function(can, views, moment, _) {
    'use strict';

    // TODO:Move this to a better place resources/utulities?
    var slice = Array.prototype.slice,
        fragmentToString = function( frag ) {
            return can.$('<div>').html( frag ).html();
        },
        bindWithThat = function( fn, context, that ) {
            return function() {
                return fn.apply( context, [that].concat( [].slice.call( arguments ) ) );
            };
        };

    return can.Control({
        'pluginName': 'bindForm',

        'getterMap': {
            'datepicker': function( $el ) {
                return moment( $el.datepicker('getDate') );
            },
            'defaultGetter': function( $el ) {
                return $el.val();
            }
        },

        defaults: {
            model: null,
            proxy: null,
            tooltipOptions: {
                track: true
            },
            getterMap: {},
            // Attributes for which this form bound controller is responsible
            attributes: []
        }
    },{
        init: function() {

            this.element.find('[name]').each( can.proxy( this.formElement, this ) );
            // Once we've replaced and sorted out inputs, set the title to empty string
            // so we can display tooltips
            this.element.find(':input').attr('title', '');

            can.extend( this.options.getterMap, this.constructor.getterMap );

        },

        /**
         * This handles the bulk of the rendering logic
         * @param  {Number} index The index of the element in the jquery list
         * @param  {HTMLDom} el   The element which is currently in selection
         * @return {undefined}
         */
        'formElement': function( index, el ) {
            var $el = can.$(el),
                attr = $el.attr('name'),
                type = $el.attr('type'),
                classes = $el.attr('class'),
                wrapper = views.wrapper,
                options;

            options = can.extend(true, {
                'attrName': attr,
                'type': type || 'text',
                'classes': classes || '',
                // Look for a template which matches the type and default to text input
                'view': ( views[type] || views.text ),
                'label': ''
            }, this.options, $el.data());

            // Add this attr to the list of attributes we're responsible for
            this.options.attributes.push( attr );

            $el.replaceWith( wrapper( options ) );
        },

        /**
         * This function handles the change event of inputs
         * @param  {jQuery} $el jQuery element
         * @return {undefined}
         */
        ':input change': function ( $el ) {
            // Add errors when an input is changed
            var type = $el.attr('data-type'),
                attr = $el.attr('name'),
                getter;

            if( type && attr ) {

                getter = this.options.getterMap[ type ] || this.options.getterMap.defaultGetter;

                this.options.model.attr( attr, getter.call( this, $el, attr ) );

                this.addErrorsForAttr( attr );
            }

        },
        // TODO: DOCUMENT THESE MOFO
        // expose these as a sort of api to the form machinery
        'getElementsFor': function( attr ) {
            return this.element.find('[name="' + attr + '"]');
        },
        'addErrorsForAttr': function( attr ) {
            var errors = this.options.model.errors( attr );

            if( errors ) {
                this.addTheseErrorsForAttr( attr, errors[attr] );
            }
        },
        'addTheseErrorsForAttr': function( attr, errors ) {
            var html, $el,
                _errors = {};
            if( errors.length ) {

                $el = this.getElementsFor( attr );

                _errors[ attr ] = errors;

                html = fragmentToString( views.errors({
                    errors: _errors,
                    control: this
                }));

                $el
                    .tooltip('option', 'content', html)
                    .addClass('error');
            }

        },
        'getLabelForAttr': function( attr ) {
            var $el = this.getElementsFor( attr );
            if( !$el ) {
                return '';
            }
            return this.getElementsFor( attr ).attr('data-label') || '';
        },
        'addErrors': function() {
            var errors = this.options.model.errors( this.options.attributes );

            if( errors ) {
                can.each( errors, function( value, key ) {
                    this.addTheseErrorsForAttr( key, value );
                }, this);
                return true;
            }
        },
        'removeErrors': function() {
            can.each( this.options.attributes, this.removeErrorsForAttr, this );
        },
        'removeErrorsForAttr': function( attr ) {
            this.getElementsFor( attr )
                .tooltip('option', 'content', '')
                .removeClass('error');
        },

        /**
         * This function handles model change events, we need to do this last
         * @param  {can.Model} model    The model that's been changed
         * @param  {Object} batchEvt    The batch object representing this change set
         * @param  {String} attr        The attr which has changed
         * @return {undefined}
         */
        '{model} change': function( model, batchEvt, attr ) {
            var errors = this.options.model.errors( attr );
            if( !errors && can.inArray( attr, this.options.attributes ) !== -1 ) {
                // If we don't have any errors, remove them
                this.removeErrorsForAttr( attr );
            }
            // TODO: Cleverer way to do this?
            if( this.lastBatch !== batchEvt.batchNum && can.inArray('error_box', this.options.attributes) !== -1 ) {
                errors = _.omit( this.options.model.errors(), this.options.attributes );
                if( errors ) {
                    this.getElementsFor('error_box').replaceWith( views.errors({
                        errors: errors,
                        control: this
                    }));
                    this.lastBatch = batchEvt.batchNum;
                }
            }
        },
        lastBatch: null,

        ' submit': function( $el, evt ) {

            var hasErrors = this.addErrors();

            evt.stopPropagation();
            evt.preventDefault();

            if( !hasErrors ) {
                can.trigger( this.options.model, 'submit' );
            } else {
                can.trigger( this.options.model, 'errors' );
            }
        }
    });

});