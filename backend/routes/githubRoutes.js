
const express = require("express");

const router = express.Router();

const GITHUB_API = "https://api.github.com";
const MAX_FILE_SIZE = 1024 * 1024; // 1 MB

const SUPPORTED_EXTENSIONS = [
  ".java",
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".py",
  ".html",
  ".css",
  ".json",
  ".sql",
  ".php",
  ".go",
  ".c",
  ".cpp",
  ".cs",
  ".rb",
  ".php",
  ".sh",
];

function parseGitHubUrl(repoUrl) {
  try {
    const url = new URL(repoUrl);

    if (
      url.protocol !== "https:" ||
      url.hostname !== "github.com" ||
      url.username ||
      url.password
    ) {
      return null;
    }

    const parts = url.pathname
      .split("/")
      .filter(Boolean);

    if (parts.length !== 2) {
      return null;
    }

    const [owner, repo] = parts;

    if (
      !/^[a-zA-Z0-9-]+$/.test(owner) ||
      !/^[a-zA-Z0-9._-]+$/.test(repo)
    ) {
      return null;
    }

    return {
      owner,
      repo: repo.replace(/\.git$/i, ""),
    };
  } catch {
    return null;
  }
}

async function githubGet(url) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "CodeLens-AI",
    },
  });

  if (!response.ok) {
    const error = new Error(
      response.status === 404
        ? "Repository or file not found. Check the URL and make sure the repository is public."
        : response.status === 403 || response.status === 429
          ? "GitHub API rate limit reached. Please wait and try again."
          : `GitHub API request failed (${response.status}).`
    );

    error.status = response.status;
    throw error;
  }

  return response.json();
}

// POST /api/github/repository
// Fetch the default branch and source-file list.
router.post("/repository", async (req, res) => {
  try {
    const { repoUrl } = req.body;

    if (typeof repoUrl !== "string" || !repoUrl.trim()) {
      return res.status(400).json({
        error: "Please enter a GitHub repository URL.",
      });
    }

    const repository = parseGitHubUrl(repoUrl.trim());

    if (!repository || !repository.repo) {
      return res.status(400).json({
        error:
          "Enter a valid public repository URL, such as https://github.com/owner/repository",
      });
    }

    const { owner, repo } = repository;
    const repoApiUrl =
      `${GITHUB_API}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;

    const repoData = await githubGet(repoApiUrl);

    if (repoData.private) {
      return res.status(400).json({
        error: "Private repositories are not supported yet.",
      });
    }

    const branch = repoData.default_branch;

    if (!branch) {
      return res.status(400).json({
        error: "Could not determine the repository's default branch.",
      });
    }

    const treeUrl =
      `${repoApiUrl}/git/trees/${encodeURIComponent(branch)}?recursive=1`;

    const treeData = await githubGet(treeUrl);

    if (treeData.truncated) {
      return res.status(400).json({
        error:
          "This repository is too large to list completely. Try a smaller repository.",
      });
    }

    const files = (treeData.tree || [])
      .filter((item) => {
        if (item.type !== "blob" || !item.path || !item.size) {
          return false;
        }

        if (item.size > MAX_FILE_SIZE) {
          return false;
        }

        const lowerPath = item.path.toLowerCase();

        // Exclude common generated and dependency folders.
        if (
          /(^|\/)(node_modules|vendor|dist|build|\.git|coverage)\//i.test(
            lowerPath
          )
        ) {
          return false;
        }

        return SUPPORTED_EXTENSIONS.some((extension) =>
          lowerPath.endsWith(extension)
        );
      })
      .map((item) => ({
        path: item.path,
        size: item.size,
      }))
      .sort((a, b) => a.path.localeCompare(b.path))
      .slice(0, 500);

    return res.json({
      repository: `${owner}/${repo}`,
      repoUrl: `https://github.com/${owner}/${repo}`,
      branch,
      files,
      totalFiles: files.length,
    });
  } catch (error) {
    console.error("GitHub repository error:", error.message);

    return res.status(error.status || 500).json({
      error: error.message || "Unable to fetch the GitHub repository.",
    });
  }
});

// POST /api/github/file
// Fetch one selected source file.
router.post("/file", async (req, res) => {
  try {
    const { repoUrl, path, branch } = req.body;

    if (
      typeof repoUrl !== "string" ||
      typeof path !== "string" ||
      typeof branch !== "string" ||
      !path.trim() ||
      !branch.trim()
    ) {
      return res.status(400).json({
        error: "Repository, file path, and branch are required.",
      });
    }

    const repository = parseGitHubUrl(repoUrl.trim());

    if (!repository || !repository.repo) {
      return res.status(400).json({
        error: "Invalid GitHub repository URL.",
      });
    }

    if (
      path.startsWith("/") ||
      path.split("/").some((part) => part === "..") ||
      path.includes("\\")
    ) {
      return res.status(400).json({
        error: "Invalid file path.",
      });
    }

    const supported = SUPPORTED_EXTENSIONS.some((extension) =>
      path.toLowerCase().endsWith(extension)
    );

    if (!supported) {
      return res.status(400).json({
        error: "This file type is not supported.",
      });
    }

    const { owner, repo } = repository;

    const apiUrl =
      `${GITHUB_API}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}` +
      `/contents/${path.split("/").map(encodeURIComponent).join("/")}` +
      `?ref=${encodeURIComponent(branch)}`;

    const fileData = await githubGet(apiUrl);

    if (fileData.type !== "file" || !fileData.content) {
      return res.status(400).json({
        error: "The selected item is not a readable file.",
      });
    }

    if (
      typeof fileData.size !== "number" ||
      fileData.size > MAX_FILE_SIZE
    ) {
      return res.status(400).json({
        error: "Files must be smaller than 1 MB.",
      });
    }

    if (fileData.encoding !== "base64") {
      return res.status(400).json({
        error: "GitHub returned an unsupported file encoding.",
      });
    }

    const code = Buffer.from(fileData.content, "base64").toString("utf8");

    return res.json({
      path: fileData.path,
      code,
      size: fileData.size,
      branch,
    });
  } catch (error) {
    console.error("GitHub file error:", error.message);

    return res.status(error.status || 500).json({
      error: error.message || "Unable to import this file.",
    });
  }
});

module.exports = router;
