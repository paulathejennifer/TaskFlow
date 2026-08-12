# TaskFlow — API Documentation

## 1. Overview

TaskFlow exposes an HTTP API that allows the frontend application to
communicate with the backend.

The API is responsible for authentication, task management, category
management, validation, and authorization.

All protected endpoints require an authenticated user.

---

# 2. Base URL

The API base URL will be configured during backend implementation.

The development and production URLs will be defined according to the
deployment environment.

---

# 3. Authentication

Authentication endpoints allow users to create an account, log in, and log
out.

## 3.1 Register

### Endpoint

POST /auth/register

### Purpose

Creates a new TaskFlow user account.

### Request Body

| Field | Required | Description |
|---|---|---|
| `full_name` | Yes | User's full name |
| `email` | Yes | User's email address |
| `password` | Yes | User's password |
| `confirm_password` | Yes | Confirmation of the password |

### Validation

- `full_name` is required.
- `email` is required and must be valid.
- `email` must be unique.
- `password` is required.
- `confirm_password` must match `password`.
- Passwords must satisfy the application's password requirements.

### Successful Response

HTTP 201 Created.

The response confirms that the account was created successfully.

---

## 3.2 Login

### Endpoint

POST /auth/login

### Purpose

Authenticates an existing user.

### Request Body

| Field | Required | Description |
|---|---|---|
| `email` | Yes | User's email address |
| `password` | Yes | User's password |

### Successful Response

HTTP 200 OK.

The backend establishes authentication for the user.

---

## 3.3 Logout

### Endpoint

POST /auth/logout

### Purpose

Logs the authenticated user out of TaskFlow.

### Authentication

Required.

### Successful Response

HTTP 200 OK.

The user's authenticated session is ended.

---

# 4. Task Endpoints

All task endpoints require authentication.

## 4.1 Create Task

### Endpoint

POST /tasks

### Purpose

Creates a new task for the authenticated user.

### Required Fields

- `title`

### Optional Fields

- `description`
- `status`
- `priority`
- `start_date`
- `due_date`
- `category_id`

If `category_id` is not provided, the task is created without a category.

### Successful Response

HTTP 201 Created.

The response contains the newly created task.

---

## 4.2 Get Tasks

### Endpoint

GET /tasks

### Purpose

Retrieves tasks belonging to the authenticated user.

### Optional Query Parameters

- `status`
- `category_id`
- `priority`
- `search`

These parameters allow the frontend to filter or search the user's tasks.

### Successful Response

HTTP 200 OK.

The response contains the user's tasks and their associated information.

---

## 4.3 Get Task Details

### Endpoint

GET /tasks/{task_id}

### Purpose

Retrieves the details of a specific task.

### Successful Response

HTTP 200 OK.

The response contains the selected task and its associated information.

### Possible Errors

- HTTP 401 Unauthorized — User is not authenticated.
- HTTP 404 Not Found — Task does not exist or does not belong to the
  authenticated user.

---

## 4.4 Update Task

### Endpoint

PUT /tasks/{task_id}

### Purpose

Updates an existing task.

### Updatable Fields

- `title`
- `description`
- `status`
- `priority`
- `start_date`
- `due_date`
- `category_id`

### Successful Response

HTTP 200 OK.

The response contains the updated task.

A task can be moved between categories or changed to have no category.

---

## 4.5 Delete Task

### Endpoint

DELETE /tasks/{task_id}

### Purpose

Deletes a task belonging to the authenticated user.

### Successful Response

HTTP 204 No Content.

The deleted task is no longer available in the user's task list.

---

# 5. Category Endpoints

All category endpoints require authentication.

## 5.1 Create Category

### Endpoint

POST /categories

### Purpose

Creates a user-defined category.

### Request Body

| Field | Required | Description |
|---|---|---|
| `name` | Yes | Name of the category |

### Validation

- `name` is required.
- `name` must not be empty or whitespace-only.
- The category belongs to the authenticated user.

### Successful Response

HTTP 201 Created.

The response contains the newly created category.

---

## 5.2 Get Categories

### Endpoint

GET /categories

### Purpose

Retrieves categories belonging to the authenticated user.

### Successful Response

HTTP 200 OK.

The response contains the user's categories.

---

## 5.3 Update Category

### Endpoint

PUT /categories/{category_id}

### Purpose

Updates the name of an existing category.

### Request Body

| Field | Required | Description |
|---|---|---|
| `name` | Yes | Updated category name |

### Successful Response

HTTP 200 OK.

The response contains the updated category.

Renaming a category does not modify the tasks assigned to it.

---

## 5.4 Delete Category

### Endpoint

DELETE /categories/{category_id}

### Purpose

Deletes a category belonging to the authenticated user.

### Successful Response

HTTP 204 No Content.

Deleting a category does not delete its associated tasks.

Tasks previously assigned to the deleted category become uncategorized.

---

# 6. Task Status

The API supports three stored task statuses:

- `TODO`
- `IN_PROGRESS`
- `DONE`

Status transitions are flexible.

A task can move between any of the supported statuses.

For example, a task can be changed from `DONE` back to `IN_PROGRESS`.

`OVERDUE` is not stored as a task status.

A task is considered overdue when its due date has passed and its status is
not `DONE`.

The frontend displays the overdue state as a visual indicator or badge.

---

# 7. Priority

The API supports the following task priority levels:

- `LOW`
- `MEDIUM`
- `HIGH`

The default priority is `MEDIUM`.

---

# 8. Error Responses

The API returns appropriate HTTP status codes when an operation fails.

| Status Code | Meaning |
|---|---|
| `200 OK` | Request completed successfully |
| `201 Created` | Resource created successfully |
| `204 No Content` | Resource deleted successfully |
| `400 Bad Request` | Request contains invalid information |
| `401 Unauthorized` | Authentication is required or credentials are invalid |
| `403 Forbidden` | User is not permitted to perform the operation |
| `404 Not Found` | Requested resource does not exist or is inaccessible |
| `409 Conflict` | Request conflicts with an existing resource |
| `422 Unprocessable Entity` | Request validation failed |
| `500 Internal Server Error` | Unexpected server error |

The frontend displays appropriate validation or error messages to the user.

---

# 9. Authorization and Ownership

Protected endpoints operate within the context of the authenticated user.

The backend must verify ownership before allowing access to or modification of
a task or category.

For tasks:

- A user can retrieve only their own tasks.
- A user can create tasks for themselves.
- A user can update only their own tasks.
- A user can delete only their own tasks.

For categories:

- A user can retrieve only their own categories.
- A user can create categories for themselves.
- A user can update only their own categories.
- A user can delete their own categories.

The frontend must not be relied upon to enforce ownership.

---

# 10. API Design Principles

The TaskFlow API follows these principles:

- Resources are represented as users, tasks, and categories.
- HTTP methods represent the intended operation.
- Protected resources require authentication.
- Ownership is enforced by the backend.
- Request data is validated before processing.
- Appropriate HTTP status codes are returned.
- Task categories are optional.
- Tasks can be moved between categories.
- Deleting a category does not delete its tasks.
- `OVERDUE` is derived rather than stored.
- The API is designed to support the frontend wireframes and user flows.