define([], function() {
    // Enable the up-to-date shiv if it's already been added.
   if(window.html5) {
       require(['html5shiv']);
   }
});
