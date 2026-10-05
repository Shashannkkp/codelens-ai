function findHardcodedUrlIp(line) {

    if (line.trim().startsWith("//")) {
        return false;
    }

    const urlPattern =
        /https?:\/\/[^\s"'<>]+/i;

    const ipPattern =
        /\b(?:\d{1,3}\.){3}\d{1,3}(?::\d+)?\b/;

    return (
        urlPattern.test(line) ||
        ipPattern.test(line)
    );
}

module.exports = {
    findHardcodedUrlIp
};