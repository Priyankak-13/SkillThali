# 🍽️ SkillThali

> **Your Skills. Your Earnings. Your Future.**

SkillThali is a student-focused freelancing platform that connects talented students with clients who need affordable, quality services. Built as a mini web project using pure HTML, CSS, and JavaScript — no frameworks, no build tools, just clean frontend code.

---

## 📁 Project Structure

```
skillthali/
├── index.html      ← Main HTML (all sections/screens)
├── style.css       ← Complete styling with CSS variables
├── app.js          ← All interactivity and logic
└── README.md       ← You are here
```

---

## 🎨 Color Theme

| Role            | Value     |
|-----------------|-----------|
| Background Start| `#441752` |
| Background End  | `#8174A0` |
| Hover Color     | `#A888B5` |
| Button Color    | `#EFB6C8` |
| Text Color      | `#F5F5F5` |

All colors are managed via CSS custom properties (`var(--btn)`, `var(--hover)`, etc.) for easy theming.

---

## 🚀 Features

### 🏠 Homepage
- Full-screen background video with gradient overlay
- Hero section: heading, tagline, two CTA buttons ("I am a Student" / "I am a Client")
- Fixed glassmorphism navigation bar with Login / Sign Up

### 📦 Categories Section
Four clickable category cards, each opening a smooth animated detail panel:

| Category   | Emoji | Services Included |
|------------|-------|-------------------|
| CodeThali  | 💻    | Web Dev, App Dev, Debugging |
| Creatix    | 🎨    | Poster, Logo, Thumbnail, Video Editing |
| QuickBites | ⚡    | Resume, LinkedIn, Data Entry, Portfolio |
| TeamUp     | 🤝    | Group Projects, Hackathons, Startups |

### 📖 About & Unique Sections
- Detailed explanation of SkillThali's mission
- Comparison with Fiverr/Upwork highlighting beginner-friendliness
- Animated stat cards

### 🔐 Authentication Flow
- **Step 1:** Email + Password
- **Step 2:** Role selection — Student or Client
- **Step 3 (Student):** Skills, experience level, real-world project comfort
- **Step 3 (Client):** Work type, preferred candidates, project description
- Redirects to role-specific dashboard on completion

### 🎓 Student Dashboard
- Greeting with active task count
- Stats bar: Active Tasks, Completed, Rating, Earnings
- Active tasks with progress bars
- Available tasks grid with category filter tabs (All / CodeThali / Creatix / QuickBites / TeamUp)
- Task detail modal with Client Info Card showing name, location, budget, rating, skills
- Apply / Start Task button

### 💼 Client Dashboard
- Post New Task modal (title, category, budget, skills, description)
- Posted tasks auto-appear in Student Dashboard
- View active and completed projects
- Applicant count per task

### ✨ UX Enhancements
- Smooth scroll behaviour
- Hover animations on all cards
- Slide-up modal animations
- Toast notifications for actions
- Shake animation on form validation errors
- Fade-up entrance animations with staggered delays
- Profile dropdown with student stats

---

## 🛠️ How to Run

No installation or build step required.

```bash
# Option 1: Just open the file
open index.html

# Option 2: Use a local server (recommended for video)
npx serve .
# or
python -m http.server 8000
# then visit http://localhost:8000
```

---

## 📱 Responsive Design

- Fully responsive for mobile, tablet, and desktop
- Grid layouts collapse gracefully
- Navigation adapts for small screens
- Touch-friendly tap targets

---

## 🔮 Planned Features (Future Scope)

- [ ] Backend integration (Node.js / Firebase)
- [ ] Real-time chat between student and client
- [ ] Payment gateway (Razorpay)
- [ ] Rating and review system
- [ ] Email notifications on task application
- [ ] Admin dashboard for moderation
- [ ] PWA support for mobile app feel

---

## 👨‍💻 Tech Stack

| Layer      | Technology                  |
|------------|-----------------------------|
| Structure  | HTML5                       |
| Styling    | CSS3 (Custom Properties, Flexbox, Grid, Animations) |
| Logic      | Vanilla JavaScript (ES6+)   |
| Fonts      | Google Fonts (Playfair Display + DM Sans) |

---

## 🙌 Credits

Built with ❤️ as a student mini-project.  
Inspired by the need for a beginner-friendly, India-focused student freelancing platform.

---

## 📄 License

This project is open for personal and educational use.

---

> *"SkillThali serves the right opportunities to hungry, talented students."*
