# Kindred — Serverless AI Chatbot

A beginner-friendly MERN-style chatbot built with React and Vite, Express, Node.js, and the official OpenAI JavaScript SDK. The backend follows a small MVC structure: routes receive requests, controllers validate them, and a service calls OpenAI. Vercel runs the same Express app as a serverless function.

## 1. Project structure

```text
.
├── client/                         # React + Vite interface
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/              # Chat window, messages, input, navbar, loader
│       ├── services/chatService.js  # Calls the backend API
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
├── api/                            # Vercel discovers functions here
│   ├── chat.js                     # /api/chat serverless entry point
│   └── health.js                   # /api/health serverless entry point
├── server/                         # Express backend
│   ├── api/index.js                 # Shared Express function adapter
│   ├── config/openai.js
│   ├── controllers/chatController.js
│   ├── middleware/errorMiddleware.js
│   ├── routes/chatRoutes.js
│   ├── services/aiService.js
│   ├── utils/promptTemplate.js
│   ├── app.js
│   └── package.json
├── .env.example
├── .gitignore
├── package.json                    # Root scripts for local development
├── vercel.json
└── README.md
```

Conversations are stored in the browser's local storage for this demo. The API receives recent conversation turns with each new message, so the assistant can use context without a database.

## 2. Backend and API

The frontend sends `POST /api/chat` with JSON shaped like:

```json
{
  "message": "What is a serverless function?",
  "history": [{ "role": "user", "content": "Hello" }, { "role": "assistant", "content": "Hi!" }]
}
```

The controller rejects empty or oversized messages and filters history to recent user and assistant text with a total history budget. The service adds the shared system prompt and calls OpenAI. The API key is read only by Node from `OPENAI_API_KEY`; it is never put in the React bundle. The API returns `{ "reply": "..." }` or `{ "error": "..." }` with an appropriate HTTP status. Vercel discovers the chat and health handlers from the repository-root `api/` directory and both forward to the shared Express app.

### Security basics

- Helmet adds common HTTP security headers. CORS allows same-origin requests, the local Vite origin, and any explicitly listed `ALLOWED_ORIGINS`.
- Chat requests are limited to 20 per 15-minute window per client IP, and JSON request bodies and conversation history have size limits. The in-memory limiter is a basic safeguard; for a high-traffic serverless deployment, use a shared rate-limit store such as Redis/KV.
- Provider errors are not returned verbatim or logged with request bodies. React renders message content as text, not executable HTML.
- This demo has no user authentication. Do not use it to expose a paid API publicly without adding authentication and a shared rate-limit store.

## 3. Frontend

The React app includes a collapsible conversation sidebar, new, delete, and clear actions, saved conversations, copy response, suggestion prompts, Enter-to-send (Shift+Enter adds a line), text/Markdown file attachment, loading dots, automatic scrolling, workspace settings, a saved dark appearance option, and responsive mobile navigation. The app reports connection, configuration, rate-limit, and AI-service errors in the interface.

## 4. Run locally

### Prerequisites

- Node.js 20 or newer and npm
- An OpenAI API key with API access and billing/quota available

### Setup

1. From the project root, copy `.env.example` to `.env`.
2. Put your key in `.env` as `OPENAI_API_KEY=...`. Keep the key private. `.env` is ignored by Git.
3. Install dependencies and start both apps:

```bash
npm install
npm --prefix server install
npm --prefix client install
npm run dev
```

4. Open the Vite URL printed in the terminal (usually `http://localhost:5173`). The Vite development server forwards `/api` requests to Express at `http://localhost:5000`.
5. To run only the API, use `npm run dev:server`; check `http://localhost:5000/api/health` for `{"status":"ok"}`. To make a production frontend bundle, run `npm run build`.

If the key is missing, the API still starts and the chat shows a configuration error when you send a message. By default the app uses OpenAI with `gpt-4o-mini`. A Groq key (`gsk_...`) is detected automatically and uses Groq's OpenAI-compatible endpoint with `openai/gpt-oss-120b` by default. You can set `OPENAI_BASE_URL` and `OPENAI_MODEL` to override those defaults. Keep the key in `.env`; never send it through the React app or commit it.

If the chat says it cannot connect to the AI provider, restart the backend after changing `.env` and confirm the machine running Node can make outbound HTTPS requests to the configured provider. The app now shows different messages for connection failures, invalid credentials, unavailable models, and provider rate limits.

## 5. Push the project to GitHub

1. Create an empty repository on [GitHub](https://github.com/new). Do not initialize it with a README if you plan to push this existing project.
2. In a terminal opened in this project folder, initialize and commit:

```bash
git init
git add .
git commit -m "Build serverless AI chatbot"
git branch -M main
```

3. Add the repository URL GitHub shows you, then push:

```bash
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Replace the example username and repository name with your own. Before pushing, make sure `.env` does not appear in `git status` and never paste your API key into source code, commits, or screenshots.

## 6. Deploy on Vercel

1. Sign in to [Vercel](https://vercel.com/) and choose **Add New → Project**.
2. Import the GitHub repository. Keep the project root as the repository root; `vercel.json` already selects `client/dist` as the frontend output and routes `/api/*` to the Express function.
3. In the Vercel project's **Settings → Environment Variables**, add `OPENAI_API_KEY` with your secret key. Optionally add `OPENAI_MODEL` (defaults to `gpt-4o-mini` for OpenAI and `openai/gpt-oss-120b` for Groq), `OPENAI_BASE_URL` (Groq is detected automatically from a `gsk_` key), and `ALLOWED_ORIGINS` (comma-separated extra trusted browser origins). Add them to the environments you intend to use (Production, and Preview if needed).
4. Click **Deploy**. Vercel runs the root build command, `npm run build`, which builds the Vite client. The API handlers live under the root `api/` directory; `/api/chat` and `/api/health` reach the shared Express app.
5. Once deployment finishes, open the public `*.vercel.app` URL. Test the UI with a message, and optionally visit `/api/health` to confirm the API is up.
6. Future pushes to the connected GitHub branch trigger a new deployment. If you change environment variables, redeploy so the function receives them.

## Notes

- The API does not expose the OpenAI key to browser code. The API endpoint is public, however, so a real public launch should add user authentication, request throttling, and cost controls.
- Chat history is saved in the current browser only, not a database or across devices. The workspace settings include an option to clear browser-saved conversations.
- Vercel's free plan and OpenAI API usage have separate limits. Check each account's current plan and usage before sharing the app widely.
