# Nexus HR — Employee Management Platform

> ReactJS Assignment Submission for Jotish

A fully functional React SPA built as part of the Jotish engineering assignment. Covers all 4 required screens plus bonus Salary Graph and Map View.

---

## 🚀 Live Demo

> Add your deployed link here (Vercel / Netlify / etc.)

---

## 📋 Assignment Requirements

| Requirement | Status |
|---|---|
| Login page with validation (testuser / Test123) | ✅ Done |
| List page with API data | ✅ Done |
| Table + Card grid toggle | ✅ Done |
| Search filter | ✅ Done |
| Details page with all employee info | ✅ Done |
| Camera capture using webcam | ✅ Done |
| Photo Result page | ✅ Done |
| Salary Bar Graph (Bonus) | ✅ Done |
| Map View with city markers (Bonus) | ✅ Done |

---

## 🛠 Tech Stack

| Concern | Library |
|---|---|
| Framework | React 18 + Vite |
| Routing | react-router-dom v6 |
| HTTP Client | Axios |
| Charts | Recharts |
| Maps | react-leaflet |
| Camera | react-webcam |
| Styling | Tailwind CSS v3 |
| Auth State | React Context API |

---

## 📁 Folder Structure

```
src/
├── components/
│   ├── Navbar.jsx            # Top navigation bar
│   ├── ProtectedRoute.jsx    # Auth guard for private routes
│   ├── EmployeeTable.jsx     # Table view
│   ├── EmployeeCard.jsx      # Card grid view
│   ├── CameraCapture.jsx     # Webcam UI
│   └── Spinner.jsx           # Loading indicator
│
├── pages/
│   ├── Login.jsx             # Route: /
│   ├── List.jsx              # Route: /list
│   ├── Details.jsx           # Route: /details/:id
│   ├── PhotoResult.jsx       # Route: /photo
│   ├── Graph.jsx             # Route: /graph
│   └── MapView.jsx           # Route: /map
│
├── services/
│   └── api.js                # Axios + CORS proxy + mock fallback
│
├── context/
│   └── AuthContext.jsx       # Login/logout + sessionStorage
│
├── hooks/
│   └── useEmployees.js       # Data fetching hook
│
├── App.jsx                   # Route definitions
└── main.jsx                  # Entry point
```

---

## ⚙️ Setup & Run

### 1. Clone the repo

```bash
git clone https://github.com/your-username/nexus-hr.git
cd nexus-hr
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🔐 Login Credentials

```
Username: testuser
Password: Test123
```

---

## 🌐 API

The employee data is fetched from the Jotish backend:

```
POST https://backend.jotish.in/backend_dev/gettabledata.php
Body: { "username": "test", "password": "123456" }
```

### CORS Fix

The API does not send CORS headers, so direct browser requests are blocked. This is solved using a **Vite dev server proxy** configured in `vite.config.js`:

```js
server: {
  proxy: {
    '/api': {
      target: 'https://backend.jotish.in',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '/backend_dev'),
    }
  }
}
```

All requests go through `/api/*` → Vite proxies them server-side → no browser CORS issue.

> If the API is still unreachable, the app automatically falls back to 15 realistic mock employees so all features remain fully testable.

---

## 📺 Screens

| Screen | Route | Description |
|---|---|---|
| Login | `/` | Credential form, validation, error messages |
| Employee List | `/list` | Table + card view, search filter, API data |
| Employee Details | `/details/:id` | Full profile, webcam photo capture |
| Photo Result | `/photo` | Captured image, download + retake options |
| Salary Graph | `/graph` | Bar chart of top 10 employee salaries |
| Map View | `/map` | City markers with name + salary popups |

---

## 📦 Build for Production

```bash
npm run build
npm run preview
```

---

## 📸 Screenshots

| Screen | Preview |
|---|---|
| Login | ![Login](screenshots/login.png) |
| Employee List | ![List](screenshots/list.png) |
| Employee Cards | ![Cards](screenshots/cards.png) |
| Employee Details | ![Details](screenshots/details.png) |
| Camera Capture | ![Camera](screenshots/camera.png) |
| Photo Result | ![Photo](screenshots/photo.png) |
| Salary Graph | ![Graph](screenshots/graph.png) |
| Map View | ![Map](screenshots/map.png) |

---

## 🎥 Screen Recording

👉 [Watch full app walkthrough](https://drive.google.com/your-recording-link)

> End-to-end demo: Login → Employee List → Details → Camera → Photo Result → Salary Graph → Map View

---

## 👤 Author

**Gurmeet Singh Rathor**  
gurigurmeet1234567@gmail.com
