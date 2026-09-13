import { useState } from "react";
import {
  Code2,
  Play,
  ShieldCheck,
  Bug,
  Zap,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Lightbulb,
} from "lucide-react";

function App() {
  const [code, setCode] = useState(`public class UserService {

    public void processUsers(List<String> users) {

        for (int i = 0; i < users.size(); i++) {

            System.out.println(users.get(i));

        }
    }
}`);

  const [language, setLanguage] = useState("Java");
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);

  const reviewCode = async () => {
    if (!code.trim()) {
      alert("Please enter some code first.");
      return;
    }

    setLoading(true);
    setReview(null);

    try {
      const response = await fetch(
        "http://localhost:8080/api/review",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code,
            language,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to review code");
      }

      const data = await response.json();

      setReview(data);
    } catch (error) {
      console.error(error);

      alert(
        "Unable to connect to the backend. Make sure Spring Boot is running on port 8080."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="bg-blue-600 p-2 rounded-xl">
              <Code2 size={24} />
            </div>

            <div>
              <h1 className="text-xl font-bold">
                CodeLens AI
              </h1>

              <p className="text-xs text-slate-500">
                Intelligent Code Review Platform
              </p>
            </div>

          </div>

          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Sparkles
              size={16}
              className="text-blue-400"
            />

            AI-Powered Code Analysis
          </div>

        </div>
      </header>


      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        <div className="mb-8">

          <h2 className="text-3xl font-bold mb-2">
            Review your code
          </h2>

          <p className="text-slate-400">
            Detect security issues, code quality problems
            and potential bugs automatically.
          </p>

        </div>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Editor */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">

              <div className="flex items-center gap-2">

                <Code2
                  size={18}
                  className="text-blue-400"
                />

                <span className="font-medium">
                  Source Code
                </span>

              </div>


              <select
                value={language}
                onChange={(e) =>
                  setLanguage(e.target.value)
                }
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none"
              >
                <option>Java</option>
                <option>JavaScript</option>
                <option>Python</option>
              </select>

            </div>


            <div className="p-4">

              <textarea
                value={code}
                onChange={(e) =>
                  setCode(e.target.value)
                }
                spellCheck="false"
                className="w-full h-[420px] resize-none bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-sm text-slate-300 outline-none focus:border-blue-500"
                placeholder="Paste your code here..."
              />

            </div>


            <div className="px-4 pb-4">

              <button
                onClick={reviewCode}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed transition rounded-xl py-3 font-semibold"
              >

                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />

                    Analyzing...
                  </>
                ) : (
                  <>
                    <Play size={18} />

                    Review Code
                  </>
                )}

              </button>

            </div>

          </div>


          {/* Results */}
          <div className="space-y-6">

            {!review && !loading && (
              <EmptyState />
            )}

            {loading && (
              <LoadingState />
            )}

            {review && (
              <>

                {/* Scores */}
                <div className="grid grid-cols-2 gap-4">

                  <ScoreCard
                    title="Code Health"
                    score={review.score}
                    icon={<CheckCircle2 size={20} />}
                  />

                  <ScoreCard
                    title="Security"
                    score={review.security}
                    icon={<ShieldCheck size={20} />}
                  />

                  <ScoreCard
                    title="Performance"
                    score={review.performance}
                    icon={<Zap size={20} />}
                  />

                  <ScoreCard
                    title="Quality"
                    score={review.quality}
                    icon={<Bug size={20} />}
                  />

                </div>


                {/* Summary */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

                  <div className="flex items-center gap-2 mb-3">

                    <Lightbulb
                      size={20}
                      className="text-yellow-400"
                    />

                    <h3 className="font-semibold">
                      Review Summary
                    </h3>

                  </div>

                  <p className="text-slate-400 text-sm leading-6">
                    {review.summary}
                  </p>

                </div>


                {/* Issues */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

                  <div className="flex items-center justify-between mb-5">

                    <div className="flex items-center gap-2">

                      <AlertTriangle
                        size={20}
                        className="text-orange-400"
                      />

                      <h3 className="font-semibold">
                        Issues Found
                      </h3>

                    </div>

                    <span className="text-xs bg-slate-800 px-3 py-1 rounded-full text-slate-400">
                      {review.issues?.length || 0} Issues
                    </span>

                  </div>


                  {review.issues?.length > 0 ? (

                    <div className="space-y-4">

                      {review.issues.map(
                        (issue, index) => (

                          <IssueCard
                            key={index}
                            issue={issue}
                          />

                        )
                      )}

                    </div>

                  ) : (

                    <NoIssues />

                  )}

                </div>

              </>
            )}

          </div>

        </div>

      </main>


      <footer className="border-t border-slate-800 mt-12">

        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm text-slate-600">
          CodeLens AI • Intelligent Code Review Platform
        </div>

      </footer>

    </div>
  );
}


/* =========================================
   SCORE CARD
========================================= */

function ScoreCard({
  title,
  score,
  icon,
}) {

  const getScoreColor = () => {

    if (score >= 80) {
      return "text-green-400";
    }

    if (score >= 60) {
      return "text-yellow-400";
    }

    return "text-red-400";
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

      <div className="flex items-center gap-2 text-slate-400 mb-4">

        {icon}

        <span className="text-sm">
          {title}
        </span>

      </div>

      <div
        className={`text-3xl font-bold ${getScoreColor()}`}
      >
        {score}

        <span className="text-sm text-slate-600">
          /100
        </span>

      </div>

    </div>
  );
}


/* =========================================
   ISSUE CARD
========================================= */

function IssueCard({ issue }) {
  const severityStyles = {
    CRITICAL:
      "bg-red-500/10 text-red-400 border-red-500/20",

    HIGH:
      "bg-orange-500/10 text-orange-400 border-orange-500/20",

    MEDIUM:
      "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",

    LOW:
      "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };

  return (
    <div className="border border-slate-800 rounded-xl bg-slate-950/50 overflow-hidden">

      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-800 bg-slate-900/60">

        <div className="flex items-start justify-between gap-4">

          <div>
            <div className="flex items-center gap-3 flex-wrap">

              <h3 className="text-white font-semibold">
                {issue.title}
              </h3>

              <span
                className={`px-2 py-1 rounded-md text-xs font-semibold border ${
                  severityStyles[issue.severity] ||
                  severityStyles.LOW
                }`}
              >
                {issue.severity}
              </span>

            </div>

            <p className="text-xs text-slate-500 mt-2">
              {issue.category}
            </p>
          </div>

          {/* EXACT LINE NUMBER */}
          <div className="shrink-0 flex items-center gap-2">

            <span className="text-xs text-slate-500">
              Line
            </span>

            <span className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-red-600 font-mono text-sm font-semibold">
              {issue.lineNumber}
            </span>

          </div>

        </div>

      </div>


      {/* EXACT ISSUE LOCATION */}
      <div className="p-5">

        <div className="flex items-center justify-between mb-2">

          <p className="text-xs uppercase tracking-wider text-slate-700">
            Exact issue location
          </p>

          {issue.matchedCode && (
            <span className="text-xs text-red-500">
              Highlighted match
            </span>
          )}

        </div>


        {/* CODE BLOCK */}
        <div className="rounded-lg overflow-x-auto border border-slate-800 bg-[#080d18]">

          <div className="flex min-w-max font-mono text-sm">

            {/* LINE NUMBER */}
            <div className="select-none px-4 py-3 text-right bg-slate-900 border-r border-slate-800 text-blue-400 font-semibold">
              {issue.lineNumber}
            </div>


            {/* SOURCE CODE */}
            <div className="px-4 py-3 whitespace-pre text-slate-300">

              <HighlightedCode
                code={issue.code}
                matchedCode={issue.matchedCode}
              />

            </div>

          </div>

        </div>


        {/* DETECTED CODE */}
        {issue.matchedCode && (
          <div className="mt-4">

            <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">
              Exact issue detected
            </p>

            <div className="inline-block rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2">

              <code className="font-mono text-sm text-red-300">
                {issue.matchedCode}
              </code>

            </div>

          </div>
        )}


        {/* PROBLEM */}
        <div className="mt-5">

          <div className="flex items-center gap-2 mb-2">

            <AlertCircle
              size={15}
              className="text-orange-400"
            />

            <p className="text-xs uppercase tracking-wider text-slate-500">
              Problem
            </p>

          </div>

          <p className="text-sm text-slate-300 leading-6">
            {issue.description}
          </p>

        </div>


        {/* RECOMMENDATION */}
        <div className="mt-5">

          <div className="flex items-center gap-2 mb-2">

            <Lightbulb
              size={15}
              className="text-yellow-400"
            />

            <p className="text-xs uppercase tracking-wider text-slate-500">
              Recommendation
            </p>

          </div>

          <p className="text-sm text-green-400 leading-6">
            {issue.recommendation}
          </p>

        </div>

      </div>

    </div>
  );
}


/* =========================================
   HIGHLIGHT MATCHED CODE
========================================= */


function HighlightedCode({ code, matchedCode }) {

  if (!code) {
    return null;
  }

  // If backend did not send matchedCode,
  // simply show the source line.
  if (!matchedCode) {
    return (
      <span className="text-slate-300">
        {code}
      </span>
    );
  }

  const index = code.indexOf(matchedCode);

  // Match not found
  if (index === -1) {
    return (
      <span className="text-slate-300">
        {code}
      </span>
    );
  }

  const before = code.substring(0, index);

  const after = code.substring(
    index + matchedCode.length
  );

  return (
    <>
      <span className="text-slate-300">
        {before}
      </span>

      {/* EXACT PROBLEMATIC CODE */}
      <span className="relative inline-block">

        <span className="rounded-md bg-red-500/20 px-1.5 py-0.5 text-red-300 ring-1 ring-red-500/50">
          {matchedCode}
        </span>

      </span>

      <span className="text-slate-300">
        {after}
      </span>
    </>
  );
}



/* =========================================
   EMPTY STATE
========================================= */

function EmptyState() {

  return (
    <div className="h-full min-h-[300px] bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center p-8">

      <div className="bg-blue-500/10 p-4 rounded-2xl mb-4">

        <Code2
          size={32}
          className="text-blue-400"
        />

      </div>

      <h3 className="text-lg font-semibold mb-2">
        Ready to review
      </h3>

      <p className="text-sm text-slate-500 max-w-sm">
        Paste your source code on the left and
        click Review Code to start the analysis.
      </p>

    </div>
  );
}


/* =========================================
   LOADING STATE
========================================= */

function LoadingState() {

  return (
    <div className="h-full min-h-[300px] bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center p-8">

      <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-5" />

      <h3 className="text-lg font-semibold mb-2">
        Analyzing your code...
      </h3>

      <p className="text-sm text-slate-500">
        Checking security, quality and performance.
      </p>

    </div>
  );
}


/* =========================================
   NO ISSUES
========================================= */

function NoIssues() {

  return (
    <div className="border border-green-500/20 bg-green-500/5 rounded-xl p-6 text-center">

      <CheckCircle2
        size={32}
        className="text-green-400 mx-auto mb-3"
      />

      <h3 className="font-semibold text-green-400 mb-1">
        No issues detected
      </h3>

      <p className="text-sm text-slate-500">
        Your code looks good based on the current
        CodeLens analysis rules.
      </p>

    </div>
  );
}


export default App;