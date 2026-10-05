function findEmptyCatch(lines, index) {

    const line = lines[index].trim();

    const catchPattern = /catch\s*\([^)]*\)\s*\{/i;

    if (!catchPattern.test(line)) {
        return false;
    }

    let nextIndex = index + 1;

    while (nextIndex < lines.length) {

        const nextLine = lines[nextIndex].trim();

        if (nextLine === "") {
            nextIndex++;
            continue;
        }

        if (nextLine === "}") {
            return true;
        }

        return false;
    }

    return false;
}

module.exports = {
    findEmptyCatch
};