# Greetings

Welcome to the **Deep Origin Test Task** repository! This project is a full-stack application for managing short links, tracking analytics, and user authentication.

---

## Features

- **Short Link Management**: Create, update, delete, and resolve short links.
- **User Authentication**: Sign up, log in.
- **Analytics**: Track clicks, unique visitors, and device usage for short links.
- **Materialized Views**: Optimized database queries for performance.
- **Dockerized Environment**: Easily run the application in development or production.

---

## Author and Source

- **Author**: Arsenii Dumitru
- **Source**: [GitHub Repository](https://github.com/dumitru-arsenii/deep-origin-test-task)

---

## Install

### Prerequisites

- **Node.js**: Ensure you have Node.js installed (v16+ recommended).
- **Docker**: Install Docker.

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/dumitru-arsenii/deep-origin-test-task.git
   cd deep-origin-test-task
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

---

## Production Run

1. Build the production image:

   ```bash
   docker build -t deep-origin-prod .
   ```

2. Run the production container:

   ```bash
   docker run -d -p 80:80 --env-file .env deep-origin-prod
   ```

3. (Optional) Update `/etc/hosts` for a custom local domain:

   ```plaintext
   127.0.0.1 deep-origin.local
   ```

   Access the application at `http://deep-origin.local`.

---

## Local/Development Run

1. Build the development image:

   ```bash
   docker build -t deep-origin-test-task-dev -f DockerFile.dev .
   ```

2. Run the development container:

   ```bash
   docker run -p 80:80 -p 3000:3000 -v $(pwd):/app deep-origin-test-task-dev
   ```

   This command attaches the entire project as a volume, enabling **Next.js Hot Module Replacement** for the frontend and automatic server restarts using **ts-node** for the backend.

3. (Optional) Update `/etc/hosts` for a custom local domain:

   ```plaintext
   127.0.0.1 deep-origin.local
   ```

   Access the application at `http://deep-origin.local`.

---

## Folder Structure

```
deep-origin-test-task/
├── packages/
│   ├── client/                  # Next.js client
│       ├── src/                 # Source code
│           ├── components/      # Reusable UI components
│           ├── contexts/        # React context providers
│           ├── pages/           # Next.js pages
│           ├── utils/           # Utility functions
│   ├── server/                  # Node.js server
│       ├── src/
│           ├── domains/         # Business logic (auth, links, stats, metrics)
│           ├── builders/        # Shared utilities (e.g., database connection)
│           ├── migrations/      # SQL migrations
├── DockerFile                   # Production Dockerfile
├── DockerFile.dev               # Development Dockerfile
├── README.md                    # Documentation
├── nginx.conf                   # Nginx configuration
├── ecosystem.config.js          # PM2 process manager configuration
├── entrypoint.sh                # Production entrypoint script
├── entrypoint.dev.sh            # Development entrypoint script
```

---
