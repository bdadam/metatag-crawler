var util = require('util');
var scraperjs = require('scraperjs');

var compose = require('./composer');
var resolveUrlsInObj = require('./urlresolve');

module.exports = function scrapeUrl(url, options, cb) {
    if (util.isFunction(options)) {
        cb = options;
    }

    scraperjs
        .StaticScraper
        .create(url)
        .scrape(function ($) {
            return compose($, url)
        })
        .then(function(crawlingResult) {
            if (options.resolveUrls !== false) {
                resolveUrlsInObj(crawlingResult, url);
            }

            return crawlingResult;
        })
        .then(function (crawlingResult) {
            cb(null, crawlingResult);
        })
        .catch(function(err) {
            cb(err);
        });
};
