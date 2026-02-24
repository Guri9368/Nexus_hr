# Nexus HR — Employee Management Platform

A fully-featured ReactJS application built as a company assignment submission.
Demonstrates clean architecture, routing, API integration, webcam capture, data visualisation, and interactive maps.

---

## Tech Stack

| Concern        | Library               |
|----------------|-----------------------|
| Framework      | React 18 + Vite       |
| Routing        | react-router-dom v6   |
| HTTP client    | Axios                 |
| Charts         | Recharts              |
| Maps           | react-leaflet         |
| Camera         | react-webcam          |
| Styling        | Tailwind CSS v3       |
| Auth state     | Context API           |

---

## Screens

| Route           | Description                                      |
|-----------------|--------------------------------------------------|
| `/`             | Login — validates `testuser` / `Test123`         |
| `/list`         | Employee directory — table ⟷ card toggle, search |
| `/details/:id`  | Employee profile + webcam photo capture          |
| `/photo`        | Photo result with download option                |
| `/graph`        | Recharts bar chart of top 10 salaries            |
| `/map`          | react-leaflet map with city markers              |

---

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Top navigation bar
│   ├── ProtectedRoute.jsx  # Auth guard for private routes
│   ├── EmployeeTable.jsx   # Data table view
│   ├── EmployeeCard.jsx    # Card grid view
│   ├── CameraCapture.jsx   # Webcam capture UI
│   └── Spinner.jsx         # Loading indicator
│
├── pages/
│   ├── Login.jsx           # Public login form
│   ├── List.jsx            # Employee list page
│   ├── Details.jsx         # Employee detail + camera
│   ├── PhotoResult.jsx     # Captured photo display
│   ├── Graph.jsx           # Salary bar chart
│   └── MapView.jsx         # Leaflet map
│
├── services/
│   └── api.js              # Axios API calls
│
├── context/
│   └── AuthContext.jsx     # Auth state + login/logout
│
├── hooks/
│   └── useEmployees.js     # Data fetching hook
│
├── App.jsx                 # Route definitions
├── main.jsx                # Entry point
└── index.css               # Tailwind + global styles
```

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

### 3. Open in browser

```
http://localhost:5173
```

### 4. Login credentials

```
Username: testuser
Password: Test123
```

---

## API

The employee data is fetched from:

```
POST https://backend.jotish.in/backend_dev/gettabledata.php
Body: { "username": "test", "password": "123456" }
```

All API logic is in `src/services/api.js`. The `useEmployees` hook in `src/hooks/useEmployees.js` manages loading, error, and data state so individual pages stay clean.

---

## Key Engineering Decisions

- **Context API** for auth — lightweight, no extra dependencies
- **sessionStorage** for auth persistence — survives refresh, clears on tab close
- **Custom hook `useEmployees`** — API calls are centralised, pages don't call Axios directly
- **Protected routes** via `<ProtectedRoute>` outlet — single guard for all private routes
- **Normalised field access** — each component handles both API field naming variants (e.g. `emp.name ?? emp.emp_name`) so the app degrades gracefully if the real API shape varies
- **Tailwind `@layer components`** — reusable classes like `.btn-primary`, `.card`, `.input-field` defined once

---

## Build for production

```bash
npm run build
npm run preview
```
