# Doctor Booking System

A modern, full-stack web application for booking doctor appointments, managing health records, and connecting patients with verified healthcare professionals. Built with React, Tailwind CSS, and a RESTful API backend.

---

## 🚀 Features
- **Patient & Doctor Dashboards:** Personalized dashboards for patients and doctors with real-time stats, quick actions, and appointment management.
- **Appointment Booking:** Intuitive interface for searching doctors, viewing profiles, and booking or rescheduling appointments.
- **Health Records:** Secure management and overview of medical documents, lab results, and prescriptions.
- **Quick Actions & Wellness:** Motivational and wellness quick actions for both patients and doctors.
- **Responsive Design:** Fully responsive, mobile-friendly UI using Tailwind CSS.
- **Authentication:** Role-based login and protected routes (JWT-based, see API integration).
- **Notifications:** In-app notifications for appointment status and reminders.
- **Dark Mode:** User preference for light/dark theme.

---

## 🗂️ Project Structure

```
DOCTOR-BOOKING-SYSTEM/
├── public/                # Static assets and index.html
├── src/
│   ├── assets/            # Images and static resources
│   ├── components/        # Reusable UI components
│   │   ├── sections/      # Landing page and shared sections
│   │   └── other/         # Utility components (e.g., ScrollToTop)
│   ├── data/              # Static data (features, stats, FAQs)
│   ├── pages/             # Main app pages (Home, Dashboards, Search)
│   ├── App.jsx            # Main app router and layout
│   ├── main.jsx           # React root entry
│   └── index.css          # Tailwind and global styles
├── package.json           # Project metadata and scripts
├── vite.config.js         # Vite configuration
└── README.md              # Project documentation
```

---

## 🧩 Main Components & Pages

- **App.jsx**: Main router, handles navigation and layout.
- **HomePage.jsx**: Landing page with hero, features, testimonials, and FAQ.
- **DoctorDashboard.jsx**: Doctor's dashboard for managing appointments, stats, and quick actions.
- **PatientDashboard.jsx**: Patient's dashboard for appointments, health overview, and quick actions.
- **DoctorSearchPage.jsx**: Search and filter doctors, view profiles, and book appointments.
- **components/**: Modular UI (NavBar, Footer, Modal, QuickActions, OverviewStats, etc.)
- **data/homePage.js**: Static data for landing page sections.

---

## 🔌 API Integration
- Uses RESTful endpoints (see code for details, e.g., `/api/appointments/patient/{id}`)
- JWT-based authentication (token stored in localStorage)
- Fetches and updates appointments, user profiles, and medical documents

---

## 🎨 Styling & UI
- **Tailwind CSS** for all layout, spacing, color, and responsive design
- No legacy CSS: all custom styles migrated to Tailwind utility classes
- Dark mode support via Tailwind's `dark:` classes

---

## 🛠️ Setup & Development

1. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```
2. **Start the development server:**
   ```bash
   npm run dev
   ```
3. **Open the app:**
   Visit [http://localhost:5173](http://localhost:5173) (or as shown in your terminal)

---

## 📁 Key Files & Folders
- `src/pages/`: Main application pages
- `src/components/`: All UI components (modals, stats, quick actions, etc.)
- `src/data/`: Static data for features, stats, testimonials, FAQs
- `src/assets/`: Images and static resources

---

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License
[MIT](LICENSE)