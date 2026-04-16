/* ================================================
   SkillThali — app.js  (Full Extended Version)
   Payment system, dynamic auth, localStorage,
   Admin Dashboard, Full Payment Flow
================================================ */

// ============ STATE ============
let currentAuthMode = 'login';
let selectedRole = '';
let preSelectedRole = '';

let currentUser = { name: '', email: '', role: '', isNew: false };

// Task store with full payment lifecycle
let taskStore = [
  { id: 1, title: "Portfolio Website", category: "codethali", budget: 1200, skills: ["HTML", "CSS", "JavaScript"], desc: "Build a responsive 3-page portfolio for a mechanical engineering student. Must include About, Projects, and Contact sections.", client: "Rahul Mehta", clientEmail: "rahul@demo.com", location: "Pune, MH", rating: "4.7", projects: 8, deadline: "3 days", status: "available", paymentStatus: "pending", assignedTo: null, submittedWork: null, postedByUser: false },
  { id: 2, title: "Logo Design for StartupX", category: "creatix", budget: 800, skills: ["Adobe Illustrator", "Figma"], desc: "Need a minimalist modern logo for a tech startup. Provide 3 colour variants and SVG + PNG exports.", client: "Sneha Joshi", clientEmail: "sneha@demo.com", location: "Mumbai, MH", rating: "4.9", projects: 12, deadline: "5 days", status: "available", paymentStatus: "pending", assignedTo: null, submittedWork: null, postedByUser: false },
  { id: 3, title: "Resume Redesign", category: "quickbites", budget: 400, skills: ["MS Word", "Canva"], desc: "Redesign a fresher resume with a modern ATS-friendly template. 1-page only.", client: "Ankit Sharma", clientEmail: "ankit@demo.com", location: "Nagpur, MH", rating: "4.5", projects: 5, deadline: "2 days", status: "available", paymentStatus: "pending", assignedTo: null, submittedWork: null, postedByUser: false },
  { id: 4, title: "Hackathon Team Formation", category: "teamup", budget: 0, skills: ["Communication", "Problem Solving"], desc: "Looking for 2 teammates for Smart India Hackathon 2025. Need one designer and one backend developer.", client: "Priya Desai", clientEmail: "priya@demo.com", location: "Pune, MH", rating: "4.8", projects: 3, deadline: "7 days", status: "available", paymentStatus: "pending", assignedTo: null, submittedWork: null, postedByUser: false },
  { id: 5, title: "YouTube Thumbnail Pack", category: "creatix", budget: 600, skills: ["Photoshop", "Canva"], desc: "Create 10 eye-catching thumbnails for a tech YouTube channel. Consistent style, bold typography.", client: "Rohan Kulkarni", clientEmail: "rohan@demo.com", location: "Nashik, MH", rating: "4.6", projects: 6, deadline: "4 days", status: "available", paymentStatus: "pending", assignedTo: null, submittedWork: null, postedByUser: false },
  { id: 6, title: "LinkedIn Profile Optimisation", category: "quickbites", budget: 350, skills: ["LinkedIn", "Content Writing"], desc: "Optimise my LinkedIn headline, about section, and experience descriptions for better visibility.", client: "Kavya Nair", clientEmail: "kavya@demo.com", location: "Pune, MH", rating: "5.0", projects: 10, deadline: "1 day", status: "available", paymentStatus: "pending", assignedTo: null, submittedWork: null, postedByUser: false },
  { id: 7, title: "Android Bug Fix", category: "codethali", budget: 900, skills: ["Java", "Android Studio"], desc: "Fix 3 known bugs in an existing Android app. Source code will be shared on GitHub.", client: "Dev Mehta", clientEmail: "dev@demo.com", location: "Mumbai, MH", rating: "4.4", projects: 4, deadline: "6 days", status: "available", paymentStatus: "pending", assignedTo: null, submittedWork: null, postedByUser: false },
  { id: 8, title: "Startup Idea Brainstorm Partner", category: "teamup", budget: 0, skills: ["Business Thinking", "Research"], desc: "Need a creative co-founder to help validate and refine an EdTech startup idea. Weekly sessions.", client: "Ishaan Tiwari", clientEmail: "ishaan@demo.com", location: "Indore, MP", rating: "4.7", projects: 2, deadline: "Ongoing", status: "available", paymentStatus: "pending", assignedTo: null, submittedWork: null, postedByUser: false }
];

// Student's task activity tracking — now user-specific
let studentActivity = { applied: [], active: [], completed: [], submitted: [] };

