// This would be cool...
define(function() {
    /* globals Date */
    var OldDate = Date,
        now = new OldDate(2014, 4, 17);

    Date = function() {
        var args = [].slice.call( arguments );

        if( args.length ) {
            /* *evil laugh* */
            return eval('new OldDate(' + args.join(' ,') + ');');
        }

        /* Fixture Date */
        return now;
    };

    Date.prototype = OldDate.prototype;

    Date.now = function() {
        return (now).now();
    };

    return OldDate;

});