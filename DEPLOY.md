# Deployment Guide for Insurance Guy

This guide will help you deploy your application to **Render** using their free tier.

## Prerequisites

1.  **GitHub Account**: You need a GitHub account.
2.  **Render Account**: Sign up at [render.com](https://render.com).
3.  **Code on GitHub**: Push your code to a GitHub repository.

## Step 1: Push to GitHub

If you haven't already, push your code to GitHub:

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

## Step 2: Prepare Environment Variables

You will need the values from your local `backend/.env` file.
You also need the content of `backend/serviceAccountKey.json`.

## Step 3: Deploy on Render

### Option A: Using Blueprints (Recommended)

1.  Go to your [Render Dashboard](https://dashboard.render.com/).
2.  Click **New +** and select **Blueprint**.
3.  Connect your GitHub repository.
4.  Render will detect `render.yaml`.
5.  It will ask you to provide values for the Environment Variables defined in `render.yaml`:
    *   `MONGO_URI`: Copy from your local `.env`.
    *   `JWT_SECRET`: Copy from your local `.env`.
    *   `FIREBASE_SERVICE_ACCOUNT_KEY`: Open `backend/serviceAccountKey.json`, copy the **entire content** (the whole JSON object), and paste it here.
6.  Click **Apply**.
7.  Render will start the deployment. It might take a few minutes.

### Option B: Manual Web Service Setup

1.  Go to your [Render Dashboard](https://dashboard.render.com/).
2.  Click **New +** and select **Web Service**.
3.  Connect your GitHub repository.
4.  Configure the service:
    *   **Name**: `insurance-guy` (or any name)
    *   **Region**: Choose one close to you (e.g., Singapore, Oregon).
    *   **Branch**: `main`
    *   **Root Directory**: `.` (leave empty)
    *   **Runtime**: `Node`
    *   **Build Command**: `bash render-build.sh`
    *   **Start Command**: `cd backend && npm start`
    *   **Instance Type**: Free
5.  **Environment Variables**:
    *   Click **Advanced** or scroll to **Environment Variables**.
    *   Add the following:
        *   `NODE_ENV`: `production`
        *   `MONGO_URI`: (Your MongoDB URI)
        *   `JWT_SECRET`: (Your Secret)
        *   `FIREBASE_SERVICE_ACCOUNT_KEY`: (Content of `backend/serviceAccountKey.json`)
6.  Click **Create Web Service**.

## Verification

Once deployed, Render will provide a URL (e.g., `https://insurance-guy.onrender.com`).
Visit the URL to see your application running!

## Troubleshooting

-   **Logs**: Check the "Logs" tab in Render if the deployment fails.
-   **Database**: Ensure your MongoDB Atlas IP whitelist allows access from anywhere (`0.0.0.0/0`) or configure it to allow Render's IPs (which change). For simplicity, `0.0.0.0/0` is often used for free tier projects.
