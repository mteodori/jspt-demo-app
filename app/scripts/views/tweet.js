/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var TweetView = Backbone.View.extend({
        template: JST['app/scripts/templates/tweet.hbs'],

        render : function () {
            this.$el.html(this.template(this.model.toJSON()));

            return this;
        }
    });

    return TweetView;
});
