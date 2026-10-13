
const express = require("express");
const cors = require("cors");

const githubRoutes = require("./routes/githubRoutes");
const { analyze } = require("./services/codeReviewService");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Basic health check
app.get("/", (req, res) => {
  res.send("CodeLens AI backend is running");
});

// GitHub repository routes
app.use("/api/github", githubRoutes);

// Existing code review API — preserve your 15 rules
app.post("/api/review", (req, res) => {
  const { code, language } = req.body;

  if (!code || !code.trim()) {
    return res.status(400).json({
      error: "Please provide code to review.",
    });
  }

  try {
    const result = analyze(code, language);
    return res.json(result);
  } catch (error) {
    console.error("Code review error:", error);

    return res.status(500).json({
      error: "An error occurred while reviewing the code.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`CodeLens AI backend running on port ${PORT}`);
});
