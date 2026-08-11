# TaskFlow — User Stories

## 1. Authentication

### US-01 — Register an Account

**User Story**

As a new user, I want to create an account so that I can securely manage my own tasks.

**Acceptance Criteria**

- The user can provide their full name, email address, password, and password confirmation.
- Full name is required.
- Email address is required and must have a valid format.
- The email address must be unique.
- Password is required and must satisfy the application's password requirements.
- Password confirmation must match the password.
- Invalid input must display a clear validation message.
- A valid submission creates the user account.
- Passwords must not be stored in plaintext.
- After successful registration, the user can proceed to the login flow.

---

### US-02 — Log In

**User Story**

As a registered user, I want to log in so that I can access my tasks and categories.

**Acceptance Criteria**

- The user can provide an email address and password.
- Both fields are required.
- Invalid credentials are rejected.
- A successful login authenticates the user.
- The authenticated user can access protected application functionality.
- The user is not given access to another user's tasks or categories.

---

### US-03 — Log Out

**User Story**

As an authenticated user, I want to log out so that I can end my current session.

**Acceptance Criteria**

- A logged-in user can select the logout action.
- The user's authenticated session is cleared.
- After logging out, protected application functionality cannot be accessed without logging in again.
- The user is redirected to an appropriate unauthenticated screen.

---

# 2. Task Management

### US-04 — Create a Task

**User Story**

As an authenticated user, I want to create a task so that I can keep track of something I need to accomplish.

**Acceptance Criteria**

- The user can provide a task title.
- The title is required.
- The user can optionally provide a description.
- The user can select a status.
- The user can select a priority.
- The user can optionally provide a start date.
- The user can optionally provide a due date.
- The user can optionally assign a category.
- If both dates are provided, the start date cannot be later than the due date.
- A valid task is saved to the database.
- The newly created task belongs to the authenticated user.
- The user receives clear feedback after successful creation.
- Invalid input is rejected with an appropriate validation message.

---

### US-05 — View Tasks

**User Story**

As an authenticated user, I want to view my tasks so that I can understand what work I have to do.

**Acceptance Criteria**

- The user can view a list of their tasks.
- Only tasks belonging to the authenticated user are returned.
- Each task provides enough information to identify its title, status, priority, and relevant dates.
- Tasks can be displayed according to the application's sorting and filtering options.
- An appropriate empty state is displayed when the user has no tasks.

---

### US-06 — View Task Details

**User Story**

As an authenticated user, I want to view the details of a task so that I can understand its complete information.

**Acceptance Criteria**

- The user can select a task from the task list.
- The task details include its title, description, status, priority, category, dates, and timestamps where applicable.
- Only the task owner can access its details.
- If the task does not exist or does not belong to the user, an appropriate error is returned.

---

### US-07 — Edit a Task

**User Story**

As an authenticated user, I want to edit a task so that I can keep its information accurate as circumstances change.

**Acceptance Criteria**

- The user can update task details.
- The user can change the title.
- The user can change the description.
- The user can change the status.
- The user can change the priority.
- The user can change the start date.
- The user can change the due date.
- The user can change or remove the category.
- Date validation is applied when both dates are provided.
- The `updated_at` value changes when the task is modified.
- Only the task owner can modify the task.
- The user receives clear feedback after a successful update.

---

### US-08 — Change Task Status

**User Story**

As an authenticated user, I want to change a task's status so that I can accurately reflect its current progress.

**Acceptance Criteria**

- A task can have one of the supported statuses:
  - `TODO`
  - `IN_PROGRESS`
  - `DONE`
- The user can move a task between the supported statuses.
- Status transitions are not restricted to a fixed sequence.
- A task can move from `DONE` back to `IN_PROGRESS` or `TODO`.
- Marking a task as done records its completion time.
- Reopening a completed task clears its completion time.
- Status changes are persisted.

---

### US-09 — Delete a Task

**User Story**

As an authenticated user, I want to delete a task so that I can remove tasks that are no longer relevant.

**Acceptance Criteria**

- The user can request deletion of a task they own.
- The system removes the task.
- The task no longer appears in the user's task list.
- A user cannot delete another user's task.
- The user receives clear feedback after successful deletion.

---

# 3. Category Management

### US-10 — Create a Category

**User Story**

As an authenticated user, I want to create categories so that I can organize my tasks according to my own needs.

