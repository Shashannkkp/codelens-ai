function findDuplicateCode(lines, index) {
    const currentLine = lines[index].trim();

    if (
        currentLine === "" ||
        currentLine.startsWith("//") ||
        currentLine.startsWith("/*") ||
        currentLine.startsWith("*")
    ) {
        return false;
    }

    for (let i = 0; i < index; i++) {
        const previousLine = lines[i].trim();

        if (
            previousLine !== "" &&
            previousLine === currentLine
        ) {
            return true;
        }
    }

    return false;
}

module.exports = {
    findDuplicateCode
};