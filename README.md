# EduSphere - Premium E-Learning Frontend Platform

EduSphere is a production-quality, responsive e-learning platform frontend built from scratch using React 18, React Router v6, Tailwind CSS, Lucide Icons, and React Hook Form.

---

## 🛠️ Stack & Dependencies

To ensure a lightweight, high-performance UI experience, the platform uses a minimal, vetted dependencies footprint:
- **React 18**: Main frontend component architecture
- **React Router v6**: Dynamic client routing
- **Tailwind CSS**: Modern utility styling, layouts, custom responsive breakpoints, transitions, and hover states
- **React Hook Form (RHF)**: Clean input validation rules for forms
- **Lucide React**: Clean SVG icons

No styling libraries (like Shadcn or Tailwind UI) or complex state managers (like Zustand/TanStack) were installed. All widgets (accordions, sliders, progress bars, notifications drawers, filter drawers) are built completely from scratch using standard React hooks (`useState`, `useContext`, `useEffect`).

---

## 📦 File Layout

```
src/
  components/       # Button, Card, Badge, Input, Avatar, RatingStars, Skeleton
  layouts/          # PublicLayout, AuthLayout, DashboardLayout, AdminLayout
  pages/            # Home, CourseList, CourseDetail, Login, Signup, StudentDashboard, AdminCourses, AdminUsers
  hooks/            # useAuth, useWishlist
  context/          # AuthContext, CourseContext, WishlistContext
  data/             # JSON schemas (courses, instructors, categories, faqs, testimonials)
  styles/           # index.css (custom tailwind configuration base layers)
```

---

## 🚀 Getting Started

Follow these steps to run the application locally on your machine:

### 1. Install Dependencies
Run the command below in the workspace folder to download the standard packages:
```bash
npm install
```

### 2. Start the Development Server
Launch the local server:
```bash
npm start
```
This runs the local server, opening the app in your default browser at `http://localhost:3000`.

---

## 🔑 Sandbox Credentials

You can log in to experience different features as a Student or Administrator:

### Student View
* **Email:** `jane@example.com`
* **Password:** `password` (any character sequence of 6+ digits)
* *Enables:* Enrolling in courses, ticking off lectures in the dynamic Course Player, earning/viewing certificates, saving items to the wishlist, and writing feedback reviews.

### Administrator View
* **Email:** `admin@example.com`
* **Password:** `password` (any character sequence of 6+ digits)
* *Enables:* Course Management CRUD (adding, editing title/price/levels, deleting courses), and User Directory management (role shifting, suspending/activating accounts, adding users).

---

## ✨ Key Features Implemented

1. **Custom Design System:** Built on a premium Indigo-Violet and Emerald color scheme, using custom geometric headings (`Outfit`) and highly readable UI text (`Inter`).
2. **Dynamic Course Player Drawer:** Located in the Student Dashboard. Click **"Resume Course"** on any active course card to open the fullscreen player. You can check off lectures on the side, instantly recalculating your overall progress percentage.
3. **Verified Credentials:** Once progress hits **100%** on a course in the player, a secure completion certificate is generated and displayed on the dashboard in real-time.
4. **Calculated Course Reviews:** Students can write feedback reviews on course detail pages. Submitting a review immediately appends it to the list and recalculates the average rating and review counts.
5. **Robust Sidebar Navigation:** Fully responsive collapsible drawers for students and admins, adapting cleanly between mobile layouts, tablet viewports, and wide desktops.
6. **RHF Validation:** Login, signup, course creation, and user creation forms all include instant error feedback overlays.
