requirejs.config({
    paths: {
        can      : 'bower_components/canjs/amd/can',
        jquery   : 'resources/jquery',
        ejs      : 'bower_components/require-can-renderers/lib/ejs',
        jqueryui : 'bower_components/jquery-ui/ui',
        //devtools : 'bower_components/devtools-snippets/snippets', reference full path for dev environments you lazy git
        moment : 'bower_components/momentjs/moment'
        //config   : 'config/config' <- A model available as a singlton
    },
    noGlobal: true
});