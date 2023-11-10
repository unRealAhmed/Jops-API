# JobsHub API

A simple Express.js and Mongoose-based API for job management, search, and user authentication.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [GitHub Repository](#github-repository)

## Features

- **Job Management:** CRUD operations for job entries.
- **Job Search:** Find jobs based on different criteria.
- **User Authentication:** Secure your API with user authentication.
- **Data Validation:** Ensure data integrity with input validation.
- **Middleware Usage:** Implement rate limiting, sanitize input, and handle errors.

## Prerequisites

Before running the JobsHub API, ensure you have the following prerequisites installed:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/) (with connection details configured in a .env file)

## Usage

Once the server is running, interact with the API using tools like [Postman](https://www.postman.com/) or integrate it into your application.

## API Endpoints

- `GET /api/v1/jobs`: Retrieve a list of jobs.
- `GET /api/v1/jobs/stats`: Retrieve statistics about your job entries.
- `POST /api/v1/jobs`: Create a new job.
- `PATCH /api/v1/jobs/:id`: Update details of a specific job.
- `DELETE /api/v1/jobs/:id`: Delete a specific job.
- `GET /api/v1/jobs/search`: Search for jobs based on criteria.

### Authentication

- `POST /api/v1/signup`: Sign up and create a new user account.

  - Request Body:
    ```json
    {
      "name": "Your Name",
      "email": "your@email.com",
      "password": "yourpassword",
      "passwordConfirm": "yourpassword"
    }
    ```

- `POST /api/v1/login`: Log in and obtain an authentication token.
  - Request Body:
    ```json
    {
      "email": "your@email.com",
      "password": "yourpassword"
    }
    ```

GitHub : [Ahmed Sayed](https://github.com/unRealAhmed)

Happy coding! 🚀
