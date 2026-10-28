
import { useState } from "react";

import AppFooter from "./components/AppFooter";
import WorkspaceToolbar from "./components/WorkspaceToolbar";
import AppHeader from "./components/AppHeader";
import GitHubExplorer from "./components/GitHubExplorer";
import CodeEditor from "./components/CodeEditor";
import ReviewResults from "./components/ReviewResults";
//import ReviewResultsHeader from "./components/ReviewResultsHeader";
import WorkspaceLayout from "./components/WorkspaceLayout";

import useGitHubRepository from "./hooks/useGitHubRepository";
import useCodeReview from "./hooks/useCodeReview";
import useCodeEditor from "./hooks/useCodeEditor";

const DEFAULT_CODE = `public class UserService {

    public User findUser(int id) {
        String password = "admin123";

        for (int i = 0; i < 100; i++) {
            System.out.println("Searching user...");
        }

        return null;
    }

    public void processUser() {
        // TODO: Add input validation
        int value = 42;
    }
}`;

function PanelHeader({ icon: Icon, title, right }) {
  return (
    <div className="flex h-10 shrink-0 items-center justify-between border-b border-[#CDBCB7]/40 px-3">
      <div className="flex min-w-0 items-center gap-2">
        <Icon size={14} className="text-[#B7D9E0]" />
        <span className="truncate text-[11px] font-semibold uppercase tracking-[0.12em] text-[#09090A]">
          {title}
        </span>
      </div>
      {right}
    </div>
  );
}

export default function App() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [language, setLanguage] = useState("Java");
  const [review, setReview] = useState(null);

  // Step 1: Initialize GitHub functionality first.
  const github = useGitHubRepository({
    setCode,
    setLanguage,
    setReview,
  });

  // Step 2: Initialize code review after github exists.
  const { loading, reviewCode } = useCodeReview({
    code,
    language,
    setReview,
    dismissMessage: github.dismissMessage,
    setError: github.setError,
  });

  const { clearCode, resetCode } = useCodeEditor({
    defaultCode: DEFAULT_CODE,
    setCode,
    setLanguage,
    setReview,
    dismissMessage: github.dismissMessage,
  });

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-gradient-to-br from-[#E5F1F4] via-[#CDE5EB] to-[#B7D9E0] text-[#09090A]">
      {/* Application header */}
      <AppHeader review={review} loading={loading} />

      {/* Workspace toolbar */}
      <WorkspaceToolbar
        repository={github.repository}
        selectedPath={github.selectedPath}
        onReset={resetCode}
      />

      {/* Three-panel workspace */}
      <WorkspaceLayout>
        {/* GitHub Explorer */}
        <GitHubExplorer
          repoUrl={github.repoUrl}
          setRepoUrl={github.setRepoUrl}
          repository={github.repository}
          repoLoading={github.repoLoading}
          loadRepository={github.loadRepository}
          expandedFolders={github.expandedFolders}
          toggleFolder={github.toggleFolder}
          selectedPath={github.selectedPath}
          onSelectFile={(file) => {
            github.setSelectedPath(file.path);
            github.dismissMessage();
          }}
          importFile={github.importFile}
          fileLoading={github.fileLoading}
          onClearRepository={github.clearRepository}
          githubError={github.githubError}
          githubMessage={github.githubMessage}
          dismissMessage={github.dismissMessage}
        />

        {/* Code editor */}
        <section className="flex min-h-0 min-w-0 flex-col overflow-hidden border-b border-[#CDBCB7]/60 xl:border-b-0 xl:border-r">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <CodeEditor
              code={code}
              setCode={setCode}
              language={language}
              setLanguage={setLanguage}
              loading={loading}
              reviewCode={reviewCode}
              clearCode={clearCode}
              resetCode={resetCode}
            />
          </div>
        </section>

        {/* Review results */}
  
       <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <ReviewResults review={review} loading={loading} />
       </section>
      </WorkspaceLayout>

      {/* Footer */}
      <AppFooter />
    </div>
  );
}
