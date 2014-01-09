define([
    'can/util/string',
    './views',
    'moment',
    'underscore',
    'utils',
    'can/control',
    'can/control/plugin',
    'jqueryui/jquery.ui.tooltip',
    'jqueryui/jquery.ui.datepicker'
], function(can, views, moment, _, utils) {
    'use strict';

    can.EJS.Helpers.prototype.bindForm = function( options ) {
        return function( el ) {
            can.$(el).bindForm( options );
        };
    };

    return can.Control({
        'pluginName': 'bindForm',

        defaults: {
            model: null,
            proxy: null,
            // When set to true this option will use the attr name as the default field name
            defaultLabel: false,
            tooltipOptions: {
                track: true
            },
            'getterMap': {
                'datepicker': function( $el ) {
                    return moment( $el.datepicker('getDate') );
                },
                'defaultGetter': function( $el ) {
                    return $el.val();
                },
                'checkbox': function( $el ) {
                    return !!$el.is(':checked');
                },
                'number': function( $el ) {
                    return Number( $el.val() );
                }
            },
            'setterMap': {
                'defaultSetter': function( attr, val ) {
                    return this.options.model.attr( attr, val );
                }
            },
            optionsMap: {},
            // Attributes for which this form bound controller is responsible
            attributes: null,
            // This can be set per input as well
            placeholder: true,
            // delay changes to the model's attribute by this amount of milliseconds
            debounceDelay: 0
        }
    },{
        init: function() {

            // Set up a new observable as our attributes, so we can magically bind to changes
            this.options.attributes = new can.List();
            this.options.optionsMap = new can.Map( this.options.optionsMap );

            this.element.find('[name]').each( can.proxy( this.formElement, this ) );
            // Once we've replaced and sorted out inputs, set the title to empty string
            // so we can display tooltips
            this.element.find(':input').attr('title', '');

            this.setter = _.debounce( this.setter, this.options.debounceDelay );

        },

        'setter': function( type ) {
            var setter = this.options.setterMap[ type ] || this.options.setterMap.defaultSetter,
                args = Array.prototype.slice.call( arguments, 1 );

            return setter.apply( this, args );
        },

        // destroy: function() {
        //     console.log('form being destroyed!');
        //     return can.Control.prototype.destroy.call( this );
        // },

        /**
         * This handles the bulk of the rendering logic
         * @param  {Number} index The index of the element in the jquery list
         * @param  {HTMLDom} el   The element which is currently in selection
         * @return {undefined}
         */
        'formElement': function( index, el ) {
            var $el = can.$(el),
                attr = $el.attr('name'),
                // default to text input
                type = $el.attr('type') || 'text',
                wrapper = views[ type + 'Wrapper' ] || views.wrapper,
                options;

            options = can.extend(true, {
                'attrName': attr,
                'type': type,
                'classes': $el.attr('class') || '',
                // Look for a template which matches the type
                'view': views[type] || views.text,
                'label': this.options.defaultLabel ? attr : '',
                'control': this,
                'valueAttr': 0,
                'textAttr': 1,
                'id': _.uniqueId( 'attr_' + attr + '_' )
            }, this.options, $el.data());

            // Add this attr to the list of attributes we're responsible for
            this.options.attributes.push( attr );

            $el.replaceWith( wrapper( options ) );
        },

        // These should be bound before we make changes to the model
        // so we can stop the change being made to it.
        ':input[type="number"][data-min] change': function( $el ) {
            var max = $el.data('max'),
                min = $el.data('min');

            /* jshint -W018 */
            // JSHint rightly complains about this use of '!', but we want this here
            // because if one of them is falsey (undefined) then the equation is falsey
            // so ( max > min ) would be falsey ( incorrectly )
            if( $el.val() < min && !(max < min) ) {
            /* jshint +W018 */
                $el.val( min );
                return false;
            }
        },
        ':input[type="number"][data-max] change': function( $el ) {
            var max = $el.data('max'),
                min = $el.data('min');

            /* jshint -W018 */
            // JSHint rightly complains about this use of '!', but we want this here
            // because if one of them is falsey (undefined) then the equation is falsey
            // so ( max > min ) would be falsey ( incorrectly )
            if( $el.val() > max && !(max < min) ) {
            /* jshint +W018 */
                $el.val( $el.data('max') );
                return false;
            }
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
                getter, val;

            if( type && attr ) {

                getter = this.options.getterMap[ type ] || this.options.getterMap.defaultGetter;

                val = getter.call( this, $el, attr );
                if( val !== this.options.model.attr( attr ) ) {
                    this.setter( type, attr, val, $el );
                }

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

                html = utils.fragmentToString( views.errors({
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
            if( !$el.length ) {
                return '';
            }
            return this.getElementsFor( attr ).attr('data-label') || '';
        },
        'addErrors': function() {
            var errors = this.options.model.errors();

            if( errors ) {
                can.each( _.pick( errors, this.options.attributes.attr() ), function( value, key ) {
                    this.addTheseErrorsForAttr( key, value );
                }, this);
                return errors;
            }
        },
        'removeErrors': function() {
            can.each( this.options.attributes.attr(), this.removeErrorsForAttr, this );
        },
        'removeErrorsForAttr': function( attr ) {
            this.getElementsFor( attr )
                .tooltip('option', 'content', '')
                .removeClass('error');
        },
        'getUnHandledErrors': function( omit ) {
            return _.omit( this.options.model.errors(), omit );
        },

        /**
         * This function handles model change events, we need to do this last
         * @param  {can.Model} model    The model that's been changed
         * @param  {Object} batchEvt    The batch object representing this change set
         * @param  {String} attr        The attr which has changed
         * @return {undefined}
         */
        '{model} change': function( model, batchEvt, attr ) {
            var errors;
            if( this.lastBatch !== batchEvt.batchNum ) {
                errors = this.options.model.errors( attr );
                if( !errors && can.inArray( attr, this.options.attributes.attr() ) !== -1 ) {
                    // If we don't have any errors, remove them
                    this.removeErrorsForAttr( attr );
                }
            }
            if( batchEvt.batchNum ) {
                this.lastBatch = batchEvt.batchNum;
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
                can.trigger( this.options.model, 'errors', [ hasErrors ] );
            }
        },

        '{model} errors': function() {
            debugger;
        }
    });

});