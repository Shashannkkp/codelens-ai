
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const githubRoutes = require("./routes/githubRoutes");

const {
    analyze
} = require("./services/codeReviewService");

const {
    reviewWithGemini
} = require("./services/geminiReviewService");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Health check
app.get("/", (req, res) => {
    res.json({
        message: "CodeLens AI backend is running."
    });
});

// Preserve GitHub repository integration
app.use("/api/github", githubRoutes);

// Calculate scores using the combined findings
function calculateScore(issues, categories = null) {
    const normalize = (value) =>
        String(value || "").trim().toUpperCase();

    const penalties = {
        CRITICAL: 25,
        HIGH: 15,
        MEDIUM: 8,
        LOW: 2
    };

    const relevantIssues = categories
        ? issues.filter((issue) =>
            categories.includes(normalize(issue.category))
        )
        : issues;

    const penalty = relevantIssues.reduce(
        (total, issue) =>
            total + (penalties[normalize(issue.severity)] || 0),
        0
    );

    return Math.max(0, 100 - penalty);
}

// Combine AI findings and local rule-based findings
function combineIssues(aiIssues = [], ruleIssues = []) {
    const combined = [];
    const seen = new Set();

    const normalize = (value) =>
        String(value ?? "")
            .trim()
            .toLowerCase()
            .replace(/\s+/g, " ");

    for (const issue of [...aiIssues, ...ruleIssues]) {
        if (!issue || typeof issue !== "object") {
            continue;
        }

        const category = normalize(issue.category);
        const title = normalize(issue.title);
        const lineNumber = Number(issue.lineNumber);

        // Keep findings with incomplete identities instead of deduplicating them.
        const key =
            category &&
            title &&
            Number.isInteger(lineNumber) &&
            lineNumber >= 0
                ? [category, lineNumber, title].join("|")
                : null;

        if (key && seen.has(key)) {
            continue;
        }

        if (key) {
            seen.add(key);
        }

        combined.push(issue);
    }

    return combined;
}


// Gemini-powered code review
app.post("/api/review", async (req, res) => {
    try {
        const {
            code,
            language = "JavaScript"
        } = req.body || {};

        if (typeof code !== "string" || !code.trim()) {
            return res.status(400).json({
                error: "Please provide source code to review."
            });
        }

        if (code.length > 30000) {
            return res.status(413).json({
                error: "Code is too long. Please submit up to 30,000 characters."
            });
        }

        if (typeof language !== "string" || !language.trim()) {
            return res.status(400).json({
                error: "Please specify the programming language."
            });
        }

        // Run the existing local analyzer
        const ruleReview = analyze(code, language.trim());

        // Run Gemini as the main reviewer
        const aiReview = await reviewWithGemini(
            code,
            language.trim()
        );

        // Merge findings and remove exact duplicates
        const issues = combineIssues(
            aiReview.issues,
            ruleReview.issues
        );

        return res.json({
            ...aiReview,
            score: calculateScore(issues),
            security: calculateScore(issues, ["SECURITY"]),
            performance: calculateScore(issues, ["PERFORMANCE"]),
            quality: calculateScore(issues, ["QUALITY", "BUG"]),
            summary: aiReview.summary ||
                `Found ${issues.length} potential issue(s).`,
            issues
        });
    } catch (error) {
        console.error("Code review failed:", error);

        return res.status(500).json({
            error: error.message ||
                "An error occurred while reviewing the code."
        });
    }
});

app.listen(PORT, () => {
    console.log(
        `CodeLens AI backend running on port ${PORT}`
    );
});
