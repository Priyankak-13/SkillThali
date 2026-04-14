/* ================================================
   SkillThali — app.js  (Updated)
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
  if (id === 'about' || id === 'categories') {
    document.getElementById('home').classList.add('active');
    const anchor = document.getElementById(id);
    if (anchor) setTimeout(() => anchor.scrollIntoView({ behavior: 'smooth' }), 50);
  } else {
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
  }
  window.scrollTo(0, 0);
}

// ============ HERO ROLE INFO PAGES ============
function showRoleInfo(role) {
  const page = document.getElementById('roleInfoPage');
  const content = document.getElementById('roleInfoContent');
  if (role === 'student') {
    content.innerHTML = `
      <span class="role-icon">🎓</span>
      <h2>I am a Student</h2>
      <p>As a student on this platform, you can showcase your skills, work on real-world projects, earn money, and build your portfolio. You can explore opportunities provided by clients and gain practical experience.</p>
      <button class="btn-primary" onclick="openAuth('signup','student')">Get Started as Student →</button>
    `;
  } else {
    content.innerHTML = `
      <span class="role-icon">💼</span>
      <h2>I am a Client</h2>
      <p>As a client, you can post projects, hire skilled students, review their work, and get your tasks completed efficiently. This platform connects you with talented individuals ready to work.</p>
      <button class="btn-primary" onclick="openAuth('signup','client')">Get Started as Client →</button>
    `;
  }
  page.classList.remove('hidden');
}

function hideRoleInfo() {
  document.getElementById('roleInfoPage').classList.add('hidden');
}

// ============ AUTH ============
function openAuth(mode, role = '') {
  currentAuthMode = mode;
  preSelectedRole = role;
  const modal = document.getElementById('authModal');
  modal.classList.remove('hidden');

  // Reset form inputs
  const emailEl = document.getElementById('authEmail');
  const passEl = document.getElementById('authPass');
  if (emailEl) emailEl.value = '';
  if (passEl) passEl.value = '';

  showAuthStep('authStep1');
  document.getElementById('authTitle').textContent = mode === 'login' ? 'Welcome Back' : 'Create Account';
  document.getElementById('authSub').textContent = mode === 'login' ? 'Login to your SkillThali account' : 'Join SkillThali today';
  document.getElementById('authSwitchText').innerHTML = mode === 'login'
    ? "Don't have an account? <a href='#' onclick='toggleAuth()'>Sign Up</a>"
    : "Already have an account? <a href='#' onclick='toggleAuth()'>Login</a>";

  // Close role info page if open
  hideRoleInfo();
}

function toggleAuth() {
  currentAuthMode = currentAuthMode === 'login' ? 'signup' : 'login';
  openAuth(currentAuthMode, preSelectedRole);
}

function closeModal() {
  document.getElementById('authModal').classList.add('hidden');
  showAuthStep('authStep1');
  // Reset form
  const emailEl = document.getElementById('authEmail');
  const passEl = document.getElementById('authPass');
  if (emailEl) emailEl.value = '';
  if (passEl) passEl.value = '';
}

function showAuthStep(id) {
  document.querySelectorAll('.auth-step').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}

function nextAuthStep() {
  const email = document.getElementById('authEmail').value.trim();
  const pass = document.getElementById('authPass').value.trim();
  if (!email || !pass) { shake(document.querySelector('.modal-box')); return; }

  if (currentAuthMode === 'login') {
    // LOGIN: skip onboarding, go directly to dashboard based on preSelectedRole or default
    const role = preSelectedRole || 'student';
    goToDashboard(role);
    return;
  }

  // SIGNUP: show onboarding
  if (preSelectedRole) {
    if (preSelectedRole === 'student') {
      showAuthStep('onboardS1');
    } else {
      showAuthStep('onboardC1');
    }
    return;
  }
  showAuthStep('authStep2');
}

function selectRole(role) {
  selectedRole = role;
  document.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
  const cards = document.querySelectorAll('.role-card');
  cards.forEach(c => {
    const h3 = c.querySelector('h3');
    if (h3 && h3.textContent.toLowerCase() === role) c.classList.add('selected');
  });
  setTimeout(() => {
    showAuthStep(role === 'student' ? 'onboardS1' : 'onboardC1');
  }, 150);
}

function goToDashboard(type) {
  closeModal();
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  if (type === 'student') {
    document.getElementById('studentDash').classList.add('active');
    renderAvailableTasks('all');
    switchStudentView('available', document.querySelector('.sidebar-btn'));
  } else {
    document.getElementById('clientDash').classList.add('active');
    renderClientTasks();
  }
  window.scrollTo(0, 0);
}

function logout() {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById('home').classList.add('active');
  window.scrollTo(0, 0);
}

function shake(el) {
  el.style.animation = 'none';
  el.offsetHeight;
  el.style.animation = 'shake 0.3s ease';
}

// ============ ONBOARDING CHOICE HELPERS ============
function toggleChoice(el, group, value) {
  el.classList.toggle('selected');
}

function selectRadioCard(el, group, value) {
  // Deselect siblings in same parent
  el.closest('.onboard-cards-grid').querySelectorAll('.onboard-choice-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
}

// ============ STUDENT DASHBOARD VIEWS ============
function switchStudentView(view, btn) {
  // Update sidebar buttons
  document.querySelectorAll('#studentSidebar .sidebar-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  // Show correct view
  document.querySelectorAll('#studentDash .dash-view').forEach(v => v.classList.remove('active'));
  const viewEl = document.getElementById('view-' + view);
  if (viewEl) viewEl.classList.add('active');

  if (view === 'available') renderAvailableTasks('all');
}

// ============ CLIENT DASHBOARD VIEWS ============
function switchClientView(view, btn) {
  document.querySelectorAll('#clientSidebar .sidebar-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  document.querySelectorAll('#clientDash .dash-view').forEach(v => v.classList.remove('active'));
  const viewEl = document.getElementById('cview-' + view);
  if (viewEl) viewEl.classList.add('active');

  if (view === 'posted') renderClientTasks();
}

// ============ SIDEBAR TOGGLE (mobile) ============
function toggleSidebar() {
  document.getElementById('studentSidebar').classList.toggle('open');
}
function toggleClientSidebar() {
  document.getElementById('clientSidebar').classList.toggle('open');
}

// ============ PROFILE NAVIGATION ============
function goToStudentProfile() {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById('studentProfile').classList.add('active');
  window.scrollTo(0, 0);
}
function goToClientProfile() {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById('clientProfile').classList.add('active');
  window.scrollTo(0, 0);
}
function goBackToDash(role) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  if (role === 'student') {
    document.getElementById('studentDash').classList.add('active');
  } else {
    document.getElementById('clientDash').classList.add('active');
  }
  window.scrollTo(0, 0);
}

// ============ CATEGORY PANEL ============
const catData = {
  codethali: {
    icon: '💻', title: 'CodeThali', subtitle: 'Technical services for every project',
    items: [
      { name: 'Web Development', desc: 'Full website builds, landing pages, and web apps.', examples: ['Portfolio site', 'Landing page for startup', 'E-commerce store'] },
      { name: 'App Development', desc: 'Mobile and desktop application development.', examples: ['Android utility app', 'React Native app', 'Desktop tool in Python'] },
      { name: 'Debugging', desc: 'Fix bugs and issues in existing codebases.', examples: ['Fix login errors', 'Resolve UI glitches', 'Performance issues'] }
    ]
  },
  creatix: {
    icon: '🎨', title: 'Creatix', subtitle: 'Creative design and visual content',
    items: [
      { name: 'Poster Design', desc: 'Eye-catching posters for events, brands, and campaigns.', examples: ['Event poster', 'Brand awareness poster', 'College fest banner'] },
      { name: 'Logo Design', desc: 'Professional logos with multiple format exports.', examples: ['Startup logo', 'Personal brand mark', 'Sports team logo'] },
      { name: 'Thumbnail Creation', desc: 'Click-worthy thumbnails for YouTube and social media.', examples: ['YouTube thumbnail pack', 'Instagram story covers', 'Course thumbnails'] }
    ]
  },
  quickbites: {
    icon: '⚡', title: 'QuickBites', subtitle: 'Quick, high-quality deliverables',
    items: [
      { name: 'LinkedIn Setup', desc: 'Complete LinkedIn profile optimisation for visibility.', examples: ['Headline + summary rewrite', 'Skills endorsement strategy', 'Featured section setup'] },
      { name: 'Data Entry', desc: 'Accurate and efficient data entry tasks.', examples: ['Excel data organisation', 'Product catalog entry', 'Form data processing'] },
      { name: 'Portfolio Website', desc: 'Professional portfolio to showcase your work.', examples: ['Developer portfolio', 'Designer showcase', 'Freelancer profile site'] }
    ]
  },
  teamup: {
    icon: '🤝', title: 'TeamUp', subtitle: 'Collaborate and build together',
    items: [
      { name: 'Group Projects', desc: 'Find teammates for academic and personal projects.', examples: ['Final year project team', 'App development team', 'Research collaboration'] },
      { name: 'Hackathon Teams', desc: 'Build or join teams for hackathons and competitions.', examples: ['SIH 2025 team', 'Coding competition partner', 'Designathon teammate'] },
      { name: 'Startup Ideas', desc: 'Co-founder matching and idea validation.', examples: ['EdTech co-founder', 'Fintech idea partner', 'Social impact startup'] }
    ]
  }
};

function openCategory(cat) {
  const d = catData[cat];
  document.getElementById('panelIcon').textContent = d.icon;
  document.getElementById('panelTitle').textContent = d.title;
  document.getElementById('panelSubtitle').textContent = d.subtitle;
  const container = document.getElementById('panelItems');
  container.innerHTML = '';

  // Hide sub detail
  document.getElementById('subDetailPanel').classList.add('hidden');
  document.getElementById('catPanelGetStarted').style.display = '';

  d.items.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'panel-item';
    div.textContent = item.name;
    div.style.animationDelay = (i * 0.07) + 's';
    div.onclick = () => openSubDetail(item);
    container.appendChild(div);
  });
  document.getElementById('catPanel').classList.remove('hidden');
}

function openSubDetail(item) {
  const panel = document.getElementById('subDetailPanel');
  document.getElementById('subDetailContent').innerHTML = `
    <h3>${item.name}</h3>
    <p>${item.desc}</p>
    <h4 style="font-size:0.82rem;color:var(--text-dim);margin-bottom:8px;margin-top:4px">Example Tasks</h4>
    <ul class="sub-examples">
      ${item.examples.map(e => `<li>→ ${e}</li>`).join('')}
    </ul>
    <button class="btn-primary" style="margin-top:16px;width:100%" onclick="openAuth('signup')">Get Started →</button>
  `;
  panel.classList.remove('hidden');
  document.getElementById('catPanelGetStarted').style.display = 'none';
}

function closeSubDetail() {
  document.getElementById('subDetailPanel').classList.add('hidden');
  document.getElementById('catPanelGetStarted').style.display = '';
}

function closeCategory() {
  document.getElementById('catPanel').classList.add('hidden');
}

// ============ STUDENT DASHBOARD ============
function renderAvailableTasks(filter) {
  const container = document.getElementById('availableTasks');
  if (!container) return;
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

// ============ MARK TASK COMPLETE ============
function markCompleted(btn, title) {
  const card = btn.closest('.task-card');
  // Update badges
  const badges = card.querySelectorAll('.payment-badge');
  badges.forEach(b => {
    b.className = 'payment-badge completed-tag';
    if (b.classList.contains('inprogress') || b.textContent.includes('In Progress')) {
      b.textContent = '✅ Completed';
    }
  });
  // Remove in progress badge
  const inprog = card.querySelector('.payment-badge.inprogress');
  if (inprog) { inprog.className = 'payment-badge completed-tag'; inprog.textContent = '✅ Completed'; }
  const securedBadge = card.querySelector('.payment-badge.secured');
  if (securedBadge) securedBadge.textContent = '💰 Released';

  btn.remove();
  showToast(`✅ "${title}" marked as completed!`);
}

// ============ TASK DETAIL MODAL ============
function openTaskDetail(task) {
  const catEmoji = { codethali: '💻', creatix: '🎨', quickbites: '⚡', teamup: '🤝' }[task.category];
  const catLabel = { codethali: 'CodeThali', creatix: 'Creatix', quickbites: 'QuickBites', teamup: 'TeamUp' }[task.category];
  document.getElementById('taskDetailContent').innerHTML = `
    <span class="task-cat" style="margin-bottom:16px;display:inline-block">${catEmoji} ${catLabel}</span>
    <h2 style="font-family:'Playfair Display',serif;font-size:1.6rem;margin-bottom:20px;color:var(--white)">${task.title}</h2>
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
      <div class="cm"><span>Payment</span><strong>🔒 Secured</strong></div>
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
      <button class="btn-secondary" onclick="closeTaskModal()">Close</button>
      <button class="btn-primary" onclick="startTask('${task.title}')">Apply Now →</button>
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
  if (!container) return;
  container.innerHTML = '';
  clientPostedTasks.forEach(task => {
    const catEmoji = { codethali: '💻', creatix: '🎨', quickbites: '⚡', teamup: '🤝' }[task.category];
    const catLabel = { codethali: 'CodeThali', creatix: 'Creatix', quickbites: 'QuickBites', teamup: 'TeamUp' }[task.category];
    const card = document.createElement('div');
    card.className = 'task-card';
    card.setAttribute('data-task-id', task.id);
    card.innerHTML = `
      <div class="task-info">
        <span class="task-cat">${catEmoji} ${catLabel}</span>
        <h4>${task.title}</h4>
        <p>${task.desc.substring(0, 65)}...</p>
      </div>
      <div class="task-meta">
        <span class="budget">${task.budget}</span>
        <span class="deadline">⏰ ${task.deadline}</span>
        <span style="font-size:0.78rem;color:var(--text-dim)">👥 ${Math.floor(Math.random()*5)+1} applicants</span>
        <span class="payment-badge inprogress">⏳ In Progress</span>
        <button class="btn-delete-task" onclick="deleteTask(event, ${task.id})">🗑️ Delete</button>
      </div>
    `;
    container.appendChild(card);
  });
  if (clientPostedTasks.length === 0) {
    container.innerHTML = '<p style="color:var(--text-dim);text-align:center;padding:30px;">No tasks posted yet.</p>';
  }
}

function deleteTask(e, id) {
  e.stopPropagation();
  clientPostedTasks = clientPostedTasks.filter(t => t.id !== id);
  renderClientTasks();
  renderAvailableTasks('all');
  showToast('🗑️ Task deleted successfully.');
}

function openPostTask() {
  document.getElementById('postTaskModal').classList.remove('hidden');
}

function closePostTask() {
  document.getElementById('postTaskModal').classList.add('hidden');
}

function submitTask() {
  // Try inline form first, then modal form
  const titleEl = document.getElementById('taskTitle') || document.getElementById('taskTitle2');
  const catEl = document.getElementById('taskCategory') || document.getElementById('taskCategory2');
  const budgetEl = document.getElementById('taskBudget') || document.getElementById('taskBudget2');
  const skillsEl = document.getElementById('taskSkills') || document.getElementById('taskSkills2');
  const descEl = document.getElementById('taskDesc') || document.getElementById('taskDesc2');

  const title = titleEl ? titleEl.value.trim() : '';
  const cat = catEl ? catEl.value : '';
  const budget = budgetEl ? budgetEl.value.trim() : '';
  const skills = skillsEl ? skillsEl.value.trim() : '';
  const desc = descEl ? descEl.value.trim() : '';

  if (!title || !cat || !budget || !desc) {
    const target = document.querySelector('.post-task-inline') || document.querySelector('#postTaskModal .modal-box');
    if (target) shake(target);
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

  // Clear form fields
  [titleEl, budgetEl, skillsEl, descEl].forEach(el => { if (el) el.value = ''; });
  if (catEl) catEl.value = '';

  renderClientTasks();
  showToast('🎉 Task posted! Students can now apply.');
}

// ============ PROFILE TOGGLE (legacy kept) ============
function toggleProfile() {
  const drop = document.getElementById('profileDrop');
  if (drop) drop.classList.toggle('hidden');
}

function toggleClientProfile() {
  goToClientProfile();
}

// ============ TAG TOGGLE ============
function toggleTag(el) { el.classList.toggle('active'); }

// ============ TOAST ============
function showToast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  t.style.cssText = `
    position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(20px);
    background:linear-gradient(135deg,rgba(5,23,71,0.97),rgba(8,31,98,0.96));
    border:1px solid rgba(255,255,255,0.13);border-radius:50px;
    padding:13px 28px;font-size:0.9rem;color:#E7E9F0;
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

// ============ SHAKE KEYFRAME ============
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
  // Close sidebars on outside click (mobile)
  const studentSidebar = document.getElementById('studentSidebar');
  if (studentSidebar && studentSidebar.classList.contains('open')) {
    if (!e.target.closest('#studentSidebar') && !e.target.closest('.dash-sidebar-toggle')) {
      studentSidebar.classList.remove('open');
    }
  }
  const clientSidebar = document.getElementById('clientSidebar');
  if (clientSidebar && clientSidebar.classList.contains('open')) {
    if (!e.target.closest('#clientSidebar') && !e.target.closest('.dash-sidebar-toggle')) {
      clientSidebar.classList.remove('open');
    }
  }
});

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('home').classList.add('active');
  renderAvailableTasks('all');
});