// ============ LOCAL STORAGE ============
function saveUser(u) { try { localStorage.setItem('st_user', JSON.stringify(u)); } catch(e) {} }
function loadUser() { try { const d = localStorage.getItem('st_user'); return d ? JSON.parse(d) : null; } catch(e) { return null; } }
function clearUser() { try { localStorage.removeItem('st_user'); } catch(e) {} }
function saveUsers(arr) { try { localStorage.setItem('st_users', JSON.stringify(arr)); } catch(e) {} }
function loadUsers() { try { const d = localStorage.getItem('st_users'); return d ? JSON.parse(d) : []; } catch(e) { return []; } }
function saveTaskStore() { try { localStorage.setItem('st_tasks', JSON.stringify(taskStore)); } catch(e) {} }
function loadTaskStore() { try { const d = localStorage.getItem('st_tasks'); return d ? JSON.parse(d) : null; } catch(e) { return null; } }

// USER-SPECIFIC activity keys — keyed by email so each user has independent state
function getActivityKey(email) {
  return 'studentActivity_' + (email || 'anon');
}
function saveStudentActivity(a) {
  try {
    const key = getActivityKey(currentUser.email);
    localStorage.setItem(key, JSON.stringify(a));
  } catch(e) {}
}
function loadStudentActivity() {
  try {
    const key = getActivityKey(currentUser.email);
    const d = localStorage.getItem(key);
    return d ? JSON.parse(d) : { applied: [], active: [], completed: [], submitted: [] };
  } catch(e) {
    return { applied: [], active: [], completed: [], submitted: [] };
  }
}

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
  const email = (document.getElementById('authEmail').value || '').trim();
  const pass = (document.getElementById('authPass').value || '').trim();
  if (!email || !pass) { shake(document.querySelector('.modal-box')); return; }

  // Check admin login
  if (email.toLowerCase() === 'admin@skillthali.com') {
    currentUser = { name: 'Admin', email: email, role: 'admin', isNew: false };
    saveUser(currentUser);
    closeModal();
    goToAdminDash();
    return;
  }

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
    // Load THIS user's own activity — user-specific key
    studentActivity = loadStudentActivity();
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

  // Always load THIS user's activity when going to dashboard
  studentActivity = loadStudentActivity();

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

// ============ ADMIN DASHBOARD ============
function goToAdminDash() {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  const adminSection = document.getElementById('adminDash');
  if (adminSection) {
    adminSection.classList.add('active');
    updateNavbarVisibility('adminDash');
    renderAdminDashboard();
  }
  window.scrollTo(0, 0);
}

function renderAdminDashboard() {
  const users = loadUsers();
  const allTasks = taskStore;

  const totalMoney = allTasks.filter(t => t.paymentStatus === 'secured' || t.paymentStatus === 'released').reduce((s, t) => s + t.budget, 0);
  const securedCount = allTasks.filter(t => t.paymentStatus === 'secured').length;
  const releasedCount = allTasks.filter(t => t.paymentStatus === 'released').length;
  const pendingCount = allTasks.filter(t => t.paymentStatus === 'pending').length;
  const totalTasks = allTasks.length;
  const totalUsers = users.length;
  const inProgressCount = allTasks.filter(t => t.status === 'assigned' || t.status === 'submitted').length;
  const completedCount = allTasks.filter(t => t.status === 'completed').length;

  setEl('adminTotalMoney', '₹' + totalMoney.toLocaleString('en-IN'));
  setEl('adminSecuredCount', securedCount);
  setEl('adminReleasedCount', releasedCount);
  setEl('adminPendingCount', pendingCount);
  setEl('adminTotalTasks', totalTasks);
  setEl('adminTotalUsers', totalUsers + 1); // +1 for admin
  setEl('adminInProgress', inProgressCount);
  setEl('adminCompleted', completedCount);

  // Render transaction table
  const tbody = document.getElementById('adminTransactionBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  allTasks.forEach(task => {
    const tr = document.createElement('tr');
    const statusClass = task.paymentStatus === 'released' ? 'badge-green' : task.paymentStatus === 'secured' ? 'badge-blue' : 'badge-yellow';
    const taskStatusClass = task.status === 'completed' ? 'badge-green' : task.status === 'submitted' ? 'badge-purple' : task.status === 'assigned' ? 'badge-orange' : 'badge-gray';
    tr.innerHTML = `
      <td><strong>${task.title}</strong></td>
      <td><span class="admin-badge badge-gray">${task.category}</span></td>
      <td>${task.client}</td>
      <td>${task.assignedTo || '<span style="color:var(--text-dim)">—</span>'}</td>
      <td><strong style="color:var(--accent)">${task.budget > 0 ? '₹' + task.budget.toLocaleString('en-IN') : 'Collab'}</strong></td>
      <td><span class="admin-badge ${statusClass}">${task.paymentStatus === 'released' ? '💰 Released' : task.paymentStatus === 'secured' ? '🔒 Secured' : '⏳ Pending'}</span></td>
      <td><span class="admin-badge ${taskStatusClass}">${task.status === 'completed' ? '✅ Done' : task.status === 'submitted' ? '📤 Submitted' : task.status === 'assigned' ? '🔥 Active' : '🟢 Open'}</span></td>
      ${task.status === 'submitted' && task.paymentStatus === 'secured' ? `<td><button class="btn-admin-release" onclick="adminForceRelease(${task.id})">Force Release</button></td>` : '<td>—</td>'}
    `;
    tbody.appendChild(tr);
  });
}

