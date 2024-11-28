Role-Based Access Control and Task Management System

A secure backend system implementing Role-Based Access Control (RBAC) for user management and task organization. This application allows users to authenticate, manage tasks, and perform role-specific actions, ensuring a robust and hierarchical permission structure.

Features

Authentication and Authorization
JWT-based authentication with access and refresh tokens.
Password hashing with bcrypt for secure user credentials.
Role-based authorization with three roles:
User: Manage personal tasks.
Moderator: View and manage all tasks.
Admin: Full access to manage users and tasks.

Task Management
Create, update, delete, and retrieve tasks with fields like:
Title
Description
Due Date
Status (pending, in-progress, completed)
Role-specific permissions to manage task

User Management
User registration and login.
Admin privileges to update roles and delete users.


Tech Stack
Backend
Node.js with Express.js: Fast and scalable server framework.
MongoDB with Mongoose: NoSQL database for efficient data storage and querying.
TypeScript: Strongly typed JavaScript for better development experience.
Security
JWT: For secure session management.
bcrypt: For password hashing.
Validation
Express-validator: For input validation and sanitization.

Installation Steps

1.Clone the repository:
git clone https://github.com/ianujchaudhari/backend-assignment.git
cd backend-assignment

2. install dependency:
npm install

3. Add a .env file in the root directory with the following variables:
PORT=4000
MONGO_URI=<your-mongo-uri>
ACCESS_TOKEN_SECRET=<your-access-token-secret>
REFRESH_TOKEN_SECRET=<your-refresh-token-secret>
TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

4.Build the project:
npm run build

5.Start the server:
npm run start

API Endpoints
Authentication
POST /api/auth/register: Register a new user.
POST /api/auth/login: Login and get access/refresh tokens.
POST /api/auth/refresh-token: Refresh the access token using a refresh token.
POST /api/auth/logout: Logout and remove refresh tokens.

User Management (Admin Only)
GET /api/admin//get-all-users: Get all registered users.
PUT /api/admin/update-user-role: Update user role to any user, moderator or Admin.
DELETE /api/admin/delete-user/:id: Update a user's role.


Task Management
POST /api/todos/add: Create a new task (User or higher).
GET /api/todos/: Get all tasks for the logged-in user.
GET /api/todos/all: Get all tasks (Moderator or higher).
PUT /api/todos/update/:id: Update a task by ID.(for same user or heigher)
DELETE /api/todos/delete/:id: Delete a task by ID.(for same user or heigher)
DELETE /api/todos/delete/all: Delete all tasks (Admin only).


Accessing the App on render.com
https://backend-assignment-q5mk.onrender.com/


