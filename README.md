# Nexus HR — Employee Management Platform

> ReactJS Assignment Submission for Jotish

A fully functional React SPA built as part of the Jotish engineering assignment. Covers all 4 required screens plus bonus Salary Graph and Map View.

---

 

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
"Real API integrated. Mock fallback activates if CORS blocks the request. All  screens fully functional."

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
| Login |  <img width="1919" height="868" alt="image" src="https://github.com/user-attachments/assets/27d2a4e0-b147-4600-a424-92af5d2ef4de" />
 |
| Employee List | <img width="1918" height="929" alt="image" src="https://github.com/user-attachments/assets/c4507cd9-74bf-43db-8552-bf2c97bbe8cb" />
 |
| Employee Cards | <img width="1919" height="822" alt="image" src="https://github.com/user-attachments/assets/4b112ee9-74ee-483c-b2e3-ea1db361c664" />
|
| Employee Details | <img width="1919" height="874" alt="image" src="https://github.com/user-attachments/assets/b36e0657-982e-41b3-850f-98c735749195" />
 |
| Camera Capture | <img width="1916" height="978" alt="image" src="https://github.com/user-attachments/assets/3caf134e-ddaa-4d25-8bc7-c650076fb54b" />
 |
| Photo Result |<img width="1917" height="846" alt="image" src="https://github.com/user-attachments/assets/0e983379-4d10-43ac-af9f-b3aeaa057666" />
 |
| Salary Graph | <img width="1907" height="851" alt="image" src="https://github.com/user-attachments/assets/f9936826-b571-47ca-a2b1-5ef346ec4a46" />
 |
| Map View |<img width="1919" height="854" alt="image" src="https://github.com/user-attachments/assets/16f0e946-bc53-48ec-bb42-16c2412a479c" />
 |

---

## 🎥 Screen Recording

https://drive.google.com/your-recording-link](https://drive.google.com/file/d/1drc-IzZ6S5RelYlotTJVJrK7gJ-wscOZ/view?usp=sharing



---

## 👤 Author

**Gurmeet Singh Rathor**  
gurigurmeet1234567@gmail.com
