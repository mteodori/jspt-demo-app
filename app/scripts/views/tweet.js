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

            var colour = [
                "rgb(142, 68, 173)",
                "rgb(243, 156, 18)",
                "rgb(211, 84, 0)",
                "rgb(0, 106, 63)",
                "rgb(41, 128, 185)",
                "rgb(192, 57, 43)",
                "rgb(135, 0, 0)",
                "rgb(39, 174, 96)"
            ];

            $(this.$el.children()[0]).css('background-color', colour[colour.length * Math.random() << 0]);

            return this;
        }
    });

    return TweetView;
});
