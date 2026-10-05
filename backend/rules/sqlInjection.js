function findSqlInjection(line) {

    const sqlPattern =
        /(select|insert|update|delete)\s+.*(\+|concat\s*\()/i;

    return sqlPattern.test(line);
}

module.exports = {
    findSqlInjection
};