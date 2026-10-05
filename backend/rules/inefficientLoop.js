function findInefficientLoop(line) {

    const loopPattern =
        /for\s*\([^;]+;\s*[^;]+\.length\s*;/i;

    return loopPattern.test(line);
}

module.exports = {
    findInefficientLoop
};