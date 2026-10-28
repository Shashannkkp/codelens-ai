
import { useEffect, useRef, useState } from "react";
import {
  loadGitHubRepository,
  loadGitHubFile,
} from "../services/githubService";
import { getLanguageFromPath } from "../utils/fileTree";

const SOURCE_EXTENSIONS = /\.(java|js|jsx|ts|tsx|py)$/i;

export default function useGitHubRepository({
  setCode,
  setLanguage,
  setReview,
}) {
  const [repoUrl, setRepoUrl] = useState("");
  const [repository, setRepository] = useState(null);
  const [selectedPath, setSelectedPath] = useState("");
  const [expandedFolders, setExpandedFolders] = useState(new Set());

  const [repoLoading, setRepoLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [githubError, setGithubError] = useState("");
  const [githubMessage, setGithubMessage] = useState("");

  // Request IDs prevent older responses from replacing newer results.
  const repoRequestId = useRef(0);
  const fileRequestId = useRef(0);

  // Controllers allow active network requests to be cancelled.
  const repoAbortController = useRef(null);
  const fileAbortController = useRef(null);

  function setError(message) {
    setGithubError(message);
    setGithubMessage("");
  }

  function cancelRepositoryRequest() {
    repoRequestId.current += 1;
    repoAbortController.current?.abort();
    repoAbortController.current = null;
  }

  function cancelFileRequest() {
    fileRequestId.current += 1;
    fileAbortController.current?.abort();
    fileAbortController.current = null;
  }

  // Cancel outstanding requests when this hook's component unmounts.
  useEffect(() => {
    return () => {
      repoRequestId.current += 1;
      fileRequestId.current += 1;

      repoAbortController.current?.abort();
      fileAbortController.current?.abort();

      repoAbortController.current = null;
      fileAbortController.current = null;
    };
  }, []);

  function toggleFolder(path) {
    setExpandedFolders((previous) => {
      const next = new Set(previous);

      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }

      return next;
    });
  }

  function expandParentFolders(path) {
    const parts = path.split("/");
    const next = new Set();

    for (let index = 1; index < parts.length; index++) {
      next.add(parts.slice(0, index).join("/"));
    }

    setExpandedFolders(next);
  }

  async function loadRepository(event) {
    event?.preventDefault();

    // A new attempt invalidates any older repository or file request.
    cancelRepositoryRequest();
    cancelFileRequest();

    const requestId = repoRequestId.current;

    if (!repoUrl.trim()) {
      setRepoLoading(false);
      setFileLoading(false);
      setError("Enter a public GitHub repository URL.");
      return;
    }

    const controller = new AbortController();
    repoAbortController.current = controller;

    setRepoLoading(true);
    setFileLoading(false);
    setGithubError("");
    setGithubMessage("");
    setRepository(null);
    setSelectedPath("");
    setExpandedFolders(new Set());
    setReview(null);

    try {
      const data = await loadGitHubRepository(repoUrl.trim(), {
        signal: controller.signal,
      });

      // Ignore results from requests that are no longer current.
      if (
        requestId !== repoRequestId.current ||
        controller.signal.aborted
      ) {
        return;
      }

      const sourceFiles = (Array.isArray(data.files) ? data.files : [])
        .filter(
          (file) =>
            file &&
            typeof file.path === "string" &&
            SOURCE_EXTENSIONS.test(file.path)
        );

      setRepository({
        ...data,
        files: sourceFiles,
      });

      if (sourceFiles.length > 0) {
        const firstFile = sourceFiles[0];

        setSelectedPath(firstFile.path);
        expandParentFolders(firstFile.path);

        const fileCountMessage =
          `Loaded ${sourceFiles.length} supported source files.`;

        const limitMessage = data.hasMoreFiles
          ? ` The repository contains ${data.totalFiles} eligible files, but only the first ${data.fileLimit || 500} files are listed.`
          : "";

        setGithubMessage(
          `${fileCountMessage}${limitMessage} Select a file to import it.`
        );
      } else {
        setGithubMessage(
          "Repository loaded, but no Java, JavaScript, TypeScript, or Python files were found."
        );
      }
    } catch (error) {
      if (
        requestId !== repoRequestId.current ||
        controller.signal.aborted ||
        error?.name === "AbortError"
      ) {
        return;
      }

      setError(
        error.message || "Could not connect to the GitHub API."
      );
    } finally {
      if (requestId === repoRequestId.current) {
        setRepoLoading(false);

        if (repoAbortController.current === controller) {
          repoAbortController.current = null;
        }
      }
    }
  }

  async function importFile(file) {
    if (
      !file ||
      !repository ||
      !Array.isArray(repository.files) ||
      !repository.files.some((item) => item.path === file.path)
    ) {
      return;
    }

    // A newer file selection cancels the previous import.
    cancelFileRequest();

    const requestId = fileRequestId.current;
    const currentRepoRequestId = repoRequestId.current;
    const currentRepository = repository;
    const controller = new AbortController();

    fileAbortController.current = controller;

    setFileLoading(true);
    setGithubError("");
    setGithubMessage("");

    try {
      const data = await loadGitHubFile(
        {
          repoUrl:
            currentRepository.repoUrl || repoUrl.trim(),
          path: file.path,
          branch: currentRepository.branch,
        },
        { signal: controller.signal }
      );

      // Never import a file into the editor if the request is stale.
      if (
        requestId !== fileRequestId.current ||
        currentRepoRequestId !== repoRequestId.current ||
        controller.signal.aborted
      ) {
        return;
      }

      setCode(data.code ?? "");
      setLanguage(getLanguageFromPath(file.path));
      setSelectedPath(file.path);
      setReview(null);

      setGithubMessage(`Imported ${file.path}`);
    } catch (error) {
      if (
        requestId !== fileRequestId.current ||
        currentRepoRequestId !== repoRequestId.current ||
        controller.signal.aborted ||
        error?.name === "AbortError"
      ) {
        return;
      }

      setError(
        error.message || "Unable to import the selected file."
      );
    } finally {
      if (requestId === fileRequestId.current) {
        setFileLoading(false);

        if (fileAbortController.current === controller) {
          fileAbortController.current = null;
        }
      }
    }
  }

  function clearRepository() {
    cancelRepositoryRequest();
    cancelFileRequest();

    setRepoLoading(false);
    setFileLoading(false);
    setRepository(null);
    setSelectedPath("");
    setGithubMessage("");
    setGithubError("");
    setExpandedFolders(new Set());
  }

  function dismissMessage() {
    setGithubError("");
    setGithubMessage("");
  }

  return {
    repoUrl,
    setRepoUrl,
    repository,
    selectedPath,
    expandedFolders,
    repoLoading,
    fileLoading,
    githubError,
    githubMessage,
    loadRepository,
    importFile,
    toggleFolder,
    setSelectedPath,
    clearRepository,
    dismissMessage,
    setError,
  };
}
