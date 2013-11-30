/*global require*/
'use strict';

require(['require', 'main'], function (require) {
    require([
        'backbone',
        'collections/tweet',
        'views/TweetCollectionView'
    ], function (Backbone, TweetCollection, TweetCollectionView) {
        var tweetCollection = new TweetCollection();
        var tweetCollectionView = new TweetCollectionView({
            el: $('.container'),
            model: tweetCollection
        });

        var poller = function() {
            tweetCollection.fetch().done(function() {
                setTimeout(poller, 5000);
            });
        };
        poller();
    });
});
