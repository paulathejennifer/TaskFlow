# TaskFlow — System Architecture

## 1. Overview

TaskFlow follows a client-server architecture consisting of a frontend
application, a backend API, and a relational database.

The frontend is responsible for presenting the user interface and handling
user interactions.

The backend is responsible for business logic, validation, authentication,
authorization, and communication with the database.

The database is responsible for persistently storing users, tasks, and
categories.

The system is designed so that the frontend communicates with the backend
through HTTP requests and receives responses from the backend.

---

# 2. Architecture Diagram

![TaskFlow System Architecture](images/system-architecture.png)

The architecture consists of the following major components:

- Client
- Frontend
- Backend API
- Database

---

# 3. Client

The client represents the device and environment through which the user
accesses TaskFlow.

TaskFlow is designed to be accessed through a web browser.

The client allows the user to interact with the TaskFlow frontend.

---

# 4. Frontend

The frontend provides the user interface for TaskFlow.

It is responsible for:

- Rendering application screens.
- Collecting user input.
- Displaying tasks and categories.
- Managing UI state.
- Displaying validation and error messages.
- Displaying task statuses and overdue indicators.
- Sending HTTP requests to the backend API.
- Processing backend responses.
- Updating the interface after successful operations.

The frontend does not act as the application's security boundary.

Authorization and ownership checks are enforced by the backend.

---

# 5. Backend API

The backend provides the application's API and contains the core application
logic.

It is responsible for:

- User registration.
- User authentication.
- Logout handling.
- Request validation.
- Task creation.
- Task retrieval.
- Task updates.
- Task deletion.
- Category creation.
- Category retrieval.
- Category updates.
- Category deletion.
- Task and category ownership checks.
- Business rules.
- Communication with the database.

The backend receives requests from the frontend, processes them, and returns
appropriate responses.

---

# 6. Database

The database provides persistent storage for TaskFlow.

The primary entities stored in the database are:

- User
- Task
- Category

The database maintains the relationships between these entities and enforces
appropriate constraints.

Tasks and categories belong to authenticated users.

A task may optionally belong to a category.

---

# 7. Request and Response Flow

The frontend communicates with the backend through HTTP requests and responses.

A typical operation follows this sequence:

1. The user performs an action in the frontend.
2. The frontend collects the required information.
3. The frontend sends an HTTP request to the backend API.
4. The backend validates the request.
5. The backend verifies authentication and authorization where required.
6. The backend performs the required business operation.
7. The database is read from or updated when necessary.
8. The backend returns an HTTP response.
9. The frontend processes the response.
10. The user interface is updated.

For example, when a user creates a task, the frontend submits the task
information to the backend. The backend validates the information, verifies
the authenticated user, creates the task, persists it in the database, and
returns the created task to the frontend.

If validation fails, the backend returns an appropriate error response and the
frontend displays the relevant error to the user.

---

# 8. Authentication and Authorization

Authentication is required before a user can access protected TaskFlow
resources.

The user provides their login credentials through the frontend.

The backend verifies the credentials and establishes the authenticated session.

After authentication, the user can access protected task and category
operations.

Authorization is handled by the backend.

For every protected task and category operation, the backend verifies that the
requested resource belongs to the authenticated user before allowing the
operation.

This prevents one user from accessing or modifying another user's tasks or
categories.

---

# 9. Task and Category Ownership

TaskFlow uses user ownership to isolate user data.

Each user can have multiple tasks and multiple categories.

Each category belongs to one user and can contain zero or many tasks.

Each task belongs to one user and can optionally belong to one category.

A task without a category has a `NULL` `category_id`.

The ownership relationships are enforced by the backend when processing
requests.

---

# 10. Overdue Task Handling

`OVERDUE` is not stored as a separate task status.

The stored task statuses are:

- `TODO`
- `IN_PROGRESS`
- `DONE`

A task is considered overdue when its due date has passed and its status is
not `DONE`.

The overdue state is derived from the task's due date and current status.

The frontend displays the overdue state using an `OVERDUE` visual indicator or
badge.

This approach avoids adding another persisted task status while still clearly
communicating overdue tasks to the user.

---

# 11. Architecture Principles

The TaskFlow architecture follows these principles:

- The frontend is responsible for presentation and user interaction.
- The backend is responsible for business logic and security.
- The database is responsible for persistent data storage.
- Authentication is required for protected resources.
- Authorization is enforced by the backend.
- User data is isolated through ownership relationships.
- The frontend communicates with the backend through HTTP requests and
  responses.
- Overdue status is derived rather than stored as a separate status.
- Categories are user-defined rather than hardcoded.
- Tasks may optionally belong to a category.
- The architecture avoids unnecessary infrastructure complexity for the
  initial implementation.