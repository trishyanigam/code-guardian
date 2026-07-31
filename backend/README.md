# CodeGuardian AI - Backend Foundation

A production-ready Express.js backend boilerplate built with Node.js ES Modules for **CodeGuardian AI**, a scalable SaaS application.

## 🚀 Technologies

- **Node.js** (v18+)
- **Express.js** (v5)
- **ES Modules** (`"type": "module"`)
- **Morgan** (HTTP request logger)
- **CORS** (Cross-Origin Resource Sharing)
- **Dotenv** (Environment variable management)

---

## 📁 Directory Structure

```text
backend/
├── .env.example            # Environment variables example file
├── .env                    # Environment configuration (ignored in vcs)
├── package.json            # Project dependencies & scripts
├── README.md               # Project documentation
└── src/
    ├── app.js              # Express app configuration & middleware setup
    ├── server.js           # Server entry point & lifecycle listeners
    ├── config/             # Environment & app configuration settings
    │   ├── env.config.js
    │   └── index.js
    ├── constants/          # Application constants & status codes
    │   └── index.js
    ├── controllers/        # Request handling logic
    │   ├── health.controller.js
    │   └── index.js
    ├── middleware/         # Custom Express middleware (Error, 404, etc.)
    │   ├── error.middleware.js
    │   ├── notFound.middleware.js
    │   └── index.js
    ├── models/             # Database schemas & ORM/ODM models
    │   └── index.js
    ├── routes/             # API route definitions & routers
    │   ├── health.routes.js
    │   └── index.js
    ├── services/           # Reusable business logic & integrations
    │   └── index.js
    ├── utils/              # Helper utilities (ApiError, ApiResponse, asyncHandler)
    │   ├── ApiError.js
    │   ├── ApiResponse.js
    │   ├── asyncHandler.js
    │   └── index.js
    └── validators/         # Request validation schemas & middleware
        └── index.js
```

---

## ⚙️ Getting Started

### 1. Installation

Install project dependencies:

```bash
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env` and configure environment variables:

```bash
cp .env.example .env
```

Default variables:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/codeguardian
CORS_ORIGIN=http://localhost:3000
```

### 3. Running the Server

#### Development Mode (with hot-reload via Nodemon)
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

---

## 📡 Base API Endpoints

| Method | Endpoint         | Description                        |
| ------ | ---------------- | ---------------------------------- |
| GET    | `/`              | Root welcome check                 |
| GET    | `/api/v1/health` | Health status and uptime endpoint  |

---

## 🛡️ Architecture & Key Features

- **ES Modules**: Utilizes modern native JavaScript module syntax (`import`/`export`).
- **Standardized Responses**: Uses `ApiResponse` and `ApiError` utilities for consistent API output formats across all endpoints.
- **Async Error Handling**: Route handlers wrapped with `asyncHandler` to safely forward rejected promises to the global error middleware.
- **Process Safety**: Graceful shutdown handles uncaught exceptions, unhandled promise rejections, and `SIGTERM` signals.
