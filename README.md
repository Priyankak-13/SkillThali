# SkillThali 🍽️

> **Your Skills. Your Earnings. Your Future.**

SkillThali is a student-focused freelancing platform connecting talented students with clients who need affordable, quality services. The platform simulates a full payment lifecycle — from posting a task, paying into escrow, submitting work, approving, and releasing funds — all on the frontend.

---

## 📖 Project Overview

SkillThali bridges the gap between skilled students and clients. Students apply for tasks, upload work, and get paid. Clients post tasks, pay securely into escrow, review work, and release payments. An Admin has full visibility into platform activity.

**No backend. No real payments. Everything runs in-browser using JS state + localStorage.**

The name "SkillThali" is inspired by the Indian concept of a *thali* — a platter offering a variety of flavours — representing the diverse range of skills and opportunities available on the platform.

---

## ✨ Features

### 🎓 Student Dashboard
- Browse all available tasks, filtered by category
- View task details including budget, deadline, client info, and required skills
- Apply for tasks — tasks become "Active"
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
- Applicants view with placeholder data

### 👑 Admin Dashboard
Login with `admin@skillthali.com` (any password) to access.

- **Overview Stats**: Platform volume, escrow count, released count, pending, total tasks, users
- **Transactions Table**: Full task list with client, student, amount, payment status, task status
- **Force Release**: Admin can override and force-release any secured payment
- **Users List**: All registered users from localStorage with role badges
- Sidebar navigation between Overview, Transactions, and Users

### 📋 Task Categories
- 💻 **CodeThali** — Web dev, app dev, debugging
- 🎨 **Creatix** — Poster design, logo design, thumbnails
- ⚡ **QuickBites** — LinkedIn setup, data entry, portfolio sites
- 🤝 **TeamUp** — Group projects, hackathon teams, startup co-founders

---

## 💰 Payment Flow (Frontend Simulation)

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

### Stage-by-Stage

| Stage | Who | Action | Result |
|-------|-----|--------|--------|
| 1 | Client | Posts task | Task visible to students |
| 2 | Student | Applies for task | Task becomes Active |
| 3 | Client | Clicks "Pay Now" | paymentStatus = `secured`, escrow simulation |
| 4 | Student | Uploads work | task.status = `submitted` |
| 5 | Client | Reviews submitted work | Sees work in "Review Work" tab |
| 6 | Client | Clicks "Approve & Release" | paymentStatus = `released`, student gets paid |
| 7 | Admin | Can force-release any stuck payment | Override for disputes |

### Payment Status Lifecycle
```
pending → secured → released
```

- **⏳ Pending** (Yellow): No payment made yet
- **🔒 Secured** (Blue): Client paid — money held in escrow
- **💰 Released** (Green): Work approved — student receives payment

---

## 👤 Roles

### 🎓 Student
- Sign up with any email → select "Student" role
- Browse tasks, apply, go active, upload work, wait for approval
- View earnings after release

### 💼 Client
- Sign up with any email → select "Client" role
- Post tasks, pay into escrow, review and approve work

### 👑 Admin
- Login email: `admin@skillthali.com` (any password)
- Full platform overview — money flow, user list, all transactions
- Can force-release payments

---

## 🚀 How to Run

1. **Clone or download** the repository
2. Ensure these files are in the same folder:
   ```
   index.html
   style.css
   app.js
   lo.jpeg       ← navbar logo (optional)
   l.jpeg        ← dashboard logo (optional)
   ved.mp4       ← hero video (optional)
   ```
3. **Open `index.html`** in any modern browser — double-click or use Live Server
4. No npm, no build, no dependencies

> **Note:** All media files are optional. The app has built-in fallbacks.

---

## 📁 Folder Structure

```
skillthali/
│
├── index.html    # All sections, modals, dashboards
├── style.css     # All styles — layout, components, animations, responsive
├── app.js        # All JS — state, payment flow, auth, admin, task logic
│
├── lo.jpeg       # Navbar logo (optional)
├── l.jpeg        # Dashboard logo (optional)
└── ved.mp4       # Hero background video (optional)
```

---

## 🛠️ Tech Stack

| Technology | Usage |
|------------|-------|
| HTML5 | Semantic structure, modals, dashboards |
| CSS3 | CSS variables, Flexbox, Grid, animations, responsive |
| Vanilla JS | All interactivity, payment simulation, state management |
| localStorage | Session persistence, task store, user registry |
| Google Fonts | Playfair Display (headings) + DM Sans (body) |

---

## ⚠️ Important Notes

- **This is a frontend simulation only** — no real money moves, no real files upload
- Payment simulation uses JS state changes + localStorage
- "Escrow" is simulated by changing `task.paymentStatus` to `"secured"`
- "File upload" is cosmetic — no real file is processed
- Admin dashboard reads directly from `taskStore` array and localStorage `st_users`
- All data resets if localStorage is cleared

---

## 🔮 Future Improvements

- **Real Payments**: Integrate Razorpay / Stripe with actual escrow logic
- **Backend**: Node.js + Express REST API with MongoDB / PostgreSQL
- **Auth**: OAuth 2.0 (Google, GitHub), JWT sessions, email verification
- **Real-time**: WebSockets for notifications and chat
- **Portfolio**: Student profile pages with project showcase
- **Mobile App**: React Native / Flutter

---

## 👤 Author

**SkillThali** — Built for Students, by Students.

Focused on the Indian student ecosystem (Maharashtra — Pune, Mumbai, Nagpur).

---

## 📄 License

Unlicensed — for educational / demo purposes only.

*© 2025 SkillThali. Connect. Create. Earn.*