**Acceptance Criteria**

- The user can provide a category name.
- The category name is required.
- The category name cannot consist only of whitespace.
- A user cannot create duplicate category names within their own categories.
- The category belongs to the authenticated user.
- A valid category is persisted.
- The new category becomes available when assigning categories to tasks.

---

### US-11 — View Categories

**User Story**

As an authenticated user, I want to view my categories so that I can understand how my tasks are organized.

**Acceptance Criteria**

- The user can view their categories.
- Only categories belonging to the authenticated user are returned.
- The number of tasks associated with each category can be displayed.
- An appropriate empty state is displayed when the user has no categories.

---

### US-12 — Rename a Category

**User Story**

As an authenticated user, I want to rename a category so that I can keep my organization meaningful as my needs change.

**Acceptance Criteria**

- The user can change the category name.
- The new name is required.
- The new name cannot consist only of whitespace.
- Duplicate category names for the same user are rejected.
- Renaming a category does not remove its associated tasks.
- Tasks previously assigned to the category continue to reference it after the rename.

---

### US-13 — Delete a Category

**User Story**

As an authenticated user, I want to delete a category so that I can remove categories I no longer need.

**Acceptance Criteria**

- The user can delete a category they own.
- Deleting a category does not delete its tasks.
- Tasks that belonged to the deleted category become uncategorized.
- A user cannot delete another user's category.
- The deleted category is no longer available for task assignment.

---

### US-14 — Assign a Task to a Category

**User Story**

As an authenticated user, I want to assign a task to a category so that I can organize related tasks together.

**Acceptance Criteria**

- A task can be assigned to one category.
- A task may also remain uncategorized.
- The selected category must belong to the authenticated user.
- The task's category can be changed later.
- Changing a task's category does not alter the task's other information.

---

# 4. Task Organization

### US-15 — Set Task Priority

**User Story**

As an authenticated user, I want to assign a priority to a task so that I can distinguish between tasks based on importance.

**Acceptance Criteria**

- A task can have one of the supported priority levels:
  - `LOW`
  - `MEDIUM`
  - `HIGH`
- New tasks default to `MEDIUM` priority.
- The user can change the priority after creating the task.
- The selected priority is persisted.

---

### US-16 — Schedule a Task

**User Story**

As an authenticated user, I want to specify when a task starts and when it is due so that I can plan my work.

**Acceptance Criteria**

- A start date is optional.
- A due date is optional.
- A task can have a start date without a due date.
- A task can have a due date without a start date.
- When both dates are provided, the start date cannot be later than the due date.
- The user can update either date later.
- The task's scheduling information is persisted.

---

### US-17 — Identify Overdue Tasks

**User Story**

As an authenticated user, I want to easily identify overdue tasks so that I know which unfinished tasks require attention.

**Acceptance Criteria**

- A task is considered overdue when its due date has passed and its status is not `DONE`.
- Overdue is derived from the task's due date and status.
- `OVERDUE` is not stored as a separate task status.
- Overdue tasks are visually distinguished in the interface.
- A completed task is not considered overdue even if its due date has passed.

---

### US-18 — Filter Tasks

**User Story**

As an authenticated user, I want to filter my tasks so that I can quickly find tasks matching specific criteria.

**Acceptance Criteria**

- The user can filter tasks by status.
- The user can filter tasks by priority.
- The user can filter tasks by category.
- Filters can be cleared.
- Filtering only applies to the authenticated user's tasks.
- The interface clearly indicates when a filter is active.

---

### US-19 — Sort Tasks

**User Story**

As an authenticated user, I want to sort my tasks so that I can view them in an order that is useful to me.

**Acceptance Criteria**

- The user can sort tasks using supported sorting options.
- Sorting does not modify the underlying task data.
- Sorting only applies to the authenticated user's tasks.

---

# 5. Task Progress Overview

### US-20 — View Task Progress

**User Story**

As an authenticated user, I want to see my overall task progress so that I can quickly understand how much work I have completed.

**Acceptance Criteria**

- The dashboard displays the total number of tasks.
- The dashboard displays the number of completed tasks.
- The dashboard displays the number of tasks that are still to do.
- The dashboard displays the number of tasks in progress.
- The completion summary can be represented as a count such as `5 of 17 completed`.
- The displayed counts reflect the user's current tasks.
- The progress information is calculated from persisted task data rather than hardcoded values.