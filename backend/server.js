const express = require("express");
const cors = require("cors");

const {
    analyze
} = require("./services/codeReviewService");

const app = express();

const PORT = 8080;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "CodeLens AI backend is running"
    });
});

app.post("/api/review", (req, res) => {

    const { code, language } = req.body;

    if (!code || code.trim() === "") {

        return res.status(400).json({
            message: "Code is required"
        });
    }

    console.log("Code received:", code);
    console.log("Language:", language);

    const review = analyze(
        code,
        language
    );

    res.json(review);
});

app.listen(PORT, () => {
    console.log(
        `CodeLens AI backend running on port ${PORT}`
    );
});