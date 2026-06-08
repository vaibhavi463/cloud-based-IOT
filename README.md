# 🔒 Smart IoT RFID Attendance System — Dashboard

A premium, dark-themed SaaS-style dashboard for the Smart IoT RFID Attendance System. Built with React, Tailwind CSS, Firebase, and Recharts.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Firebase
Open `src/firebase/config.js` and replace the placeholder values with your Firebase project credentials:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

---

## 📁 Project Structure

```
src/
├── firebase/           # Firebase SDK config
├── hooks/              # Custom React hooks (real-time Firestore)
│   ├── useStudents.js
│   ├── useAttendance.js
│   └── useStats.js
├── utils/              # Export utilities (PDF, Excel, CSV)
├── components/
│   ├── layout/         # Sidebar, Navbar, Layout wrapper
│   ├── dashboard/      # StatCard, LiveFeed, SystemHealth
│   ├── students/       # StudentTable, AddStudentModal, ImportCSV
│   ├── attendance/     # AttendanceTable
│   ├── analytics/      # TrendChart, PieChart, BarChart
│   ├── reports/        # ReportGenerator
│   └── ui/             # Badge, Modal, SearchInput, EmptyState
├── pages/              # 6 main pages
│   ├── DashboardPage.jsx
│   ├── StudentsPage.jsx
│   ├── AttendancePage.jsx
│   ├── AnalyticsPage.jsx
│   ├── ReportsPage.jsx
│   └── SettingsPage.jsx
├── App.jsx             # Router
├── main.jsx            # Entry point
└── index.css           # Tailwind theme + glassmorphism
```

---

## ✨ Features

| Feature | Details |
|---------|---------|
| 📊 Dashboard | 6 stat cards, trend chart, live feed, system health |
| 👥 Students | Add, edit, delete, import CSV, export CSV |
| 📋 Attendance | Real-time table, search, filter, sort, paginate, CSV/Excel export |
| 📈 Analytics | 30-day trend, pie chart, bar chart, RFID usage leaderboard |
| 📄 Reports | Daily/weekly/monthly, PDF export, Excel export, print |
| ⚙️ Settings | System health monitor, security panel, about section |
| 🎨 Design | Dark glassmorphism, Framer Motion animations, responsive |

---

## 🔥 Deploy to Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize hosting
firebase init hosting
# → Select your Firebase project
# → Set public directory to: dist
# → Configure as single-page app: Yes

# Build & Deploy
npm run build
firebase deploy --only hosting
```

---

## 🛠 Tech Stack

- **React 19** + Vite
- **Tailwind CSS v4**
- **Firebase SDK** (Firestore real-time listeners)
- **Recharts** (responsive charts)
- **Framer Motion** (animations)
- **Lucide React** (icons)
- **jsPDF + autotable** (PDF export)
- **xlsx** (Excel export)
- **date-fns** (date formatting)

---

## 🌐 System Architecture

```
RFID Card Scan → ESP32 + MFRC522 → WiFi → HTTP POST → Cloud Run API → Firestore → Dashboard
```

---

Built for university final-year project demonstration, viva, and portfolio showcase.
