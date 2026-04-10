/* ================================================
   SkillThali — app.js
   All interactivity: auth, nav, categories,
   dashboards, modals, tasks, filters
================================================ */

// ============ STATE ============
let currentAuthMode = 'login';
let selectedRole = '';
let preSelectedRole = '';
let clientPostedTasks = [
  {
    id: 1, title: "Portfolio Website", category: "codethali",
    budget: "₹1,200", skills: ["HTML", "CSS", "JavaScript"],
    desc: "Build a responsive 3-page portfolio for a mechanical engineering student. Must include About, Projects, and Contact sections.",
    client: "Rahul Mehta", location: "Pune, MH", rating: "4.7", projects: 8,
    deadline: "3 days"
  },
  {
    id: 2, title: "Logo Design for StartupX", category: "creatix",
    budget: "₹800", skills: ["Adobe Illustrator", "Figma"],
    desc: "Need a minimalist modern logo for a tech startup. Provide 3 colour variants and SVG + PNG exports.",
    client: "Sneha Joshi", location: "Mumbai, MH", rating: "4.9", projects: 12,
    deadline: "5 days"
  },
  {
    id: 3, title: "Resume Redesign", category: "quickbites",
    budget: "₹400", skills: ["MS Word", "Canva"],
    desc: "Redesign a fresher resume with a modern ATS-friendly template. 1-page only.",
    client: "Ankit Sharma", location: "Nagpur, MH", rating: "4.5", projects: 5,
    deadline: "2 days"
  },
  {
    id: 4, title: "Hackathon Team Formation", category: "teamup",
    budget: "₹0 (Collaboration)", skills: ["Communication", "Problem Solving"],
    desc: "Looking for 2 teammates for Smart India Hackathon 2025. Need one designer and one backend developer.",
    client: "Priya Desai", location: "Pune, MH", rating: "4.8", projects: 3,
    deadline: "7 days"
  },
  {
    id: 5, title: "YouTube Thumbnail Pack", category: "creatix",
    budget: "₹600", skills: ["Photoshop", "Canva"],
    desc: "Create 10 eye-catching thumbnails for a tech YouTube channel. Consistent style, bold typography.",
    client: "Rohan Kulkarni", location: "Nashik, MH", rating: "4.6", projects: 6,
    deadline: "4 days"
  },
  {
    id: 6, title: "LinkedIn Profile Optimisation", category: "quickbites",
    budget: "₹350", skills: ["LinkedIn", "Content Writing"],
    desc: "Optimise my LinkedIn headline, about section, and experience descriptions for better visibility.",
    client: "Kavya Nair", location: "Pune, MH", rating: "5.0", projects: 10,
    deadline: "1 day"
  },
  {
    id: 7, title: "Android Bug Fix", category: "codethali",
    budget: "₹900", skills: ["Java", "Android Studio"],
    desc: "Fix 3 known bugs in an existing Android app. Source code will be shared on GitHub.",
    client: "Dev Mehta", location: "Mumbai, MH", rating: "4.4", projects: 4,
    deadline: "6 days"
  },
  {
    id: 8, title: "Startup Idea Brainstorm Partner", category: "teamup",
    budget: "₹0 (Equity possible)", skills: ["Business Thinking", "Research"],
    desc: "Need a creative co-founder to help validate and refine a EdTech startup idea. Weekly sessions.",
    client: "Ishaan Tiwari", location: "Indore, MP", rating: "4.7", projects: 2,
    deadline: "Ongoing"
  }
];

// ============ SECTION NAV ============
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  const target = id === 'categories' ? 'home' : id;
  const el = document.getElementById(target === 'about' ? 'home' : target + (id === 'home' ? '' : ''));
  document.getElementById('home').classList.add('active');
  if (id === 'about' || id === 'categories') {
    const anchor = document.getElementById(id);
    if (anchor) setTimeout(() => anchor.scrollIntoView({ behavior: 'smooth' }), 50);
  }
}

