// Vercel discovers functions from the repository-root /api directory.
// Reuse the Express MVC app so /api/chat keeps the same controller and middleware.
export { default } from '../server/api/index.js';
