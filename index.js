var URL = require('url');
var LRU = require("lru-cache");
var scraperjs = require('scraperjs');
var cache = LRU({max: 1000, maxAge: 1000 * 60 * 60 * 24});

module.exports = scrapeUrl;

function scrapeUrl(url, cb) {

    var parsedUrl = URL.parse(url);

    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        return cb(new Error('Invalid URL.'));
    }

    var data = cache.get(url);

    if (data) {
        return cb(null, data);
    }

    scraperjs
        .StaticScraper
        .create(url)
        .scrape(function ($) {
            var data = {
                url: url,
                title: title($),
                description: description($),
                canonical: canonical($, url),
                images: images($, url),
                videos: videos($, url)
            };

            return data;
        },
        function (result) {
            cache.set(url, result);
            cb(null, result);
        });
}

function trim(s) {
    return (s && s.trim && s.trim()) || '';
}

function title($) {
    return trim($('meta[property="og:title"]').attr('content') || $('head title').text());
}

function description($) {
    return trim($('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content'));
}

function canonical($, url) {
    var parsedURL = trim($('link[rel=canonical]').attr('href'));
    return parsedURL ? URL.resolve(url, parsedURL) : url;
}

function images($, url) {
    var images = [];

    [].forEach.call($('meta[property^="og:image"]'), function (el) {
        var $el = $(el);
        var propName = $el.attr('property');
        var content = $el.attr('content');

        if (propName === 'og:image' || propName === 'og:image:url') {
            images.push({url: content});
        }

        var currentVideo = images[images.length - 1] || {};

        switch (propName) {
            case 'og:image:secure_url':
                currentVideo.url = content;
                break;
            case 'og:image:type':
                currentVideo.type = content;
                break;
            case 'og:image:width':
                currentVideo.width = parseInt(content, 10);
                break;
            case 'og:image:height':
                currentVideo.height = parseInt(content, 10);
                break;
        }
    });

    return images;
}

function videos($, url) {
    /*
     <meta property="og:video:url" content="https://www.youtube.com/embed/Pc9ZMlubuIY">
     <meta property="og:video:secure_url" content="https://www.youtube.com/embed/Pc9ZMlubuIY">
     <meta property="og:video:type" content="text/html">
     <meta property="og:video:width" content="1280">
     <meta property="og:video:height" content="720">

     <meta property="og:video:url" content="http://www.youtube.com/v/Pc9ZMlubuIY?autohide=1&amp;version=3">
     <meta property="og:video:secure_url" content="https://www.youtube.com/v/Pc9ZMlubuIY?autohide=1&amp;version=3">
     <meta property="og:video:type" content="application/x-shockwave-flash">
     <meta property="og:video:width" content="1280">
     <meta property="og:video:height" content="720">
     */

    var videos = [];

    [].forEach.call($('meta[property^="og:video"]'), function (el) {
        var $el = $(el);
        var propName = $el.attr('property');
        var content = $el.attr('content');

        if (propName === 'og:video' || propName === 'og:video:url') {
            videos.push({url: content});
        }

        var currentVideo = videos[videos.length - 1];

        switch (propName) {
            case 'og:video:secure_url':
                currentVideo.url = content;
                break;
            case 'og:video:type':
                currentVideo.type = content;
                break;
            case 'og:video:width':
                currentVideo.width = parseInt(content, 10);
                break;
            case 'og:video:height':
                currentVideo.height = parseInt(content, 10);
                break;
        }
    });

    return videos;
}