// ============ AUTH ============
function openAuth(mode, role = '') {
  currentAuthMode = mode;
  preSelectedRole = role;
  const modal = document.getElementById('authModal');
  modal.classList.remove('hidden');
  showAuthStep('authStep1');
  document.getElementById('authTitle').textContent = mode === 'login' ? 'Welcome Back' : 'Create Account';
  document.getElementById('authSub').textContent = mode === 'login' ? 'Login to your SkillThali account' : 'Join SkillThali today';
  document.getElementById('authSwitchText').innerHTML = mode === 'login'
    ? "Don't have an account? <a href='#' onclick='toggleAuth()'>Sign Up</a>"
    : "Already have an account? <a href='#' onclick='toggleAuth()'>Login</a>";
}

function toggleAuth() {
  currentAuthMode = currentAuthMode === 'login' ? 'signup' : 'login';
  openAuth(currentAuthMode, preSelectedRole);
}

function closeModal() {
  document.getElementById('authModal').classList.add('hidden');
  showAuthStep('authStep1');
}

function showAuthStep(id) {
  document.querySelectorAll('.auth-step').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function nextAuthStep() {
  const email = document.getElementById('authEmail').value.trim();
  const pass = document.getElementById('authPass').value.trim();
  if (!email || !pass) { shake(document.querySelector('.modal-box')); return; }
  if (preSelectedRole) { selectRole(preSelectedRole); return; }
  showAuthStep('authStep2');
}

function selectRole(role) {
  selectedRole = role;
  document.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
  const cards = document.querySelectorAll('.role-card');
  cards.forEach(c => { if (c.querySelector('h3').textContent.toLowerCase() === role) c.classList.add('selected'); });
  setTimeout(() => showAuthStep(role === 'student' ? 'authStep3S' : 'authStep3C'), 150);
}

function goToDashboard(type) {
  closeModal();
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  if (type === 'student') {
    document.getElementById('studentDash').classList.add('active');
    renderAvailableTasks('all');
  } else {
    document.getElementById('clientDash').classList.add('active');
    renderClientTasks();
  }
  window.scrollTo(0, 0);
}

function logout() {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById('home').classList.add('active');
  document.getElementById('profileDrop')?.classList.add('hidden');
  window.scrollTo(0, 0);
}

function shake(el) {
  el.style.animation = 'none';
  el.offsetHeight;
  el.style.animation = 'shake 0.3s ease';
}

// ============ CATEGORY PANEL ============
const catData = {
  codethali: {
    icon: '💻', title: 'CodeThali', subtitle: 'Technical services for every project',
    items: ['Web Development', 'App Development', 'Debugging', 'API Integration', 'Code Review']
  },
  creatix: {
    icon: '🎨', title: 'Creatix', subtitle: 'Creative design and visual content',
    items: ['Poster Design', 'Logo Design', 'Thumbnail Creation', 'Video Editing', 'Social Media Graphics']
  },
  quickbites: {
    icon: '⚡', title: 'QuickBites', subtitle: 'Quick, high-quality deliverables',
    items: ['Resume Writing', 'LinkedIn Setup', 'Data Entry', 'Portfolio Website', 'Cover Letter']
  },
  teamup: {
    icon: '🤝', title: 'TeamUp', subtitle: 'Collaborate and build together',
    items: ['Group Projects', 'Hackathon Teams', 'Startup Ideas', 'Research Projects', 'Study Groups']
  }
};

function openCategory(cat) {
  const d = catData[cat];
  document.getElementById('panelIcon').textContent = d.icon;
  document.getElementById('panelTitle').textContent = d.title;
  document.getElementById('panelSubtitle').textContent = d.subtitle;
  const container = document.getElementById('panelItems');
  container.innerHTML = '';
  d.items.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'panel-item';
    div.textContent = item;
    div.style.animationDelay = (i * 0.07) + 's';
    div.onclick = () => openAuth('signup');
    container.appendChild(div);
  });
  document.getElementById('catPanel').classList.remove('hidden');
}

