function decode(url) {
    return decodeURIComponent(url.replace(/\+/g, ' '));
}

export default decode;