function adminForceRelease(taskId) {
  const task = taskStore.find(t => t.id === taskId);
  if (!task) return;
  task.status = 'completed';
  task.paymentStatus = 'released';
  saveTaskStore();
  renderAdminDashboard();
  showToast('💰 Admin: Payment force-released for "' + task.title + '"');
}

function switchAdminView(view, btn) {
  document.querySelectorAll('#adminSidebar .sidebar-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.querySelectorAll('#adminDash .dash-view').forEach(v => v.classList.remove('active'));
  const viewEl = document.getElementById('aview-' + view);
  if (viewEl) viewEl.classList.add('active');
  if (view === 'overview') renderAdminDashboard();
  if (view === 'transactions') renderAdminTransactions();
  if (view === 'users') renderAdminUsers();
}

function renderAdminTransactions() {
  renderAdminDashboard(); // reuse table render
}

function renderAdminUsers() {
  const users = loadUsers();
  const container = document.getElementById('adminUsersList');
  if (!container) return;
  container.innerHTML = '';
  // Add admin itself
  const allUsers = [{ name: 'Admin', email: 'admin@skillthali.com', role: 'admin' }, ...users];
  allUsers.forEach(u => {
    const row = document.createElement('div');
    row.className = 'admin-user-row';
    const roleClass = u.role === 'admin' ? 'badge-purple' : u.role === 'client' ? 'badge-blue' : 'badge-green';
    row.innerHTML = `
      <div class="admin-user-avatar">${(u.name || 'U').substring(0,2).toUpperCase()}</div>
      <div class="admin-user-info">
        <strong>${u.name}</strong>
        <span>${u.email}</span>
      </div>
      <span class="admin-badge ${roleClass}">${u.role === 'admin' ? '👑 Admin' : u.role === 'client' ? '💼 Client' : '🎓 Student'}</span>
    `;
    container.appendChild(row);
  });
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
    const myTasks = taskStore.filter(t => t.postedByUser && t.client === (currentUser.name || ''));
    const activeCount = myTasks.filter(t => t.status === 'assigned').length;
    const completedCount = myTasks.filter(t => t.status === 'completed').length;
    setEl('clientStatActive', activeCount);
    setEl('clientStatCompleted', completedCount);
  }
}

