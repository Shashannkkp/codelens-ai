
const API_URL = "http://localhost:8080";

async function postRequest(endpoint, body) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || `Request failed with status ${response.status}`
    );
  }

  return data;
}

export function loadGitHubRepository(repoUrl) {
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