
# Prompts Used During Development

This document records the key AI-assisted prompts used in the development of Workflow Builder Lite. Prompts were used to accelerate implementation, clarify architectural decisions, and validate best practices. All code and design decisions were reviewed and adapted for project requirements.

---

## 1. Project Structure and Scaffolding
**Prompt Category:** Project Generation
**Prompt:**
```
Generate a full-stack project structure for a workflow automation app with:
- Backend: Node.js + Express + Prisma + PostgreSQL
- Frontend: React (Vite)
- LLM integration (Google Gemini)
Include folders for controllers, routes, services, utils, and a clean React client.
```
**Outcome:**
Used as a reference for initial folder and file layout. Final structure was customized for modularity and clarity.

---

## 2. Workflow Engine Design
**Prompt Category:** Architecture/Design
**Prompt:**
```
Design a workflowEngine module that executes a list of steps sequentially, passing each step's output as the next input. Each step may be LLM-based or non-LLM. Track execution time per step and return structured results.
```
**Outcome:**
Informed the implementation of a modular, sequential workflow engine with per-step timing and error handling.

---

## 3. Step Registry Pattern
**Prompt Category:** Architecture/Refactor
**Prompt:**
```
How can I avoid switch/case logic for step types in a workflow system? Suggest a registry pattern for mapping step types to handlers and metadata.
```
**Outcome:**
Adopted a centralized stepRegistry object for extensibility and maintainability of step definitions.

---

## 4. LLM Service Isolation
**Prompt Category:** Best Practice/Integration
**Prompt:**
```
What is the best way to isolate all LLM (Google Gemini) API calls in a Node.js backend? Ensure that business logic is not tied to the LLM provider.
```
**Outcome:**
Implemented llmService as a dedicated module, abstracting all LLM interactions and supporting future provider changes.

---

## 5. Centralized Error Handling
**Prompt Category:** Error Handling
**Prompt:**
```
How should I structure centralized error handling in an Express backend? Include a custom AppError class and asyncHandler utility.
```
**Outcome:**
Developed a robust error handling layer with AppError, asyncHandler, and consistent error responses.

---

## 6. Input Validation Layer
**Prompt Category:** Validation/Best Practice
**Prompt:**
```
Suggest a validation approach for workflow creation and run execution endpoints. Enforce step type validity, input presence, and step count limits.
```
**Outcome:**
Added a dedicated validation module for workflows and runs, ensuring strong input checks and clear error messages.

---

## 7. Health Endpoint Implementation
**Prompt Category:** Feature Implementation
**Prompt:**
```
How can I implement a health endpoint in Express that checks server status, database connectivity (PostgreSQL), and LLM API availability?
```
**Outcome:**
Built a /api/health endpoint that verifies server, DB, and LLM status, returning a structured health report.

---

## 8. Frontend API Service Refactor
**Prompt Category:** Refactor/Frontend
**Prompt:**
```
Refactor the React frontend API service to use axios instead of fetch, and ensure all endpoints match the backend routes.
```
**Outcome:**
Updated the frontend API layer for consistency, error handling, and maintainability.

---

## 9. Dark Theme and UI Modernization
**Prompt Category:** UI/UX Enhancement
**Prompt:**
```
Suggest a modern dark theme and button hover effects for a React + Vite app. Update CSS variables and button styles for a more creative, professional look.
```
**Outcome:**
Applied a dark theme and improved button styles for a more polished user experience.

---
