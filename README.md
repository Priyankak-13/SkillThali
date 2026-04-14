# SkillThali

A student-focused freelancing platform connecting students and clients.

---

## Overview

SkillThali bridges the gap between talented students and clients looking for affordable, quality work. Students can discover tasks, build portfolios, and earn — while clients can post projects and hire skilled individuals with ease.

---

## Features

- **Navbar Visibility Control** — Navbar is shown only on public pages (Home, About, Categories) and automatically hidden inside dashboards and auth flows.
- **Dynamic Dashboards** — Separate, fully functional dashboards for Students and Clients with sidebar navigation and task management.
- **Profile Dropdown** — A top-right clickable avatar reveals a dropdown with Profile and Logout options, matching the app theme.
- **Dynamic Welcome Message** — Displays `Welcome, [Name]` for new signups and `Welcome back, [Name] 👋` for returning users, derived dynamically from auth input.
- **Task Filtering** — Students can filter available tasks by category: CodeThali, Creatix, QuickBites, TeamUp.
- **Task Posting & Deletion** — Clients can post new tasks and delete existing ones in real time.
- **Smooth UI/UX** — Animated cards, hover effects, rounded containers, smooth transitions, and clean spacing throughout.

---

## Tech Stack

| Layer      | Technology        |
|------------|-------------------|
| Markup     | HTML5             |
| Styling    | CSS3              |
| Logic      | Vanilla JavaScript |
| Fonts      | Google Fonts (Playfair Display, DM Sans) |

---

## How to Run

1. Clone or download the project folder.
2. Open `index.html` in any modern browser.
3. No build tools, no dependencies, no server required.

```
project/
├── index.html
├── style.css
├── app.js
├── l.jpeg        ← Logo image
├── ved.mp4       ← Hero background video
└── README.md
```

---

## Folder Structure

```
skillthali/
├── index.html      Main HTML — all sections and modals
├── style.css       Global styles, theme, responsive rules
├── app.js          All interactivity: auth, dashboards, tasks
├── l.jpeg          Logo (circular, shown in navbar)
└── ved.mp4         Hero section background video
```

---

## Future Improvements

- Backend integration with user authentication (Firebase / Node.js)
- Real-time chat between students and clients
- Payment gateway for secured task escrow
- Student skill verification and rating system
- Mobile app version (React Native)
