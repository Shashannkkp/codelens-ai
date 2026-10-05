function findInputValidation(lines, index) {

    const line = lines[index];

    const inputPattern =
        /(@RequestParam|@PathVariable|@RequestBody|request\.getParameter|req\.getParameter)/i;

    if (!inputPattern.test(line)) {
        return false;
    }

    const start = Math.max(0, index - 3);
    const end = Math.min(lines.length, index + 4);

    const nearbyCode =
        lines.slice(start, end).join(" ");

    const validationPattern =
        /\b(if|validate|validated|validation|isBlank|isEmpty|matches|contains|length|size)\b/i;

    return !validationPattern.test(nearbyCode);
}

module.exports = {
    findInputValidation
};