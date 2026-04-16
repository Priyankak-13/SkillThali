# Student Freelancing Platform 🍽️

> **SkillThali — Your Skills. Your Earnings. Your Future.**

---

## Description

SkillThali is a **frontend-only freelancing platform simulation** that connects talented students with clients who need affordable, quality services. The platform simulates a full payment lifecycle — from posting a task, paying into escrow, submitting work, approving, and releasing funds — all on the frontend using localStorage.

The name "SkillThali" is inspired by the Indian concept of a *thali* — a platter offering a variety of flavours — representing the diverse range of skills and opportunities available on the platform.

---

## Features

### 🎓 Student Dashboard
- Browse all available tasks, filtered by category
- View task details including budget, deadline, client info, and required skills
- Apply for tasks — tasks become "Active" for that student only
- **Upload Work**: Submit work description + simulated file attachment
- Track submitted tasks with "Waiting for Approval" status
- View completed tasks with 💰 Payment Released badge
- Profile page showing earnings, active tasks, and rating

### 💼 Client Dashboard
- Post new tasks with title, category, budget, skills, and description
- **Active Tasks** tab — view open/assigned tasks with Pay Now button
- **💳 Pay Now**: Simulates payment, moves funds to escrow (🔒 Secured)
- **Review Work** tab — approve student submissions
- **Approve & Release Payment** — releases escrow payment to student
- **Completed Tasks** tab — history of all finished work

### 👑 Admin Dashboard
- Login with `admin@skillthali.com` (any password)
- Overview Stats: Platform volume, escrow count, released count, pending, total tasks, users
- Transactions Table: Full task list with client, student, amount, payment status, task status
- Force Release: Admin can override and force-release any secured payment
- Users List: All registered users with role badges

### 📋 Task Categories
- 💻 **CodeThali** — Web dev, app dev, debugging
- 🎨 **Creatix** — Poster design, logo design, thumbnails
- ⚡ **QuickBites** — LinkedIn setup, data entry, portfolio sites
- 🤝 **TeamUp** — Group projects, hackathon teams, startup co-founders

### 🔐 User-Specific Task System
- Each student has their own independent task state
- When Student A applies for a task, Student B still sees it as available
- Applied, active, submitted, and completed task lists are all user-specific
- Data is persisted per user via unique localStorage keys

---

## Payment UI Flow

```
CLIENT                 PLATFORM              STUDENT
  │                      │                     │
  ├─ Post Task ──────────►│                     │
  │                      │◄── Student Applies ──┤
  ├─ Pay Now ────────────►│ (Escrow = Secured)  │
  │                      │──── Task Active ────►│
  │                      │◄── Upload Work ───────┤
  ├─ Review Submission   │                     │
  ├─ Approve & Release ─►│ (Escrow Released)   │
  │                      │──── 💰 Paid ────────►│
```

### Payment Status Lifecycle
```
pending → secured → released
```

- **⏳ Pending** (Yellow): No payment made yet
- **🔒 Secured** (Blue): Client paid — money held in escrow
- **💰 Released** (Green): Work approved — student receives payment

---

## How It Works

- Uses **localStorage** to simulate multiple independent users
- Each student's activity (applied, active, submitted, completed tasks) is stored under a unique key: `studentActivity_<userEmail>`
- When a user logs in, their own activity is loaded from localStorage
- When a user logs out, only the in-memory session is reset — their data remains intact for next login
- Task store (`st_tasks`) is shared globally so clients can see all tasks, but students see a filtered view based on their own applied list
- All data resets if localStorage is cleared

---

## How to Run

1. **Clone or download** the repository
2. Ensure these files are in the same folder:
   ```
   index.html
   style.css
   app.js
   logo.jpeg       ← navbar logo (optional)
   l.jpeg          ← dashboard logo (optional)
   ved.mp4         ← hero video (optional)
   ```
3. **Open `index.html`** in any modern browser — double-click or use Live Server
4. No npm, no build, no dependencies

> **Note:** All media files are optional. The app has built-in fallbacks.

---

## Folder Structure

```
skillthali/
│
├── index.html    # All sections, modals, dashboards
├── style.css     # All styles — layout, components, animations, responsive
├── app.js        # All JS — state, payment flow, auth, admin, task logic
│
├── logo.jpeg     # Navbar logo (optional)
├── l.jpeg        # Dashboard logo (optional)
└── ved.mp4       # Hero background video (optional)
```

---

## Tech Stack

| Technology | Usage |
|------------|-------|
| HTML5 | Semantic structure, modals, dashboards |
| CSS3 | CSS variables, Flexbox, Grid, animations, responsive |
| Vanilla JS | All interactivity, payment simulation, state management |
| localStorage | Session persistence, task store, user registry, per-user activity |
| Google Fonts | Playfair Display (headings) + DM Sans (body) |

---

## Roles

### 🎓 Student
- Sign up with any email → select "Student" role
- Browse tasks, apply (task hides from your view only), go active, upload work, wait for approval
- View earnings after release

### 💼 Client
- Sign up with any email → select "Client" role
- Post tasks, pay into escrow, review and approve work

### 👑 Admin
- Login email: `admin@skillthali.com` (any password)
- Full platform overview — money flow, user list, all transactions
- Can force-release payments

---

## Future Scope

- **Backend Integration**: Node.js + Express REST API with MongoDB / PostgreSQL
- **Real Payment Gateway**: Integrate Razorpay / Stripe with actual escrow logic
- **Authentication System**: OAuth 2.0 (Google, GitHub), JWT sessions, email verification
- **Real-time Notifications**: WebSockets for live updates and chat
- **Portfolio Pages**: Student profile pages with project showcase
- **Mobile App**: React Native / Flutter

---

## Important Notes

- **This is a frontend simulation only** — no real money moves, no real files upload
- Payment simulation uses JS state changes + localStorage
- "Escrow" is simulated by changing `task.paymentStatus` to `"secured"`
- "File upload" is cosmetic — no real file is processed
- All data resets if localStorage is cleared

---

*© 2025 SkillThali. Connect. Create. Earn. Built for Students, by Students.*
*Focused on the Indian student ecosystem (Maharashtra — Pune, Mumbai, Nagpur).*