function closeCategory() {
  document.getElementById('catPanel').classList.add('hidden');
}

// ============ STUDENT DASHBOARD ============
function renderAvailableTasks(filter) {
  const container = document.getElementById('availableTasks');
  container.innerHTML = '';
  const tasks = filter === 'all' ? clientPostedTasks : clientPostedTasks.filter(t => t.category === filter);
  tasks.forEach((task, i) => {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.style.animationDelay = (i * 0.05) + 's';
    card.style.animation = 'fadeUp 0.4s ease both';
    const catEmoji = { codethali: '💻', creatix: '🎨', quickbites: '⚡', teamup: '🤝' }[task.category];
    const catLabel = { codethali: 'CodeThali', creatix: 'Creatix', quickbites: 'QuickBites', teamup: 'TeamUp' }[task.category];
    card.innerHTML = `
      <div class="task-info">
        <span class="task-cat">${catEmoji} ${catLabel}</span>
        <h4>${task.title}</h4>
        <p>${task.desc.substring(0, 72)}...</p>
      </div>
      <div class="task-meta">
        <span class="budget">${task.budget}</span>
        <span class="deadline">⏰ ${task.deadline}</span>
      </div>
    `;
    card.onclick = () => openTaskDetail(task);
    container.appendChild(card);
  });
  if (tasks.length === 0) {
    container.innerHTML = '<p style="color:var(--text-dim);text-align:center;padding:30px;">No tasks in this category yet.</p>';
  }
}

