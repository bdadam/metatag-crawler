var normalizeText = require('./normalize');

module.exports = function ($) {
    return {
        title: title(),
        description: description(),
        canonical: canonical(),
        keywords: keywords()
    };

    function title() {
        return normalizeText($('head title').text());
    }

    function description() {
        return normalizeText($('meta[name="description"]').attr('content'));
    }

    function keywords() {
        var output = normalizeText($('meta[name="keywords"]').attr('content')) + normalizeText($('meta[name="Keywords"]').attr('content'))
        return output
    }

    function canonical() {
        return normalizeText($('link[rel=canonical]').attr('href'));
    }
};