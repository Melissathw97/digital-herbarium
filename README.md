# Digital Herbarium 🪴

## Next.js + Supabase Application (Dockerized)

This repository contains a Next.js application integrated with Supabase for authentication and data, containerized using Docker and Docker Compose. This guide will walk you through setting up and running the application locally.

### 1. Prerequisites

Before you begin, ensure you have the following installed on your machine:

**Git**: For cloning the repository.

**Docker Desktop**: Includes Docker Engine and Docker Compose. Download from Docker's official website.

**Node.js (v18 or later) & npm**: While the app runs in Docker, you might need Node.js/npm locally for initial setup or running development scripts outside Docker.

<br />

### 2. Initial Setup

#### i. Clone the Repository:

git clone [YOUR_REPOSITORY_URL]
cd plant-digitalization # Or whatever your project folder is named

<hr />

#### ii. Create .env.prod File:

This application relies on environment variables for Supabase configuration, API keys, and other settings. You need to create a .env.prod file in the root of the project (the same directory as docker-compose.yaml and Dockerfile).

<hr />

#### iii. Create a file named .env.prod with the following content:

```
# Supabase Configuration (REQUIRED for client-side and server-side)
NEXT_PUBLIC_SUPABASE_URL=https://your_project_ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_public_anon_key

# Application Site URL (CRITICAL for authentication redirects in Docker)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Allowed Origins for Supabase (adjust if your app runs on other domains/ports)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,https://your_project_ref.supabase.co

# Email Service (e.g., Resend) Configuration (REQUIRED for email-based auth, password resets)
RESEND_API_KEY=your_resend_api_key
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_USER=resend
SMTP_PASS=your_resend_api_key # Often the same as RESEND_API_KEY for Resend
```

> Important: Replace the placeholder values (your_project_ref.supabase.co, your_public_anon_key, your_resend_api_key) with your actual Supabase project URL, Anon Key, and Resend API Key. You can find your Supabase keys in your Supabase Dashboard under Project Settings > API.

<br />

### 3. Running the Application

Once your .env.prod file is set up and Supabase/OAuth redirect URLs are configured, you can build and run your Dockerized application.

Open your terminal and navigate to the root directory of your project (where docker-compose.yaml and .env.prod are located).
Load Environment Variables and Build the Docker Image:
It's critical that the NEXT_PUBLIC_ environment variables are available during the Docker build process so Next.js can inline them into the client-side bundle
Ensure you are in the project root directory
 
```
cd /path/to/your/plant-digitalization
```

### ‼️ IMPORTANT: Load variables into your shell for the build process
```
set -a # Automatically export all variables defined afterwards
source ./.env.prod # Load variables from .env.prod into your current shell
set +a # Turn off automatic export
```

### Stop any existing containers and rebuild the image from scratch (recommended for first run or changes)
```
docker-compose down # Stops and removes existing containers/networks
docker-compose build --no-cache # Builds the 'nextjs-app' service image without using cache
```

You might still see a few warnings about ALLOWED_ORIGINS, RESEND_API_KEY, etc., not being set during the build, but the crucial NEXT_PUBLIC_ ones should now be picked up without warnings.

Start the Application Containers:

```
docker-compose up
```


This command will start the nextjs-app service. You will see logs from the Next.js server directly in your terminal.

To run in the background (detached mode), use docker-compose up -d. You can then view logs with docker-compose logs nextjs-app.

<br />

### 4. Accessing the Application

Once docker-compose up shows that the Next.js server is ready (e.g., "✓ Ready in Xms"), open your web browser and navigate to:

```
http://localhost:3000
```

Your Next.js application should now be running, and the Supabase authentication flow (sign-up, sign-in, OAuth redirects) should work correctly.
