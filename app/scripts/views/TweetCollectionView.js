/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'views/tweet'
], function ($, _, Backbone, TweetView) {
    'use strict';

    var TweetCollectionView = Backbone.View.extend({

        initialize : function (options) {
            this.listenTo(this.model, "sync", this.render);
        },

        renderItem: function(item) {
            var itemView = new TweetView({model: item});
            this.$el.append(itemView.render().el);
        },

        render: function() {
            this.$el.empty();
            this.model.each(function(item) {
                this.renderItem(item);
            }, this);
            return this;
        }

    });

    return TweetCollectionView;
});
