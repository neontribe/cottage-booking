define([
    'can/util/string',
    './views',
    'moment',
    'underscore',
    'utils',
    'can/control',
    'can/control/plugin',
    'jqueryui/tooltip',
    'jqueryui/datepicker',
    'plugins/map/getter',
    'can/map/validations',
    'customselect'
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
            allowAutofill: true,
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
                },
                'modelMultiCheckbox': function( $el ) {
                    // if this val is set
                    return this.options.getterMap.checkbox( $el ) ? $el.data('formModel') : null;
                },
                'mixedCheckboxSelect': function( $el ) {
                    var val = $el.val();
                    var model = $el.data('formModel');
                    
                    if( $el.is('input') ) {
                      val = this.options.getterMap.checkbox( $el ) ? 1 : 0;
                    }

                    if( val > 0 && model ) {
                        return model.constructor( can.$.extend( {}, model.attr(), {
                            quantity: val
                        }));
                    } else {
                        return null;
                    }
                }
            },
            'setterMap': {
                'defaultSetter': function( attr, val ) {
                    return this.options.model.attr( attr, val );
                },
                'modelMultiCheckbox': function( attr, val, $element ) {
                    var location = attr + '.' + $element.attr('value');
                    if( val ) {
                        return this.options.model.attr( location, val );
                    } else {
                        return this.options.model.removeAttr( location );
                    }
                },
                'mixedCheckboxSelect': function( attr, val, $element ) {
                    var location = attr + '.' + $element.data('value');
                    if( val ) {
                        return this.options.model.attr( location, val );
                    } else {
                        return this.options.model.removeAttr( location );
                    }
                }
            },
            optionsMap: {},
            // Attributes for which this form bound controller is responsible
            attributes: null,
            // This can be set per input as well
            placeholder: true,
            // delay changes to the model's attribute by this amount of milliseconds
            debounceDelay: 0,
            display: {},
            disabled: {},
            customSelect: true
        }
    },{
        init: function() {
            var $selects;
            // Set up a new observable as our attributes, so we can magically bind to changes
            this.options.attributes = new can.List();
            this.options.optionsMap = new can.Map( this.options.optionsMap );
            // We expect these to be computes, so that change events will get properly updated
            this.options.display    = new can.Map( this.options.display );
            this.options.disabled   = new can.Map( this.options.disabled );

            if( this.options.allowAutofill && this.element.is('form') ) {
                this.element.attr('method', 'POST');
            }

            this.options.validations = !!this.options.model.constructor.validations;

            this.element.find('[name]').each( can.proxy( this.formElement, this ) );
            // Once we've replaced and sorted out inputs, set the title to empty string
            // so we can display tooltips
            this.element.find(':input').attr('title', '');

            $selects = this.element.find('select');

            if( $selects.length && this.options.customSelect ) {
                _.defer(function() { $selects.customSelect(); });
            }

            if( this.options.debounceDelay > 0 ) {
                this.setter = _.debounce( this.setter, this.options.debounceDelay );
            }
        },

        'setter': function( type ) {
            var setter = this.options.setterMap[ type ] || this.options.setterMap.defaultSetter,
                args = Array.prototype.slice.call( arguments, 1 );

            return setter.apply( this, args );
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
                // default to text input
                type = $el.attr('type') || 'text',
                wrapper = views[ type + 'Wrapper' ] || views.wrapper,
                options;

            options = can.extend(true, {
                'attrName'      : attr,
                'type'          : type,
                'classes'       : $el.attr('class') || '',
                'view'          : views[type] || views.text, // Look for a template which matches the type
                'label'         : this.options.defaultLabel ? attr : '',
                'control'       : this,
                'valueAttr'     : 0,
                'textAttr'      : 1,
                'id'            : this.idify( attr ),
                'required'      : this.options.validations ? this.options.model.errors( attr, '' ) : false,
                'disabledView'  : views.disabledAttr
            }, this.options, $el.data());

            // Add this attr to the list of attributes we're responsible for
            this.options.attributes.push( attr );

            $el.replaceWith( wrapper( options ) );
        },

        'idify': function( attr ) {
            if( attr && typeof attr === 'string' ) {
                return _.uniqueId( 'attr_' + attr.replace(/\./g, '-' ) + '_' );
            }
            return _.uniqueId();
        },

        // These should be bound before we make changes to the model
        // so we can stop the change being made to it.
        ':input[data-type="number"][data-min] change': function( $el ) {
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
        ':input[data-type="number"][data-max] change': function( $el ) {
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
            this.updateModel($el);
        },

        updateModel: function ( $el ) {
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

                //this.addErrorsForAttr( attr );
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
                    .addClass('error')
                    .attr('aria-invalid', 'true');
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
            this.options.attributes.each( this.removeErrorsForAttr, this );
        },
        'removeErrorsForAttr': function( attr ) {
            this.getElementsFor( attr ).each(function() {
                var $this = can.$( this );
                if( $this.data('uiTooltip') ) {
                    $this
                        .tooltip('option', 'content', '')
                        .removeClass('error')
                        .attr('aria-invalid', null);
                }
                //     .tooltip('option', 'content', '')
                //
            });
        },
        'getUnHandledErrors': function( omit ) {
            return _.omit( this.options.model.errors(), omit );
        },
        //************ END API THINGS ***************

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
                // check for errors for which we are responsible
                errors = this.options.model.errors( this.options.attributes.attr() );
                if( errors ) {
                    _.chain( this.options.attributes.attr() )
                        .difference( _.keys( errors ) )
                        .each(can.proxy(function( validAttr ) {
                            // loop through the attributes which don't have any errors
                            this.removeErrorsForAttr( validAttr );
                        }, this));

                } else {
                    this.removeErrors();
                }

                if( !errors && can.inArray( attr, this.options.attributes.attr() ) !== -1 ) {
                    // If we don't have any errors, remove them
                    this.removeErrorsForAttr( attr );
                } else {
                    this.addErrorsForAttr( attr );
                }
            }
            if( batchEvt.batchNum ) {
                this.lastBatch = batchEvt.batchNum;
            }
        },
        lastBatch: null,

        ' submit': function( $el, evt ) {
            evt.stopPropagation();
            evt.preventDefault();

            var hasErrors = this.addErrors();

            if( !hasErrors ) {
                can.trigger( this.options.model, 'submit' );
            } else {
                this.element.trigger('error', [ this.options.model, hasErrors ] );
                can.trigger( this.options.model, 'formErrors', [ hasErrors ] );
            }
        },

        // This is because errors don't appear to bubble correctly
        // TODO: when the errors appear for sub models change this behaviour
        // See: https://github.com/bitovi/canjs/pull/434
        inseminateErrors: function( errObj ) {
            if( errObj ) {
                can.each(errObj, function( error, key ) {
                    var modl;
                    if( key.indexOf('.') > -1 ) {
                        modl = key.split('.');
                        // Pop off the attribute
                        modl.pop();
                        can.trigger( this.options.model.attr( modl.join('.') ), 'formErrors' );
                    }
                }, this);
            }
        },

        '{model} formErrors': function( model, evt, errors ) {
            // If we hear about some errors happening elsewhere
            // try and apply them correctly, if errors is falsey (undefined) presume we
            // have been trigged manually
            if( errors ) {
                if( _.intersection( _.keys( errors ) , this.options.attributes.attr() ).length ) {
                    this.addErrors();
                }
                // eurgh...
                this.inseminateErrors( errors );
            } else {
                this.addErrors();
            }
        }
    });

});
