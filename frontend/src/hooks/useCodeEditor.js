
export default function useCodeEditor({
  defaultCode,
  setCode,
  setLanguage,
  setReview,
  dismissMessage,
}) {
  function clearCode() {
    setCode("");
    setReview(null);
    dismissMessage();
  }

  function resetCode() {
    setCode(defaultCode);
    setLanguage("Java");
    setReview(null);
    dismissMessage();
  }

  return {
    clearCode,
    resetCode,
  };
}
