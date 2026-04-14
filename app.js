/* ================================================
   SkillThali — app.js  (Full Fix)
   Payment system, dynamic auth, localStorage
================================================ */

// ============ STATE ============
let currentAuthMode = 'login';
let selectedRole = '';
let preSelectedRole = '';

let currentUser = { name: '', email: '', role: '', isNew: false };

// Task store with full payment lifecycle
let taskStore = [
  { id: 1, title: "Portfolio Website", category: "codethali", budget: 1200, skills: ["HTML", "CSS", "JavaScript"], desc: "Build a responsive 3-page portfolio for a mechanical engineering student. Must include About, Projects, and Contact sections.", client: "Rahul Mehta", location: "Pune, MH", rating: "4.7", projects: 8, deadline: "3 days", status: "available", paymentStatus: "pending", assignedTo: null },
  { id: 2, title: "Logo Design for StartupX", category: "creatix", budget: 800, skills: ["Adobe Illustrator", "Figma"], desc: "Need a minimalist modern logo for a tech startup. Provide 3 colour variants and SVG + PNG exports.", client: "Sneha Joshi", location: "Mumbai, MH", rating: "4.9", projects: 12, deadline: "5 days", status: "available", paymentStatus: "pending", assignedTo: null },
  { id: 3, title: "Resume Redesign", category: "quickbites", budget: 400, skills: ["MS Word", "Canva"], desc: "Redesign a fresher resume with a modern ATS-friendly template. 1-page only.", client: "Ankit Sharma", location: "Nagpur, MH", rating: "4.5", projects: 5, deadline: "2 days", status: "available", paymentStatus: "pending", assignedTo: null },
  { id: 4, title: "Hackathon Team Formation", category: "teamup", budget: 0, skills: ["Communication", "Problem Solving"], desc: "Looking for 2 teammates for Smart India Hackathon 2025. Need one designer and one backend developer.", client: "Priya Desai", location: "Pune, MH", rating: "4.8", projects: 3, deadline: "7 days", status: "available", paymentStatus: "pending", assignedTo: null },
  { id: 5, title: "YouTube Thumbnail Pack", category: "creatix", budget: 600, skills: ["Photoshop", "Canva"], desc: "Create 10 eye-catching thumbnails for a tech YouTube channel. Consistent style, bold typography.", client: "Rohan Kulkarni", location: "Nashik, MH", rating: "4.6", projects: 6, deadline: "4 days", status: "available", paymentStatus: "pending", assignedTo: null },
  { id: 6, title: "LinkedIn Profile Optimisation", category: "quickbites", budget: 350, skills: ["LinkedIn", "Content Writing"], desc: "Optimise my LinkedIn headline, about section, and experience descriptions for better visibility.", client: "Kavya Nair", location: "Pune, MH", rating: "5.0", projects: 10, deadline: "1 day", status: "available", paymentStatus: "pending", assignedTo: null },
  { id: 7, title: "Android Bug Fix", category: "codethali", budget: 900, skills: ["Java", "Android Studio"], desc: "Fix 3 known bugs in an existing Android app. Source code will be shared on GitHub.", client: "Dev Mehta", location: "Mumbai, MH", rating: "4.4", projects: 4, deadline: "6 days", status: "available", paymentStatus: "pending", assignedTo: null },
  { id: 8, title: "Startup Idea Brainstorm Partner", category: "teamup", budget: 0, skills: ["Business Thinking", "Research"], desc: "Need a creative co-founder to help validate and refine an EdTech startup idea. Weekly sessions.", client: "Ishaan Tiwari", location: "Indore, MP", rating: "4.7", projects: 2, deadline: "Ongoing", status: "available", paymentStatus: "pending", assignedTo: null }
];

// Student's task activity tracking
let studentActivity = { applied: [], active: [], completed: [] };

// ============ LOCAL STORAGE ============
function saveUser(u) { try { localStorage.setItem('st_user', JSON.stringify(u)); } catch(e) {} }
function loadUser() { try { const d = localStorage.getItem('st_user'); return d ? JSON.parse(d) : null; } catch(e) { return null; } }
function clearUser() { try { localStorage.removeItem('st_user'); } catch(e) {} }
function saveUsers(arr) { try { localStorage.setItem('st_users', JSON.stringify(arr)); } catch(e) {} }
function loadUsers() { try { const d = localStorage.getItem('st_users'); return d ? JSON.parse(d) : []; } catch(e) { return []; } }

// ============ NAVBAR VISIBILITY ============
function updateNavbarVisibility(id) {
  const nav = document.getElementById('mainNav');
  if (!nav) return;
  if (id === 'home') nav.classList.remove('nav-hidden');
  else nav.classList.add('nav-hidden');
}

