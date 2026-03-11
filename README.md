# Construction website clone

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/yobuyobumail-4522s-projects/v0-construction-website-clone)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/z9tcegaqQpZ)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/yobuyobumail-4522s-projects/v0-construction-website-clone](https://vercel.com/yobuyobumail-4522s-projects/v0-construction-website-clone)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/z9tcegaqQpZ](https://v0.app/chat/projects/z9tcegaqQpZ)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Firebase Integration & Authentication

This project is fully integrated with Firebase for backend services:

- **🔐 Firebase Authentication** - Secure dashboard login (no signup, users created in backend)
- **📦 Firestore Database** - Store images, videos, team members, and settings
- **📁 Firebase Storage** - Upload and manage media files

### Quick Start

1. **Create your first admin user** in Firebase Console → Authentication → Users
2. **Login** at `/login` to access the dashboard
3. **Upload content** using the dashboard forms

### Documentation

- **[SETUP_COMPLETE.md](SETUP_COMPLETE.md)** - ⭐ Start here! Complete setup guide
- **[AUTHENTICATION_SETUP.md](AUTHENTICATION_SETUP.md)** - How to create users and manage login
- **[FIREBASE_SETUP.md](FIREBASE_SETUP.md)** - Firebase configuration details
- **[INTEGRATION_EXAMPLE.md](INTEGRATION_EXAMPLE.md)** - Code examples

### Available Hooks

Use these hooks in `lib/hooks/` for easy Firebase integration:
- `useImages()` - Manage project images with upload
- `useVideos()` - Manage video content
- `useTeam()` - Manage team members with photo upload

### Environment Variables (Optional)

Create a `.env.local` file for production deployment:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```
# daigavilla-web-app
