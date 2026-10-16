
const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8080"
).replace(/\/+$/, "");

async function postRequest(endpoint, body) {
  let response;

  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("The GitHub request was cancelled.");
    }

    throw new Error(
      "Unable to connect to the CodeLens AI backend. Make sure the backend is running and try again."
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.error ||
        data.message ||
        `GitHub request failed with status ${response.status}.`
    );
  }

  return data;
}

export function loadGitHubRepository(repoUrl) {
  if (typeof repoUrl !== "string" || !repoUrl.trim()) {
    return Promise.reject(
      new Error("Please enter a GitHub repository URL.")
    );
  }

  return postRequest("/api/github/repository", {
    repoUrl: repoUrl.trim(),
  });
}

export function loadGitHubFile({ repoUrl, path, branch }) {
  return postRequest("/api/github/file", {
    repoUrl,
    path,
    branch,
  });
}