// ============ SECTION NAV ============
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  if (id === 'about' || id === 'categories') {
    document.getElementById('home').classList.add('active');
    updateNavbarVisibility('home');
    const anchor = document.getElementById(id);
    if (anchor) setTimeout(() => anchor.scrollIntoView({ behavior: 'smooth' }), 50);
  } else {
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
    updateNavbarVisibility(id);
  }
  window.scrollTo(0, 0);
}

// ============ HERO ROLE INFO ============
function showRoleInfo(role) {
  console.log('clicked: showRoleInfo →', role);
  const content = document.getElementById('roleInfoContent');
  if (role === 'student') {
    content.innerHTML = `<span class="role-icon">🎓</span><h2>I am a Student</h2><p>Showcase your skills, work on real-world projects, earn money, and build your portfolio.</p><button class="btn-primary" onclick="openAuth('signup','student')">Get Started as Student →</button>`;
  } else {
    content.innerHTML = `<span class="role-icon">💼</span><h2>I am a Client</h2><p>Post projects, hire skilled students, review their work, and get tasks completed efficiently.</p><button class="btn-primary" onclick="openAuth('signup','client')">Get Started as Client →</button>`;
  }
  document.getElementById('roleInfoPage').classList.remove('hidden');
}
function hideRoleInfo() { document.getElementById('roleInfoPage').classList.add('hidden'); }

// ============ AUTH ============
function openAuth(mode, role = '') {
  console.log('clicked: openAuth →', mode, role);
  currentAuthMode = mode;
  preSelectedRole = role;
  document.getElementById('authModal').classList.remove('hidden');
  ['authName','authEmail','authPass'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  showAuthStep('authStep1');
  refreshAuthUI();
  hideRoleInfo();
}

function refreshAuthUI() {
  const isLogin = currentAuthMode === 'login';
  document.getElementById('authTitle').textContent = isLogin ? 'Welcome Back' : 'Create Account';
  document.getElementById('authSub').textContent = isLogin ? 'Login to your SkillThali account' : 'Join SkillThali today';
  document.getElementById('authSwitchText').innerHTML = isLogin
    ? "Don't have an account? <a href='#' onclick='toggleAuth()'>Sign Up</a>"
    : "Already have an account? <a href='#' onclick='toggleAuth()'>Login</a>";
  const ng = document.getElementById('authNameGroup');
  if (ng) ng.style.display = isLogin ? 'none' : 'block';
}

function toggleAuth() {
  currentAuthMode = currentAuthMode === 'login' ? 'signup' : 'login';
  ['authName','authEmail','authPass'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  refreshAuthUI();
}

function closeModal() {
  document.getElementById('authModal').classList.add('hidden');
  showAuthStep('authStep1');
  ['authName','authEmail','authPass'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
}

function showAuthStep(id) {
  document.querySelectorAll('.auth-step').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}

function nextAuthStep() {
  console.log('clicked: nextAuthStep → mode:', currentAuthMode);
  const email = (document.getElementById('authEmail').value || '').trim();
  const pass = (document.getElementById('authPass').value || '').trim();
  if (!email || !pass) { shake(document.querySelector('.modal-box')); return; }

  if (currentAuthMode === 'login') {
    const users = loadUsers();
    const match = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === pass);
    if (match) {
      currentUser = { name: match.name, email: match.email, role: match.role, isNew: false };
    } else {
      const raw = email.split('@')[0];
      currentUser = { name: raw.charAt(0).toUpperCase() + raw.slice(1), email, role: preSelectedRole || 'student', isNew: false };
    }
    saveUser(currentUser);
    goToDashboard(currentUser.role);
    return;
  }

  // Signup
  const nameEl = document.getElementById('authName');
  const name = nameEl ? nameEl.value.trim() : '';
  if (!name) { shake(document.querySelector('.modal-box')); return; }

  currentUser = { name, email, role: preSelectedRole || '', isNew: true };

  if (preSelectedRole) {
    showAuthStep(preSelectedRole === 'student' ? 'onboardS1' : 'onboardC1');
    return;
  }
  showAuthStep('authStep2');
}

function selectRole(role) {
  selectedRole = role;
  currentUser.role = role;
  document.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
  document.querySelectorAll('.role-card').forEach(c => {
    const h3 = c.querySelector('h3');
    if (h3 && h3.textContent.toLowerCase() === role) c.classList.add('selected');
  });
  setTimeout(() => showAuthStep(role === 'student' ? 'onboardS1' : 'onboardC1'), 150);
}

function goToDashboard(type) {
  if (!currentUser.role) currentUser.role = type;
  saveUser(currentUser);

  // Persist to users registry for login
  const passEl = document.getElementById('authPass');
  const pass = passEl ? passEl.value : '';
  if (currentUser.isNew && pass && currentUser.email) {
    const users = loadUsers();
    if (!users.find(u => u.email.toLowerCase() === currentUser.email.toLowerCase())) {
      users.push({ name: currentUser.name, email: currentUser.email, password: pass, role: currentUser.role });
      saveUsers(users);
    }
  }

  closeModal();
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));

  if (type === 'student') {
    document.getElementById('studentDash').classList.add('active');
    updateNavbarVisibility('studentDash');
    renderAvailableTasks('all');
    switchStudentView('available', document.querySelector('#studentSidebar .sidebar-btn'));
    updateDynamicUI('student');
  } else {
    document.getElementById('clientDash').classList.add('active');
    updateNavbarVisibility('clientDash');
    renderClientTasks();
    updateDynamicUI('client');
  }
  window.scrollTo(0, 0);
}

