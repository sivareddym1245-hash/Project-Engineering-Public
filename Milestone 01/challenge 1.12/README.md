# AI Chatbot

## What I Built
A minimal AI chatbot with a Node.js Express backend and a vanilla JS frontend.

## API and Model
**API:** OpenRouter  
**Model:** openai/gpt-4o-mini  
**Why backend only:** API keys exposed in frontend JavaScript are readable by anyone who opens browser DevTools. A backend proxy keeps the key server-side and never sends it to the browser.  
**Fallback provider:** Google Gemini API (free tier). Switching requires changing the base URL to `https://generativelanguage.googleapis.com/v1beta/openai/` and the model name to `gemini-1.5-flash`.

## Live Deployment
**Frontend:** https://delicate-taffy-25c39a.netlify.app
**Backend:** https://project-engineering-public-1.onrender.com