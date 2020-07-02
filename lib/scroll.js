'use strict';

function scroll(position, callback) {
    if (callback) {
        var top_1 = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        scroll(position);
        var count_1 = 0;
        var interval_1 = setInterval(function () {
            var currentTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            if (currentTop === top_1 || count_1++ === 30) {
                clearInterval(interval_1);
                callback();
            }
            else {
                top_1 = currentTop;
            }
        }, 100);
    }
    else if (typeof position === 'string') {
        var element = document.querySelector(position);
        if (element) {
            element.scrollIntoView();
        }
        else {
            scroll(0);
        }
    }
    else if (position > -1) {
        var top_2 = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        if (top_2 !== position) {
            document.documentElement.scrollTop = document.body.scrollTop = position;
        }
    }
}

module.exports = scroll;
