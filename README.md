# Cottage Booking Path using canJS

[![Build Status](https://travis-ci.org/RpprRoger/cottage-booking.png)](https://travis-ci.org/RpprRoger/cottage-booking)

## Versioning
I attempt to follow the [Semver](http://semver.org/) version ethos

## Download dependencies
### This doesn't work on windows, the nested node_modules exceeded max filename size
```bash
npm install && bower install
```

## Grunt tasks
# Note: The release uses the same syntax as [bumpup](https://github.com/darsain/grunt-bumpup)
```bash
# default grunt task is to build and create the prod.zip file
grunt

# buildViewFiles will build the view.js file used to
# manage the views for each control 
# ( see controls/form/views.js for a good example )
grunt buildViewFiles

# this will release and add a release to the releases 
# The release should include a zip of build production files
# TODO: add changelog
grunt release            # Default patch release
grunt release:minor      # Minor release
grunt release:minor:1458 # Minor release with buildtype suffix

```

# Deployment
Take the prod.zip file and add it to the booking module

```bash
$ tree .
├── prod
│   └── prod.zip
├── templates
│    ├── booking_complete_email_customer.tpl.php
│    └── tabs_booking_payment_complete.tpl.php
├─── tabs_booking_payment_error.tpl.php
├── tabs_booking.admin.inc
├── TabsBookingBlocks.class.php
├── tabs_booking.booking.inc
├── tabs_booking.enquiry.inc
├── tabs_booking.info
├── tabs_booking.install
├── tabs_booking.metatag.inc
├── tabs_booking.module
├── tabs_booking.path.inc
├── TabsBookingSession.class.php
└── TabsBookingUtils.class.php

$ cd prod
$ wget https://github.com/neontribe/cottage-booking/releases/download/<version>/prod.zip
$ unzip prod.zip
$ git commit -am 'Include javascript version <version>'
$ drush cc all
```
