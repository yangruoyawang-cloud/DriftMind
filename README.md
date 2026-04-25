<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/e5db03f8-d6c6-486a-a641-e34d50fe9fa6

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy (Render)

1. Push this repo to GitHub.
2. In Render, click `New +` -> `Blueprint`.
3. Select this repository. Render will read `render.yaml`.
4. Set secret env var:
   - `GEMINI_API_KEY` = your Gemini API key
5. Deploy and verify:
   - `https://<your-render-domain>/api/health`
   - Check `diagnostics.HAS_KEY` is `true`.

Rate limit defaults:
- `API_RATE_LIMIT_WINDOW_MS=60000`
- `API_RATE_LIMIT_MAX=30`
