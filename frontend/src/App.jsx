import { useState } from "react";
import {
  Sparkles,
  ShieldCheck,
  Bug,
  Zap,
} from "lucide-react";

import Navbar from "./components/Navbar";
import CodeEditor from "./components/CodeEditor";
import ReviewResults from "./components/ReviewResults";

const DEFAULT_CODE = `public class UserService {

    public void processUsers(List<String> users) {

        for (int i = 0; i < users.size(); i++) {

            System.out.println(users.get(i));

        }
    }
}`;

function App() {
  const [code, setCode] = useState(DEFAULT_CODE);
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
        "Unable to connect to the backend. Make sure the CodeLens backend is running on port 8080."
      );
    } finally {
      setLoading(false);
    }
  };

  const clearCode = () => {
    setCode("");
    setReview(null);
  };

  const resetCode = () => {
    setCode(DEFAULT_CODE);
    setLanguage("Java");
    setReview(null);
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-slate-950 text-white flex flex-col">
      
      {/* Navbar */}
      <Navbar />

      {/* Main Application Area */}
      <main className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col">

          {/* Hero Section */}
          <section className="shrink-0 mb-5">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">

              <div>
                <div className="flex items-center gap-2 text-blue-400 text-sm font-medium mb-2">
                  <Sparkles size={16} />
                  <span>AI-powered developer tooling</span>
                </div>

              </div>

              {/* Feature Badges */}
              <div className="flex flex-wrap gap-2">
                <FeatureBadge
                  icon={<ShieldCheck size={14} />}
                  text="Security"
                />

                <FeatureBadge
                  icon={<Bug size={14} />}
                  text="Bug Detection"
                />

                <FeatureBadge
                  icon={<Zap size={14} />}
                  text="Performance"
                />
              </div>

            </div>
          </section>

          {/* Editor + Results */}
          <section className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-2 gap-5">

            {/* Left - Code Editor */}
            <div className="min-h-0 h-full">
              <CodeEditor
                code={code}
                setCode={setCode}
                language={language}
                setLanguage={setLanguage}
                clearCode={clearCode}
                resetCode={resetCode}
                reviewCode={reviewCode}
                loading={loading}
              />
            </div>

            {/* Right - Review Results */}
            <div className="min-h-0 h-full">
              <ReviewResults
                review={review}
                loading={loading}
              />
            </div>

          </section>
        </div>
      </main>
    </div>
  );
}

function FeatureBadge({ icon, text }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-800 bg-slate-900/70 text-xs text-slate-400">
      {icon}
      {text}
    </div>
  );
}

export default App;