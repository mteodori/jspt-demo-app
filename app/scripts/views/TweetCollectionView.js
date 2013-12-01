/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'views/tweet',
    'freewall'
], function ($, _, Backbone, TweetView, Freewall) {
    'use strict';

    var TweetCollectionView = Backbone.View.extend({

        initialize : function () {
            this.listenTo(this.model, "sync", this.render);
            this.wall = new Freewall(this.el);
        },

        renderItem: function (item) {
            var itemView = new TweetView({model: item});
            this.$el.append(itemView.render().el);
        },

        render: function () {
            this.$el.empty();
            this.model.each(function(item) {
                this.renderItem(item);
            }, this);
            this.wall.fitWidth();
            return this;
        }

    });

    return TweetCollectionView;
});
