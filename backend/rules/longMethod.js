function findLongMethod(lines, index) {

    const methodPattern =
        /^\s*(public|private|protected)?\s*(static\s+)?[\w<>\[\]]+\s+\w+\s*\([^)]*\)\s*\{/;

    if (!methodPattern.test(lines[index])) {
        return false;
    }

    let braceCount = 0;

    for (let i = index; i < lines.length; i++) {

        const line = lines[i];

        braceCount += (line.match(/{/g) || []).length;
        braceCount -= (line.match(/}/g) || []).length;

        if (braceCount === 0) {

            const methodLength = i - index + 1;

            return methodLength > 30;
        }
    }

    return false;
}

module.exports = {
    findLongMethod
};