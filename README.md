# CodeLens AI

CodeLens AI is a browser-based code review workspace. It combines an AI-assisted review with local rule-based checks, helping developers spot potential security, performance, and code-quality issues. You can write or paste code in the editor, or import a supported source file from a public GitHub repository.

> This repository contains a software project, not a personal resume or portfolio. No resume PDF, personal contact details, live demo, or repository-specific URL is currently included.

## Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Usage](#usage)
- [API](#api)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [Contact](#contact)
- [License](#license)

## About the Project

CodeLens AI provides a focused workspace for reviewing source code. The React frontend includes a code editor, a GitHub repository explorer, and a results panel. The Node.js/Express backend combines findings from local analysis rules with a Gemini-powered review and returns issue details and category scores.

The project is intended as a development aid. Review results are suggestions and should be checked by a developer before changing or relying on code.

## Features

- **AI-assisted code review:** Uses the Google Gemini API to generate review findings.
- **Rule-based checks:** Supplements AI results with 15 local checks, including checks for hardcoded credentials, SQL injection patterns, insecure HTTP, empty catch blocks, and input validation.
- **Issue summaries and scores:** Presents findings with severity and code-quality, security, and performance scores.
- **GitHub file import:** Loads source files from public GitHub repositories for review.
- **Editable workspace:** Review imported code or enter code directly in the editor.
- **Supported editor languages:** Java, JavaScript, and Python.
- **Responsive three-panel interface:** Brings repository browsing, editing, and review output together.

GitHub import currently supports public repositories and selected source formats, including Java, JavaScript/TypeScript, Python, HTML, CSS, SQL, Go, C/C++, C#, PHP, Ruby, shell scripts, and JSON. The backend limits imported files to 1 MB and lists up to 500 supported files per repository.

## Technology Stack

| Area | Technologies |
| --- | --- |
| Frontend | React 19, Vite, Tailwind CSS, Lucide React |
| Main backend | Node.js, Express 5 |
| AI review | Google Gemini API via `@google/genai` |
| Repository access | GitHub REST API |
| Alternative backend | Java 25, Spring Boot 4 |

## Project Structure

```text
.
├── backend/          # Express API, GitHub integration, and review services
├── backend-spring/   # Separate Spring Boot rule-based review backend
└── frontend/         # React and Vite application
```

The frontend is configured to call the Express backend at `http://localhost:8080`. The Spring Boot project is separate and does not provide the GitHub repository endpoints or Gemini integration used by the full application.

## Getting Started

### Prerequisites

- Node.js (current LTS recommended) and npm
- A Google Gemini API key for AI-assisted reviews
- Git

### Clone the repository

Replace the URL below with the clone URL for your GitHub repository:

```bash
git clone https://github.com/<your-account>/<your-repository>.git
cd <your-repository>
```

### Install dependencies

From the repository root, install dependencies separately for the frontend and Express backend:

```bash
cd backend
npm install
cd ../frontend
npm install
```

### Configure and run the backend

Create `backend/.env` and add your Gemini API key:

```dotenv
GEMINI_API_KEY=your_gemini_api_key
PORT=8080
```

Then start the API:

```bash
# Run this from the repository root in its own terminal.
cd backend
npm start
```

For development with automatic restarts, use `npm run dev` instead.

### Run the frontend

In a second terminal:

```bash
# Run this from the repository root.
cd frontend
npm run dev
```

Open the local URL printed by Vite (typically `http://localhost:5173`). Keep the backend running at `http://localhost:8080` while using the app.

## Configuration

| Variable | Required | Description |
| --- | --- | --- |
| `GEMINI_API_KEY` | Yes for AI reviews | API key used by the Gemini review service. |
| `PORT` | No | Express server port; defaults to `8080`. |
| `GITHUB_TOKEN` | No | Optional GitHub token for repository API requests, useful when unauthenticated rate limits are reached. |

Keep API keys in `backend/.env`; do not commit that file or expose secrets in frontend code. The GitHub integration can make unauthenticated requests when `GITHUB_TOKEN` is not set, subject to GitHub's rate limits.

## Usage

1. Start the backend and frontend as described above.
2. In the app, either enter code in the editor or provide the URL of a public GitHub repository and import a supported file.
3. Choose Java, JavaScript, or Python in the editor when reviewing code directly.
4. Run the review and inspect the findings, severity levels, recommendations, and category scores.
5. Treat findings as prompts for further investigation; automated analysis can produce false positives or miss issues.

## API

The Express backend exposes these endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/` | Health check. |
| `POST` | `/api/review` | Reviews submitted source code. Expects JSON containing `code` and an optional `language`. |
| `POST` | `/api/github/repository` | Lists supported source files in a public GitHub repository. Expects JSON containing `repoUrl`. |
| `POST` | `/api/github/file` | Imports a selected source file. Expects `repoUrl`, `path`, and `branch`. |

## Screenshots

No application screenshot is currently included in the repository. Add a captured UI image under `frontend/src/assets/` (or another documented image folder) and embed it here when one is available, for example:

```markdown
![CodeLens AI workspace](frontend/src/assets/codelens-workspace.png)
```

## Contributing

Contributions are welcome. To propose a change:

1. Fork the repository and create a focused branch.
2. Make the change and verify the relevant frontend build or backend behavior.
3. Open a pull request describing the motivation, implementation, and any manual or automated checks performed.

Please do not include API keys, personal credentials, or other secrets in commits. The frontend provides `npm run lint` and `npm run build` scripts.

## Contact

No personal or maintainer contact details are configured in this repository. For project questions or bug reports, open an issue in the GitHub repository where you found this README.

## License

There is no repository-wide `LICENSE` file at this time. The backend package metadata declares ISC for that package, but this does not establish a license for the complete repository. Please contact the repository maintainer before reusing or redistributing the project, and add a root license file once the intended license is confirmed.