function setEl(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function logout() {
  // Reset in-memory session only — do NOT clear user-specific localStorage activity
  currentUser = { name: '', email: '', role: '', isNew: false };
  studentActivity = { applied: [], active: [], completed: [], submitted: [] };
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
  if (view === 'submitted') renderStudentSubmittedTasks();
}

// ============ CLIENT VIEWS ============
function switchClientView(view, btn) {
  document.querySelectorAll('#clientSidebar .sidebar-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.querySelectorAll('#clientDash .dash-view').forEach(v => v.classList.remove('active'));
  const viewEl = document.getElementById('cview-' + view);
  if (viewEl) viewEl.classList.add('active');
  if (view === 'posted') renderClientTasks();
  if (view === 'submitted') renderClientSubmittedTasks();
  if (view === 'completed') renderClientCompletedTasks();
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
  else if (role === 'admin') { document.getElementById('adminDash').classList.add('active'); updateNavbarVisibility('adminDash'); renderAdminDashboard(); }
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
  if (task.status === 'submitted') return `<span class="payment-badge submitted-badge">📤 Submitted</span>`;
  if (task.status === 'assigned') return `<span class="payment-badge inprogress">🔥 In Progress</span>`;
  return `<span class="payment-badge available-badge">🟢 Available</span>`;
}
function fmtBudget(b) { return b > 0 ? '₹' + b.toLocaleString('en-IN') : '₹0 (Collab)'; }

// ============ CLIENT: PAY NOW BUTTON ============
function payNowBtn(task) {
  if (task.paymentStatus !== 'pending' || task.budget <= 0) return '';
  return `<button class="btn-pay-now-active" onclick="event.stopPropagation();simulatePayment(${task.id})">💳 Pay Now</button>`;
}

// ============ SIMULATE PAYMENT (CLIENT) ============
function simulatePayment(taskId) {
  const task = taskStore.find(t => t.id === taskId);
  if (!task || task.paymentStatus !== 'pending') return;

  // Show payment simulation modal
  const overlay = document.getElementById('paymentSimModal');
  if (overlay) {
    document.getElementById('paySimTaskTitle').textContent = task.title;
    document.getElementById('paySimAmount').textContent = fmtBudget(task.budget);
    document.getElementById('paySimConfirmBtn').onclick = () => confirmPayment(taskId);
    overlay.classList.remove('hidden');
  }
}

function confirmPayment(taskId) {
  const task = taskStore.find(t => t.id === taskId);
  if (!task) return;
  task.paymentStatus = 'secured';
  if (task.status === 'available') task.status = 'available'; // keep available for students
  saveTaskStore();

  // Show loading animation in modal
  const body = document.getElementById('paySimBody');
  if (body) {
    body.innerHTML = `
      <div class="pay-processing">
        <div class="pay-spinner"></div>
        <p>Processing payment...</p>
      </div>`;
    setTimeout(() => {
      body.innerHTML = `
        <div class="pay-success">
          <div class="pay-success-icon">✅</div>
          <h3>Payment Secured!</h3>
          <p>₹${task.budget.toLocaleString('en-IN')} is now held in escrow. It will be released once the student completes the task.</p>
          <button class="btn-primary" onclick="closePaymentModal()" style="margin-top:16px;width:100%">Done</button>
        </div>`;
    }, 1800);
  }

  setTimeout(() => {
    renderClientTasks();
    updateDynamicUI('client');
    showToast(`🔒 Payment secured for "${task.title}" — ₹${task.budget.toLocaleString('en-IN')} in escrow`);
  }, 2000);
}

function closePaymentModal() {
  const overlay = document.getElementById('paymentSimModal');
  if (overlay) overlay.classList.add('hidden');
  renderClientTasks();
}

// ============ AVAILABLE TASKS ============
function renderAvailableTasks(filter) {
  const container = document.getElementById('availableTasks');
  if (!container) return;
  container.innerHTML = '';

  // USER-SPECIFIC: only show tasks this user has NOT applied for
  const userApplied = studentActivity.applied || [];
  const available = taskStore.filter(t => t.status === 'available' && !userApplied.includes(t.id));
  const tasks = filter === 'all' ? available : available.filter(t => t.category === filter);

  tasks.forEach((task, i) => {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.style.animation = 'fadeUp 0.4s ease both';
    card.style.animationDelay = (i * 0.05) + 's';
    const catEmoji = { codethali: '💻', creatix: '🎨', quickbites: '⚡', teamup: '🤝' }[task.category];
    const catLabel = { codethali: 'CodeThali', creatix: 'Creatix', quickbites: 'QuickBites', teamup: 'TeamUp' }[task.category];
    const paySecured = task.paymentStatus === 'secured';
    card.innerHTML = `
      <div class="task-info">
        <span class="task-cat">${catEmoji} ${catLabel}</span>
        <h4>${task.title}</h4>
        <p>${task.desc.substring(0, 72)}...</p>
      </div>
      <div class="task-meta">
        <span class="budget">${fmtBudget(task.budget)}</span>
        <span class="deadline">⏰ ${task.deadline}</span>
        ${paySecured ? '<span class="payment-badge secured">🔒 Payment Ready</span>' : ''}
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
  // USER-SPECIFIC: only show tasks in this user's active list
  const active = taskStore.filter(t => studentActivity.active.includes(t.id) && t.status === 'assigned');
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
        <button class="btn-upload-work" onclick="openUploadWork(${task.id})">📤 Upload Work</button>
      </div>`;
    container.appendChild(card);
  });
  updateDynamicUI('student');
}

// ============ UPLOAD WORK FLOW ============
function openUploadWork(taskId) {
  const task = taskStore.find(t => t.id === taskId);
  if (!task) return;
  const overlay = document.getElementById('uploadWorkModal');
  if (overlay) {
    document.getElementById('uploadWorkTaskTitle').textContent = task.title;
    document.getElementById('uploadWorkConfirmBtn').onclick = () => confirmUploadWork(taskId);
    document.getElementById('uploadWorkBody').innerHTML = `
      <div class="form-group">
        <label style="color:var(--text-dim);font-size:0.85rem;display:block;margin-bottom:8px">Work Description / Link</label>
        <textarea class="form-input" id="uploadWorkDesc" rows="3" placeholder="Describe your work or paste a link (GitHub, Drive, Figma, etc.)..."></textarea>
      </div>
      <div class="upload-file-zone" onclick="simulateFileClick()">
        <div class="upload-file-icon">📁</div>
        <p>Click to attach file <span style="color:var(--text-dim)">(simulated — no real upload)</span></p>
        <span id="uploadFileName" style="color:var(--accent);font-size:0.82rem;margin-top:4px;display:block"></span>
      </div>
    `;
    overlay.classList.remove('hidden');
  }
}

function simulateFileClick() {
  const names = ['final_work.zip', 'design_v2.fig', 'portfolio.html', 'bugfix_branch.zip', 'logo_pack.zip'];
  const name = names[Math.floor(Math.random() * names.length)];
  setEl('uploadFileName', '✅ ' + name + ' selected');
}

function confirmUploadWork(taskId) {
  const task = taskStore.find(t => t.id === taskId);
  if (!task) return;
  const descEl = document.getElementById('uploadWorkDesc');
  const desc = descEl ? descEl.value.trim() : 'Work submitted';
  task.status = 'submitted';
  task.submittedWork = desc || 'Work submitted by student';
  if (!studentActivity.submitted) studentActivity.submitted = [];
  if (!studentActivity.submitted.includes(taskId)) studentActivity.submitted.push(taskId);
  studentActivity.active = studentActivity.active.filter(id => id !== taskId);
  saveTaskStore();
  // Save activity under this user's specific key
  saveStudentActivity(studentActivity);

  const overlay = document.getElementById('uploadWorkModal');
  if (overlay) overlay.classList.add('hidden');
  renderStudentActiveTasks();
  renderStudentSubmittedTasks();
  updateDynamicUI('student');
  showToast('📤 Work submitted! Waiting for client approval.');
}

function closeUploadWorkModal() {
  const overlay = document.getElementById('uploadWorkModal');
  if (overlay) overlay.classList.add('hidden');
}

// ============ STUDENT SUBMITTED TASKS ============
function renderStudentSubmittedTasks() {
  const container = document.getElementById('studentSubmittedTasks');
  if (!container) return;
  container.innerHTML = '';
  if (!studentActivity.submitted) studentActivity.submitted = [];
  // USER-SPECIFIC: only show tasks in this user's submitted list
  const submitted = taskStore.filter(t => studentActivity.submitted.includes(t.id));
  if (!submitted.length) { container.innerHTML = '<p style="color:var(--text-dim);text-align:center;padding:30px;">No submitted tasks yet. Upload your work when ready! 📤</p>'; return; }
  submitted.forEach(task => {
    const catEmoji = { codethali: '💻', creatix: '🎨', quickbites: '⚡', teamup: '🤝' }[task.category];
    const catLabel = { codethali: 'CodeThali', creatix: 'Creatix', quickbites: 'QuickBites', teamup: 'TeamUp' }[task.category];
    const card = document.createElement('div');
    card.className = 'task-card';
    const isReleased = task.paymentStatus === 'released';
    card.innerHTML = `
      <div class="task-info">
        <span class="task-cat">${catEmoji} ${catLabel}</span>
        <h4>${task.title}</h4>
        <p style="color:${isReleased ? '#7cfc90' : '#ffb347'};font-size:0.83rem">${isReleased ? '✅ Client approved! Payment released.' : '⏳ Waiting for client approval...'}</p>
      </div>
      <div class="task-meta">
        <span class="budget">${fmtBudget(task.budget)}</span>
        ${paymentBadge(task)}
        <span class="payment-badge submitted-badge">📤 Submitted</span>
        ${isReleased ? '<span class="payment-badge completed-tag">💰 Paid!</span>' : ''}
      </div>`;
    container.appendChild(card);
  });
}

// ============ STUDENT COMPLETED TASKS ============
function renderStudentCompletedTasks() {
  const container = document.getElementById('studentCompletedTasks');
  if (!container) return;
  container.innerHTML = '';
  // USER-SPECIFIC: only show tasks in this user's completed list
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

// ============ MARK COMPLETED (LEGACY KEPT) ============
function markCompleted(taskId) {
  const task = taskStore.find(t => t.id === taskId);
  if (!task) return;
  task.status = 'completed';
  task.paymentStatus = 'released';
  studentActivity.active = studentActivity.active.filter(id => id !== taskId);
  if (!studentActivity.completed.includes(taskId)) studentActivity.completed.push(taskId);
  saveTaskStore();
  // Save activity under this user's specific key
  saveStudentActivity(studentActivity);
  renderStudentActiveTasks();
  renderStudentCompletedTasks();
  renderClientTasks();
  updateDynamicUI('student');
  showToast(`✅ "${task.title}" completed! ${task.budget > 0 ? fmtBudget(task.budget) + ' released.' : 'Nice work!'}`);
}

// ============ TASK DETAIL MODAL (STUDENT) ============
function openTaskDetail(task) {
  const catEmoji = { codethali: '💻', creatix: '🎨', quickbites: '⚡', teamup: '🤝' }[task.category];
  const catLabel = { codethali: 'CodeThali', creatix: 'Creatix', quickbites: 'QuickBites', teamup: 'TeamUp' }[task.category];
  // USER-SPECIFIC: check if current user has already applied
  const applied = studentActivity.applied.includes(task.id);
  const paySecured = task.paymentStatus === 'secured';
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
    ${paySecured ? `<div class="pay-secured-notice"><span>🔒</span><span>Payment of ${fmtBudget(task.budget)} is secured in escrow — you'll receive it on completion!</span></div>` : ''}
    <div class="task-desc"><h4>Task Description</h4><p>${task.desc}</p></div>
    <div class="task-desc"><h4>Required Skills</h4><div class="skills-row">${task.skills.map(s=>`<span class="skill-tag">${s}</span>`).join('')}</div></div>
    <div class="detail-btns">
      <button class="btn-secondary" onclick="closeTaskModal()">Close</button>
      ${applied ? `<button class="btn-primary" style="opacity:0.6;cursor:not-allowed;pointer-events:none">✅ Applied</button>` : `<button class="btn-primary" onclick="applyForTask(${task.id})">Apply Now →</button>`}
    </div>`;
  document.getElementById('taskModal').classList.remove('hidden');
}

function closeTaskModal() { document.getElementById('taskModal').classList.add('hidden'); }

// ============ APPLY = ASSIGN + TRACK (USER-SPECIFIC) ============
function applyForTask(taskId) {
  const task = taskStore.find(t => t.id === taskId);
  if (!task || task.status !== 'available') return;
  task.status = 'assigned';
  if (task.paymentStatus !== 'secured') task.paymentStatus = 'pending';
  task.assignedTo = currentUser.name || 'Student';
  // USER-SPECIFIC: record in this user's own activity
  if (!studentActivity.applied.includes(taskId)) studentActivity.applied.push(taskId);
  if (!studentActivity.active.includes(taskId)) studentActivity.active.push(taskId);
  saveTaskStore();
  // Save activity under this user's specific key
  saveStudentActivity(studentActivity);
  closeTaskModal();
  renderAvailableTasks('all');
  renderClientTasks();
  updateDynamicUI('student');
  showToast(`✅ Applied for "${task.title}"! ${task.paymentStatus === 'secured' ? 'Payment 🔒 is secured.' : 'Waiting for client payment.'}`);
}

// ============ CLIENT TASKS ============
function renderClientTasks() {
  const container = document.getElementById('clientPostedTasks');
  if (!container) return;
  container.innerHTML = '';
  const myTasks = taskStore.filter(t => !t.postedByUser || t.client === (currentUser.name || ''));
  if (!myTasks.length) { container.innerHTML = '<p style="color:var(--text-dim);text-align:center;padding:30px;">No tasks posted yet.</p>'; return; }
  myTasks.filter(t => t.status === 'available' || t.status === 'assigned').forEach(task => {
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
        <div class="task-action-row">
          ${task.paymentStatus === 'pending' && task.budget > 0 ? `<button class="btn-pay-now-active" onclick="event.stopPropagation();simulatePayment(${task.id})">💳 Pay Now</button>` : ''}
          <button class="btn-delete-task" onclick="deleteTask(event,${task.id})">🗑️</button>
        </div>
      </div>`;
    card.onclick = () => openClientTaskDetail(task);
    container.appendChild(card);
  });
  if (!myTasks.filter(t => t.status === 'available' || t.status === 'assigned').length) {
    container.innerHTML = '<p style="color:var(--text-dim);text-align:center;padding:30px;">No active tasks. Post a new task!</p>';
  }
  updateDynamicUI('client');
}

// ============ CLIENT SUBMITTED TASKS ============
function renderClientSubmittedTasks() {
  const container = document.getElementById('clientSubmittedTasksList');
  if (!container) return;
  container.innerHTML = '';
  const submitted = taskStore.filter(t => t.status === 'submitted');
  if (!submitted.length) { container.innerHTML = '<p style="color:var(--text-dim);text-align:center;padding:30px;">No tasks submitted for review yet. Students will submit work here.</p>'; return; }
  submitted.forEach(task => {
    const catEmoji = { codethali: '💻', creatix: '🎨', quickbites: '⚡', teamup: '🤝' }[task.category];
    const catLabel = { codethali: 'CodeThali', creatix: 'Creatix', quickbites: 'QuickBites', teamup: 'TeamUp' }[task.category];
    const card = document.createElement('div');
    card.className = 'task-card submitted-review-card';
    card.innerHTML = `
      <div class="task-info">
        <span class="task-cat">${catEmoji} ${catLabel}</span>
        <h4>${task.title}</h4>
        <p style="color:var(--text-dim);font-size:0.83rem">Submitted by: <strong style="color:var(--white)">${task.assignedTo || 'Student'}</strong></p>
        ${task.submittedWork ? `<p style="font-size:0.8rem;color:var(--accent);margin-top:4px">📎 "${task.submittedWork.substring(0,60)}${task.submittedWork.length > 60 ? '...' : ''}"</p>` : ''}
      </div>
      <div class="task-meta">
        <span class="budget">${fmtBudget(task.budget)}</span>
        <span class="payment-badge submitted-badge">📤 Review Pending</span>
        ${paymentBadge(task)}
        <button class="btn-approve-release" onclick="approveAndRelease(${task.id})">✅ Approve & Release Payment</button>
      </div>`;
    container.appendChild(card);
  });
}

// ============ CLIENT COMPLETED TASKS ============
function renderClientCompletedTasks() {
  const container = document.getElementById('clientCompletedTasksList');
  if (!container) return;
  container.innerHTML = '';
  const completed = taskStore.filter(t => t.status === 'completed');
  if (!completed.length) { container.innerHTML = '<p style="color:var(--text-dim);text-align:center;padding:30px;">No completed tasks yet.</p>'; return; }
  completed.forEach(task => {
    const catEmoji = { codethali: '💻', creatix: '🎨', quickbites: '⚡', teamup: '🤝' }[task.category];
    const catLabel = { codethali: 'CodeThali', creatix: 'Creatix', quickbites: 'QuickBites', teamup: 'TeamUp' }[task.category];
    const card = document.createElement('div');
    card.className = 'task-card';
    card.innerHTML = `
      <div class="task-info">
        <span class="task-cat">${catEmoji} ${catLabel}</span>
        <h4>${task.title}</h4>
        <p>Completed by: <strong style="color:var(--accent)">${task.assignedTo || 'Student'}</strong></p>
      </div>
      <div class="task-meta">
        <span class="budget">${fmtBudget(task.budget)}</span>
        <span class="payment-badge completed-tag">✅ Completed</span>
        <span class="payment-badge completed-tag">💰 Paid</span>
        <span style="font-size:0.78rem;color:#7cfc90">⭐ Great work!</span>
      </div>`;
    container.appendChild(card);
  });
}

// ============ APPROVE & RELEASE PAYMENT ============
function approveAndRelease(taskId) {
  const task = taskStore.find(t => t.id === taskId);
  if (!task) return;
  task.status = 'completed';
  task.paymentStatus = 'released';

  // Update student activity — find student's activity by assignedTo email if possible
  // Since task.assignedTo holds name, we update the activity for any user whose active/submitted list has this task
  const allUsers = loadUsers();
  allUsers.forEach(u => {
    const key = getActivityKey(u.email);
    try {
      const data = localStorage.getItem(key);
      if (data) {
        const act = JSON.parse(data);
        if (act.submitted && act.submitted.includes(taskId)) {
          if (!act.completed) act.completed = [];
          if (!act.completed.includes(taskId)) act.completed.push(taskId);
          act.submitted = act.submitted.filter(id => id !== taskId);
          localStorage.setItem(key, JSON.stringify(act));
        }
      }
    } catch(e) {}
  });
  // Also update current in-memory studentActivity if this user submitted it
  if (studentActivity.submitted && studentActivity.submitted.includes(taskId)) {
    if (!studentActivity.completed) studentActivity.completed = [];
    if (!studentActivity.completed.includes(taskId)) studentActivity.completed.push(taskId);
    studentActivity.submitted = studentActivity.submitted.filter(id => id !== taskId);
    saveStudentActivity(studentActivity);
  }

  saveTaskStore();
  renderClientSubmittedTasks();
  renderClientCompletedTasks();
  renderAdminDashboard();
  showToast(`💰 Payment released for "${task.title}"! ${fmtBudget(task.budget)} sent to ${task.assignedTo || 'student'}.`);
}

function deleteTask(e, id) {
  e.stopPropagation();
  taskStore = taskStore.filter(t => t.id !== id);
  studentActivity.applied = studentActivity.applied.filter(i => i !== id);
  studentActivity.active = studentActivity.active.filter(i => i !== id);
  saveTaskStore();
  renderClientTasks();
  renderAvailableTasks('all');
  showToast('🗑️ Task deleted successfully.');
}

function openPostTask() { document.getElementById('postTaskModal').classList.remove('hidden'); }
function closePostTask() { document.getElementById('postTaskModal').classList.add('hidden'); }

// ============ CLIENT TASK DETAIL MODAL ============
function openClientTaskDetail(task) {
  const catEmoji = { codethali: '💻', creatix: '🎨', quickbites: '⚡', teamup: '🤝' }[task.category];
  const catLabel = { codethali: 'CodeThali', creatix: 'Creatix', quickbites: 'QuickBites', teamup: 'TeamUp' }[task.category];
  const payLabel = task.paymentStatus === 'released' ? '💰 Released' : task.paymentStatus === 'secured' ? '🔒 Secured' : '⏳ Pending';
  const statusLabel = task.status === 'completed' ? '✅ Completed' : task.status === 'submitted' ? '📤 Submitted' : task.status === 'assigned' ? '🔥 In Progress' : '🟢 Available';
  document.getElementById('clientTaskDetailContent').innerHTML = `
    <span class="task-cat" style="margin-bottom:12px;display:inline-block">${catEmoji} ${catLabel}</span>
    <h2 class="ctd-title">${task.title}</h2>
    <div class="ctd-meta">
      <div class="ctd-meta-item"><span>Budget</span><strong>${fmtBudget(task.budget)}</strong></div>
      <div class="ctd-meta-item"><span>Deadline</span><strong>⏰ ${task.deadline}</strong></div>
      <div class="ctd-meta-item"><span>Status</span><strong>${statusLabel}</strong></div>
      <div class="ctd-meta-item"><span>Payment</span><strong>${payLabel}</strong></div>
      ${task.assignedTo ? `<div class="ctd-meta-item"><span>Assigned To</span><strong>🎓 ${task.assignedTo}</strong></div>` : ''}
    </div>
    <div class="ctd-desc-block">
      <h4>Description</h4>
      <p>${task.desc}</p>
    </div>
    ${task.skills && task.skills.length ? `<div class="ctd-desc-block"><h4>Required Skills</h4><div class="skills-row">${task.skills.map(s=>`<span class="skill-tag">${s}</span>`).join('')}</div></div>` : ''}
    ${task.submittedWork ? `<div class="ctd-desc-block"><h4>📤 Submitted Work</h4><p style="color:var(--accent)">${task.submittedWork}</p></div>` : ''}
    ${task.paymentStatus === 'pending' && task.budget > 0 ? `
      <div class="pay-pending-block">
        <span>💳 Payment not yet processed for this task</span>
        <button class="btn-pay-now-active" onclick="closeClientTaskModal();simulatePayment(${task.id})">💳 Pay Now</button>
      </div>` : ''}
    ${task.status === 'submitted' ? `<div style="margin-top:16px"><button class="btn-approve-release" onclick="approveAndRelease(${task.id});closeClientTaskModal()">✅ Approve & Release Payment</button></div>` : ''}
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
    clientEmail: currentUser.email || '',
    location: 'Pune, MH', rating: '4.8', projects: 1,
    deadline: '7 days', status: 'available', paymentStatus: 'pending', assignedTo: null,
    submittedWork: null, postedByUser: true
  });

  saveTaskStore();
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
  if (saved && saved.name) {
    currentUser = saved;
    // Load THIS user's specific activity on page restore
    studentActivity = loadStudentActivity();
    if (currentUser.role === 'admin') {
      goToAdminDash();
      return;
    }
  }
  // Load persisted tasks
  const savedTasks = loadTaskStore();
  if (savedTasks && savedTasks.length) taskStore = savedTasks;

  document.getElementById('home').classList.add('active');
  updateNavbarVisibility('home');
  renderAvailableTasks('all');
});
