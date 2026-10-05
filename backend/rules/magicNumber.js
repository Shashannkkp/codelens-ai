function findMagicNumber(line) {

    const magicNumberPattern =
        /(?:if|while|return|=)\s*[^;]*\b(?!0\b|1\b)\d{2,}\b/;

    return magicNumberPattern.test(line);
}

module.exports = {
    findMagicNumber
};