# Firebase Setup for YoungGo

## Overview
YoungGo uses Firebase Firestore to ensure all users see the same events across all devices. This provides a shared, persistent calendar that works on smartphones, tablets, and desktops.

## Setup Instructions

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name (e.g., "younggo-events")
4. Follow the setup wizard

### 2. Enable Firestore
1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users

### 3. Get Configuration
1. In Firebase Console, go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" and choose "Web"
4. Register app and copy the config

### 4. Environment Variables
Create a `.env` file in the project root with:

```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your_app_id_here
```

### 5. Install Dependencies
```bash
npm install
```

## Current Implementation
- Events are stored in Firestore collection `events`
- Real-time synchronization across all devices
- Automatic fallback to localStorage if Firebase is not configured
- All users see the same events regardless of device

## Security Rules
For production, update Firestore security rules to:
- Allow read access to all users
- Allow write access only to authenticated users
- Prevent deletion of events by non-organizers
