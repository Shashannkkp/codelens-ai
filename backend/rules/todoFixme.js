function findTodoFixme(line) {

    const todoPattern =
        /^\s*(\/\/|\/\*|\*|#)\s*(TODO|FIXME)\b/i;

    return todoPattern.test(line);
}

module.exports = {
    findTodoFixme
};