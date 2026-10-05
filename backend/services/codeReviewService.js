const {
    findHardcodedPassword
} = require("../rules/hardcodedPassword");

const {
    findHardcodedSecret
} = require("../rules/hardcodedSecret");

const {
    findDebugOutput
} = require("../rules/debugOutput");

const {
    findEmptyCatch
} = require("../rules/emptyCatch");

const {
    findSqlInjection
} = require("../rules/sqlInjection");

const {
    findInefficientLoop
} = require("../rules/inefficientLoop");

const {
    findMagicNumber
} = require("../rules/magicNumber");

const {
    findLongMethod
} = require("../rules/longMethod");

const {
    findDuplicateCode
} = require("../rules/duplicateCode");

const {
    findUnusedVariable
} = require("../rules/unusedVariable");

const {
    findNullPointerRisk
} = require("../rules/nullPointerRisk");

const {
    findHardcodedUrlIp
} = require("../rules/hardcodedUrlIp");

const {
    findTodoFixme
} = require("../rules/todoFixme");

const {
    findInsecureHttp
} = require("../rules/insecureHttp");

const {
    findInputValidation
} = require("../rules/inputValidation");


function analyze(code, language) {

    const lines = code.split("\n");
    const issues = [];

    for (let i = 0; i < lines.length; i++) {

        const line = lines[i];


        // Rule 1: Hardcoded Password
        if (findHardcodedPassword(line)) {

            issues.push({
                category: "SECURITY",
                severity: "HIGH",
                title: "Hardcoded password detected",
                description:
                    "A password appears to be directly stored in the source code.",
                recommendation:
                    "Move the password to environment variables or secure configuration.",
                lineNumber: i + 1,
                code: line.trim(),
                matchedCode: line.trim()
            });
        }


        // Rule 2: Hardcoded Secret / API Key
        if (findHardcodedSecret(line)) {

            issues.push({
                category: "SECURITY",
                severity: "HIGH",
                title: "Hardcoded secret detected",
                description:
                    "A secret, API key, or token appears to be directly stored in the source code.",
                recommendation:
                    "Move the secret to environment variables or secure configuration.",
                lineNumber: i + 1,
                code: line.trim(),
                matchedCode: line.trim()
            });
        }


        // Rule 3: Debug Output
        if (findDebugOutput(line)) {

            issues.push({
                category: "QUALITY",
                severity: "LOW",
                title: "Debug output detected",
                description:
                    "Debug output appears to be present in the source code.",
                recommendation:
                    "Remove debug output or replace it with a proper logging mechanism.",
                lineNumber: i + 1,
                code: line.trim(),
                matchedCode: line.trim()
            });
        }


        // Rule 4: Empty Catch Block
        if (findEmptyCatch(lines, i)) {

            issues.push({
                category: "QUALITY",
                severity: "MEDIUM",
                title: "Empty catch block detected",
                description:
                    "An exception is being caught without any handling logic.",
                recommendation:
                    "Handle the exception properly or add appropriate logging.",
                lineNumber: i + 1,
                code: line.trim(),
                matchedCode: line.trim()
            });
        }


        // Rule 5: SQL Injection
        if (findSqlInjection(line)) {

            issues.push({
                category: "SECURITY",
                severity: "HIGH",
                title: "Potential SQL injection detected",
                description:
                    "SQL appears to be constructed using string concatenation.",
                recommendation:
                    "Use prepared statements or parameterized queries instead of string concatenation.",
                lineNumber: i + 1,
                code: line.trim(),
                matchedCode: line.trim()
            });
        }


        // Rule 6: Inefficient Loop
        if (findInefficientLoop(line)) {

            issues.push({
                category: "PERFORMANCE",
                severity: "MEDIUM",
                title: "Potentially inefficient loop detected",
                description:
                    "A loop repeatedly accesses the collection length during iteration.",
                recommendation:
                    "Consider storing the collection length before the loop when appropriate.",
                lineNumber: i + 1,
                code: line.trim(),
                matchedCode: line.trim()
            });
        }


        // Rule 7: Magic Number
        if (findMagicNumber(line)) {

            issues.push({
                category: "QUALITY",
                severity: "LOW",
                title: "Magic number detected",
                description:
                    "An unexplained numeric value is used directly in the code.",
                recommendation:
                    "Replace the value with a descriptive named constant.",
                lineNumber: i + 1,
                code: line.trim(),
                matchedCode: line.trim()
            });
        }


        // Rule 8: Long Method
        if (findLongMethod(lines, i)) {

            issues.push({
                category: "QUALITY",
                severity: "MEDIUM",
                title: "Long method detected",
                description:
                    "This method contains more than 30 lines of code.",
                recommendation:
                    "Consider breaking the method into smaller, focused methods.",
                lineNumber: i + 1,
                code: line.trim(),
                matchedCode: line.trim()
            });
        }


        // Rule 9: Duplicate Code
        if (findDuplicateCode(lines, i)) {

            issues.push({
                category: "QUALITY",
                severity: "MEDIUM",
                title: "Duplicate code detected",
                description:
                    "A line of code appears to be duplicated elsewhere in the source.",
                recommendation:
                    "Consider removing duplicated code or extracting shared logic into a reusable method.",
                lineNumber: i + 1,
                code: line.trim(),
                matchedCode: line.trim()
            });
        }


        // Rule 10: Unused Variable
        if (findUnusedVariable(lines, i)) {

            issues.push({
                category: "QUALITY",
                severity: "LOW",
                title: "Potentially unused variable detected",
                description:
                    "A variable is declared but does not appear to be used later in the code.",
                recommendation:
                    "Remove the variable if it is not needed or use it where appropriate.",
                lineNumber: i + 1,
                code: line.trim(),
                matchedCode: line.trim()
            });
        }


        // Rule 11: Null Pointer Risk
        if (findNullPointerRisk(line)) {

            issues.push({
                category: "BUG",
                severity: "HIGH",
                title: "Potential null pointer risk detected",
                description:
                    "A variable is explicitly assigned null and may cause a null-related error if accessed without checking.",
                recommendation:
                    "Check the value before using it or handle the null case explicitly.",
                lineNumber: i + 1,
                code: line.trim(),
                matchedCode: line.trim()
            });
        }


        // Rule 12: Hardcoded URL / IP
        if (findHardcodedUrlIp(line)) {

            issues.push({
                category: "QUALITY",
                severity: "LOW",
                title: "Hardcoded URL or IP detected",
                description:
                    "A URL or IP address appears to be directly stored in the source code.",
                recommendation:
                    "Move environment-specific URLs and IP addresses to configuration or environment variables.",
                lineNumber: i + 1,
                code: line.trim(),
                matchedCode: line.trim()
            });
        }


        // Rule 13: TODO / FIXME
        if (findTodoFixme(line)) {

            issues.push({
                category: "QUALITY",
                severity: "LOW",
                title: "TODO/FIXME comment detected",
                description:
                    "The source code contains a TODO or FIXME comment indicating unfinished work.",
                recommendation:
                    "Resolve the pending task or track it through a proper issue-management system.",
                lineNumber: i + 1,
                code: line.trim(),
                matchedCode: line.trim()
            });
        }


        // Rule 14: Insecure HTTP
        if (findInsecureHttp(line)) {

            issues.push({
                category: "SECURITY",
                severity: "MEDIUM",
                title: "Insecure HTTP connection detected",
                description:
                    "The code uses an unencrypted HTTP connection.",
                recommendation:
                    "Use HTTPS instead of HTTP when communicating with external services.",
                lineNumber: i + 1,
                code: line.trim(),
                matchedCode: line.trim()
            });
        }


        // Rule 15: Missing Input Validation
        if (findInputValidation(lines, i)) {

            issues.push({
                category: "SECURITY",
                severity: "MEDIUM",
                title: "Potential missing input validation",
                description:
                    "External input appears to be used without nearby validation logic.",
                recommendation:
                    "Validate and sanitize external input before processing it.",
                lineNumber: i + 1,
                code: line.trim(),
                matchedCode: line.trim()
            });
        }
    }


    return {
        score: issues.length > 0 ? 75 : 100,

        security:
            issues.length > 0 ? 60 : 100,

        performance: 100,

        quality:
            issues.length > 0 ? 80 : 100,

        summary:
            issues.length === 0
                ? "No issues detected. Your code looks good."
                : `Found ${issues.length} potential issue(s). Review the findings below.`,

        issues
    };
}


module.exports = {
    analyze
};