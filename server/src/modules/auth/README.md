# Auth Module

This module manages user authentication, including local registration/login and OAuth 2.0 with Google Passport.

## Key Files
- `auth.controller.js`: Handles authentication flows, registration, and logout.
- `auth.service.js`: Manages JWT generation, password hashing, and refresh token handling.
- `auth.model.js`: Schema for user authentication credentials.
- `auth.passport.js`: Passport.js configuration for authentication strategies.
- `auth.routes.js`: API endpoints for authentication.
- `auth.validation.js`: Zod schemas for validating registration and login requests.
