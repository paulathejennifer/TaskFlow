# TaskFlow — Data Model

## 1. Overview

TaskFlow uses a relational data model consisting of three primary entities:

- User
- Task
- Category

The data model is designed to support authenticated task management while
ensuring that users can only access and manage resources that belong to them.

The relationships between these entities are represented in the Entity
Relationship Diagram (ERD) below.

---

## 2. Entity Relationship Diagram

![TaskFlow Entity Relationship Diagram](images/erd.png)

The ERD represents the relationships between users, tasks, and categories,
including ownership and optional task categorization.

---

# 3. Entities and Attributes

## 3.1 User

The `User` entity represents a registered TaskFlow account.

### Attributes

| Attribute | Type | Required | Nullable | Default | Constraints / Description |
|---|---|---|---|---|---|
| `id` | UUID | Yes | No | Generated | Primary key. Must be unique. |
| `full_name` | String | Yes | No | None | User's full name. Must not be empty or whitespace-only. |
| `email` | String | Yes | No | None | User's email address. Must be valid and unique. |
| `password_hash` | String | Yes | No | None | Securely hashed password. Plaintext passwords must never be stored. |
| `created_at` | DateTime | Yes | No | Current timestamp | Timestamp indicating when the account was created. |
| `updated_at` | DateTime | Yes | No | Current timestamp | Timestamp indicating when the user record was last updated. |

### User Constraints

- `id` is the primary key.
- `email` must be unique.
- Email addresses should be normalized before comparison and storage.
- Passwords must never be stored in plaintext.
- Password hashing is handled by the backend.
- `created_at` is assigned when the account is created.
- `updated_at` is updated whenever the user record changes.

---

## 3.2 Task

The `Task` entity represents a piece of work that an authenticated user wants
to create, track, update, or complete.

### Attributes

| Attribute | Type | Required | Nullable | Default | Constraints / Description |
|---|---|---|---|---|---|
| `id` | UUID | Yes | No | Generated | Primary key. Must be unique. |
| `user_id` | UUID | Yes | No | None | Foreign key referencing the owner of the task. |
| `category_id` | UUID | No | Yes | `NULL` | Optional foreign key referencing a category. |
| `title` | String | Yes | No | None | Task title. Must not be empty or whitespace-only. |
| `description` | Text | No | Yes | `NULL` | Optional additional information about the task. |
| `status` | Enum | Yes | No | `TODO` | Current state of the task. |
| `priority` | Enum | Yes | No | `MEDIUM` | Importance level of the task. |
| `start_date` | DateTime | No | Yes | `NULL` | Optional date/time at which the task is intended to start. |
| `due_date` | DateTime | No | Yes | `NULL` | Optional date/time by which the task is intended to be completed. |
| `completed_at` | DateTime | No | Yes | `NULL` | Timestamp recorded when the task is marked as completed. |
| `created_at` | DateTime | Yes | No | Current timestamp | Timestamp indicating when the task was created. |
| `updated_at` | DateTime | Yes | No | Current timestamp | Timestamp indicating when the task was last updated. |

### Task Constraints

- `id` is the primary key.
- `user_id` must reference an existing user.
- `category_id` may be `NULL` because assigning a category is optional.
- `title` is required.
- `title` must not be empty or consist only of whitespace.
- `description` is optional.
- `status` must contain one of the supported status values.
- `priority` must contain one of the supported priority values.
- `start_date` is optional.
- `due_date` is optional.
- If both `start_date` and `due_date` are provided, `start_date` must not be
  later than `due_date`.
- `completed_at` is populated when a task is marked as `DONE`.
- `completed_at` is cleared if a completed task is reopened.
- `created_at` is assigned when the task is created.
- `updated_at` is updated whenever the task changes.

### Task Status

A task can have one of the following statuses:

```text
TODO
IN_PROGRESS
DONE
```

The status represents the current state of the task.

### Status Transitions

Task statuses are intentionally allowed to move freely between the supported
states.

For example:

```text
TODO → IN_PROGRESS → DONE
```

However, the system also allows:

```text
DONE → IN_PROGRESS
DONE → TODO
IN_PROGRESS → TODO
TODO → DONE
```

This is intentional because users may forget to update a task, change their
mind about its progress, or need to reopen a previously completed task.

The system therefore does not enforce a fixed status progression.

### Task Priority

A task can have one of the following priority levels:

```text
LOW
MEDIUM
HIGH
```

The default priority for a newly created task is:

```text
MEDIUM
```

### Task Title

The task title is mandatory because every task should have a meaningful
identifier that allows the user to recognize it.

The title:

- Must be provided when creating a task.
- Must not be empty.
- Must not consist only of whitespace.
- May be edited after creation.

### Task Description

The description is optional.

A user may create a task with only a title when additional information is not
necessary.

### Task Dates

Both `start_date` and `due_date` are optional.

The following combinations are therefore valid:

