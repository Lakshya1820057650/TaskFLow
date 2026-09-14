# TaskFlow — Java Full Stack Task Manager

A task management application built with **Spring Boot** (REST API + JPA) on the
backend and a lightweight **HTML/CSS/JavaScript** frontend consuming the API.
Built as a hands-on capstone-style project for Java Full Stack Engineer Trainee
applications.

## Tech Stack

- **Backend:** Java 17, Spring Boot 3, Spring Web, Spring Data JPA
- **Database:** H2 (in-memory, zero setup — swap for MySQL in `application.properties` if needed)
- **Validation:** Jakarta Bean Validation (`@NotBlank`, `@Size`)
- **Testing:** JUnit 5 + Mockito (service-layer unit tests)
- **Frontend:** Vanilla HTML/CSS/JavaScript (fetch API, no framework dependency)
- **Build tool:** Maven

## Features

- Full CRUD for tasks (create, read, update, delete)
- Filter tasks by status (`PENDING`, `IN_PROGRESS`, `COMPLETED`)
- Search tasks by title (case-insensitive, partial match)
- Priority levels (`LOW`, `MEDIUM`, `HIGH`)
- Server-side validation with structured JSON error responses
- Global exception handling (404 for missing tasks, 400 for validation errors)
- Layered architecture: Controller → Service (interface + impl) → Repository → Entity
- Unit tests for the service layer using mocked repository (Mockito)

## Project Structure

```
taskflow/
├── pom.xml
├── src/main/java/com/taskflow/
│   ├── TaskflowApplication.java       # entry point
│   ├── model/Task.java                # JPA entity
│   ├── repository/TaskRepository.java # Spring Data JPA repo
│   ├── service/                       # business logic (interface + impl)
│   ├── controller/TaskController.java # REST endpoints
│   └── exception/                     # custom exception + global handler
├── src/main/resources/
│   ├── application.properties
│   └── static/                        # frontend: index.html, style.css, app.js
└── src/test/java/com/taskflow/service/TaskServiceTest.java
```

## How to Run

### Prerequisites
- Java 17+ (`java -version`)
- Maven 3.6+ (`mvn -version`) — or use an IDE like IntelliJ/Eclipse/VS Code which bundles it

### Steps
```bash
# 1. Navigate into the project
cd taskflow

# 2. Run it
mvn spring-boot:run
```

Then open **http://localhost:8080** in your browser — the frontend is served directly
by Spring Boot. The REST API lives under **http://localhost:8080/api/tasks**.

The H2 database console is available at **http://localhost:8080/h2-console**
(JDBC URL: `jdbc:h2:mem:taskflowdb`, username: `sa`, no password) — useful for
showing interviewers you understand what's happening under the hood.

### Run tests
```bash
mvn test
```

## API Endpoints

| Method | Endpoint                          | Description                     |
|--------|------------------------------------|----------------------------------|
| GET    | `/api/tasks`                       | List all tasks                  |
| GET    | `/api/tasks?status=PENDING`        | Filter by status                |
| GET    | `/api/tasks?search=keyword`        | Search by title                 |
| GET    | `/api/tasks/{id}`                  | Get a single task               |
| POST   | `/api/tasks`                       | Create a task                   |
| PUT    | `/api/tasks/{id}`                  | Update a task                   |
| DELETE | `/api/tasks/{id}`                  | Delete a task                   |

Example request body:
```json
{
  "title": "Prepare capstone demo",
  "description": "Practice explaining the layered architecture",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "dueDate": "2026-09-20"
}
```

## Before you present this as your own project

1. **Run it locally end-to-end** and click through every feature yourself.
2. **Read every file** — be ready to explain the Controller → Service → Repository
   flow, why the Service is an interface + implementation, and what `@Valid`,
   `@RestControllerAdvice`, and `@PrePersist` do.
3. **Push it to your GitHub** as its own repo, with a commit history (don't just
   upload it as one giant commit — make a few incremental commits so it looks
   like real development, because it will be).
4. **Extend it** if you have time: add pagination, a `PATCH /api/tasks/{id}/status`
   endpoint, or swap H2 for MySQL — genuine extensions make for great interview
   talking points.

## Possible Next Steps (good "future work" talking points)

- Add JWT-based authentication (Spring Security)
- Add pagination and sorting to `GET /api/tasks`
- Swap H2 for MySQL with Docker Compose
- Add a `/api/tasks/stats` endpoint (counts by status/priority)
- Migrate the frontend to React for closer alignment with a full JD stack
