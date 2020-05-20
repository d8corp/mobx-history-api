'use strict';

function decode(url) {
    return decodeURIComponent(url.replace(/\+/g, ' '));
}

module.exports = decode;
