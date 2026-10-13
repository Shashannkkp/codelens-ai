
const API_URL = "http://localhost:8080";

export async function reviewCodeRequest({ code, language }) {
  const response = await fetch(`${API_URL}/api/review`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code, language }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || `Code review failed with status ${response.status}`
    );
  }

  return data;
}