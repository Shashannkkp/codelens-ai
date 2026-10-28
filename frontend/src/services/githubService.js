
const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8080"
).replace(/\/+$/, "");

async function postRequest(endpoint, body, { signal } = {}) {
  let response;

  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal,
    });
  } catch (error) {
    // Let the hook handle intentional cancellations.
    if (error?.name === "AbortError") {
      throw error;
    }

    throw new Error(
      "Unable to connect to the CodeLens AI backend. Make sure the backend is running and try again."
    );
  }

  let data = {};

  try {
    data = await response.json();
  } catch {
    // The server may return an empty or non-JSON response.
  }

  if (!response.ok) {
    throw new Error(
      data.error ||
        data.message ||
        `GitHub request failed with status ${response.status}.`
    );
  }

  return data;
}

export function loadGitHubRepository(repoUrl, { signal } = {}) {
  if (typeof repoUrl !== "string" || !repoUrl.trim()) {
    return Promise.reject(
      new Error("Please enter a GitHub repository URL.")
    );
  }

  return postRequest(
    "/api/github/repository",
    { repoUrl: repoUrl.trim() },
    { signal }
  );
}

export function loadGitHubFile(
  { repoUrl, path, branch },
  { signal } = {}
) {
  return postRequest(
    "/api/github/file",
    { repoUrl, path, branch },
    { signal }
  );
}
