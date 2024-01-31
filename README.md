# Server Overview

The server-side of the Property Management System is responsible for handling API requests, interacting with the database, and managing property data.

# Getting Started with the Server

## Installation

1. Navigate to the server directory.
2. Run npm install to install dependencies.

# Server Technologies Used

- Javascript
- Express.js

# Project Structure

```
server/
  .env.example # .env example
  src/ # Contains the source code.
    config/ # Configuration files
      config.ts
      database.config.ts # database configuration file1
    controller/ # Request handlers.
    middleware/ # Middlewares
    model/ # Database models.
    routes/ # API route definitions.
    services/ # Controller services
    test/ # Test code
    utils/ # Utils code
    app.ts # Application entry point
```

### Details:

- `config/`: Holds the configuration files. It includes settings, constants, and environment variable handling.
- `middleware/`: Middlewares are functions that have access to the request and response objects, and the next middleware function in the cycle.
