# SkillThali 🍽️

> **Your Skills. Your Earnings. Your Future.**

SkillThali is a student-focused freelancing platform that connects talented students with clients who need affordable, quality services. The platform enables students to showcase their skills — coding, graphic design, content creation, and more — while working on real-world projects and gaining practical industry exposure.

---

## 📖 Description

SkillThali bridges the gap between skilled students and clients looking to get work done efficiently and affordably. Students can browse available tasks, apply for projects, build their portfolios, and earn money. Clients can post tasks, manage applicants, and track project progress — all within a clean, intuitive interface.

The name "SkillThali" is inspired by the Indian concept of a *thali* — a platter offering a variety of flavours — representing the diverse range of skills and opportunities available on the platform.

---

## ✨ Features

### 🎓 Student Dashboard
- Browse all available tasks filtered by category
- View task details including budget, deadline, client info, and required skills
- Apply for tasks with a single click
- Track active tasks with a live progress bar
- View completed tasks and total earnings

### 💼 Client Dashboard
- Post new tasks with title, category, budget, skills, and description
- View all posted tasks and their current statuses
- Click any task to view full details in a modal
- Delete tasks that are no longer needed
- View applicants per task (with placeholder data)

### 📋 Task Posting & Applying
- Tasks are categorised into four sections:
  - 💻 **CodeThali** — Web dev, app dev, debugging
  - 🎨 **Creatix** — Poster design, logo design, thumbnails
  - ⚡ **QuickBites** — LinkedIn setup, data entry, portfolio sites
  - 🤝 **TeamUp** — Group projects, hackathon teams, startup co-founders
- Students apply for tasks directly; tasks move to "Active" once assigned

### 💰 Payment Status System
The platform tracks payment through a three-stage lifecycle:

| Stage | Badge | Meaning |
|-------|-------|---------|
| ⏳ Pending | Yellow | Payment not yet processed |
| 🔒 Secured | Blue | Payment held in escrow after student applies |
| 💰 Released | Green | Payment released after task is marked complete |

### 🔐 Fake Pay Now UI (Coming Soon)
- A **"Pay Now"** button is displayed on tasks where `paymentStatus === 'pending'` and `budget > 0`
- The button is intentionally **non-functional** and **disabled** — it serves as a UI placeholder
- Styled in amber/orange to indicate a pending action
- Marked with `cursor: not-allowed` and `pointer-events: none` to prevent interaction
- Tooltip reads: *"Payment gateway coming soon"*
- Appears both in the Client Posted Tasks list and inside the Task Detail modal

---

## 🛠️ Tech Stack

| Technology | Usage |
|------------|-------|
| **HTML5** | Semantic page structure, modals, forms, dashboard layout |
| **CSS3** | Custom properties, Flexbox, CSS Grid, animations, responsive design |
| **Vanilla JavaScript** | All interactivity, state management, DOM manipulation |
| **LocalStorage** | Persisting user sessions across page reloads |
| **Google Fonts** | Playfair Display (headings) + DM Sans (body) |

No external libraries, frameworks, or build tools are required.

---

## 🚀 How to Run the Project

1. **Clone or download** the repository to your local machine.

2. Ensure the following files are in the same directory:
   ```
   index.html
   style.css
   app.js
   lo.jpeg       ← navbar logo image (optional)
   l.jpeg        ← dashboard logo image (optional)
   ved.mp4       ← hero background video (optional)
   ```

3. **Open `index.html`** directly in any modern web browser:
   - Double-click `index.html`, or
   - Use a local server (e.g., VS Code Live Server extension)

4. No installation, no dependencies, no build step required.

> **Note:** The hero video (`ved.mp4`) and logo images (`lo.jpeg`, `l.jpeg`) are optional. The app has built-in fallbacks if these files are missing.

---

## 📁 Folder Structure

```
skillthali/
│
├── index.html          # Main HTML file — all sections, modals, dashboards
├── style.css           # All styles — layout, components, animations, responsive
├── app.js              # All JavaScript — state, rendering, auth, task logic
│
├── lo.jpeg             # Navbar logo image (home page)
├── l.jpeg              # Dashboard navbar logo image
└── ved.mp4             # Hero section background video
```

---

## 🔮 Future Improvements

### 💳 Real Payment Integration
- Integrate **Razorpay** or **Stripe** for actual payment processing
- Implement escrow logic: client pays upfront, funds released on task completion
- Add payment history and invoice generation

### 🔧 Backend & Database
- Build a REST API using **Node.js + Express** or **Django**
- Use **MongoDB** or **PostgreSQL** for persistent data storage
- Replace `localStorage` with server-side sessions and JWT authentication

### 🔐 Authentication APIs
- Replace the current mock auth with real **OAuth 2.0** (Google, GitHub login)
- Add email verification and password reset flows
- Role-based access control (student vs client vs admin)

### 📱 Additional Features
- Real-time notifications using **WebSockets**
- In-app messaging between students and clients
- Student rating and review system
- Portfolio showcase page per student profile
- Admin dashboard for platform moderation
- Mobile app using **React Native** or **Flutter**

---

## 👤 Author

**SkillThali** — Built for Students, by Students.

- Platform designed to empower college students with real-world project experience
- Focused on the Indian student ecosystem (Maharashtra, MH — Pune, Mumbai, Nagpur)
- Inspired by the spirit of *jugaad* and collaborative learning

---

## 📄 License

This project is currently unlicensed and intended for educational/demo purposes.

---

*© 2025 SkillThali. Connect. Create. Earn.*
