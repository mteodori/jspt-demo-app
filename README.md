# jspt-demo-app

A twitter wall demo built with [generator-jspt](https://github.com/mteodori/generator-jspt) for the JavaScript Power Tools presentation at Codemotion 2013.

## pre-requisites

Install [Node.js](http://nodejs.org) 0.8.0+ via one of:

* using your package manager if the version provided is recent enough
* using a binary package
* compiling from source code

[Grunt](http://gruntjs.com) is required to build and launch the application for development.

[Bower](http://bower.io/) is required to download the frontend dependencies.

Install both via:

    npm install -g grunt-cli bower # install bower and grunt

## run

In the project directory, launch:

    bower install # download all javascript frontend dependencies
    npm install # download all node/grunt development dependencies
    grunt server # launch development server

HTTP server listens on <http://localhost:9000/index.html> and picks up changes to files automatically via livereload.


## access to Twitter API

The demo application speaks with the Twitter API 1.1 which are currently mocked as a json file within the app directory:

    app/1.1/search/tweets.json

Should you want to connect to the real Twitter API, just remove this file which takes precedence and a proxy rule is already configured for you in grunt to connect to <http://localhost:7890> as the target API host.

Here you should have an instance of [twitter-proxy](https://github.com/leftlogic/twitter-proxy) correctly configured and running (see related page on how to do this, it requires the creation of an app on Twitter also) as the Twitter API 1.1 does not allow direct access from JavaScript clients.

The target API host can be customised via command line options (the values shown here are the defaults):

    grunt server --api-host=localhost --api-port=7890 --api-https=false

