'use strict';

require.config({
    baseUrl: 'scripts'
});

require(['require', 'main'], function (require) {

    require([
        'spec/test.js',
    ], function() {

        (window.mochaPhantomJS || mocha).run();

    });

});
