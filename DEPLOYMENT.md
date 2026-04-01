# Deployment To-Do List

This document outlines the steps required to deploy the **5s Arena Blog** (Frontend & Backend).

## 1. Prerequisites
- [ ] Create a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account and a cluster.
- [ ] Create an [ImageKit.io](https://imagekit.io/) account for image CDN.
- [ ] Create a [Google Cloud Console](https://console.cloud.google.com/) project for Google OAuth (if using).
- [ ] Choose deployment platforms (e.g., **Vercel/Netlify** for Frontend, **Render/Heroku/Railway** for Backend).

## 2. Backend Deployment (Express API)
- [ ] **Database Connection:** 
  - Obtain the Connection String from MongoDB Atlas.
  - Ensure the IP address of your deployment server is whitelisted in Atlas (or set to `0.0.0.0/0` for dynamic IPs).
- [ ] **Environment Variables:** Set the following on your backend hosting platform:
  - `MONGODB_URI`: Your MongoDB Atlas connection string.
  - `JWT_SECRET`: A strong, random string for signing tokens.
  - `CLIENT_URL`: The URL of your deployed frontend (e.g., `https://5s-arena-blog.vercel.app`).
  - `PORT`: Usually handled by the platform (default `5000`).
- [ ] **Code Changes Required:**
  - [ ] Update `server/index.js` CORS settings if necessary (already uses `CLIENT_URL` env).
- [ ] **Build Command:** `npm install`
- [ ] **Start Command:** `npm run server`

## 3. Frontend Deployment (React/Vite)
- [ ] **Environment Variables:** Set the following in your frontend build settings:
  - `VITE_API_BASE_URL`: The URL of your deployed backend (e.g., `https://5s-arena-api.onrender.com/api`).
  - `VITE_IK_URL_ENDPOINT`: Your ImageKit URL endpoint.
  - `VITE_IK_PUBLIC_KEY`: Your ImageKit public key.
  - `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth Client ID.
- [x] **Code Changes Required:**
  - [x] **CRITICAL:** Update `src/services/api.js` to use `import.meta.env.VITE_API_BASE_URL` instead of hardcoded `localhost:5000`. (Done)
- [ ] **Build Settings:**
  - **Build Command:** `npm run build`
  - **Output Directory:** `dist`

## 4. Final Verification
- [ ] Verify frontend can reach backend API.
- [ ] Test Login/Registration flow.
- [ ] Test Image uploads/display via ImageKit.
- [ ] Verify SEO meta tags are working on social media (using tools like [metatags.io](https://metatags.io/)).

## 5. Security Checklist
- [ ] Ensure `JWT_SECRET` is never committed to Git.
- [ ] Use `HTTPS` for both frontend and backend.
- [ ] Set `secure: true` for any cookies if applicable.
- [ ] Verify CORS is restricted to your frontend domain in production.
