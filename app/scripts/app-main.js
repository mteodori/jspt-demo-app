/*global require*/
'use strict';

require(['require', 'main'], function (require) {
    require([
        'backbone',
        'collections/tweet',
        'views/TweetCollectionView'
    ], function (Backbone, TweetCollection, TweetCollectionView) {
        //window.alert('RequireJS Main Application Started');
        var tweetCollection = new TweetCollection();
        var tweetCollectionView = new TweetCollectionView({
            el: $('.container'),
            model: tweetCollection
        });

//        setInterval(function() {
            tweetCollection.fetch();
//       }, 5000);

//        Backbone.history.start();
    });
});