// ============ DYNAMIC UI ============
function updateDynamicUI(role) {
  const name = currentUser.name || 'User';
  const email = currentUser.email || '';
  const greeting = currentUser.isNew ? `Welcome, ${name} 🎉` : `Welcome back, ${name} 👋`;
  const initials = name.substring(0, 2).toUpperCase();

  if (role === 'student') {
    setEl('studentGreeting', greeting);
    setEl('studentNavInitials', initials);
    setEl('studentAvatarInitials', initials);
    setEl('profileDropName', name);
    setEl('profilePageName', name);
    setEl('profilePageEmail', '📧 ' + (email || 'student@college.edu'));
    setEl('profilePageInitials', initials);
    // Dynamic stats
    const completed = studentActivity.completed.length;
    const active = studentActivity.active.length;
    const earnings = studentActivity.completed.reduce((sum, id) => {
      const t = taskStore.find(t => t.id === id);
      return sum + (t ? t.budget : 0);
    }, 0);
    setEl('statActiveTasks', active);
    setEl('statCompletedTasks', completed);
    setEl('statEarnings', '₹' + earnings.toLocaleString('en-IN'));
  } else {
    setEl('clientGreeting', greeting);
    setEl('clientNavInitials', initials);
    setEl('clientAvatarInitials', initials);
    setEl('clientProfileDropName', name);
    setEl('clientProfilePageName', name);
    setEl('clientProfilePageEmail', '📧 ' + (email || 'client@company.com'));
    setEl('clientProfilePageInitials', initials);
    const activeCount = taskStore.filter(t => t.status === 'assigned').length;
    const completedCount = taskStore.filter(t => t.status === 'completed').length;
    setEl('clientStatActive', activeCount);
    setEl('clientStatCompleted', completedCount);
  }
}

