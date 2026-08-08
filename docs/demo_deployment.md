# MEEWA B2B Platform - Demo Deployment Guide

This guide provides step-by-step instructions to deploy your application to the cloud for a live demo. We are using a robust stack that offers generous free tiers:
- **Database**: Supabase (PostgreSQL)
- **Media Storage**: Cloudinary
- **Backend (API)**: Render (FastAPI)
- **Frontend & Admin**: Vercel (Next.js)

---

## Step 1: Secure Your Credentials in `.env`
To keep your secrets safe, we will store them locally in your root `.env` file first.

1. Open `.env` in the root of the project.
2. Ensure you have placeholders ready for the cloud services:

```env
# Database Configuration (We will replace this with Supabase)
DATABASE_URL=postgresql+psycopg://postgres:root123@localhost:5432/meewa

# Storage Configuration
STORAGE_PROVIDER=cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Authentication & CORS
SECRET_KEY=your-super-secret-key-change-in-prod
CORS_ORIGINS=https://meewa-frontend.vercel.app,http://localhost:3000
ADMIN_CORS_ORIGINS=https://meewa-admin.vercel.app,http://localhost:3001
```

---

## Step 2: Set up Supabase (Database)
1. Go to [Supabase](https://supabase.com/) and create a free account.
2. Click **New Project** and create an organization/project. 
3. **Save your Database Password!** You will need it.
4. Once the project provisions (takes ~2 minutes), go to **Project Settings** (the gear icon) > **Database**.
5. Scroll down to **Connection String** > **URI**.
6. Copy the URI and replace `[YOUR-PASSWORD]` with the password you just created.
7. Paste this string into your `.env` file as your new `DATABASE_URL`.
   *Make sure you change `postgresql://` to `postgresql+psycopg://` at the start of the URL so our backend driver works.*

---

## Step 3: Set up Cloudinary (Media Storage)
Since cloud servers (like Render) wipe their hard drives every time they restart, we must store your product images in Cloudinary.

1. Go to [Cloudinary](https://cloudinary.com/) and create a free account.
2. In your Dashboard, you will see your **Product Environment Credentials**:
   - Cloud Name
   - API Key
   - API Secret
3. Copy these three values and paste them into your `.env` file under the Cloudinary settings.

---

## Step 4: Run the Migration Script
Now that your `.env` file has the Supabase and Cloudinary credentials, we need to migrate your local data so you don't lose anything.

1. Once you have populated the `.env` file, **let me know in the chat**.
2. I will automatically run a Python script that will:
   - Connect to your local database and copy all products, categories, and settings directly into Supabase.
   - Upload all your existing images from `backend/uploads` directly to Cloudinary.
   - Update the new image URLs in Supabase.

---

## Step 5: Deploy the Backend to Render
1. We need to upload your backend to GitHub. Create a new empty repository on your GitHub account called `meewa-backend`.
2. I will help you initialize git and push your backend code to this repository.
3. Go to [Render.com](https://render.com/) and create a free account.
4. Click **New** > **Web Service**.
5. Connect your GitHub account and select your `meewa-backend` repository.
6. **Configuration**:
   - Runtime: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
7. Under **Environment Variables**, click "Add Environment Variable" and paste in every single variable from your root `.env` file (Database URL, Cloudinary credentials, Secret Key, etc.).
8. Deploy! Render will give you a live API URL (e.g., `https://meewa-backend.onrender.com`).

---

## Step 6: Deploy Frontends to Vercel
1. Upload your `frontend` folder to a GitHub repository (`meewa-frontend`) and `admin_frontend` to another (`meewa-admin`).
2. Go to [Vercel](https://vercel.com/) and connect your GitHub account.
3. Import the `meewa-frontend` repository.
4. **Environment Variables**: Add `NEXT_PUBLIC_API_URL` and set its value to your live Render Backend URL (e.g., `https://meewa-backend.onrender.com`).
5. Click **Deploy**.
6. Repeat the process for `meewa-admin`, but add both `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_ADMIN_API_URL` (set both to the live Render Backend URL).

### Final Polish
Once Vercel gives you the live domain names (e.g., `meewa.vercel.app`), go back to your Render dashboard and update the `CORS_ORIGINS` and `ADMIN_CORS_ORIGINS` environment variables to include the new Vercel domains so they are allowed to talk to your API!
