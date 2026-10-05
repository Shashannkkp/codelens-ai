function findDebugOutput(line) {

    const debugPattern =
        /\b(System\.out\.print(?:ln)?|System\.err\.print(?:ln)?|console\.log|console\.debug)\s*\(/i;

    return debugPattern.test(line);
}

module.exports = {
    findDebugOutput
};