function setEl(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function logout() {
  currentUser = { name: '', email: '', role: '', isNew: false };
  studentActivity = { applied: [], active: [], completed: [] };
  clearUser();
  document.querySelectorAll('.profile-dropdown-menu').forEach(d => d.classList.remove('open'));
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById('home').classList.add('active');
  updateNavbarVisibility('home');
  window.scrollTo(0, 0);
}

function shake(el) {
  if (!el) return;
  el.style.animation = 'none';
  el.offsetHeight;
  el.style.animation = 'shake 0.3s ease';
}

// ============ PROFILE DROPDOWN ============
function toggleStudentProfileDrop(e) {
  e.stopPropagation();
  document.getElementById('studentProfileMenu').classList.toggle('open');
  const cm = document.getElementById('clientProfileMenu');
  if (cm) cm.classList.remove('open');
}
function toggleClientProfileDrop(e) {
  e.stopPropagation();
  document.getElementById('clientProfileMenu').classList.toggle('open');
  const sm = document.getElementById('studentProfileMenu');
  if (sm) sm.classList.remove('open');
}

// ============ ONBOARDING ============
function toggleChoice(el) { el.classList.toggle('selected'); }
function selectRadioCard(el) {
  el.closest('.onboard-cards-grid').querySelectorAll('.onboard-choice-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
}

// ============ STUDENT VIEWS ============
function switchStudentView(view, btn) {
  document.querySelectorAll('#studentSidebar .sidebar-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.querySelectorAll('#studentDash .dash-view').forEach(v => v.classList.remove('active'));
  const viewEl = document.getElementById('view-' + view);
  if (viewEl) viewEl.classList.add('active');
  if (view === 'available') renderAvailableTasks('all');
  if (view === 'active') renderStudentActiveTasks();
  if (view === 'completed') renderStudentCompletedTasks();
}

// ============ CLIENT VIEWS ============
function switchClientView(view, btn) {
  document.querySelectorAll('#clientSidebar .sidebar-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.querySelectorAll('#clientDash .dash-view').forEach(v => v.classList.remove('active'));
  const viewEl = document.getElementById('cview-' + view);
  if (viewEl) viewEl.classList.add('active');
  if (view === 'posted') renderClientTasks();
}

// ============ SIDEBAR TOGGLE ============
function toggleSidebar() { document.getElementById('studentSidebar').classList.toggle('open'); }
function toggleClientSidebar() { document.getElementById('clientSidebar').classList.toggle('open'); }

// ============ PROFILE NAV ============
function goToStudentProfile() {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById('studentProfile').classList.add('active');
  updateNavbarVisibility('studentProfile');
  const m = document.getElementById('studentProfileMenu');
  if (m) m.classList.remove('open');
  window.scrollTo(0, 0);
}
function goToClientProfile() {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById('clientProfile').classList.add('active');
  updateNavbarVisibility('clientProfile');
  const m = document.getElementById('clientProfileMenu');
  if (m) m.classList.remove('open');
  window.scrollTo(0, 0);
}
function goBackToDash(role) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  if (role === 'student') { document.getElementById('studentDash').classList.add('active'); updateNavbarVisibility('studentDash'); }
  else { document.getElementById('clientDash').classList.add('active'); updateNavbarVisibility('clientDash'); }
  window.scrollTo(0, 0);
}

// ============ CATEGORY PANEL ============
const catData = {
  codethali: { icon: '💻', title: 'CodeThali', subtitle: 'Technical services for every project', items: [{ name: 'Web Development', desc: 'Full website builds, landing pages, and web apps.', examples: ['Portfolio site', 'Landing page for startup', 'E-commerce store'] }, { name: 'App Development', desc: 'Mobile and desktop application development.', examples: ['Android utility app', 'React Native app', 'Desktop tool in Python'] }, { name: 'Debugging', desc: 'Fix bugs and issues in existing codebases.', examples: ['Fix login errors', 'Resolve UI glitches', 'Performance issues'] }] },
  creatix: { icon: '🎨', title: 'Creatix', subtitle: 'Creative design and visual content', items: [{ name: 'Poster Design', desc: 'Eye-catching posters for events, brands, and campaigns.', examples: ['Event poster', 'Brand awareness poster', 'College fest banner'] }, { name: 'Logo Design', desc: 'Professional logos with multiple format exports.', examples: ['Startup logo', 'Personal brand mark', 'Sports team logo'] }, { name: 'Thumbnail Creation', desc: 'Click-worthy thumbnails for YouTube and social media.', examples: ['YouTube thumbnail pack', 'Instagram story covers', 'Course thumbnails'] }] },
  quickbites: { icon: '⚡', title: 'QuickBites', subtitle: 'Quick, high-quality deliverables', items: [{ name: 'LinkedIn Setup', desc: 'Complete LinkedIn profile optimisation for visibility.', examples: ['Headline + summary rewrite', 'Skills endorsement strategy', 'Featured section setup'] }, { name: 'Data Entry', desc: 'Accurate and efficient data entry tasks.', examples: ['Excel data organisation', 'Product catalog entry', 'Form data processing'] }, { name: 'Portfolio Website', desc: 'Professional portfolio to showcase your work.', examples: ['Developer portfolio', 'Designer showcase', 'Freelancer profile site'] }] },
  teamup: { icon: '🤝', title: 'TeamUp', subtitle: 'Collaborate and build together', items: [{ name: 'Group Projects', desc: 'Find teammates for academic and personal projects.', examples: ['Final year project team', 'App development team', 'Research collaboration'] }, { name: 'Hackathon Teams', desc: 'Build or join teams for hackathons and competitions.', examples: ['SIH 2025 team', 'Coding competition partner', 'Designathon teammate'] }, { name: 'Startup Ideas', desc: 'Co-founder matching and idea validation.', examples: ['EdTech co-founder', 'Fintech idea partner', 'Social impact startup'] }] }
};

function openCategory(cat) {
  console.log('clicked: openCategory →', cat);
  const d = catData[cat];
  document.getElementById('panelIcon').textContent = d.icon;
  document.getElementById('panelTitle').textContent = d.title;
  document.getElementById('panelSubtitle').textContent = d.subtitle;
  const container = document.getElementById('panelItems');
  container.innerHTML = '';
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
  console.log('clicked: openSubDetail →', item.name);
  document.getElementById('subDetailContent').innerHTML = `<h3>${item.name}</h3><p>${item.desc}</p><h4 style="font-size:0.82rem;color:var(--text-dim);margin-bottom:8px;margin-top:4px">Example Tasks</h4><ul class="sub-examples">${item.examples.map(e=>`<li>→ ${e}</li>`).join('')}</ul><button class="btn-primary" style="margin-top:16px;width:100%" onclick="openAuth('signup')">Get Started →</button>`;
  document.getElementById('subDetailPanel').classList.remove('hidden');
  document.getElementById('catPanelGetStarted').style.display = 'none';
}
function closeSubDetail() { document.getElementById('subDetailPanel').classList.add('hidden'); document.getElementById('catPanelGetStarted').style.display = ''; }
function closeCategory() { document.getElementById('catPanel').classList.add('hidden'); }

// ============ PAYMENT BADGE HELPERS ============
function paymentBadge(task) {
  if (task.paymentStatus === 'released') return `<span class="payment-badge completed-tag">💰 Released</span>`;
  if (task.paymentStatus === 'secured') return `<span class="payment-badge secured">🔒 Secured</span>`;
  return `<span class="payment-badge pending-badge">⏳ Pending</span>`;
}
function statusBadge(task) {
  if (task.status === 'completed') return `<span class="payment-badge completed-tag">✅ Completed</span>`;
  if (task.status === 'assigned') return `<span class="payment-badge inprogress">🔥 In Progress</span>`;
  return `<span class="payment-badge available-badge">🟢 Available</span>`;
}
function fmtBudget(b) { return b > 0 ? '₹' + b.toLocaleString('en-IN') : '₹0 (Collab)'; }

// ============ PAY NOW BUTTON (UI ONLY) ============
function payNowBtn(task) {
  if (task.paymentStatus !== 'pending' || task.budget <= 0) return '';
  return `<button class="btn-pay-now" disabled title="Payment gateway coming soon">🔐 Pay Now</button>`;
}

// ============ AVAILABLE TASKS ============
function renderAvailableTasks(filter) {
  const container = document.getElementById('availableTasks');
  if (!container) return;
  container.innerHTML = '';
  const available = taskStore.filter(t => t.status === 'available');
  const tasks = filter === 'all' ? available : available.filter(t => t.category === filter);
  tasks.forEach((task, i) => {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.style.animation = 'fadeUp 0.4s ease both';
    card.style.animationDelay = (i * 0.05) + 's';
    const catEmoji = { codethali: '💻', creatix: '🎨', quickbites: '⚡', teamup: '🤝' }[task.category];
    const catLabel = { codethali: 'CodeThali', creatix: 'Creatix', quickbites: 'QuickBites', teamup: 'TeamUp' }[task.category];
    const applied = studentActivity.applied.includes(task.id);
    card.innerHTML = `
      <div class="task-info">
        <span class="task-cat">${catEmoji} ${catLabel}</span>
        <h4>${task.title}</h4>
        <p>${task.desc.substring(0, 72)}...</p>
      </div>
      <div class="task-meta">
        <span class="budget">${fmtBudget(task.budget)}</span>
        <span class="deadline">⏰ ${task.deadline}</span>
        ${applied ? '<span class="payment-badge inprogress">✅ Applied</span>' : ''}
      </div>`;
    card.onclick = () => openTaskDetail(task);
    container.appendChild(card);
  });
  if (tasks.length === 0) container.innerHTML = '<p style="color:var(--text-dim);text-align:center;padding:30px;">No tasks in this category yet.</p>';
}

function filterTasks(cat, btn) {
  document.querySelectorAll('.ftab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderAvailableTasks(cat);
}

// ============ STUDENT ACTIVE TASKS ============
function renderStudentActiveTasks() {
  const container = document.getElementById('studentActiveTasks');
  if (!container) return;
  container.innerHTML = '';
  const active = taskStore.filter(t => studentActivity.active.includes(t.id));
  if (!active.length) { container.innerHTML = '<p style="color:var(--text-dim);text-align:center;padding:30px;">No active tasks yet. Apply for tasks to get started! 💪</p>'; return; }
  active.forEach(task => {
    const catEmoji = { codethali: '💻', creatix: '🎨', quickbites: '⚡', teamup: '🤝' }[task.category];
    const catLabel = { codethali: 'CodeThali', creatix: 'Creatix', quickbites: 'QuickBites', teamup: 'TeamUp' }[task.category];
    const card = document.createElement('div');
    card.className = 'task-card active-task';
    card.innerHTML = `
      <div class="task-info">
        <span class="task-cat">${catEmoji} ${catLabel}</span>
        <h4>${task.title}</h4>
        <p>${task.desc.substring(0, 65)}...</p>
      </div>
      <div class="task-meta">
        <span class="budget">${fmtBudget(task.budget)}</span>
        <span class="deadline">⏰ ${task.deadline}</span>
        ${paymentBadge(task)}
        ${statusBadge(task)}
        <div class="progress-bar"><div style="width:${Math.floor(Math.random()*40)+30}%"></div></div>
        <button class="btn-complete" onclick="markCompleted(${task.id})">Mark as Completed ✓</button>
      </div>`;
    container.appendChild(card);
  });
  updateDynamicUI('student');
}

// ============ STUDENT COMPLETED TASKS ============
function renderStudentCompletedTasks() {
  const container = document.getElementById('studentCompletedTasks');
  if (!container) return;
  container.innerHTML = '';
  const done = taskStore.filter(t => studentActivity.completed.includes(t.id));
  if (!done.length) { container.innerHTML = '<p style="color:var(--text-dim);text-align:center;padding:30px;">No completed tasks yet. Keep going! 🚀</p>'; return; }
  done.forEach(task => {
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
        <span class="budget">${fmtBudget(task.budget)}</span>
        <span class="payment-badge completed-tag">✅ Completed</span>
        <span class="payment-badge completed-tag">💰 Released</span>
        <span style="font-size:0.78rem;color:#7cfc90">⭐ 5.0</span>
      </div>`;
    container.appendChild(card);
  });
}

// ============ MARK COMPLETED (PAYMENT FLOW) ============
function markCompleted(taskId) {
  const task = taskStore.find(t => t.id === taskId);
  if (!task) return;
  task.status = 'completed';
  task.paymentStatus = 'released';
  studentActivity.active = studentActivity.active.filter(id => id !== taskId);
  if (!studentActivity.completed.includes(taskId)) studentActivity.completed.push(taskId);
  renderStudentActiveTasks();
  renderStudentCompletedTasks();
  renderClientTasks();
  updateDynamicUI('student');
  showToast(`✅ "${task.title}" completed! ${task.budget > 0 ? fmtBudget(task.budget) + ' released.' : 'Nice work!'}`);
}

// ============ TASK DETAIL MODAL ============
function openTaskDetail(task) {
  const catEmoji = { codethali: '💻', creatix: '🎨', quickbites: '⚡', teamup: '🤝' }[task.category];
  const catLabel = { codethali: 'CodeThali', creatix: 'Creatix', quickbites: 'QuickBites', teamup: 'TeamUp' }[task.category];
  const applied = studentActivity.applied.includes(task.id);
  document.getElementById('taskDetailContent').innerHTML = `
    <span class="task-cat" style="margin-bottom:16px;display:inline-block">${catEmoji} ${catLabel}</span>
    <h2 style="font-family:'Playfair Display',serif;font-size:1.6rem;margin-bottom:20px;color:var(--white)">${task.title}</h2>
    <div class="client-info">
      <div class="client-avatar">${task.client.split(' ').map(w=>w[0]).join('')}</div>
      <div class="client-details"><h3>${task.client}</h3><p>📍 ${task.location} &nbsp;·&nbsp; ⭐ ${task.rating} &nbsp;·&nbsp; ${task.projects} projects posted</p></div>
    </div>
    <div class="client-meta">
      <div class="cm"><span>Budget</span><strong>${fmtBudget(task.budget)}</strong></div>
      <div class="cm"><span>Deadline</span><strong>${task.deadline}</strong></div>
      <div class="cm"><span>Status</span><strong>${task.status.charAt(0).toUpperCase()+task.status.slice(1)}</strong></div>
      <div class="cm"><span>Payment</span><strong>${task.paymentStatus === 'secured' ? '🔒 Secured' : task.paymentStatus === 'released' ? '💰 Released' : '⏳ Pending'}</strong></div>
    </div>
    <div class="task-desc"><h4>Task Description</h4><p>${task.desc}</p></div>
    <div class="task-desc"><h4>Required Skills</h4><div class="skills-row">${task.skills.map(s=>`<span class="skill-tag">${s}</span>`).join('')}</div></div>
    <div class="detail-btns">
      <button class="btn-secondary" onclick="closeTaskModal()">Close</button>
      ${applied ? `<button class="btn-primary" style="opacity:0.6;cursor:not-allowed">✅ Applied</button>` : `<button class="btn-primary" onclick="applyForTask(${task.id})">Apply Now →</button>`}
    </div>`;
  document.getElementById('taskModal').classList.remove('hidden');
}

function closeTaskModal() { document.getElementById('taskModal').classList.add('hidden'); }

// ============ APPLY = ASSIGN + SECURE PAYMENT ============
function applyForTask(taskId) {
  const task = taskStore.find(t => t.id === taskId);
  if (!task || task.status !== 'available') return;
  task.status = 'assigned';
  task.paymentStatus = 'secured';
  task.assignedTo = currentUser.name || 'Student';
  if (!studentActivity.applied.includes(taskId)) studentActivity.applied.push(taskId);
  if (!studentActivity.active.includes(taskId)) studentActivity.active.push(taskId);
  closeTaskModal();
  renderAvailableTasks('all');
  renderClientTasks();
  updateDynamicUI('student');
  showToast(`✅ Applied for "${task.title}"! Payment 🔒 Secured.`);
}

// ============ CLIENT TASKS ============
function renderClientTasks() {
  const container = document.getElementById('clientPostedTasks');
  if (!container) return;
  container.innerHTML = '';
  if (!taskStore.length) { container.innerHTML = '<p style="color:var(--text-dim);text-align:center;padding:30px;">No tasks posted yet.</p>'; return; }
  taskStore.forEach(task => {
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
        <span class="budget">${fmtBudget(task.budget)}</span>
        <span class="deadline">⏰ ${task.deadline}</span>
        ${statusBadge(task)}
        ${paymentBadge(task)}
        ${payNowBtn(task)}
        <button class="btn-delete-task" onclick="deleteTask(event,${task.id})">🗑️ Delete</button>
      </div>`;
    card.onclick = () => openClientTaskDetail(task);
    container.appendChild(card);
  });
  updateDynamicUI('client');
}

function deleteTask(e, id) {
  e.stopPropagation();
  taskStore = taskStore.filter(t => t.id !== id);
  studentActivity.applied = studentActivity.applied.filter(i => i !== id);
  studentActivity.active = studentActivity.active.filter(i => i !== id);
  renderClientTasks();
  renderAvailableTasks('all');
  showToast('🗑️ Task deleted successfully.');
}

function openPostTask() { document.getElementById('postTaskModal').classList.remove('hidden'); }
function closePostTask() { document.getElementById('postTaskModal').classList.add('hidden'); }

// ============ CLIENT TASK DETAIL MODAL ============
function openClientTaskDetail(task) {
  console.log('clicked: openClientTaskDetail →', task.title);
  const catEmoji = { codethali: '💻', creatix: '🎨', quickbites: '⚡', teamup: '🤝' }[task.category];
  const catLabel = { codethali: 'CodeThali', creatix: 'Creatix', quickbites: 'QuickBites', teamup: 'TeamUp' }[task.category];
  const payLabel = task.paymentStatus === 'released' ? '💰 Released' : task.paymentStatus === 'secured' ? '🔒 Secured' : '⏳ Pending';
  const statusLabel = task.status === 'completed' ? '✅ Completed' : task.status === 'assigned' ? '🔥 In Progress' : '🟢 Available';
  document.getElementById('clientTaskDetailContent').innerHTML = `
    <span class="task-cat" style="margin-bottom:12px;display:inline-block">${catEmoji} ${catLabel}</span>
    <h2 class="ctd-title">${task.title}</h2>
    <div class="ctd-meta">
      <div class="ctd-meta-item"><span>Budget</span><strong>${fmtBudget(task.budget)}</strong></div>
      <div class="ctd-meta-item"><span>Deadline</span><strong>⏰ ${task.deadline}</strong></div>
      <div class="ctd-meta-item"><span>Status</span><strong>${statusLabel}</strong></div>
      <div class="ctd-meta-item"><span>Payment</span><strong>${payLabel}</strong></div>
    </div>
    <div class="ctd-desc-block">
      <h4>Description</h4>
      <p>${task.desc}</p>
    </div>
    ${task.skills && task.skills.length ? `<div class="ctd-desc-block"><h4>Required Skills</h4><div class="skills-row">${task.skills.map(s=>`<span class="skill-tag">${s}</span>`).join('')}</div></div>` : ''}
    ${task.paymentStatus === 'pending' && task.budget > 0 ? `<div style="margin-top:16px;padding:14px 16px;background:rgba(255,165,0,0.07);border:1px solid rgba(255,165,0,0.2);border-radius:10px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;"><span style="font-size:0.83rem;color:#ffb347;">💳 Payment not yet processed for this task</span><button class="btn-pay-now" disabled title="Payment gateway coming soon">🔐 Pay Now</button></div>` : ''}
    <button class="btn-ghost ctd-close-btn" onclick="closeClientTaskModal()">Close</button>
  `;
  document.getElementById('clientTaskModal').classList.remove('hidden');
}
function closeClientTaskModal() { document.getElementById('clientTaskModal').classList.add('hidden'); }

function submitTask() {
  const titleEl = document.getElementById('taskTitle') || document.getElementById('taskTitle2');
  const catEl = document.getElementById('taskCategory') || document.getElementById('taskCategory2');
  const budgetEl = document.getElementById('taskBudget') || document.getElementById('taskBudget2');
  const skillsEl = document.getElementById('taskSkills') || document.getElementById('taskSkills2');
  const descEl = document.getElementById('taskDesc') || document.getElementById('taskDesc2');

  const title = titleEl ? titleEl.value.trim() : '';
  const cat = catEl ? catEl.value : '';
  const budget = budgetEl ? (parseInt(budgetEl.value) || 0) : 0;
  const skills = skillsEl ? skillsEl.value.trim() : '';
  const desc = descEl ? descEl.value.trim() : '';

  if (!title || !cat || !desc) {
    shake(document.querySelector('.post-task-inline') || document.querySelector('#postTaskModal .modal-box'));
    return;
  }

  taskStore.unshift({
    id: Date.now(), title, category: cat, budget,
    skills: skills.split(',').map(s => s.trim()).filter(Boolean),
    desc, client: currentUser.name || 'Client',
    location: 'Pune, MH', rating: '4.8', projects: 1,
    deadline: '7 days', status: 'available', paymentStatus: 'pending', assignedTo: null
  });

  closePostTask();
  [titleEl, budgetEl, skillsEl, descEl].forEach(el => { if (el) el.value = ''; });
  if (catEl) catEl.value = '';
  renderClientTasks();
  showToast('🎉 Task posted! Students can now apply.');
}

// ============ TOAST ============
function showToast(msg) {
  const t = document.createElement('div');
  t.textContent = msg;
  t.style.cssText = `position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(20px);background:linear-gradient(135deg,rgba(22,26,48,0.97),rgba(49,48,77,0.96));border:1px solid rgba(182,187,196,0.2);border-radius:50px;padding:13px 28px;font-size:0.9rem;color:#F0ECE5;z-index:9999;opacity:0;transition:all 0.35s ease;box-shadow:0 8px 30px rgba(0,0,0,0.4);font-family:'DM Sans',sans-serif;white-space:nowrap;max-width:90vw;text-align:center;`;
  document.body.appendChild(t);
  requestAnimationFrame(() => { t.style.opacity='1'; t.style.transform='translateX(-50%) translateY(0)'; });
  setTimeout(() => { t.style.opacity='0'; t.style.transform='translateX(-50%) translateY(20px)'; setTimeout(() => t.remove(), 400); }, 3500);
}

// ============ SHAKE ============
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}`;
document.head.appendChild(shakeStyle);

// ============ PAY NOW BUTTON STYLE (injected) ============
const payNowStyle = document.createElement('style');
payNowStyle.textContent = `
.btn-pay-now {
  background: rgba(255,165,0,0.10);
  border: 1px solid rgba(255,165,0,0.30);
  color: #ffb347;
  padding: 6px 16px;
  border-radius: 50px;
  font-size: 0.78rem;
  font-family: 'DM Sans', sans-serif;
  font-weight: 600;
  cursor: not-allowed;
  opacity: 0.75;
  pointer-events: none;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  letter-spacing: 0.02em;
}
`;
document.head.appendChild(payNowStyle);

// ============ CLICK OUTSIDE CLOSE ============
document.addEventListener('click', (e) => {
  if (!e.target.closest('.profile-dropdown-wrapper')) {
    document.querySelectorAll('.profile-dropdown-menu').forEach(m => m.classList.remove('open'));
  }
  const ss = document.getElementById('studentSidebar');
  if (ss && ss.classList.contains('open') && !e.target.closest('#studentSidebar') && !e.target.closest('.dash-sidebar-toggle')) ss.classList.remove('open');
  const cs = document.getElementById('clientSidebar');
  if (cs && cs.classList.contains('open') && !e.target.closest('#clientSidebar') && !e.target.closest('.dash-sidebar-toggle')) cs.classList.remove('open');
});

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
  const saved = loadUser();
  if (saved && saved.name) currentUser = saved;
  document.getElementById('home').classList.add('active');
  updateNavbarVisibility('home');
  renderAvailableTasks('all');
});
