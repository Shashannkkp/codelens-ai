function findHardcodedSecret(line) {

    const secretPattern =
        /(api[_-]?key|secret|token|access[_-]?token)\s*=\s*["'][^"']+["']/i;

    return secretPattern.test(line);
}

module.exports = {
    findHardcodedSecret
};