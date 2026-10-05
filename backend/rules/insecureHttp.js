function findInsecureHttp(line) {

    if (line.trim().startsWith("//")) {
        return false;
    }

    const httpPattern =
        /http:\/\/[^\s"'<>]+/i;

    return httpPattern.test(line);
}

module.exports = {
    findInsecureHttp
};