function findHardcodedPassword(line) {

    const passwordPattern =
        /(?:password|passwd|pwd)\s*=\s*["'][^"']+["']/i;

    return passwordPattern.test(line);
}

module.exports = {
    findHardcodedPassword
};