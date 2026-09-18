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

        String[] lines =
                code.split("\\r?\\n", -1);

        List<Issue> issues =
                new ArrayList<>();

        // Rule 1: Hardcoded password
        for (int i = 0;
             i < lines.length;
             i++) {

            String line =
                    lines[i];

            String matched =
                    findHardcodedPassword(line);

            if (matched != null) {

                issues.add(
                        new Issue(
                                "SECURITY",
                                "HIGH",
                                "Hardcoded password detected",
                                "A password is directly written in the source code.",
                                "Move the password to environment variables or secure application configuration.",
                                i + 1,
                                line.trim(),
                                matched
                        )
                );
            }
        }

        // Rule 2: Hardcoded secret/API key
        for (int i = 0;
             i < lines.length;
             i++) {

            String line =
                    lines[i];

            String matched =
                    findHardcodedSecret(line);

            if (matched != null) {

                issues.add(
                        new Issue(
                                "SECURITY",
                                "HIGH",
                                "Hardcoded secret detected",
                                "A secret or API key appears to be stored directly in the source code.",
                                "Move secrets to environment variables or a secure secret-management system.",
                                i + 1,
                                line.trim(),
                                matched
                        )
                );
            }
        }

        // Rule 3: Debug output
        for (int i = 0;
             i < lines.length;
             i++) {

            String line =
                    lines[i];

            if (findDebugOutput(
                    line,
                    language
            )) {

                issues.add(
                        new Issue(
                                "QUALITY",
                                "LOW",
                                "Debug output detected",
                                "Debug output can remain in production code and make logs noisy.",
                                "Use a proper logging framework instead of direct console output.",
                                i + 1,
                                line.trim(),
                                line.trim()
                        )
                );
            }
        }

        // Rule 4: Empty catch block
        for (int i = 0;
             i < lines.length;
             i++) {

            String line =
                    lines[i];

            if (containsEmptyCatch(
                    line,
                    lines,
                    i
            )) {

                issues.add(
                        new Issue(
                                "BUG",
                                "MEDIUM",
                                "Empty catch block detected",
                                "The exception is caught but no action is taken.",
                                "Handle the exception properly or log it so failures are not silently ignored.",
                                i + 1,
                                line.trim(),
                                "catch"
                        )
                );
            }
        }

        // Rule 5: SQL injection
        for (int i = 0;
             i < lines.length;
             i++) {

            String line =
                    lines[i];

            String matched =
                    findSqlInjection(
                            line,
                            language
                    );

            if (matched != null) {

                issues.add(
                        new Issue(
                                "SECURITY",
                                "CRITICAL",
                                "Possible SQL injection detected",
                                "SQL appears to be constructed using string concatenation, which may allow untrusted input to alter the query.",
                                "Use prepared statements or parameterized queries instead of concatenating user input into SQL.",
                                i + 1,
                                line.trim(),
                                matched
                        )
                );
            }
        }

        // Rule 6: Inefficient loop
        for (int i = 0;
             i < lines.length;
             i++) {

            String line =
                    lines[i];

            String matched =
                    findInefficientLoop(line);

            if (matched != null) {

                issues.add(
                        new Issue(
                                "PERFORMANCE",
                                "MEDIUM",
                                "Potentially inefficient loop detected",
                                "The loop repeatedly performs an operation that may be more efficient outside the loop.",
                                "Move invariant work outside the loop when possible.",
                                i + 1,
                                line.trim(),
                                matched
                        )
                );
            }
        }

        // Rule 7: Magic number
        for (int i = 0;
             i < lines.length;
             i++) {

            String line =
                    lines[i];

            String matched =
                    findMagicNumber(
                            line,
                            language
                    );

            if (matched != null) {

                issues.add(
                        new Issue(
                                "QUALITY",
                                "LOW",
                                "Magic number detected",
                                "A numeric value is used directly without explaining its meaning.",
                                "Replace the value with a clearly named constant.",
                                i + 1,
                                line.trim(),
                                matched
                        )
                );
            }
        }

        // Rule 8: Long method
        addLongMethodIssues(
                lines,
                language,
                issues
        );

        // Rule 9: Duplicate code
        addDuplicateCodeIssues(
                lines,
                issues
        );

        // Rule 10: Unused variable
        addUnusedVariableIssues(
                lines,
                language,
                issues
        );

        // Rule 11: Null pointer risk
        addNullPointerRiskIssues(
                lines,
                language,
                issues
        );

        // Rule 12: Hardcoded URL / IP
        addHardcodedUrlIpIssues(
                lines,
                language,
                issues
        );

        // Rule 13: TODO / FIXME
        addTodoFixmeIssues(
                lines,
                issues
        );

        // Rule 14: Insecure HTTP
        addInsecureHttpIssues(
                lines,
                issues
        );

        // Rule 15: Input validation
        addInputValidationIssues(
                lines,
                language,
                issues
        );

        int securityScore = 100;
        int qualityScore = 100;
        int performanceScore = 100;
        int bugScore = 100;

        for (Issue issue : issues) {

            int deduction =
                    getDeduction(
                            issue.severity()
                    );

            switch (issue.category()) {

                case "SECURITY" ->
                        securityScore =
                                Math.max(
                                        0,
                                        securityScore - deduction
                                );

                case "QUALITY" ->
                        qualityScore =
                                Math.max(
                                        0,
                                        qualityScore - deduction
                                );

                case "PERFORMANCE" ->
                        performanceScore =
                                Math.max(
                                        0,
                                        performanceScore - deduction
                                );

                case "BUG" ->
                        bugScore =
                                Math.max(
                                        0,
                                        bugScore - deduction
                                );
            }
        }

        int overallScore =
                (securityScore
                        + performanceScore
                        + qualityScore
                        + bugScore)
                        / 4;

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

    // ---------------------------------------------------------
    // Rule 1
    // ---------------------------------------------------------

    private String findHardcodedPassword(
            String line
    ) {

        Pattern pattern =
                Pattern.compile(
                        "(?i)(password|passwd|pwd)\\s*=\\s*[\"'][^\"']+[\"']"
                );

        Matcher matcher =
                pattern.matcher(line);

        if (matcher.find()) {
            return matcher.group();
        }

        return null;
    }

    // ---------------------------------------------------------
    // Rule 2
    // ---------------------------------------------------------

    private String findHardcodedSecret(
            String line
    ) {

        Pattern pattern =
                Pattern.compile(
                        "(?i)(api[_-]?key|secret|token)\\s*=\\s*[\"'][^\"']+[\"']"
                );

        Matcher matcher =
                pattern.matcher(line);

        if (matcher.find()) {
            return matcher.group();
        }

        return null;
    }

    // ---------------------------------------------------------
    // Rule 3
    // ---------------------------------------------------------

    private boolean findDebugOutput(
            String line,
            String language
    ) {

        if (line == null) {
            return false;
        }

        String trimmed =
                line.trim();

        if (trimmed.startsWith("//")
                || trimmed.startsWith("/*")
                || trimmed.startsWith("*")
                || trimmed.startsWith("#")) {

            return false;
        }

        if (language == null) {
            return false;
        }

        String normalized =
                language.toLowerCase();

        if (normalized.contains("java")
                || normalized.contains("javascript")
                || normalized.contains("typescript")) {

            return trimmed.contains(
                    "System.out.println("
            )
                    || trimmed.contains(
                    "console.log("
            );
        }

        if (normalized.contains("python")) {

            return trimmed.startsWith(
                    "print("
            );
        }

        return false;
    }

    // ---------------------------------------------------------
    // Rule 4
    // ---------------------------------------------------------

    private boolean containsEmptyCatch(
            String line,
            String[] lines,
            int currentIndex
    ) {

        String trimmed =
                line.trim();

        if (!trimmed.contains("catch")) {
            return false;
        }

        if (trimmed.contains("{}")) {
            return true;
        }

        if (!trimmed.endsWith("{")) {
            return false;
        }

        int braceCount = 1;

        for (int i = currentIndex + 1;
             i < lines.length;
             i++) {

            String nextLine =
                    lines[i].trim();

            if (nextLine.isEmpty()) {
                continue;
            }

            braceCount +=
                    countBraces(nextLine);

            if (braceCount == 0) {
                return true;
            }

            if (!nextLine.equals("}")) {
                return false;
            }
        }

        return false;
    }

    // ---------------------------------------------------------
    // Rule 5
    // ---------------------------------------------------------

    private String findSqlInjection(
            String line,
            String language
    ) {

        if (line == null
                || language == null) {

            return null;
        }

        String normalizedLanguage =
                language.toLowerCase();

        if (!normalizedLanguage.contains("java")
                && !normalizedLanguage.contains("javascript")
                && !normalizedLanguage.contains("typescript")) {

            return null;
        }

        Pattern pattern =
                Pattern.compile(
                        "(?i)(select|insert|update|delete)\\b.*\\+.*"
                );

        Matcher matcher =
                pattern.matcher(line);

        if (matcher.find()) {
            return matcher.group();
        }

        return null;
    }

    // ---------------------------------------------------------
    // Rule 6
    // ---------------------------------------------------------

    private String findInefficientLoop(
            String line
    ) {

        if (line == null) {
            return null;
        }

        String trimmed =
                line.trim();

        Pattern pattern =
                Pattern.compile(
                        "(?i)for\\s*\\([^)]*\\)"
                );

        Matcher matcher =
                pattern.matcher(trimmed);

        if (matcher.find()
                && trimmed.contains(".size()")) {

            return matcher.group();
        }

        return null;
    }

    // ---------------------------------------------------------
    // Rule 7
    // ---------------------------------------------------------

    private String findMagicNumber(
            String line,
            String language
    ) {

        if (line == null
                || language == null) {

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

        Pattern numberPattern =
                Pattern.compile(
                        "(?<![A-Za-z0-9_])\\d+(?![A-Za-z0-9_])"
                );

        Matcher matcher =
                numberPattern.matcher(trimmed);

        while (matcher.find()) {

            String number =
                    matcher.group();

            if (number.equals("0")
                    || number.equals("1")) {

                continue;
            }

            if (trimmed.matches(
                    ".*\\b(class|interface)\\s+\\w+\\s*\\{?.*"
            )) {

                continue;
            }

            return number;
        }

        return null;
    }

    // ---------------------------------------------------------
    // Rule 8
    // ---------------------------------------------------------

    private void addLongMethodIssues(
            String[] lines,
            String language,
            List<Issue> issues
    ) {

        if (language == null) {
            return;
        }

        String normalized =
                language.toLowerCase();

        if (!normalized.contains("java")) {
            return;
        }

        for (int i = 0;
             i < lines.length;
             i++) {

            String line =
                    lines[i].trim();

            if (!looksLikeJavaMethod(line)) {
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
            int endLine = -1;

            for (int j = openingBrace;
                 j < lines.length;
                 j++) {

                braceCount +=
                        countBraces(lines[j]);

                if (j > openingBrace
                        && braceCount == 0) {

                    endLine = j;
                    break;
                }
            }

            if (endLine == -1) {
                continue;
            }

            int meaningfulLines =
                    countMeaningfulLines(
                            lines,
                            openingBrace + 1,
                            endLine
                    );

            if (meaningfulLines
                    > MAX_METHOD_LINES) {

                issues.add(
                        new Issue(
                                "QUALITY",
                                "MEDIUM",
                                "Long method detected",
                                "This method contains more than "
                                        + MAX_METHOD_LINES
                                        + " meaningful lines and may be difficult to maintain.",
                                "Break the method into smaller methods with focused responsibilities.",
                                i + 1,
                                line,
                                line
                        )
                );
            }
        }
    }

    private boolean looksLikeJavaMethod(
            String line
    ) {

        if (line.isEmpty()
                || line.startsWith("//")
                || line.startsWith("/*")
                || line.startsWith("*")) {

            return false;
        }

        return line.matches(
                ".*\\b(public|private|protected)\\b.*\\([^)]*\\).*"
        )
                && !line.contains(" class ")
                && !line.startsWith("if ")
                && !line.startsWith("for ")
                && !line.startsWith("while ")
                && !line.startsWith("switch ");
    }

    private int findMethodOpeningBrace(
            String[] lines,
            int methodLine
    ) {

        for (int i = methodLine;
             i < Math.min(
                     methodLine + 3,
                     lines.length
             );
             i++) {

            if (lines[i].contains("{")) {
                return i;
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

            String trimmed =
                    lines[i].trim();

            if (trimmed.isEmpty()) {
                continue;
            }

            if (trimmed.startsWith("//")
                    || trimmed.startsWith("*")
                    || trimmed.startsWith("/*")) {

                continue;
            }

            count++;
        }

        return count;
    }

    // ---------------------------------------------------------
    // Rule 9
    // ---------------------------------------------------------

    private void addDuplicateCodeIssues(
            String[] lines,
            List<Issue> issues
    ) {

        Map<String, Integer> firstOccurrence =
                new HashMap<>();

        Map<String, Integer> occurrenceCount =
                new HashMap<>();

        for (int i = 0;
             i < lines.length;
             i++) {

            String normalized =
                    normalizeDuplicateLine(
                            lines[i]
                    );

            if (normalized.length()
                    < MIN_DUPLICATE_LINE_LENGTH) {

                continue;
            }

            if (normalized.startsWith("//")
                    || normalized.startsWith("/*")
                    || normalized.startsWith("*")
                    || normalized.startsWith("#")) {

                continue;
            }

            occurrenceCount.put(
                    normalized,
                    occurrenceCount.getOrDefault(
                            normalized,
                            0
                    ) + 1
            );

            firstOccurrence.putIfAbsent(
                    normalized,
                    i
            );
        }

        for (int i = 0;
             i < lines.length;
             i++) {

            String normalized =
                    normalizeDuplicateLine(
                            lines[i]
                    );

            if (normalized.length()
                    < MIN_DUPLICATE_LINE_LENGTH) {

                continue;
            }

            int count =
                    occurrenceCount.getOrDefault(
                            normalized,
                            0
                    );

            Integer first =
                    firstOccurrence.get(
                            normalized
                    );

            if (count > 1
                    && first != null
                    && first != i) {

                issues.add(
                        new Issue(
                                "QUALITY",
                                "LOW",
                                "Duplicate code detected",
                                "This line appears multiple times in the source code.",
                                "Extract repeated logic into a reusable method or constant.",
                                i + 1,
                                lines[i].trim(),
                                lines[i].trim()
                        )
                );
            }
        }
    }

    private String normalizeDuplicateLine(
            String line
    ) {

        return line
                .trim()
                .replaceAll(
                        "\\s+",
                        " "
                );
    }

    // ---------------------------------------------------------
    // Rule 10
    // ---------------------------------------------------------

    private void addUnusedVariableIssues(
            String[] lines,
            String language,
            List<Issue> issues
    ) {

        if (language == null) {
            return;
        }

        String normalizedLanguage =
                language.toLowerCase();

        if (!normalizedLanguage.contains("java")) {
            return;
        }

        Pattern variablePattern =
                Pattern.compile(
                        "\\b(?:int|long|double|float|boolean|String)\\s+(\\w+)\\s*(?:=|;)"
                );

        for (int i = 0;
             i < lines.length;
             i++) {

            String line =
                    lines[i];

            Matcher matcher =
                    variablePattern.matcher(line);

            if (!matcher.find()) {
                continue;
            }

            String variableName =
                    matcher.group(1);

            int usageCount = 0;

            for (int j = 0;
                 j < lines.length;
                 j++) {

                if (j == i) {
                    continue;
                }

                if (lines[j].matches(
                        ".*\\b"
                                + Pattern.quote(variableName)
                                + "\\b.*"
                )) {

                    usageCount++;
                }
            }

            if (usageCount == 0) {

                issues.add(
                        new Issue(
                                "QUALITY",
                                "LOW",
                                "Potentially unused variable",
                                "The variable is declared but no later reference was detected.",
                                "Remove the variable if it is unnecessary or use it where required.",
                                i + 1,
                                line.trim(),
                                variableName
                        )
                );
            }
        }
    }

    // ---------------------------------------------------------
    // Rule 11
    // ---------------------------------------------------------

    private void addNullPointerRiskIssues(
            String[] lines,
            String language,
            List<Issue> issues
    ) {

        if (language == null) {
            return;
        }

        if (!language.toLowerCase().contains("java")) {
            return;
        }

        Pattern declarationPattern =
                Pattern.compile(
                        "\\b(?:String|List<[^>]+>|Map<[^>]+>|\\w+)\\s+(\\w+)\\s*=\\s*null\\s*;"
                );

        for (int i = 0;
             i < lines.length;
             i++) {

            Matcher declarationMatcher =
                    declarationPattern.matcher(
                            lines[i]
                    );

            if (!declarationMatcher.find()) {
                continue;
            }

            String variableName =
                    declarationMatcher.group(1);

            for (int j = i + 1;
                 j < lines.length;
                 j++) {

                String riskExpression =
                        findNullRiskExpression(
                                lines[j],
                                variableName
                        );

                if (riskExpression != null) {

                    issues.add(
                            new Issue(
                                    "BUG",
                                    "HIGH",
                                    "Potential null pointer risk",
                                    "A variable initialized with null is used without an obvious null check.",
                                    "Check the variable for null before accessing it.",
                                    j + 1,
                                    lines[j].trim(),
                                    riskExpression
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

        Pattern pattern =
                Pattern.compile(
                        "\\b"
                                + Pattern.quote(variableName)
                                + "\\s*\\.\\s*\\w+\\s*\\("
                );

        Matcher matcher =
                pattern.matcher(line);

        if (matcher.find()) {
            return matcher.group();
        }

        return null;
    }

    // ---------------------------------------------------------
    // Rule 12
    // ---------------------------------------------------------

    private void addHardcodedUrlIpIssues(
            String[] lines,
            String language,
            List<Issue> issues
    ) {

        if (language == null) {
            return;
        }

        Pattern urlPattern =
                Pattern.compile(
                        "(https?://[^\\s\"'<>]+)"
                );

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

    // ---------------------------------------------------------
    // Rule 13
    // ---------------------------------------------------------

    private void addTodoFixmeIssues(
            String[] lines,
            List<Issue> issues
    ) {

        Pattern todoFixmePattern =
                Pattern.compile(
                        "(?i)\\b(TODO|FIXME)\\b"
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

            boolean isComment =
                    trimmed.startsWith("//")
                            || trimmed.startsWith("/*")
                            || trimmed.startsWith("*")
                            || trimmed.startsWith("#");

            if (!isComment) {
                continue;
            }

            Matcher matcher =
                    todoFixmePattern.matcher(line);

            if (!matcher.find()) {
                continue;
            }

            String matchedKeyword =
                    matcher.group(1);

            String title;
            String description;
            String recommendation;

            if (matchedKeyword.equalsIgnoreCase("TODO")) {

                title =
                        "TODO comment detected";

                description =
                        "The code contains a TODO comment indicating unfinished or pending work.";

                recommendation =
                        "Complete the pending task or remove the TODO comment once the work is finished.";

            } else {

                title =
                        "FIXME comment detected";

                description =
                        "The code contains a FIXME comment indicating a known problem or area that needs correction.";

                recommendation =
                        "Resolve the identified problem and remove the FIXME comment once it is fixed.";
            }

            issues.add(
                    new Issue(
                            "QUALITY",
                            "LOW",
                            title,
                            description,
                            recommendation,
                            i + 1,
                            trimmed,
                            matchedKeyword
                    )
            );
        }
    }

    // ---------------------------------------------------------
    // Rule 14
    // ---------------------------------------------------------

    private void addInsecureHttpIssues(
            String[] lines,
            List<Issue> issues
    ) {

        Pattern httpPattern =
                Pattern.compile(
                        "(?i)\\bhttp://[^\\s\"'<>]+"
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

            boolean isComment =
                    trimmed.startsWith("//")
                            || trimmed.startsWith("/*")
                            || trimmed.startsWith("*")
                            || trimmed.startsWith("#");

            if (isComment) {
                continue;
            }

            Matcher matcher =
                    httpPattern.matcher(line);

            if (!matcher.find()) {
                continue;
            }

            String matchedHttpUrl =
                    matcher.group();

            issues.add(
                    new Issue(
                            "SECURITY",
                            "MEDIUM",
                            "Insecure HTTP detected",
                            "The code uses an HTTP URL, which does not provide encrypted communication and may expose transmitted data.",
                            "Use HTTPS instead of HTTP whenever the endpoint supports secure communication.",
                            i + 1,
                            trimmed,
                            matchedHttpUrl
                    )
            );
        }
    }

    // ---------------------------------------------------------
    // Rule 15
    // ---------------------------------------------------------

    private void addInputValidationIssues(
            String[] lines,
            String language,
            List<Issue> issues
    ) {

        if (language == null) {
            return;
        }

        if (!language.toLowerCase().contains("java")) {
            return;
        }

        Pattern requestParameterPattern =
                Pattern.compile(
                        "@(?:RequestParam|PathVariable|RequestBody)\\b"
                );

        Pattern requestGetParameterPattern =
                Pattern.compile(
                        "\\b(?:request|req)\\.getParameter\\s*\\("
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

            boolean externalInput =
                    requestParameterPattern
                            .matcher(line)
                            .find()
                            ||
                    requestGetParameterPattern
                            .matcher(line)
                            .find();

            if (!externalInput) {
                continue;
            }

            boolean validationFound =
                    hasNearbyValidation(
                            lines,
                            i
                    );

            if (validationFound) {
                continue;
            }

            String matchedInput =
                    findInputMatch(
                            line,
                            requestParameterPattern,
                            requestGetParameterPattern
                    );

            issues.add(
                    new Issue(
                            "SECURITY",
                            "MEDIUM",
                            "Input validation may be missing",
                            "External input is being accepted without an obvious validation check nearby.",
                            "Validate and sanitize external input before processing, storing, or using it.",
                            i + 1,
                            trimmed,
                            matchedInput
                    )
            );
        }
    }

    private boolean hasNearbyValidation(
            String[] lines,
            int inputLine
    ) {

        int start =
                Math.max(
                        0,
                        inputLine - 3
                );

        int end =
                Math.min(
                        lines.length,
                        inputLine + 5
                );

        Pattern validationPattern =
                Pattern.compile(
                        "(?i)\\b(if|validate|validated|validation|isBlank|isEmpty|matches|contains|length|size)\\b"
                );

        for (int i = start;
             i < end;
             i++) {

            if (i == inputLine) {
                continue;
            }

            if (validationPattern
                    .matcher(lines[i])
                    .find()) {

                return true;
            }
        }

        return false;
    }

    private String findInputMatch(
            String line,
            Pattern requestParameterPattern,
            Pattern requestGetParameterPattern
    ) {

        Matcher annotationMatcher =
                requestParameterPattern
                        .matcher(line);

        if (annotationMatcher.find()) {
            return annotationMatcher.group();
        }

        Matcher requestMatcher =
                requestGetParameterPattern
                        .matcher(line);

        if (requestMatcher.find()) {
            return requestMatcher.group();
        }

        return line.trim();
    }

    // ---------------------------------------------------------
    // Score calculation
    // ---------------------------------------------------------

    private int getDeduction(
            String severity
    ) {

        return switch (severity) {

            case "CRITICAL" -> 40;

            case "HIGH" -> 25;

            case "MEDIUM" -> 15;

            case "LOW" -> 5;

            default -> 0;
        };
    }

    // ---------------------------------------------------------
    // Response records
    // ---------------------------------------------------------

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