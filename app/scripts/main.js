/*global require*/
'use strict';

require.config({
    shim: {
        jquery: {
            exports: '$'
        },
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        bootstrap: {
            deps: [
                'jquery'
            ],
            exports: 'bootstrap'
        },
        freewall: {
            deps: [
                'jquery'
            ],
            exports: 'freewall'
        },
        handlebars: {
            exports: 'Handlebars'
        }
    },
    paths: {
        jquery: '../bower_components/jquery/jquery',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/underscore/underscore',
        bootstrap: '../bower_components/bootstrap/dist/js/bootstrap',
        handlebars: '../bower_components/handlebars/handlebars',
        chai: '../bower_components/chai/chai',
        'doc-ready': '../bower_components/doc-ready/doc-ready',
        eventEmitter: '../bower_components/eventEmitter/EventEmitter',
        eventie: '../bower_components/eventie/eventie',
        freewall: '../bower_components/freewall/freewall',
        'get-size': '../bower_components/get-size/get-size',
        'get-style-property': '../bower_components/get-style-property/get-style-property',
        'jquery-bridget': '../bower_components/jquery-bridget/jquery.bridget',
        masonry: '../bower_components/masonry/masonry',
        'matches-selector': '../bower_components/matches-selector/matches-selector',
        mocha: '../bower_components/mocha/mocha',
        modernizr: '../bower_components/modernizr/modernizr',
        requirejs: '../bower_components/requirejs/require',
        sinon: '../bower_components/sinon/index',
        'handlebars.runtime': '../bower_components/handlebars/handlebars.runtime',
        item: '../bower_components/outlayer/item',
        outlayer: '../bower_components/outlayer/outlayer'
    }
});
