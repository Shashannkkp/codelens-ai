
import { useState } from "react";
import { reviewCodeRequest } from "../services/reviewService";

export default function useCodeReview({
  code,
  language,
  setReview,
  dismissMessage,
  setError,
}) {
  const [loading, setLoading] = useState(false);

  async function reviewCode() {
    if (!code.trim()) {
      setError("Please enter some code to review.");
      return;
    }

    setLoading(true);
    dismissMessage();

    try {
      const data = await reviewCodeRequest({
        code,
        language,
      });

      setReview(data);
    } catch (error) {
      setError(
        error.message || "Unable to reach the CodeLens AI backend."
      );
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    reviewCode,
  };
}
