# URL Shortener and Analytics System

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [Usage](#usage)
7. [API Documentation](#api-documentation)
8. [Testing](#testing)
9. [Project Structure](#project-structure)
10. [Contributing](#contributing)
11. [License](#license)

---

## Overview

This project is a **URL Shortener and Analytics System** designed to shorten URLs and provide analytics on their usage. It supports user authentication via Google OAuth, rate-limiting, and detailed tracking of URL usage statistics. The project is containerized using Docker to support cross-environment portability.

---

## Features

- URL Shortening
- Google OAuth-based Authentication
- Rate Limiting for API requests
- Click Analytics (Total Clicks, Unique Clicks, OS and Device types)
- Dockerized setup for seamless deployment

---

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (supports Dockerized and standalone setups)
- **Cache**: Redis
- **Authentication**: Passport.js with Google OAuth
- **Testing**: Jest, Supertest
- **Containerization**: Docker

---

## Installation

### Prerequisites

- Node.js >= 14.x
- Docker and Docker Compose
- MongoDB and Redis (if not using Docker)

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/url-shortener.git
   cd url-shortener
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (see [Configuration](#configuration)).

4. Start the server:
   ```bash
   npm start
   ```

5. For Dockerized setup:
   ```bash
   docker-compose up --build
   ```

---

## Configuration

Create a `.env` file in the root directory and set the following variables:

```env
# General
PORT=3000
NODE_ENV=development
#Docker
USE_DOCKER=boolean
# MongoDB
MONGO_URI=mongodb://<host>:<port>/<database>

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
```

For Docker, ensure the `.env` file is loaded in the `docker-compose.yml` file.
USE_DOCKER will be true for docker environment.
USE_DOCKER will be false for local environment.
---

## Usage

### Local Development

1. Start the server locally:
   ```bash
   npm start
   ```

2. Make API requests using tools like Postman or curl.

### Docker Deployment

1. Build and run Docker containers:
   ```bash
   docker-compose up --build
   ```

2. Access the application on `http://localhost:3000`.

---

## API Documentation

### Key Endpoints

#### URL Shortening

- **POST** `/api/shorten`
  - Request Body: `{ "originalUrl": "https://example.com" }`
  - Response: `{ "shortUrl": "http://short.ly/abc123" }`

- **GET** `/:alias`
  - Redirects to the original URL.

#### Analytics

- **GET** `/api/analytics/overall`
  - Fetch overall analytics.

- **GET** `/api/analytics/:alias`
  - Fetch analytics for a specific shortened URL.

#### Authentication

- **GET** `/api/auth/google`
  - Redirects to Google OAuth.

- **GET** `/api/auth/google/callback`
  - Callback for Google OAuth.

---

## Testing

Run tests using:
```bash
npm test
```

---

## Project Structure

```plaintext
src/
├── controllers/
│   ├── analyticsController.js
│   ├── authController.js
│   └── urlController.js
├── middlewares/
│   ├── authMiddleware.js
│   └── rateLimiter.js
├── routes/
│   ├── analyticsRoutes.js
│   ├── authRoutes.js
│   └── urlRoutes.js
├── models/
│   └── URL.js
├── utils/
├── app.js

.env
Dockerfile
docker-compose.yml
```

---

## Contributing

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit changes and push to your fork.
4. Submit a pull request.

---

## License

This project is licensed under the MIT License.