```text
start_date + due_date
start_date only
due_date only
neither date
```

If both dates are provided:

```text
start_date <= due_date
```

The system must reject a task where the start date occurs after the due date.

Dates can be modified after task creation.

### Task Completion

When a task is changed to `DONE`:

```text
completed_at = current timestamp
```

If a completed task is subsequently reopened and moved back to `TODO` or
`IN_PROGRESS`:

```text
completed_at = NULL
```

This allows the system to accurately represent whether the task is currently
completed.

---

## 3.3 Category

The `Category` entity represents a user-defined method of organizing tasks.

Categories are not globally hardcoded by the application.

Users can create categories according to their own needs, such as:

```text
Work
Family
Personal
School
Errands
Projects
```

These examples are illustrative only. Users are free to create, rename, and
delete their own categories.

### Attributes

| Attribute | Type | Required | Nullable | Default | Constraints / Description |
|---|---|---|---|---|---|
| `id` | UUID | Yes | No | Generated | Primary key. Must be unique. |
| `user_id` | UUID | Yes | No | None | Foreign key referencing the category owner. |
| `name` | String | Yes | No | None | User-defined category name. |
| `created_at` | DateTime | Yes | No | Current timestamp | Timestamp indicating when the category was created. |
| `updated_at` | DateTime | Yes | No | Current timestamp | Timestamp indicating when the category was last updated. |

### Category Constraints

- `id` is the primary key.
- `user_id` must reference an existing user.
- `name` is required.
- `name` must not be empty.
- `name` must not consist only of whitespace.
- A user cannot have duplicate category names.
- Categories belong to the user who created them.
- Category names can be changed after creation.
- Deleting a category must not delete the tasks assigned to it.

---

# 4. Relationships

## 4.1 User — Task

### Relationship

**One-to-Many (1:N)**

One user can own many tasks.

```text
User 1 ───────────< Task
```

Each task belongs to exactly one user.

### Business Rule

A task cannot exist without an owner.

The `Task.user_id` attribute references `User.id`.

Therefore:

```text
User
  |
  | 1
  |
  | many
  ↓
Task
```

---

## 4.2 User — Category

### Relationship

**One-to-Many (1:N)**

One user can create many categories.

```text
User 1 ───────────< Category
```

Each category belongs to exactly one user.

The `Category.user_id` attribute references `User.id`.

Therefore:

```text
User
  |
  | 1
  |
  | many
  ↓
Category
```

---

## 4.3 Category — Task

### Relationship

**One-to-Many (1:N)**

One category can contain many tasks.

```text
Category 1 ───────────< Task
```

However, category assignment is optional for a task.

Therefore:

- A category can have zero or many tasks.
- A task can belong to zero or one category.

The `Task.category_id` field is therefore nullable.

```text
Category 1 ───────────< Task
                         |
                         | 0..1 category
```

---

# 5. Relationship Summary

| Relationship | Cardinality | Description |
|---|---|---|
| User → Task | 1 : Many | One user can own many tasks. |
| User → Category | 1 : Many | One user can create many categories. |
| Category → Task | 1 : Many | One category can contain many tasks. |
| Task → Category | 0..1 | A task may be uncategorized or assigned to one category. |

### Overall Relationship Model

```text
                         ┌──────────────┐
                         │     User     │
                         └──────┬───────┘
                                │
                 ┌──────────────┴──────────────┐
                 │                             │
                 │ 1                           │ 1
                 │                             │
              many                          many
                 │                             │
                 ▼                             ▼
          ┌─────────────┐               ┌─────────────┐
          │    Task     │               │  Category   │
          └─────────────┘               └──────┬──────┘
                 ▲                              │
                 │                              │ 1
                 │                              │
                 └──────────── many ────────────┘
```

More precisely:

```text
User
 ├── 1 : Many → Task
 └── 1 : Many → Category

Category
 └── 1 : Many → Task

Task
 ├── belongs to exactly 1 User
 └── belongs to 0 or 1 Category
```

---

# 6. Referential Integrity

The database relationships must enforce valid references between entities.

## 6.1 Task Ownership

`Task.user_id` must reference an existing `User.id`.

A task must always have an owner.

## 6.2 Category Ownership

`Category.user_id` must reference an existing `User.id`.

A category must always have an owner.

## 6.3 Task Category

If `Task.category_id` is not `NULL`, it must reference an existing
`Category.id`.

The backend must additionally verify that the referenced category belongs to
the authenticated user.

This prevents a user from assigning their task to another user's category.

---

# 7. Data Ownership and Isolation

TaskFlow is a multi-user application.

Each user's tasks and categories must be isolated from other users.

The backend must verify ownership when performing operations such as:

- Viewing a task
- Updating a task
- Deleting a task
- Viewing a category
- Updating a category
- Deleting a category
- Assigning a category to a task

The frontend must not be treated as the security boundary.

