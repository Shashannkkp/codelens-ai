package com.codelens.backend.service;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class CodeReviewService {

    private static final int MAX_METHOD_LINES = 30;
    private static final int MIN_DUPLICATE_LINE_LENGTH = 10;

    public ReviewAnalysis analyze(
            String code,
            String language
    ) {

        String[] lines = code.split("\\r?\\n");

        List<Issue> issues = new ArrayList<>();

        // -----------------------------------------
        // Rule 1: Hardcoded Password
        // -----------------------------------------

        for (int i = 0; i < lines.length; i++) {

            String line = lines[i];

            if (findHardcodedPassword(line)) {

                issues.add(
                        new Issue(
                                "SECURITY",
                                "HIGH",
                                "Hardcoded password detected",
                                "A password appears to be directly written in the source code.",
                                "Move passwords to environment variables or a secure secrets manager.",
                                i + 1,
                                line.trim(),
                                line.trim()
                        )
                );
            }
        }

        // -----------------------------------------
        // Rule 2: Hardcoded Secret / API Key
        // -----------------------------------------

        for (int i = 0; i < lines.length; i++) {

            String line = lines[i];

            if (findHardcodedSecret(line)) {

                issues.add(
                        new Issue(
                                "SECURITY",
                                "HIGH",
                                "Hardcoded secret detected",
                                "A secret or API key appears to be stored directly in the source code.",
                                "Store secrets in environment variables or a secure secrets manager.",
                                i + 1,
                                line.trim(),
                                line.trim()
                        )
                );
            }
        }

        // -----------------------------------------
        // Rule 3: Debug Output
        // -----------------------------------------

        for (int i = 0; i < lines.length; i++) {

            String line = lines[i];

            if (findDebugOutput(line, language)) {

                issues.add(
                        new Issue(
                                "QUALITY",
                                "LOW",
                                "Debug output detected",
                                "Debug or console output should generally not remain in production code.",
                                "Remove the debug statement or replace it with a proper logging framework.",
                                i + 1,
                                line.trim(),
                                line.trim()
                        )
                );
            }
        }

        // -----------------------------------------
        // Rule 4: Empty Catch Block
        // -----------------------------------------

        for (int i = 0; i < lines.length; i++) {

            String line = lines[i];

            if (containsEmptyCatch(line, lines, i)) {

                issues.add(
                        new Issue(
                                "QUALITY",
                                "MEDIUM",
                                "Empty catch block detected",
                                "The exception is caught but no action is taken.",
                                "Handle the exception properly or log it so failures are not silently ignored.",
                                i + 1,
                                line.trim(),
                                line.trim()
                        )
                );
            }
        }

        // -----------------------------------------
        // Rule 5: SQL Injection
        // -----------------------------------------

        for (int i = 0; i < lines.length; i++) {

            String line = lines[i];

            if (findSqlInjection(line, language)) {

                issues.add(
                        new Issue(
                                "SECURITY",
                                "CRITICAL",
                                "Possible SQL injection detected",
                                "SQL appears to be constructed using string concatenation or direct user-controlled input.",
                                "Use prepared statements, parameterized queries, or Spring Data/JPA query parameters.",
                                i + 1,
                                line.trim(),
                                line.trim()
                        )
                );
            }
        }

        // -----------------------------------------
        // Rule 6: Inefficient Loop
        // -----------------------------------------

        for (int i = 0; i < lines.length; i++) {

            String line = lines[i];

            if (findInefficientLoop(line)) {

                issues.add(
                        new Issue(
                                "PERFORMANCE",
                                "MEDIUM",
                                "Potentially inefficient loop detected",
                                "The loop may repeatedly perform an operation that could be optimized.",
                                "Consider improving the loop logic or using a more efficient collection operation.",
                                i + 1,
                                line.trim(),
                                line.trim()
                        )
                );
            }
        }

        // -----------------------------------------
        // Rule 7: Magic Number
        // -----------------------------------------

        for (int i = 0; i < lines.length; i++) {

            String line = lines[i];

            String matchedNumber =
                    findMagicNumber(line, language);

            if (matchedNumber != null) {

                issues.add(
                        new Issue(
                                "QUALITY",
                                "LOW",
                                "Magic number detected",
                                "A numeric value is used directly in the code without explaining its meaning.",
                                "Replace the value with a named constant that describes its purpose.",
                                i + 1,
                                line.trim(),
                                matchedNumber
                        )
                );
            }
        }

        // -----------------------------------------
        // Rule 8: Long Method
        // -----------------------------------------

        addLongMethodIssues(
                lines,
                language,
                issues
        );

        // -----------------------------------------
        // Rule 9: Duplicate Code
        // -----------------------------------------

        addDuplicateCodeIssues(
                lines,
                issues
        );

        // -----------------------------------------
        // Rule 10: Unused Variable
        // -----------------------------------------

        addUnusedVariableIssues(
                lines,
                language,
                issues
        );

        // -----------------------------------------
        // Rule 11: Null Pointer Risk
        // -----------------------------------------

        addNullPointerRiskIssues(
                lines,
                language,
                issues
        );

        // -----------------------------------------
        // Rule 12: Hardcoded URL / IP
        // -----------------------------------------

        addHardcodedUrlIpIssues(
                lines,
                language,
                issues
        );

        // -----------------------------------------
        // Calculate Scores
        // -----------------------------------------

        int securityScore = 100;
        int performanceScore = 100;
        int qualityScore = 100;
        int bugScore = 100;

        for (Issue issue : issues) {

            int deduction =
                    getDeduction(issue.severity());

            switch (issue.category().toUpperCase()) {

                case "SECURITY":
                    securityScore -= deduction;
                    break;

                case "PERFORMANCE":
                    performanceScore -= deduction;
                    break;

                case "QUALITY":
                    qualityScore -= deduction;
                    break;

                case "BUG":
                    bugScore -= deduction;
                    break;

                default:
                    break;
            }
        }

        securityScore =
                Math.max(0, securityScore);

        performanceScore =
                Math.max(0, performanceScore);

        qualityScore =
                Math.max(0, qualityScore);

        bugScore =
                Math.max(0, bugScore);

        int overallScore =
                (securityScore
                        + performanceScore
                        + qualityScore
                        + bugScore) / 4;

        String summary;

        if (issues.isEmpty()) {

            summary =
                    "No issues detected. Your code looks good.";

        } else {

            summary =
                    "Found "
                            + issues.size()
                            + " potential issue(s). Review the findings below.";
        }

        return new ReviewAnalysis(
                overallScore,
                securityScore,
                performanceScore,
                qualityScore,
                summary,
                issues
        );
    }

    // =========================================================
    // RULE 1 - HARDCODED PASSWORD
    // =========================================================

    private boolean findHardcodedPassword(
            String line
    ) {

        Pattern pattern =
                Pattern.compile(
                        "(?i)\\b(password|passwd|pwd)\\b\\s*=\\s*[\"'][^\"']+[\"']"
                );

        return pattern.matcher(line).find();
    }

    // =========================================================
    // RULE 2 - HARDCODED SECRET
    // =========================================================

    private boolean findHardcodedSecret(
            String line
    ) {

        Pattern pattern =
                Pattern.compile(
                        "(?i)\\b(api[_-]?key|secret|access[_-]?token|auth[_-]?token)\\b\\s*=\\s*[\"'][^\"']+[\"']"
                );

        return pattern.matcher(line).find();
    }

    // =========================================================
    // RULE 3 - DEBUG OUTPUT
    // =========================================================

    private boolean findDebugOutput(
            String line,
            String language
    ) {

        if (language == null) {
            return false;
        }

        if (language.equalsIgnoreCase("Java")) {

            return line.contains(
                    "System.out.println"
            ) || line.contains(
                    "System.err.println"
            );
        }

        if (language.equalsIgnoreCase("JavaScript")
                || language.equalsIgnoreCase("TypeScript")) {

            return line.contains(
                    "console.log"
            ) || line.contains(
                    "console.error"
            ) || line.contains(
                    "console.warn"
            );
        }

        if (language.equalsIgnoreCase("Python")) {

            return line.trim().startsWith(
                    "print("
            );
        }

        return false;
    }

    // =========================================================
    // RULE 4 - EMPTY CATCH
    // =========================================================

    private boolean containsEmptyCatch(
            String line,
            String[] lines,
            int currentIndex
    ) {

        if (!line.contains("catch")) {
            return false;
        }

        String trimmed =
                line.trim();

        if (trimmed.endsWith("{}")
                || trimmed.endsWith("{ }")) {

            return true;
        }

        if (currentIndex + 1 >= lines.length) {
            return false;
        }

        String nextLine =
                lines[currentIndex + 1].trim();

        return nextLine.equals("}")
                || nextLine.equals("};");
    }

    // =========================================================
    // RULE 5 - SQL INJECTION
    // =========================================================

    private boolean findSqlInjection(
            String line,
            String language
    ) {

        if (language == null
                || !language.equalsIgnoreCase("Java")) {

            return false;
        }

        String lower =
                line.toLowerCase();

        boolean sqlKeyword =
                lower.contains("select ")
                        || lower.contains("insert ")
                        || lower.contains("update ")
                        || lower.contains("delete ");

        boolean stringConcatenation =
                line.contains("\" + ")
                        || line.contains("+ \"")
                        || line.contains("' + ")
                        || line.contains("+ '");

        return sqlKeyword
                && stringConcatenation;
    }

    // =========================================================
    // RULE 6 - INEFFICIENT LOOP
    // =========================================================

    private boolean findInefficientLoop(
            String line
    ) {

        String trimmed =
                line.trim();

        return trimmed.startsWith(
                "for ("
        ) && trimmed.contains(
                ".size()"
        );
    }

    // =========================================================
    // RULE 7 - MAGIC NUMBER
    // =========================================================

    private String findMagicNumber(
            String line,
            String language
    ) {

        if (language == null
                || !language.equalsIgnoreCase("Java")) {

            return null;
        }

        String trimmed =
                line.trim();

        if (trimmed.startsWith("//")
                || trimmed.startsWith("/*")
                || trimmed.startsWith("*")) {

            return null;
        }

        Pattern pattern =
                Pattern.compile(
                        "(?<![A-Za-z0-9_])\\d{2,}(?![A-Za-z0-9_])"
                );

        Matcher matcher =
                pattern.matcher(line);

        if (matcher.find()) {

            return matcher.group();
        }

        return null;
    }

    // =========================================================
    // RULE 8 - LONG METHOD
    // =========================================================

    private void addLongMethodIssues(
            String[] lines,
            String language,
            List<Issue> issues
    ) {

        if (language == null
                || !language.equalsIgnoreCase("Java")) {

            return;
        }

        for (int i = 0;
             i < lines.length;
             i++) {

            String trimmed =
                    lines[i].trim();

            if (!looksLikeJavaMethod(trimmed)) {
                continue;
            }

            int openingBrace =
                    findMethodOpeningBrace(
                            lines,
                            i
                    );

            if (openingBrace == -1) {
                continue;
            }

            int braceCount = 0;
            int end = -1;

            for (int j = openingBrace;
                 j < lines.length;
                 j++) {

                braceCount +=
                        countBraces(lines[j]);

                if (braceCount == 0) {

                    end = j;
                    break;
                }
            }

            if (end == -1) {
                continue;
            }

            int meaningfulLines =
                    countMeaningfulLines(
                            lines,
                            openingBrace + 1,
                            end
                    );

            if (meaningfulLines > MAX_METHOD_LINES) {

                issues.add(
                        new Issue(
                                "QUALITY",
                                "MEDIUM",
                                "Long method detected",
                                "This method contains "
                                        + meaningfulLines
                                        + " meaningful lines of code.",
                                "Consider breaking the method into smaller, focused methods.",
                                i + 1,
                                trimmed,
                                trimmed
                        )
                );
            }
        }
    }

    private boolean looksLikeJavaMethod(
            String line
    ) {

        if (line.startsWith("if ")
                || line.startsWith("if(")
                || line.startsWith("for ")
                || line.startsWith("for(")
                || line.startsWith("while ")
                || line.startsWith("while(")
                || line.startsWith("switch ")
                || line.startsWith("switch(")
                || line.startsWith("catch ")
                || line.startsWith("catch(")) {

            return false;
        }

        return line.matches(
                ".*\\b(public|private|protected|static|final|void|int|String|boolean|double|long)\\b.*\\([^;]*\\).*\\{?.*"
        );
    }

    private int findMethodOpeningBrace(
            String[] lines,
            int methodLine
    ) {

        for (int i = methodLine;
             i < lines.length;
             i++) {

            if (lines[i].contains("{")) {
                return i;
            }

            if (i > methodLine + 3) {
                break;
            }
        }

        return -1;
    }

    private int countBraces(
            String line
    ) {

        int count = 0;

        for (char character :
                line.toCharArray()) {

            if (character == '{') {
                count++;
            }

            if (character == '}') {
                count--;
            }
        }

        return count;
    }

    private int countMeaningfulLines(
            String[] lines,
            int start,
            int end
    ) {

        int count = 0;

        for (int i = start;
             i < end;
             i++) {

            String line =
                    lines[i].trim();

            if (line.isEmpty()) {
                continue;
            }

            if (line.startsWith("//")
                    || line.startsWith("/*")
                    || line.startsWith("*")) {

                continue;
            }

            if (line.equals("{")
                    || line.equals("}")) {

                continue;
            }

            count++;
        }

        return count;
    }

    // =========================================================
    // RULE 9 - DUPLICATE CODE
    // =========================================================

    private void addDuplicateCodeIssues(
            String[] lines,
            List<Issue> issues
    ) {

        Map<String, List<Integer>> occurrences =
                new HashMap<>();

        for (int i = 0;
             i < lines.length;
             i++) {

            String normalized =
                    normalizeDuplicateLine(
                            lines[i]
                    );

            if (normalized == null) {
                continue;
            }

            occurrences
                    .computeIfAbsent(
                            normalized,
                            key -> new ArrayList<>()
                    )
                    .add(i);
        }

        for (Map.Entry<String, List<Integer>> entry
                : occurrences.entrySet()) {

            List<Integer> lineNumbers =
                    entry.getValue();

            if (lineNumbers.size() < 2) {
                continue;
            }

            for (int occurrence = 1;
                 occurrence < lineNumbers.size();
                 occurrence++) {

                int index =
                        lineNumbers.get(occurrence);

                issues.add(
                        new Issue(
                                "QUALITY",
                                "LOW",
                                "Duplicate code detected",
                                "This line of code is repeated elsewhere in the source code.",
                                "Consider extracting the repeated logic into a reusable method, variable, or constant.",
                                index + 1,
                                lines[index].trim(),
                                lines[index].trim()
                        )
                );
            }
        }
    }

    private String normalizeDuplicateLine(
            String line
    ) {

        if (line == null) {
            return null;
        }

        String trimmed =
                line.trim();

        if (trimmed.isEmpty()) {
            return null;
        }

        if (trimmed.startsWith("//")
                || trimmed.startsWith("/*")
                || trimmed.startsWith("*")
                || trimmed.startsWith("#")) {

            return null;
        }

        if (trimmed.equals("{")
                || trimmed.equals("}")
                || trimmed.equals("};")) {

            return null;
        }

        if (trimmed.length()
                < MIN_DUPLICATE_LINE_LENGTH) {

            return null;
        }

        if (trimmed.startsWith("if ")
                || trimmed.startsWith("if(")
                || trimmed.startsWith("for ")
                || trimmed.startsWith("for(")
                || trimmed.startsWith("while ")
                || trimmed.startsWith("while(")
                || trimmed.startsWith("switch ")
                || trimmed.startsWith("switch(")) {

            return null;
        }

        return trimmed.replaceAll(
                "\\s+",
                " "
        );
    }

    // =========================================================
    // RULE 10 - UNUSED VARIABLE
    // =========================================================

    private void addUnusedVariableIssues(
            String[] lines,
            String language,
            List<Issue> issues
    ) {

        if (language == null) {
            return;
        }

        if (!language.equalsIgnoreCase("Java")) {
            return;
        }

        Pattern variablePattern =
                Pattern.compile(
                        "\\b(?:String|int|long|double|float|boolean|char|byte|short)\\s+(\\w+)\\s*(?:=|;)"
                );

        for (int i = 0;
             i < lines.length;
             i++) {

            String line =
                    lines[i];

            String trimmed =
                    line.trim();

            if (trimmed.isEmpty()) {
                continue;
            }

            if (trimmed.startsWith("//")
                    || trimmed.startsWith("/*")
                    || trimmed.startsWith("*")) {

                continue;
            }

            Matcher matcher =
                    variablePattern.matcher(line);

            if (!matcher.find()) {
                continue;
            }

            String variableName =
                    matcher.group(1);

            boolean used = false;

            Pattern usagePattern =
                    Pattern.compile(
                            "\\b"
                                    + Pattern.quote(variableName)
                                    + "\\b"
                    );

            for (int j = 0;
                 j < lines.length;
                 j++) {

                if (i == j) {
                    continue;
                }

                Matcher usageMatcher =
                        usagePattern.matcher(
                                lines[j]
                        );

                if (usageMatcher.find()) {

                    used = true;
                    break;
                }
            }

            if (!used) {

                issues.add(
                        new Issue(
                                "QUALITY",
                                "LOW",
                                "Unused variable detected",
                                "The variable '"
                                        + variableName
                                        + "' is declared but never used.",
                                "Remove the unused variable or use it where required.",
                                i + 1,
                                trimmed,
                                variableName
                        )
                );
            }
        }
    }

    // =========================================================
    // RULE 11 - NULL POINTER RISK
    // =========================================================

    private void addNullPointerRiskIssues(
            String[] lines,
            String language,
            List<Issue> issues
    ) {

        if (language == null
                || !language.equalsIgnoreCase("Java")) {

            return;
        }

        Pattern assignmentPattern =
                Pattern.compile(
                        "\\b(?:String|Object|[A-Z][A-Za-z0-9_<>]*)\\s+(\\w+)\\s*=\\s*[^;]+;"
                );

        for (int i = 0;
             i < lines.length;
             i++) {

            String line =
                    lines[i];

            String trimmed =
                    line.trim();

            if (trimmed.isEmpty()) {
                continue;
            }

            if (trimmed.startsWith("//")
                    || trimmed.startsWith("/*")
                    || trimmed.startsWith("*")) {

                continue;
            }

            Matcher assignmentMatcher =
                    assignmentPattern.matcher(line);

            if (!assignmentMatcher.find()) {
                continue;
            }

            String variableName =
                    assignmentMatcher.group(1);

            for (int j = i + 1;
                 j < lines.length;
                 j++) {

                String usageLine =
                        lines[j].trim();

                if (usageLine.isEmpty()) {
                    continue;
                }

                if (usageLine.equals("}")
                        || usageLine.startsWith("return ")) {

                    break;
                }

                String matchedExpression =
                        findNullRiskExpression(
                                usageLine,
                                variableName
                        );

                if (matchedExpression != null) {

                    issues.add(
                            new Issue(
                                    "BUG",
                                    "MEDIUM",
                                    "Possible null pointer risk",
                                    "The variable '"
                                            + variableName
                                            + "' is used without an explicit null check and may potentially contain null.",
                                    "Check the value for null before using it, or initialize it with a guaranteed non-null value.",
                                    j + 1,
                                    usageLine,
                                    matchedExpression
                            )
                    );

                    break;
                }
            }
        }
    }

    private String findNullRiskExpression(
            String line,
            String variableName
    ) {

        Pattern directUsagePattern =
                Pattern.compile(
                        "\\b"
                                + Pattern.quote(variableName)
                                + "\\s*\\.\\s*[A-Za-z_][A-Za-z0-9_]*\\s*(?:\\([^)]*\\))?"
                );

        Matcher matcher =
                directUsagePattern.matcher(line);

        if (matcher.find()) {

            return matcher.group();
        }

        return null;
    }

    // =========================================================
    // RULE 12 - HARDCODED URL / IP
    // =========================================================

    private void addHardcodedUrlIpIssues(
            String[] lines,
            String language,
            List<Issue> issues
    ) {

        if (language == null) {
            return;
        }

        /*
         * Detect hardcoded HTTP/HTTPS URLs.
         *
         * Example:
         *
         * String apiUrl =
         *     "https://api.example.com/users";
         */

        Pattern urlPattern =
                Pattern.compile(
                        "(https?://[^\\s\"'<>]+)"
                );

        /*
         * Detect IPv4 addresses.
         *
         * Example:
         *
         * String server =
         *     "192.168.1.100";
         */

        Pattern ipPattern =
                Pattern.compile(
                        "(?<![\\d.])"
                                + "(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)"
                                + "(?:\\."
                                + "(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)"
                                + "){3}"
                                + "(?::\\d{1,5})?"
                                + "(?![\\d.])"
                );

        for (int i = 0;
             i < lines.length;
             i++) {

            String line =
                    lines[i];

            String trimmed =
                    line.trim();

            if (trimmed.isEmpty()) {
                continue;
            }

            // Ignore comments.
            if (trimmed.startsWith("//")
                    || trimmed.startsWith("/*")
                    || trimmed.startsWith("*")
                    || trimmed.startsWith("#")) {

                continue;
            }

            Matcher urlMatcher =
                    urlPattern.matcher(line);

            if (urlMatcher.find()) {

                String matchedUrl =
                        urlMatcher.group(1);

                issues.add(
                        new Issue(
                                "QUALITY",
                                "LOW",
                                "Hardcoded URL detected",
                                "A URL is directly embedded in the source code and may make the application environment-dependent.",
                                "Move the URL to application configuration or an environment variable.",
                                i + 1,
                                trimmed,
                                matchedUrl
                        )
                );

                /*
                 * A URL can contain an IP address.
                 * Avoid reporting the same line twice.
                 */
                continue;
            }

            Matcher ipMatcher =
                    ipPattern.matcher(line);

            if (ipMatcher.find()) {

                String matchedIp =
                        ipMatcher.group();

                issues.add(
                        new Issue(
                                "QUALITY",
                                "LOW",
                                "Hardcoded IP address detected",
                                "An IP address is directly embedded in the source code and may make the application environment-dependent.",
                                "Move the IP address to application configuration or an environment variable.",
                                i + 1,
                                trimmed,
                                matchedIp
                        )
                );
            }
        }
    }

    // =========================================================
    // SCORE CALCULATION
    // =========================================================

    private int getDeduction(
            String severity
    ) {

        if (severity == null) {
            return 0;
        }

        return switch (
                severity.toUpperCase()
        ) {

            case "CRITICAL" -> 40;

            case "HIGH" -> 25;

            case "MEDIUM" -> 15;

            case "LOW" -> 5;

            default -> 0;
        };
    }

    // =========================================================
    // RESPONSE RECORDS
    // =========================================================

    public record ReviewAnalysis(
            int score,
            int security,
            int performance,
            int quality,
            String summary,
            List<Issue> issues
    ) {
    }

    public record Issue(
            String category,
            String severity,
            String title,
            String description,
            String recommendation,
            int lineNumber,
            String code,
            String matchedCode
    ) {
    }
}