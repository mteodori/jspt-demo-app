/*global define*/

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var TweetModel = Backbone.Model.extend({
        defaults: {
        }
    });

    return TweetModel;
});