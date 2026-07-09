# File uploader
A cloud storage application (inspired by Google Drive) built to upload, organize, and share files using Supabase storage and a PostgreSQL database.

## Tech stack
- **Frontend:** React, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database & Storage:** PostgreSQL, Prisma ORM, Supabase Storage
- **Authentication:** Passport.js, Express-session, prisma-session-store, bcryptjs
- **Tools:** Node-Postgres (pg), Dotenv

## Features
- **User Authentication:** Secure sign-up, login, and session persistence using Passport.js and prisma-session-storage.
- **Folder Management:** Create folders to organize files inside them, rename folders and delete them.
- **File Operations:** Upload, save, download, and track files safely.
- **Cloud Integration:** Files are hosted on Supabase Storage, with their generated access URLs tracked via a Prisma database schema.

## Getting Started
**Prerequisites**
- Node.js 
- PostgreSQL installed and running on your machine.
- A Supabase Project with a storage bucket created (Name your bucket 'files_upload' if you don't want to change the code).

### Installation
Because this project is organized as a monorepo, dependencies must be installed individually for both the frontend and backend.

1. Clone the repository:
```
git clone git@github.com:navjotmaan/file-uploader.git
cd file-uploader
```
2. Setup the Frontend Client:
```
cd client
npm install
cd ..
```
3. Setup the Backend Server:
```
cd server
npm install
cd ..
```
### Configuration
Navigate to the server/ directory and create a .env file. Populate it with the following environment variables:
```
# Session security
SESSION_SECRET=your_super_secret_session_key

# Database Connections (See note below for Local vs Production)
DATABASE_URL="postgresql://user:password@localhost:5432/file_uploader?schema=public"
DIRECT_URL="postgresql://user:password@localhost:5432/file_uploader?schema=public"

# Supabase API Settings
SUPABASE_URL_API=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_secret_key
```

**Database URL Notes:**
- *Local Development:* Set both DATABASE_URL and DIRECT_URL to your standard local PostgreSQL connection string.
- *Production (Supabase Hosted):* Replace them with your pooled and direct connection strings provided by your Supabase database dashboard (*.supabase.com).

## Available Scripts
From inside the server/ directory, you can run the following infrastructure and lifecycle scripts:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Spins up the backend development server using `nodemon` and `tsx`. |
| `npm run build` | Generates the Prisma client, compiles TypeScript to JavaScript, and moves generated files to the dist folder. |
| `npm run start` | Applies pending Prisma database migrations safely to production and launches the compiled server. |

## Running the App Locally
1. Open a terminal to run the backend API:
   ```
   cd server
   #  First time setup: push schema to your local DB
   npx prisma db push
   npm run dev
   ```

2. Open a second terminal to run the React client:
   ```
    cd client
    npm run dev
   ```
   
