
function findDuplicateCode(lines, index) {
    const currentLine = lines[index].trim();

    // Ignore blank lines and comments.
    if (
        currentLine === "" ||
        currentLine.startsWith("//") ||
        currentLine.startsWith("/*") ||
        currentLine.startsWith("*") ||
        currentLine.startsWith("*/")
    ) {
        return false;
    }

    // Ignore common structural lines that frequently repeat.
    const ignoredLines = new Set([
        "{",
        "}",
        "};",
        "break;",
        "continue;"
    ]);

    if (ignoredLines.has(currentLine)) {
        return false;
    }

    // Require a meaningful line to avoid flagging short fragments.
    if (currentLine.length < 12) {
        return false;
    }

    // Report a duplicate only if the exact line appeared earlier.
    for (let i = 0; i < index; i++) {
        const previousLine = lines[i].trim();

        if (
            previousLine === currentLine &&
            previousLine.length >= 12 &&
            !ignoredLines.has(previousLine) &&
            !previousLine.startsWith("//") &&
            !previousLine.startsWith("/*") &&
            !previousLine.startsWith("*")
        ) {
            return true;
        }
    }

    return false;
}

module.exports = {
    findDuplicateCode
};
