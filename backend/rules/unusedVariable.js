function findUnusedVariable(lines, index) {
    const line = lines[index];

    const declarationPattern =
        /\b(?:int|double|float|long|boolean|String|var|let|const)\s+(\w+)\s*(?:=|;)/;

    const match = line.match(declarationPattern);

    if (!match) {
        return false;
    }

    const variableName = match[1];

    for (let i = index + 1; i < lines.length; i++) {
        if (
            new RegExp(`\\b${variableName}\\b`).test(lines[i])
        ) {
            return false;
        }
    }

    return true;
}

module.exports = {
    findUnusedVariable
};