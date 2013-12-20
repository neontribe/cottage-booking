define([
    'can/util/string',
    './views',
    'moment',
    'can/control',
    'can/control/plugin',
    'jqueryui/jquery.ui.core',
    'jqueryui/jquery.ui.datepicker'
], function(can, views, moment) {
    'use strict';

    return can.Control({
        'pluginName': 'bindForm',

        defaults: {
            model: null,
            proxy: null,
            tooltipOptions: {
                track: true
            }
        }
    },{
        init: function() {

            var self = this;

            this.element.find('[name]').each(function() {
                var $this = can.$(this),
                    attr = $this.attr('name'),
                    type = $this.attr('type'),
                    classes = $this.attr('class'),
                    fragment, options;

                options = can.extend(true, {
                    'attrName': attr,
                    'type': type,
                    'classes': classes
                }, self.options,$this.data());

                // Look for a template which matches the type and default to text input
                fragment = ( views[type] || views.text );

                $this.replaceWith( fragment( options ) );
            });

        },

        'input,select,textarea[data-type] change': function ( $el ) {
            // Remove errors when an input is changed
            // TODO: improve this
            $el.removeAttr('title');
        },

        'input[data-type="datepicker"] change': function( $el ) {
            var attr = $el.attr('name');

            this.options.model.attr( attr, moment( $el.datepicker('getDate') ) );
        },

        ' submit': function( $el, evt ) {
            var errors = this.options.model.errors();

            evt.stopPropagation();
            evt.preventDefault();

            if( this.options.proxy ) {
                // Use the proxy option to allow errors from other fields to show
            }

            can.each( errors, function( value, key ) {
                var $input = this.element.find('[name="' + key + '"]');

                if( $input.length ) {
                    $input.attr('title', value.join(' and '));
                }
            }, this);

            if( !errors ) {
                can.trigger( this.options.model, 'submit' );
            } else {
                can.trigger( this.options.model, 'errors' );
            }
        }
    });

});