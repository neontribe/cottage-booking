#!/bin/bash
heroku config:add BUILDPACK_URL=https://github.com/mbuchetics/heroku-buildpack-nodejs-grunt.git
heroku labs:enable user-env-compile -a $1
heroku config:set NODE_ENV=development