For example, retrieving a task should conceptually ensure that both the task
identifier and authenticated user's identifier match:

```text
task.id = requested_task_id
AND
task.user_id = authenticated_user_id
```

This prevents a user from accessing another user's task by changing an ID in
a request.

---

# 8. Category Assignment

Category assignment is optional.

A user may create a task without selecting a category.

For example:

```text
Task A
Category: NULL
```

The user can later assign the task to a category:

```text
Task A
Category: Work
```

The user can also change the category later:

```text
Work → Personal
```

or remove the category entirely:

```text
Personal → Uncategorized
```

This allows task organization to change as the user's needs change.

---

# 9. Category Deletion Behaviour

Deleting a category must not delete the tasks associated with that category.

Instead, the category reference on those tasks is removed.

For example:

```text
Before deletion:

Category: Work
    ├── Task A
    ├── Task B
    └── Task C
```

After deleting the `Work` category:

```text
Task A → Uncategorized
Task B → Uncategorized
Task C → Uncategorized
```

The tasks remain available to the user.

This prevents deleting an organizational category from accidentally deleting
the user's actual work.

---

# 10. Overdue Task Behaviour

`OVERDUE` is intentionally **not** stored as a separate task status.

The supported stored statuses remain:

```text
TODO
IN_PROGRESS
DONE
```

A task is considered overdue when:

```text
due_date < current time
AND
status != DONE
```

Therefore:

```text
TODO + past due date
        ↓
     OVERDUE
```

and:

```text
IN_PROGRESS + past due date
        ↓
       OVERDUE
```

A completed task is not considered overdue:

```text
DONE + past due date
        ↓
    NOT OVERDUE
```

The overdue state is therefore derived from existing task information rather
than stored independently.

The frontend can communicate this state using a clear visual indicator, such
as an `OVERDUE` badge.

This keeps the stored task status simple while still giving the user clear
visibility into overdue work.

---

# 11. Task Completion Tracking

The dashboard can display progress information such as:

```text
5 of 17 tasks completed
```

The values are derived from the user's persisted tasks.

For example:

```text
Total tasks = 17
Completed tasks = 5
```

The frontend must not use hardcoded values for this information.

The backend can provide the relevant task data or calculated counts through
the API, while the frontend is responsible for presenting the information to
the user.

---

# 12. Data Validation Rules

The following validation rules apply to the data model.

## User

- Full name is required.
- Full name cannot be empty or whitespace-only.
- Email is required.
- Email must have a valid email format.
- Email must be unique.
- Password must be securely hashed before storage.

## Task

- Title is required.
- Title cannot be empty or whitespace-only.
- Description is optional.
- Status must be `TODO`, `IN_PROGRESS`, or `DONE`.
- Priority must be `LOW`, `MEDIUM`, or `HIGH`.
- Start date is optional.
- Due date is optional.
- If both dates are supplied, the start date cannot occur after the due date.
- Category is optional.
- If a category is supplied, it must belong to the authenticated user.

## Category

- Category name is required.
- Category name cannot be empty or whitespace-only.
- A user cannot create duplicate category names.
- Category ownership must be verified by the backend.

---

# 13. Design Decisions

The data model intentionally remains small for the MVP.

The three entities are sufficient to support:

- User authentication
- User-owned tasks
- Task status management
- Task priority
- Task scheduling
- Task completion tracking
- Optional categorization
- Category management
- Overdue task identification
- Task progress summaries
- User data isolation

The model avoids introducing additional entities unless they become necessary
during implementation.

The following decisions were made during the design process:

### Optional Categories

Tasks can exist without a category because a user may not know how they want
to organize a task at the time it is created.

### One Category Per Task

A task belongs to zero or one category rather than multiple categories.

This keeps the MVP simple and gives categories a clear organizational
purpose without introducing a many-to-many relationship and an additional
join table.

### Free Task Status Transitions

The system does not force users through a fixed task lifecycle.

Users can move tasks between `TODO`, `IN_PROGRESS`, and `DONE` as needed.

### Derived Overdue State

`OVERDUE` is not stored as a fourth status.

It is derived from the due date and current task status so that the system does
not have to maintain potentially conflicting status information.

### Category Deletion

Deleting a category does not delete its tasks.

Tasks become uncategorized instead.

### Completion Timestamp

`completed_at` records when a task was completed and is cleared if the task is
reopened.

---

# 14. Entity Summary

| Entity | Purpose |
|---|---|
| `User` | Represents an authenticated TaskFlow user. |
| `Task` | Represents a piece of work managed by a user. |
| `Category` | Represents a user-defined way of organizing tasks. |

The resulting domain model is intentionally simple:

```text
User
 ├── Tasks
 │    ├── Status
 │    ├── Priority
 │    ├── Dates
 │    └── Optional Category
 │
 └── Categories
      └── Tasks
```

This provides the foundation for the API, database implementation, validation,
authentication, and frontend functionality that will be developed in later
stages.