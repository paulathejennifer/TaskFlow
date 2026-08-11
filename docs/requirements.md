# TaskFlow — Requirements

## 1. Project Context

### 1.1 Problem Statement

A user needs a simple system for managing tasks from creation through completion.

The system should allow users to:

- Record tasks.
- Track task progress.
- Organize tasks according to importance and timing.
- Update tasks as circumstances change.
- Remove tasks that are no longer needed.

### 1.2 Proposed Solution

**TaskFlow** is a web-based task management system that allows authenticated users to create, organize, track, update, and complete their tasks through a browser-based interface.

The application consists of a frontend and backend that communicate through HTTP APIs, with task and category data persisted in a relational database.

---

# 2. Clarification Questions

Before defining the system requirements, the following questions were considered to clarify the intended behavior of the application.

## 2.1 Users

- Is the system intended for one user or multiple users?
- Can users have separate task lists?
- Should users be able to see other users' tasks?

### Decision

The system supports multiple users.

Each user manages their own tasks and categories, and users cannot access another user's tasks or categories.

---

## 2.2 Task Lifecycle

- Can a task have a start date different from its creation date?
- Can a task become overdue?
- Can a completed task be reopened?
- Can a task be completed before its due date?
- Should the system record when a task was actually completed?
- Should task statuses be allowed to move freely between available states?

### Decisions

- A task may have a start date that differs from its creation date.
- A task may become overdue when its due date has passed and it has not been completed.
- A completed task may be reopened if additional work is required.
- A task may be completed before its due date.
- The system records the actual completion time.
- Task status may move between `TODO`, `IN_PROGRESS`, and `DONE` as required by the user.

`OVERDUE` is not treated as a separate stored status. It is derived from the task's due date and current status.

---

## 2.3 Task Organization

The following questions were considered:

- Should tasks have priorities?
- How many priority levels should be supported?
- Should tasks have categories?
- Should categories be user-defined?
- Should users be able to filter tasks?
- Should users be able to sort tasks?
- Should a task be allowed to have no category?

### Decisions

- Tasks have a priority.
- Three priority levels are supported: `LOW`, `MEDIUM`, and `HIGH`.
- Users can create their own categories.
- A task may belong to zero or one category.
- Users can filter and sort their tasks.

---

# 3. Domain Assumptions

The following assumptions define the expected behavior of the system where the assignment does not explicitly specify a rule.

## 3.1 Multiple Users

The system supports multiple users, and each task belongs to exactly one user.

## 3.2 Task Ownership

Users can only view, modify, and delete their own tasks.

## 3.3 Task Scheduling

A task may have a start date that differs from its creation date.

A start date is optional because not every task requires a planned start period.

## 3.4 Due Dates

A task may have an optional due date.

A task is considered overdue when its due date has passed while its status is not `DONE`.

## 3.5 Completion

Completing a task records the actual completion time.

## 3.6 Reopening Tasks

A completed task can be reopened if additional work is required.

When a completed task is reopened, its completion timestamp is cleared.

## 3.7 Priority

Tasks support three priority levels:

- Low
- Medium
- High

New tasks default to `MEDIUM` priority.

## 3.8 Categories

Categories are user-defined.

A task may have no category when it is created.

A task can later be assigned to a category or moved to another category.

## 3.9 Category Deletion

Deleting a category does not delete the tasks that belong to it.

Tasks previously assigned to a deleted category become uncategorized.

---

# 4. Functional Requirements

## 4.1 Authentication

The system shall allow users to:

- Register an account.
- Log in.
- Access authenticated functionality.
- Log out.

Authentication is required before accessing protected task and category functionality.

---

## 4.2 Task Management

The system shall allow authenticated users to:

- Create a task.
- View their tasks.
- View an individual task.
- Update a task.
- Change a task's status.
- Delete a task.
- Complete a task.
- Reopen a completed task.

---

## 4.3 Task Organization

The system shall allow users to:

- Set task priority.
- Set an optional start date.
- Set an optional due date.
- Assign an optional category.
- Change a task's category.
- Identify overdue tasks.
- Filter tasks by status.
- Filter tasks by priority.
- Filter tasks by category.
- Sort tasks.

---

## 4.4 Category Management

The system shall allow authenticated users to:

- Create categories.
- View their categories.
- Rename categories.
- Delete categories.
- Assign tasks to categories.
- Move tasks between categories.

---

## 4.5 Task Overview

The system shall provide a task overview that allows a user to quickly understand their progress.

At minimum, the dashboard should provide:

- Total number of tasks.
- Number of completed tasks.
- Number of tasks in `TODO`.
- Number of tasks in `IN_PROGRESS`.

For example:

> 5 of 17 tasks completed.

The completion count is derived from the user's tasks.

---

# 5. Validation Requirements

The system shall validate data before it is accepted.

## 5.1 User Validation

- Email is required.
- Email must have a valid format.
- Email must be unique.
- Password is required.
- Password must satisfy the defined minimum password requirements.
- Passwords must not be stored in plaintext.

## 5.2 Task Validation

- A task title is required.
- Status must be one of the supported statuses.
- Priority must be one of the supported priority levels.
- If a category is provided, it must belong to the authenticated user.
- If both start date and due date are provided, the start date must not be later than the due date.

## 5.3 Category Validation

- Category name is required.
- Category names must be unique for the same user.
- Users may only access their own categories.

---

# 6. Non-Functional Requirements

## 6.1 Security

- Passwords must never be stored in plaintext.
- Protected task and category operations require authentication.
- Users must not be able to access another user's tasks or categories.
- User ownership must be enforced by the backend rather than trusted from frontend input.

## 6.2 Data Persistence

Task and category data must persist while the application is running.

The application will use a relational database for persistence.

## 6.3 Reliability

- Invalid requests must be rejected gracefully.
- The system should return clear error responses for validation and authorization failures.
- Core application behavior should remain consistent when users create, update, or delete data.

## 6.4 Maintainability

- Frontend and backend responsibilities should remain clearly separated.
- Code should follow a logical and consistent project structure.
- API contracts should be clearly defined and documented.
- Business rules should be enforced consistently.

## 6.5 Usability

The interface should provide clear feedback for:

- Loading states.
- Successful operations.
- Validation errors.
- Failed operations.
- Empty states.

Actions such as creating, updating, and deleting tasks should provide clear user feedback.

## 6.6 Testability

Core business behavior should be covered by automated tests, particularly:

- Authentication.
- Task validation.
- Task ownership.
- Category ownership.
- Task status changes.
- Task completion behavior.
- Category deletion behavior.

## 6.7 Performance

The system should provide responsive interactions for the expected scale of a small task-management application.

---

# 7. Scope

## 7.1 In Scope

The MVP includes:

- User registration.
- User login and logout.
- JWT-based authentication.
- Task creation.
- Task viewing.
- Task updating.
- Task deletion.
- Task status management.
- Task priorities.
- Optional task categories.
- Optional start dates.
- Optional due dates.
- Overdue task identification.
- Category creation.
- Category updating.
- Category deletion.
- Task filtering and sorting.
- Task progress overview.
- Persistent relational database storage.
- Frontend/backend communication through HTTP APIs.

## 7.2 Out of Scope

The following are intentionally excluded from the MVP:

- Real-time WebSocket notifications.
- Email notifications.
- Push notifications.
- AI-powered task recommendations.
- Team collaboration.
- Multiple task owners.
- Complex role-based access control.
- Calendar synchronization.
- External integrations.

These features are outside the core problem being solved and are not required for the assignment.