function filterTasks(cat, btn) {
  document.querySelectorAll('.ftab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderAvailableTasks(cat);
}

// ============ TASK DETAIL MODAL ============
function openTaskDetail(task) {
  const catEmoji = { codethali: '💻', creatix: '🎨', quickbites: '⚡', teamup: '🤝' }[task.category];
  const catLabel = { codethali: 'CodeThali', creatix: 'Creatix', quickbites: 'QuickBites', teamup: 'TeamUp' }[task.category];
  document.getElementById('taskDetailContent').innerHTML = `
    <span class="task-cat" style="margin-bottom:16px;display:inline-block">${catEmoji} ${catLabel}</span>
    <h2 style="font-family:'Playfair Display',serif;font-size:1.6rem;margin-bottom:20px">${task.title}</h2>
    <div class="client-info">
      <div class="client-avatar">${task.client.split(' ').map(w=>w[0]).join('')}</div>
      <div class="client-details">
        <h3>${task.client}</h3>
        <p>📍 ${task.location} &nbsp;·&nbsp; ⭐ ${task.rating} &nbsp;·&nbsp; ${task.projects} projects posted</p>
      </div>
    </div>
    <div class="client-meta">
      <div class="cm"><span>Budget</span><strong>${task.budget}</strong></div>
      <div class="cm"><span>Deadline</span><strong>${task.deadline}</strong></div>
      <div class="cm"><span>Category</span><strong>${catLabel}</strong></div>
    </div>
    <div class="task-desc">
      <h4>Task Description</h4>
      <p>${task.desc}</p>
    </div>
    <div class="task-desc">
      <h4>Required Skills</h4>
      <div class="skills-row">
        ${task.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
      </div>
    </div>
    <div class="detail-btns">
      <button class="btn-secondary" onclick="closeTaskModal()">View Full Details</button>
      <button class="btn-primary" onclick="startTask('${task.title}')">Start Task →</button>
    </div>
  `;
  document.getElementById('taskModal').classList.remove('hidden');
}

function closeTaskModal() {
  document.getElementById('taskModal').classList.add('hidden');
}

function startTask(title) {
  closeTaskModal();
  showToast(`✅ Applied for "${title}" successfully!`);
}

// ============ CLIENT DASHBOARD ============
function renderClientTasks() {
  const container = document.getElementById('clientPostedTasks');
  container.innerHTML = '';
  clientPostedTasks.slice(0, 4).forEach(task => {
    const catEmoji = { codethali: '💻', creatix: '🎨', quickbites: '⚡', teamup: '🤝' }[task.category];
    const catLabel = { codethali: 'CodeThali', creatix: 'Creatix', quickbites: 'QuickBites', teamup: 'TeamUp' }[task.category];
    const card = document.createElement('div');
    card.className = 'task-card';
    card.innerHTML = `
      <div class="task-info">
        <span class="task-cat">${catEmoji} ${catLabel}</span>
        <h4>${task.title}</h4>
        <p>${task.desc.substring(0, 65)}...</p>
      </div>
      <div class="task-meta">
        <span class="budget">${task.budget}</span>
        <span class="deadline">⏰ ${task.deadline}</span>
        <span style="font-size:0.78rem;color:var(--btn)">👥 ${Math.floor(Math.random()*5)+1} applicants</span>
      </div>
    `;
    container.appendChild(card);
  });
}

function openPostTask() {
  document.getElementById('postTaskModal').classList.remove('hidden');
}

function closePostTask() {
  document.getElementById('postTaskModal').classList.add('hidden');
}

function submitTask() {
  const title = document.getElementById('taskTitle').value.trim();
  const cat = document.getElementById('taskCategory').value;
  const budget = document.getElementById('taskBudget').value.trim();
  const skills = document.getElementById('taskSkills').value.trim();
  const desc = document.getElementById('taskDesc').value.trim();
  if (!title || !cat || !budget || !desc) {
    shake(document.querySelector('#postTaskModal .modal-box'));
    return;
  }
  const newTask = {
    id: Date.now(), title, category: cat,
    budget: `₹${budget}`, skills: skills.split(',').map(s => s.trim()).filter(Boolean),
    desc, client: 'Rahul Mehta', location: 'Pune, MH',
    rating: '4.7', projects: 8, deadline: '7 days'
  };
  clientPostedTasks.unshift(newTask);
  closePostTask();
  renderClientTasks();
  // Clear form
  ['taskTitle','taskBudget','taskSkills','taskDesc'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('taskCategory').value = '';
  showToast('🎉 Task posted successfully! Students can now apply.');
}

// ============ PROFILE TOGGLE ============
function toggleProfile() {
  document.getElementById('profileDrop').classList.toggle('hidden');
}

function toggleClientProfile() {
  // Simple toggle for client (no separate profile drop implemented)
  showToast('👤 Client profile coming soon!');
}

// ============ TAG TOGGLE ============
function toggleTag(el) {
  el.classList.toggle('active');
}

// ============ TOAST ============
function showToast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  t.style.cssText = `
    position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(20px);
    background:linear-gradient(135deg,rgba(68,23,82,0.97),rgba(100,80,130,0.96));
    border:1px solid var(--card-border);border-radius:50px;
    padding:13px 28px;font-size:0.9rem;color:var(--text);
    z-index:9999;opacity:0;transition:all 0.35s ease;
    box-shadow:0 8px 30px rgba(0,0,0,0.4);
    font-family:'DM Sans',sans-serif;
    white-space:nowrap;max-width:90vw;text-align:center;
  `;
  document.body.appendChild(t);
  requestAnimationFrame(() => {
    t.style.opacity = '1';
    t.style.transform = 'translateX(-50%) translateY(0)';
  });
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => t.remove(), 400);
  }, 3000);
}

// ============ SHAKE KEYFRAME (injected) ============
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }
`;
document.head.appendChild(shakeStyle);

// ============ CLICK OUTSIDE CLOSE ============
document.addEventListener('click', (e) => {
  const drop = document.getElementById('profileDrop');
  if (drop && !drop.classList.contains('hidden')) {
    if (!e.target.closest('.profile-icon') && !e.target.closest('.profile-drop')) {
      drop.classList.add('hidden');
    }
  }
});

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('home').classList.add('active');
});
