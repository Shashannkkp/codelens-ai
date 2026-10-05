function findNullPointerRisk(line) {
    const nullPattern =
        /\b(\w+)\s*=\s*null\s*;/i;

    const match = line.match(nullPattern);

    if (!match) {
        return false;
    }

    return true;
}

module.exports = {
    findNullPointerRisk
};