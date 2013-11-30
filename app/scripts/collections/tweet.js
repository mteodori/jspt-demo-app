/*global define*/

define([
    'underscore',
    'backbone',
    'models/tweet'
], function (_, Backbone, TweetModel) {
    'use strict';

    var TweetCollection = Backbone.Collection.extend({
        model: TweetModel,
        q: 'codemotion',
        count: 12,
        url: function() {
            var search = this.q ? 'from:@' + this.q + ' OR @' + this.q + ' OR #' + this.q : '';
            return '/1.1/search/tweets.json?q=' + encodeURIComponent(search) + '&count=' + this.count + '&since_id=1&result_type=recent&include_entities=true';
        },
        parse: function(data) {
            return data.statuses;
        }
    });

    return TweetCollection;
});
