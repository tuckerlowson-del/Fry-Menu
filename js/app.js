// Fry Menu — Role powers, chat, debts, notifications
// Owner credentials are secret (Ford / 2580)

const ROLES = [
    { id: 'owner', name: 'Owner', description: 'Full control of everything.', color: 'owner', locked: true },
    { id: 'administration', name: 'Administration', description: 'Moderate members & pending requests.', color: 'administration' },
    { id: 'og', name: 'OG', description: 'Respected long-time member with special status.', color: 'og' },
    { id: 'mathematician', name: 'Mathematician', description: 'Analytics, totals and number crunching.', color: 'mathematician' },
    { id: 'loan-shark', name: 'Loan Shark', description: 'Tracks who owes money and who has paid.', color: 'loan-shark' },
    { id: 'dept-owners', name: 'Dept Owners', description: 'Heads of departments.', color: 'dept-owners' },
    { id: 'member', name: 'Member', description: 'Standard member access.', color: 'member' },
    { id: 'pending', name: 'Pending to get accepted', description: 'Waiting for approval.', color: 'pending' },
    { id: 'declined', name: 'Declined', description: 'Application declined.', color: 'declined' }
];

const OWNER_NAME = 'Ford';
const OWNER_PASS = '2580';

const DEFAULT_MEMBERS = [{
    id: 1, name: 'Ford', username: 'ford', password: OWNER_PASS,
    role: 'owner', fridayTakeout: 0, budget: 0,
    joined: '2024-01-01', email: 'owner@frymenu.com'
}];

let SHARED_MODE = false; // true when server.py is running (everyone shares data)

function loadMembers() {
    try {
        const s = localStorage.getItem('fm_members_v3');
        return s ? JSON.parse(s) : [...DEFAULT_MEMBERS];
    } catch { return [...DEFAULT_MEMBERS]; }
}
function saveMembers(list) {
    localStorage.setItem('fm_members_v3', JSON.stringify(list));
    try { localStorage.setItem('fm_members_backup', JSON.stringify(list)); } catch (e) {}
    pushSharedData();
}

async function detectSharedServer() {
    try {
        const r = await fetch('/api/health', { cache: 'no-store' });
        if (!r.ok) return false;
        const j = await r.json();
        SHARED_MODE = !!(j && j.shared);
        return SHARED_MODE;
    } catch {
        SHARED_MODE = false;
        return false;
    }
}

async function pullSharedData() {
    try {
        const r = await fetch('/api/data', { cache: 'no-store' });
        if (!r.ok) return false;
        const data = await r.json();
        if (data.members) {
            members = data.members;
            localStorage.setItem('fm_members_v3', JSON.stringify(members));
        }
        if (data.debts) {
            debts = data.debts;
            localStorage.setItem('fm_debts_v1', JSON.stringify(debts));
        }
        if (data.chat) {
            chatMessages = data.chat;
            localStorage.setItem('fm_chat_v1', JSON.stringify(chatMessages));
        }
        if (data.orders) {
            localStorage.setItem('fm_orders_v1', JSON.stringify(data.orders));
        }
        if (data.warnings) {
            localStorage.setItem('fm_warnings_v1', JSON.stringify(data.warnings));
        }
        if (data.rules && data.rules.length) {
            localStorage.setItem('fm_rules_v1', JSON.stringify(data.rules));
        }
        if (data.settings) {
            localStorage.setItem('fm_settings_v1', JSON.stringify(data.settings));
        }
        if (data.announcements) {
            localStorage.setItem('fm_announcements_v1', JSON.stringify(data.announcements));
        }
        SHARED_MODE = true;
        return true;
    } catch {
        return false;
    }
}

let _pushTimer = null;
function pushSharedData() {
    if (!SHARED_MODE) return;
    clearTimeout(_pushTimer);
    _pushTimer = setTimeout(async () => {
        try {
            await fetch('/api/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    members,
                    debts,
                    chat: chatMessages,
                    orders: loadOrders(),
                    warnings: loadWarnings(),
                    rules: loadRules(),
                    settings: loadAppSettings(),
                    announcements: JSON.parse(localStorage.getItem('fm_announcements_v1') || '[]')
                })
            });
        } catch (e) {}
    }, 300);
}

function backupAllData() {
    try {
        const pack = {
            members, debts, chat: chatMessages, orders: loadOrders(),
            settings: loadAppSettings(), warnings: loadWarnings(), rules: loadRules(),
            savedAt: new Date().toISOString()
        };
        localStorage.setItem('fm_full_backup_v1', JSON.stringify(pack));
        localStorage.setItem('fm_last_save', new Date().toISOString());
    } catch (e) {}
    pushSharedData();
}

function restoreFromBackup() {
    try {
        const raw = localStorage.getItem('fm_full_backup_v1');
        if (!raw) { notify('No backup', 'Nothing saved yet', 'info'); return; }
        const pack = JSON.parse(raw);
        if (pack.members) { members = pack.members; saveMembers(members); }
        if (pack.debts) { debts = pack.debts; saveDebts(debts); }
        if (pack.chat) { chatMessages = pack.chat; saveChat(chatMessages); }
        if (pack.orders) saveOrders(pack.orders);
        if (pack.settings) saveAppSettings(pack.settings);
        if (pack.warnings) saveWarnings(pack.warnings);
        if (pack.rules) saveRules(pack.rules);
        notify('Restored', 'Data loaded from local backup', 'success');
        renderPage(currentPage || 'settings');
    } catch (e) {
        notify('Restore failed', String(e.message || e), 'danger');
    }
}

function loadDebts() {
    try {
        const s = localStorage.getItem('fm_debts_v1');
        return s ? JSON.parse(s) : [];
    } catch { return []; }
}
function saveDebts(list) {
    localStorage.setItem('fm_debts_v1', JSON.stringify(list));
    try { localStorage.setItem('fm_last_save', new Date().toISOString()); } catch (e) {}
    pushSharedData();
}

function loadChat() {
    try {
        const s = localStorage.getItem('fm_chat_v1');
        return s ? JSON.parse(s) : [];
    } catch { return []; }
}
function saveChat(list) {
    localStorage.setItem('fm_chat_v1', JSON.stringify(list));
    try { localStorage.setItem('fm_last_save', new Date().toISOString()); } catch (e) {}
    pushSharedData();
}

function loadSession() {
    try {
        const s = localStorage.getItem('fm_session_v3');
        return s ? JSON.parse(s) : null;
    } catch { return null; }
}
function saveSession(u) { localStorage.setItem('fm_session_v3', JSON.stringify(u)); }
function clearSession() { localStorage.removeItem('fm_session_v3'); }

let members = loadMembers();
let debts = loadDebts();
let chatMessages = loadChat();
let currentUser = null;
let currentPage = 'dashboard';
let authMode = 'create';

const splash = document.getElementById('splash');
const loginScreen = document.getElementById('login-screen');
const appEl = document.getElementById('app');
const content = document.getElementById('content');
const pageTitle = document.getElementById('page-title');
const mainNav = document.getElementById('main-nav');
const notifContainer = document.getElementById('notif-container');
const modalOverlay = document.getElementById('modal-overlay');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalFooter = document.getElementById('modal-footer');

function getRole(id) { return ROLES.find(r => r.id === id) || { name: id, color: 'member' }; }
function roleBadge(id) {
    const r = getRole(id);
    return `<span class="role-badge role-${r.color}">${r.name}</span>`;
}
function formatDate(d) {
    return new Date(d).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' });
}
function formatRand(n) { return 'R ' + Number(n || 0).toLocaleString('en-ZA'); }
function timeNow() {
    return new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
}

function notify(title, body = '', type = 'info') {
    const container = document.getElementById('notif-container') || notifContainer;
    if (!container) return;

    // Max 3 visible at once
    while (container.children.length >= 3) {
        container.firstChild.remove();
    }

    const el = document.createElement('div');
    el.className = `notif ${type}`;
    el.innerHTML = `
        <button class="notif-close" type="button" aria-label="Close">×</button>
        <div class="notif-title">${title}</div>
        ${body ? `<div class="notif-body">${body}</div>` : ''}
        <div class="notif-bar"></div>
    `;
    container.appendChild(el);

    const remove = () => {
        if (!el.parentNode) return;
        el.classList.add('leaving');
        setTimeout(() => el.remove(), 280);
    };

    el.querySelector('.notif-close').addEventListener('click', (e) => {
        e.stopPropagation();
        remove();
    });
    el.addEventListener('click', remove);

    setTimeout(remove, 5000);
}

function getNavForRole(role) {
    const all = [
        { page: 'dashboard', icon: '📊', label: 'Dashboard' },
        { page: 'chat', icon: '💬', label: 'General Chat' },
        { page: 'dm', icon: '✉️', label: 'Direct Messages' },
        { page: 'members', icon: '👥', label: 'Members' },
        { page: 'roles', icon: '🎭', label: 'Roles' },
        { page: 'rules', icon: '📜', label: 'Rules' },
        { page: 'pending', icon: '⏳', label: 'Pending' },
        { page: 'assign', icon: '➕', label: 'Assign Role' },
        { page: 'debts', icon: '💰', label: 'Debts / Loans' },
        { page: 'math', icon: '🧮', label: 'Analytics' },
        { page: 'shop', icon: '🛒', label: 'Fry Shop' },
        { page: 'settings', icon: '⚙️', label: 'Settings' },
        { page: 'profile', icon: '👤', label: 'My Profile' }
    ];
    // Owner: everything
    if (role === 'owner') return all;
    // Administration: moderate only — NOT assign roles, NOT full settings power, NOT owner tools
    if (role === 'administration') {
        return all.filter(i => ['dashboard','chat','dm','members','roles','rules','pending','shop','profile'].includes(i.page));
    }
    if (role === 'loan-shark') {
        return all.filter(i => ['dashboard','chat','dm','debts','shop','rules','profile','members'].includes(i.page));
    }
    if (role === 'mathematician') {
        return all.filter(i => ['dashboard','chat','dm','math','rules','profile','members'].includes(i.page));
    }
    if (role === 'og') {
        return all.filter(i => ['dashboard','chat','dm','shop','rules','profile','members','roles'].includes(i.page));
    }
    if (role === 'dept-owners') {
        return all.filter(i => ['dashboard','chat','dm','members','shop','rules','profile'].includes(i.page));
    }
    if (role === 'member') {
        return all.filter(i => ['dashboard','chat','dm','debts','shop','rules','profile'].includes(i.page));
    }
    // Pending / Declined: ONLY dashboard + general chat
    return all.filter(i => ['dashboard','chat'].includes(i.page));
}

function canManagePending() {
    return currentUser && (currentUser.role === 'owner' || currentUser.role === 'administration');
}
function canAssignRoles() {
    return currentUser && currentUser.role === 'owner';
}
function canManageDebts() {
    return currentUser && (currentUser.role === 'owner' || currentUser.role === 'loan-shark');
}
function isOnCooldown() {
    const until = Number(localStorage.getItem('fm_cooldown_until') || 0);
    return Date.now() < until;
}
function getCooldownLeftMs() {
    return Math.max(0, Number(localStorage.getItem('fm_cooldown_until') || 0) - Date.now());
}
function setCooldown(hours) {
    localStorage.setItem('fm_cooldown_until', String(Date.now() + hours * 3600 * 1000));
    localStorage.setItem('fm_device_blocked', '1');
}
function deviceBlockedFromSignup() {
    return localStorage.getItem('fm_device_blocked') === '1' && isOnCooldown();
}

function buildNav() {
    const items = getNavForRole(currentUser.role);
    mainNav.innerHTML = items.map(i => `
        <a href="#" class="nav-item ${i.page === currentPage ? 'active' : ''}" data-page="${i.page}">
            <span class="nav-icon">${i.icon}</span>
            <span>${i.label}</span>
        </a>
    `).join('');
    mainNav.querySelectorAll('.nav-item').forEach(el => {
        el.addEventListener('click', e => {
            e.preventDefault();
            renderPage(el.dataset.page);
            document.getElementById('sidebar').classList.remove('open');
        });
    });
}

function updateUserCard() {
    if (!currentUser) return;
    document.getElementById('user-name').textContent = currentUser.name;
    document.getElementById('user-role').textContent = getRole(currentUser.role).name;
    document.getElementById('user-avatar').textContent = currentUser.name.charAt(0).toUpperCase();
    document.getElementById('sidebar-role-tag').textContent = getRole(currentUser.role).name;
}

function startSplash() {
    const statusEl = document.getElementById('splash-status');
    const barEl = document.getElementById('splash-progress-bar');
    const percentEl = document.getElementById('splash-percent');
    const fakeLoads = [
        'Loaded engine modules…',
        'Loaded Fry Menu core…',
        'Loaded member database…',
        'Loaded chat services…',
        'Loaded loan shark protocols…',
        'Loaded role permissions…',
        'Loaded Friday countdown…',
        'Loaded shop inventory…',
        'Loaded security layer…',
        'Loaded notification system…',
        'Loaded media handlers…',
        'Loaded Ford sponsorship pack…',
        'Loaded analytics engine…',
        'Checking network…',
        'Almost ready…',
        'Finalizing…'
    ];
    let i = 0;
    const showStatus = () => {
        if (!statusEl) return;
        statusEl.textContent = fakeLoads[i % fakeLoads.length];
        i++;
    };
    showStatus();
    const statusTimer = setInterval(showStatus, 550);

    // Slower load: usually ~18–22s, sometimes ~25s, max ~30s
    const roll = Math.random();
    let loadMs;
    if (roll < 0.55) {
        loadMs = 18000 + Math.floor(Math.random() * 4000); // 18–22s
    } else if (roll < 0.85) {
        loadMs = 24000 + Math.floor(Math.random() * 2000); // 24–26s
    } else {
        loadMs = 28000 + Math.floor(Math.random() * 2001); // 28–30s
    }

    const start = Date.now();
    const progressTimer = setInterval(() => {
        const t = Math.min(1, (Date.now() - start) / loadMs);
        // ease-out curve so it feels alive
        const eased = 1 - Math.pow(1 - t, 2.2);
        const pct = Math.min(100, Math.floor(eased * 100));
        if (barEl) barEl.style.width = pct + '%';
        if (percentEl) percentEl.textContent = pct + '%';
    }, 50);

    setTimeout(() => {
        clearInterval(statusTimer);
        clearInterval(progressTimer);
        if (barEl) barEl.style.width = '100%';
        if (percentEl) percentEl.textContent = '100%';
        if (statusEl) statusEl.textContent = 'Ready.';
        splash.classList.add('fade-out');
        setTimeout(async () => {
            splash.classList.add('hidden');
            await detectSharedServer();
            await refreshSharedOrLocal();
            // Always land on Login / Create for every new open (no silent auto-login)
            currentUser = null;
            // Keep session only for "Continue as…" chip — do not enter app automatically
            loginScreen.classList.remove('hidden');
            appEl.classList.add('hidden');
            renderContinueChip();
            initMusicPlayer();
            if (SHARED_MODE) {
                setTimeout(() => notify('Shared mode', 'Everyone on this link shares the same members', 'info'), 400);
            }
        }, 1000);
    }, loadMs);
}

function renderContinueChip() {
    const session = loadSession();
    let chip = document.getElementById('continue-chip');
    if (!session) {
        if (chip) chip.remove();
        return;
    }
    // Validate session still exists and not banned
    const fresh = members.find(m => m.id === session.id);
    if (!fresh || fresh.banned) {
        clearSession();
        if (chip) chip.remove();
        return;
    }
    if (!chip) {
        chip = document.createElement('div');
        chip.id = 'continue-chip';
        chip.className = 'continue-chip';
        const card = document.querySelector('.login-card');
        if (card) card.insertBefore(chip, card.firstChild);
    }
    chip.innerHTML = `
        <p class="text-sm" style="margin-bottom:8px;">Welcome back, <strong>${escapeHtml(fresh.name)}</strong></p>
        <button type="button" class="btn btn-primary btn-full" id="btn-continue-session">Continue as ${escapeHtml(fresh.name)}</button>
        <button type="button" class="btn btn-secondary btn-full" id="btn-switch-account" style="margin-top:8px;">Use another account</button>
    `;
    document.getElementById('btn-continue-session').onclick = () => {
        currentUser = fresh;
        saveSession(currentUser);
        showApp();
        notify('Welcome back', fresh.name, 'success');
    };
    document.getElementById('btn-switch-account').onclick = () => {
        clearSession();
        chip.remove();
        setAuthMode('login');
    };
}

/* ========== BACKGROUND MUSIC (Spotify embeds — legal streaming) ========== */
const FRY_PLAYLIST = [
    { title: 'Billie Jean', artist: 'Michael Jackson', id: '5ChkMS8OtdzJeqyybCc9R5' },
    { title: 'Beat It', artist: 'Michael Jackson', id: '0ObFg0ZQ3QgZ1AbJKtZZy9' },
    { title: 'Smooth Criminal', artist: 'Michael Jackson', id: '1snPhmev6V3gV2iVgwdyag' },
    { title: 'Tokyo Drift', artist: 'Teriyaki Boyz', id: '4OhjjiTuEFz3noSiI3ijtI' },
    { title: 'You Make My Dreams', artist: 'Hall & Oates', id: '45Lsx3nQ6nxxrQQIfGM4mA' },
    { title: 'Hot Together', artist: 'The Pointer Sisters', id: '1o3Ra0t5JaFMh3y5hqg0iC' },
    // Inner Light — no clear match; owner can paste Spotify link later
    { title: 'Inner Light', artist: 'Add Spotify link', id: null }
];
let musicIndex = 0;
let musicOpen = false;

function initMusicPlayer() {
    if (document.getElementById('music-player')) return;
    const el = document.createElement('div');
    el.id = 'music-player';
    el.className = 'music-player';
    el.innerHTML = `
        <button type="button" class="music-toggle" id="music-toggle" title="Music">🎵</button>
        <div class="music-panel hidden" id="music-panel">
            <div class="music-head">
                <strong>Fry Menu Radio</strong>
                <button type="button" class="music-close" id="music-close">×</button>
            </div>
            <p class="text-sm text-muted" style="margin-bottom:8px;">Tap play on Spotify. Browsers block silent autoplay.</p>
            <div class="music-track-title" id="music-track-title"></div>
            <div id="music-embed"></div>
            <div class="music-controls">
                <button type="button" class="btn btn-secondary btn-sm" id="music-prev">⏮</button>
                <button type="button" class="btn btn-primary btn-sm" id="music-next">Next ⏭</button>
            </div>
            <div class="music-list" id="music-list"></div>
            <p class="text-sm text-muted" style="margin-top:8px;">Missing <em>Inner Light</em>? Send the Spotify link and we can add it.</p>
        </div>
    `;
    document.body.appendChild(el);
    document.getElementById('music-toggle').onclick = () => {
        musicOpen = !musicOpen;
        document.getElementById('music-panel').classList.toggle('hidden', !musicOpen);
        if (musicOpen) renderMusicTrack();
    };
    document.getElementById('music-close').onclick = () => {
        musicOpen = false;
        document.getElementById('music-panel').classList.add('hidden');
    };
    document.getElementById('music-prev').onclick = () => {
        musicIndex = (musicIndex - 1 + FRY_PLAYLIST.length) % FRY_PLAYLIST.length;
        renderMusicTrack();
    };
    document.getElementById('music-next').onclick = () => {
        musicIndex = (musicIndex + 1) % FRY_PLAYLIST.length;
        renderMusicTrack();
    };
    renderMusicList();
}

function renderMusicList() {
    const list = document.getElementById('music-list');
    if (!list) return;
    list.innerHTML = FRY_PLAYLIST.map((t, i) => `
        <button type="button" class="music-list-item ${i === musicIndex ? 'active' : ''}" data-i="${i}">
            ${i + 1}. ${escapeHtml(t.title)} <span class="text-muted">— ${escapeHtml(t.artist)}</span>
        </button>
    `).join('');
    list.querySelectorAll('.music-list-item').forEach(btn => {
        btn.onclick = () => {
            musicIndex = parseInt(btn.getAttribute('data-i'), 10);
            renderMusicTrack();
        };
    });
}

function renderMusicTrack() {
    const t = FRY_PLAYLIST[musicIndex];
    const titleEl = document.getElementById('music-track-title');
    const embed = document.getElementById('music-embed');
    if (!t || !embed) return;
    if (titleEl) titleEl.textContent = t.title + ' — ' + t.artist;
    if (!t.id) {
        embed.innerHTML = `<p class="text-sm text-muted">No Spotify link for this track yet. Paste a link in Settings later or send it to the owner.</p>`;
    } else {
        embed.innerHTML = `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/${t.id}?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
    }
    renderMusicList();
}

function refreshFromStorage() {
    members = loadMembers();
    debts = loadDebts();
    chatMessages = loadChat();
    if (!members.some(m => m.role === 'owner')) {
        members.unshift({ ...DEFAULT_MEMBERS[0] });
        localStorage.setItem('fm_members_v3', JSON.stringify(members));
    }
}

async function refreshSharedOrLocal() {
    const ok = await pullSharedData();
    if (!ok) refreshFromStorage();
    else {
        if (!members.some(m => m.role === 'owner')) {
            members.unshift({ ...DEFAULT_MEMBERS[0] });
            saveMembers(members);
        }
    }
    return ok;
}

const createForm = document.getElementById('create-form');
const loginForm = document.getElementById('login-form');
const authSubtitle = document.getElementById('auth-subtitle');
const authHint = document.getElementById('auth-hint');
const authToggleBtn = document.getElementById('auth-toggle-btn');

function setAuthMode(mode) {
    authMode = mode;
    if (mode === 'create') {
        createForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        authSubtitle.textContent = 'Create your account';
        authHint.textContent = 'Already have an account? Click Login below.';
        authToggleBtn.textContent = 'Login';
    } else {
        createForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        authSubtitle.textContent = 'Login to your account';
        authHint.textContent = 'New here? Click Create Account below.';
        authToggleBtn.textContent = 'Create Account';
    }
}

authToggleBtn.addEventListener('click', () => {
    setAuthMode(authMode === 'create' ? 'login' : 'create');
});

function makeJoinCode(user) {
    try {
        return btoa(unescape(encodeURIComponent(JSON.stringify({
            name: user.name,
            username: user.username,
            password: user.password,
            fridayTakeout: user.fridayTakeout,
            budget: user.budget,
            joined: user.joined,
            role: 'pending'
        }))));
    } catch {
        return '';
    }
}

function parseJoinCode(code) {
    try {
        return JSON.parse(decodeURIComponent(escape(atob(code.trim()))));
    } catch {
        try {
            return JSON.parse(atob(code.trim()));
        } catch {
            return null;
        }
    }
}

createForm.addEventListener('submit', async e => {
    e.preventDefault();
    if (deviceBlockedFromSignup() || isOnCooldown()) {
        const left = Math.ceil(getCooldownLeftMs() / 60000);
        notify('Cooldown', `This phone is timed out. Wait ~${left} min before creating an account.`, 'danger');
        return;
    }
    await refreshSharedOrLocal();
    const name = document.getElementById('c-name').value.trim();
    const password = document.getElementById('c-password').value;
    const friday = Number(document.getElementById('c-friday').value) || 0;
    const budget = Number(document.getElementById('c-budget').value) || 0;

    if (!name || !password) {
        notify('Error', 'Name and password required', 'danger');
        return;
    }
    if (name.toLowerCase() === OWNER_NAME.toLowerCase()) {
        notify('Error', 'That name is reserved', 'danger');
        return;
    }
    if (members.some(m => m.name.toLowerCase() === name.toLowerCase())) {
        notify('Error', 'Name already taken — try Login instead', 'danger');
        return;
    }

    const newUser = {
        id: Math.max(...members.map(m => m.id), 0) + 1,
        name,
        username: name.toLowerCase().replace(/\s+/g, ''),
        password,
        role: 'pending',
        fridayTakeout: friday,
        budget,
        joined: new Date().toISOString().slice(0, 10),
        email: ''
    };
    members.push(newUser);
    saveMembers(members);
    backupAllData();
    currentUser = newUser;
    saveSession(currentUser);
    showApp();
    notify('Account created', 'You are Pending — Owner can accept you in Pending tab', 'info');
});

loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    await refreshSharedOrLocal();
    const name = document.getElementById('l-name').value.trim();
    const password = document.getElementById('l-password').value;

    if (name.toLowerCase() === OWNER_NAME.toLowerCase() && password === OWNER_PASS) {
        let owner = members.find(m => m.role === 'owner');
        if (!owner) {
            owner = { ...DEFAULT_MEMBERS[0] };
            members = [owner, ...members.filter(m => m.role !== 'owner')];
            saveMembers(members);
        }
        currentUser = owner;
        saveSession(currentUser);
        showApp();
        notify('Welcome back', 'Logged in as Owner', 'success');
        return;
    }

    const user = members.find(m => m.name.toLowerCase() === name.toLowerCase());
    if (!user) {
        notify('Not found', 'No account with that name', 'danger');
        return;
    }
    if (user.password !== password) {
        notify('Wrong password', 'Try again', 'danger');
        return;
    }
    if (user.banned) {
        notify('Banned', user.banReason ? 'Reason: ' + user.banReason : 'You are banned from Fry Menu', 'danger');
        return;
    }
    currentUser = user;
    saveSession(currentUser);
    showApp();
    notify('Welcome back', `Logged in as ${user.name}`, 'success');
});

function showApp() {
    loginScreen.classList.add('hidden');
    appEl.classList.remove('hidden');
    updateUserCard();
    buildNav();
    renderPage('dashboard');
    initMusicPlayer();
}

function logout() {
    clearSession();
    currentUser = null;
    appEl.classList.add('hidden');
    loginScreen.classList.remove('hidden');
    setAuthMode('login');
    createForm.reset();
    loginForm.reset();
    renderContinueChip();
    initMusicPlayer();
}
document.getElementById('logout-btn').addEventListener('click', logout);

async function renderPage(page) {
    await refreshSharedOrLocal();
    if (currentUser) {
        const fresh = members.find(m => m.id === currentUser.id);
        if (fresh) currentUser = fresh;
    }
    currentPage = page;
    const titles = {
        dashboard: 'Dashboard', chat: 'General Chat', members: 'Members',
        roles: 'Roles', rules: 'Rules', pending: 'Pending', assign: 'Assign Role',
        debts: 'Debts / Loans', math: 'Analytics', shop: 'Fry Shop',
        dm: 'Direct Messages', settings: 'Settings', profile: 'My Profile'
    };
    pageTitle.textContent = titles[page] || 'Fry Menu';
    buildNav();

    if (window._fridayTimer) {
        clearInterval(window._fridayTimer);
        window._fridayTimer = null;
    }

    switch (page) {
        case 'dashboard': renderDashboard(); break;
        case 'chat': renderChat(); break;
        case 'dm': renderDM(); break;
        case 'members': renderMembers(); break;
        case 'roles': renderRoles(); break;
        case 'rules': renderRules(); break;
        case 'pending': renderPending(); break;
        case 'assign': renderAssign(); break;
        case 'debts': renderDebts(); break;
        case 'math': renderMath(); break;
        case 'shop': renderShop(); break;
        case 'settings': renderSettings(); break;
        case 'profile': renderProfile(); break;
        default: renderDashboard();
    }
}

function getNextFriday() {
    // Accurate next Friday 17:00 local time. If today is Friday and before 17:00 → today 17:00.
    // If Friday after 17:00 → next week's Friday 17:00.
    const now = new Date();
    const target = new Date(now);
    const day = now.getDay(); // 0 Sun … 5 Fri … 6 Sat
    let daysUntil = (5 - day + 7) % 7;
    target.setDate(now.getDate() + daysUntil);
    target.setHours(17, 0, 0, 0);
    if (target.getTime() <= now.getTime()) {
        target.setDate(target.getDate() + 7);
        target.setHours(17, 0, 0, 0);
    }
    return target;
}

function getNextMonday() {
    // Accurate next Monday 09:00 — loan payback deadline
    const now = new Date();
    const target = new Date(now);
    const day = now.getDay();
    let daysUntil = (1 - day + 7) % 7; // 1 = Monday
    target.setDate(now.getDate() + daysUntil);
    target.setHours(9, 0, 0, 0);
    if (target.getTime() <= now.getTime()) {
        target.setDate(target.getDate() + 7);
        target.setHours(9, 0, 0, 0);
    }
    return target;
}

function formatCountdown(targetDate) {
    const now = new Date();
    let diff = targetDate - now;
    if (diff < 0) diff = 0;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { d, h, m, s, diff };
}

function calcLoanInterest(debt) {
    // R2 interest starts after payback deadline (Monday 09:00 of week after loan accepted)
    if (!debt || debt.status !== 'owed' || !debt.dueAt) return 0;
    const due = new Date(debt.dueAt).getTime();
    const now = Date.now();
    if (now <= due) return 0;
    const daysLate = Math.floor((now - due) / 86400000) + 1;
    return daysLate * 2;
}

function totalOwedAmount(debt) {
    return Number(debt.amount || 0) + calcLoanInterest(debt) + Number(debt.interestAccrued || 0);
}

function checkMonthTimeout(debt) {
    // If not paid and a new calendar month after due → 2 hour timeout
    if (!debt || debt.status !== 'owed' || !debt.dueAt) return;
    const due = new Date(debt.dueAt);
    const now = new Date();
    if (now <= due) return;
    if (now.getFullYear() > due.getFullYear() || (now.getFullYear() === due.getFullYear() && now.getMonth() > due.getMonth())) {
        if (debt.borrowerId === currentUser.id) {
            setCooldown(2);
            notify('Timeout', 'Unpaid loan crossed into a new month — 2 hour cooldown', 'danger');
        }
    }
}

function startFridayCountdown() {
    const el = document.getElementById('friday-countdown');
    if (!el) return;
    function tick() {
        const { d, h, m, s } = formatCountdown(getNextFriday());
        el.innerHTML = `
            <div class="cd-unit"><span class="cd-num">${d}</span><span class="cd-label">Days</span></div>
            <div class="cd-unit"><span class="cd-num">${String(h).padStart(2,'0')}</span><span class="cd-label">Hrs</span></div>
            <div class="cd-unit"><span class="cd-num">${String(m).padStart(2,'0')}</span><span class="cd-label">Min</span></div>
            <div class="cd-unit"><span class="cd-num">${String(s).padStart(2,'0')}</span><span class="cd-label">Sec</span></div>
        `;
    }
    tick();
    window._fridayTimer = setInterval(tick, 1000);
}

function renderDashboard() {
    const role = currentUser.role;
    const total = members.length;
    const pending = members.filter(m => m.role === 'pending').length;
    const active = members.filter(m => !['pending','declined'].includes(m.role)).length;
    const myOwed = debts.filter(d => d.borrowerId === currentUser.id && d.status === 'owed')
        .reduce((s, d) => s + Number(d.amount), 0);
    const chatCount = chatMessages.length;

    let statusBanner = '';
    if (role === 'pending') {
        statusBanner = `
            <div class="banner banner-warn mb-4">
                <div class="banner-icon">⏳</div>
                <div>
                    <strong>Pending approval</strong>
                    <p>You can explore chat, members & roles. Full features unlock when accepted.</p>
                </div>
            </div>`;
    } else if (role === 'declined') {
        statusBanner = `
            <div class="banner banner-danger mb-4">
                <div class="banner-icon">🚫</div>
                <div>
                    <strong>Application declined</strong>
                    <p>You can still browse. Ask the Owner to re-accept you.</p>
                </div>
            </div>`;
    }

    // Quick action buttons based on role
    let quickActions = `
        <button class="qa-btn" onclick="renderPage('chat')">💬 Chat</button>
        <button class="qa-btn" onclick="renderPage('members')">👥 Members</button>
        <button class="qa-btn" onclick="renderPage('shop')">🛒 Shop</button>
    `;
    if (!['pending','declined'].includes(role)) {
        quickActions += `<button class="qa-btn" onclick="renderPage('debts')">💰 Loans</button>`;
    }
    if (canManagePending()) {
        quickActions += `<button class="qa-btn" onclick="renderPage('pending')">⏳ Pending (${pending})</button>`;
    }
    if (canAssignRoles()) {
        quickActions += `<button class="qa-btn" onclick="renderPage('assign')">🎭 Assign</button>`;
    }
    if (role === 'mathematician' || role === 'owner') {
        quickActions += `<button class="qa-btn" onclick="renderPage('math')">🧮 Analytics</button>`;
    }
    if (role === 'loan-shark' || role === 'owner') {
        quickActions += `<button class="qa-btn" onclick="openAddDebt()">📝 Record loan</button>`;
    }
    if (!['pending','declined'].includes(role)) {
        quickActions += `<button class="qa-btn accent" onclick="openBorrowLoan()">🤝 Borrow</button>`;
    }

    // Role-specific panel
    let rolePanel = '';
    if (role === 'owner' || role === 'administration') {
        rolePanel = `
            <div class="card mb-4">
                <h3 class="card-title">🛡️ Admin toolkit</h3>
                <div class="action-grid">
                    <button class="action-tile" onclick="renderPage('pending')"><span>⏳</span>Review pending</button>
                    <button class="action-tile" onclick="renderPage('members')"><span>👥</span>Manage members</button>
                    ${role === 'owner' ? `<button class="action-tile" onclick="renderPage('assign')"><span>🎭</span>Assign roles</button>` : ''}
                    <button class="action-tile" onclick="renderPage('debts')"><span>💰</span>All loans</button>
                    <button class="action-tile" onclick="renderPage('math')"><span>📊</span>Stats</button>
                    <button class="action-tile" onclick="notify('Broadcast','System is online','success')"><span>📢</span>Ping system</button>
                </div>
            </div>`;
    } else if (role === 'loan-shark') {
        const owedList = debts.filter(d => d.status === 'owed');
        const totalOwed = owedList.reduce((s, d) => s + Number(d.amount), 0);
        rolePanel = `
            <div class="card mb-4">
                <h3 class="card-title">🦈 Loan Shark desk</h3>
                <div class="profile-stat"><span class="profile-label">Money out there</span><span class="profile-value">${formatRand(totalOwed)}</span></div>
                <div class="profile-stat"><span class="profile-label">Active loans</span><span class="profile-value">${owedList.length}</span></div>
                <div class="action-grid" style="margin-top:12px;">
                    <button class="action-tile" onclick="renderPage('debts')"><span>📋</span>Loan book</button>
                    <button class="action-tile" onclick="openAddDebt()"><span>➕</span>New loan</button>
                    <button class="action-tile" onclick="notify('Collection','Check who still owes you','info')"><span>🔔</span>Remind</button>
                </div>
            </div>`;
    } else if (role === 'mathematician') {
        const sumF = members.reduce((s, m) => s + Number(m.fridayTakeout || 0), 0);
        const sumB = members.reduce((s, m) => s + Number(m.budget || 0), 0);
        rolePanel = `
            <div class="card mb-4">
                <h3 class="card-title">🧮 Number crunch</h3>
                <div class="profile-stat"><span class="profile-label">All Friday take-outs</span><span class="profile-value">${formatRand(sumF)}</span></div>
                <div class="profile-stat"><span class="profile-label">All budgets</span><span class="profile-value">${formatRand(sumB)}</span></div>
                <div class="action-grid" style="margin-top:12px;">
                    <button class="action-tile" onclick="renderPage('math')"><span>📈</span>Full analytics</button>
                    <button class="action-tile" onclick="renderPage('members')"><span>🔢</span>Member numbers</button>
                </div>
            </div>`;
    } else if (role === 'og') {
        rolePanel = `
            <div class="card mb-4">
                <h3 class="card-title">⭐ OG lounge</h3>
                <p class="text-sm text-muted mb-4">Respected status. You help set the culture.</p>
                <div class="action-grid">
                    <button class="action-tile" onclick="renderPage('chat')"><span>💬</span>Lead chat</button>
                    <button class="action-tile" onclick="renderPage('shop')"><span>🛒</span>Fry Shop</button>
                    <button class="action-tile" onclick="notify('OG flex','Stay legendary','success')"><span>🔥</span>Flex</button>
                </div>
            </div>`;
    } else if (role === 'dept-owners') {
        rolePanel = `
            <div class="card mb-4">
                <h3 class="card-title">🏢 Department HQ</h3>
                <div class="action-grid">
                    <button class="action-tile" onclick="renderPage('members')"><span>👥</span>Your people</button>
                    <button class="action-tile" onclick="renderPage('chat')"><span>📢</span>Announce</button>
                    <button class="action-tile" onclick="renderPage('shop')"><span>🛒</span>Order supplies</button>
                </div>
            </div>`;
    } else if (role === 'member') {
        rolePanel = `
            <div class="card mb-4">
                <h3 class="card-title">🍟 Member hub</h3>
                <div class="action-grid">
                    <button class="action-tile" onclick="renderPage('chat')"><span>💬</span>Chat</button>
                    <button class="action-tile" onclick="openBorrowLoan()"><span>🤝</span>Borrow</button>
                    <button class="action-tile" onclick="renderPage('shop')"><span>🛒</span>Shop</button>
                    <button class="action-tile" onclick="renderPage('profile')"><span>👤</span>Profile</button>
                </div>
            </div>`;
    } else {
        rolePanel = `
            <div class="card mb-4">
                <h3 class="card-title">👀 Explore while you wait</h3>
                <div class="action-grid">
                    <button class="action-tile" onclick="renderPage('chat')"><span>💬</span>Read chat</button>
                    <button class="action-tile" onclick="renderPage('members')"><span>👥</span>See members</button>
                    <button class="action-tile" onclick="renderPage('roles')"><span>🎭</span>View roles</button>
                </div>
            </div>`;
    }

    // Recent chat preview
    const recentChat = chatMessages.slice(-3).reverse();
    const chatPreview = recentChat.length ? recentChat.map(m => `
        <div class="activity-row">
            <span class="activity-dot"></span>
            <div><strong>${escapeHtml(m.name)}</strong>: ${escapeHtml(m.text.slice(0, 60))}${m.text.length > 60 ? '…' : ''}
            <div class="text-muted text-sm">${m.time}</div></div>
        </div>
    `).join('') : `<p class="text-muted text-sm">No messages yet — be the first!</p>`;

    content.innerHTML = `
        ${statusBanner}

        <div class="countdown-card mb-4">
            <div class="countdown-label">⏰ Next Friday take-out</div>
            <div class="countdown-row" id="friday-countdown">
                <div class="cd-unit"><span class="cd-num">-</span><span class="cd-label">Days</span></div>
                <div class="cd-unit"><span class="cd-num">-</span><span class="cd-label">Hrs</span></div>
                <div class="cd-unit"><span class="cd-num">-</span><span class="cd-label">Min</span></div>
                <div class="cd-unit"><span class="cd-num">-</span><span class="cd-label">Sec</span></div>
            </div>
            <div class="countdown-sub">Your Friday amount: <strong>${formatRand(currentUser.fridayTakeout)}</strong> · Friday 17:00</div>
        </div>

        ${(() => {
            let anns = [];
            try { anns = JSON.parse(localStorage.getItem('fm_announcements_v1') || '[]'); } catch (e) {}
            if (!anns.length) return '';
            return `<div class="card mb-4"><h3 class="card-title">📢 Announcements</h3>${anns.slice().reverse().slice(0, 5).map(a => `
                <div class="activity-row"><span class="activity-dot"></span><div><strong>${escapeHtml(a.by || 'System')}</strong>: ${escapeHtml(a.text)}<div class="text-muted text-sm">${a.time || ''}</div></div></div>
            `).join('')}</div>`;
        })()}

        <div class="grid grid-4 mb-4">
            <div class="card stat-card">
                <div class="stat-icon">👥</div>
                <div class="stat-label">Members</div>
                <div class="stat-value">${total}</div>
            </div>
            <div class="card stat-card">
                <div class="stat-icon">✅</div>
                <div class="stat-label">Active</div>
                <div class="stat-value">${active}</div>
            </div>
            <div class="card stat-card">
                <div class="stat-icon">💬</div>
                <div class="stat-label">Messages</div>
                <div class="stat-value">${chatCount}</div>
            </div>
            <div class="card stat-card">
                <div class="stat-icon">💸</div>
                <div class="stat-label">You owe</div>
                <div class="stat-value" style="font-size:1.2rem;">${formatRand(myOwed)}</div>
            </div>
        </div>

        <div class="card mb-4">
            <h3 class="card-title">⚡ Quick actions</h3>
            <div class="qa-row">${quickActions}</div>
        </div>

        ${rolePanel}

        <div class="card mb-4">
            <h3 class="card-title">💰 Your wallet</h3>
            <div class="profile-stat"><span class="profile-label">Friday take-out</span><span class="profile-value">${formatRand(currentUser.fridayTakeout)}</span></div>
            <div class="profile-stat"><span class="profile-label">Budget</span><span class="profile-value">${formatRand(currentUser.budget)}</span></div>
            <div class="profile-stat"><span class="profile-label">Still owing</span><span class="profile-value" style="color:var(--danger);">${formatRand(myOwed)}</span></div>
            <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;">
                <button class="btn btn-secondary btn-sm" onclick="openEditMoney()">✏️ Edit amounts</button>
                ${!['pending','declined'].includes(role) ? `<button class="btn btn-primary btn-sm" onclick="openBorrowLoan()">Borrow money</button>` : ''}
            </div>
        </div>

        <div class="card mb-4">
            <div class="flex items-center justify-between mb-4">
                <h3 class="card-title" style="margin:0;">💬 Live chat pulse</h3>
                <button class="btn btn-secondary btn-sm" onclick="renderPage('chat')">Open</button>
            </div>
            ${chatPreview}
        </div>

        <div class="card">
            <h3 class="card-title">🎭 You are ${getRole(role).name}</h3>
            <p class="text-sm text-muted">${getRole(role).description}</p>
        </div>
    `;

    startFridayCountdown();
}

function openEditMoney() {
    modalTitle.textContent = 'Update your money';
    modalBody.innerHTML = `
        <div class="form-group">
            <label>Friday take-out (R)</label>
            <input type="number" class="form-control" id="edit-friday" value="${currentUser.fridayTakeout || 0}" min="0" step="50">
        </div>
        <div class="form-group">
            <label>Budget (R)</label>
            <input type="number" class="form-control" id="edit-budget" value="${currentUser.budget || 0}" min="0" step="100">
        </div>
    `;
    modalFooter.innerHTML = `
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="saveEditMoney()">Save</button>
    `;
    openModal();
}

function saveEditMoney() {
    const friday = Number(document.getElementById('edit-friday').value) || 0;
    const budget = Number(document.getElementById('edit-budget').value) || 0;
    currentUser.fridayTakeout = friday;
    currentUser.budget = budget;
    const m = members.find(x => x.id === currentUser.id);
    if (m) {
        m.fridayTakeout = friday;
        m.budget = budget;
        saveMembers(members);
    }
    saveSession(currentUser);
    closeModal();
    renderPage('dashboard');
    notify('Updated', 'Money amounts saved', 'success');
}

function renderChat() {
    const canSend = currentUser.role !== 'declined';
    const settings = loadAppSettings();
    const chatAllowed = settings.chatOpen !== false;

    content.innerHTML = `
        ${currentUser.role === 'pending' ? `<div class="banner banner-warn mb-4"><div class="banner-icon">⏳</div><div><strong>Pending</strong><p>You can chat while waiting for approval.</p></div></div>` : ''}
        ${currentUser.role === 'declined' ? `<div class="banner banner-danger mb-4"><div class="banner-icon">🚫</div><div><strong>Read-only</strong><p>Declined accounts can view chat only.</p></div></div>` : ''}
        ${!chatAllowed ? `<div class="banner banner-danger mb-4"><div class="banner-icon">🔒</div><div><strong>Chat closed</strong><p>Admin turned off chat sending.</p></div></div>` : ''}
        <div class="chat-wrap">
            <div class="chat-messages" id="chat-messages"></div>
            ${canSend && chatAllowed ? `
            <div class="chat-toolbar">
                <label class="chat-tool-btn" title="Photo">
                    📷
                    <input type="file" id="chat-image" accept="image/*" hidden>
                </label>
                <label class="chat-tool-btn" title="Video">
                    🎬
                    <input type="file" id="chat-video" accept="video/*" hidden>
                </label>
                <button type="button" class="chat-tool-btn" id="chat-voice-btn" title="Voice message">🎤</button>
                <span class="chat-voice-status" id="chat-voice-status"></span>
            </div>
            <div class="chat-input-row">
                <input type="text" id="chat-input" placeholder="Type a message..." maxlength="500">
                <button class="btn btn-primary btn-sm" id="chat-send">Send</button>
            </div>` : ''}
        </div>
    `;

    const box = document.getElementById('chat-messages');

    function mediaHtml(m) {
        if (m.type === 'image' && m.data) {
            return `<img class="chat-media" src="${m.data}" alt="photo" loading="lazy">`;
        }
        if (m.type === 'video' && m.data) {
            return `<video class="chat-media" src="${m.data}" controls playsinline></video>`;
        }
        if (m.type === 'audio' && m.data) {
            return `<audio class="chat-audio" src="${m.data}" controls></audio>`;
        }
        return `<div>${escapeHtml(m.text || '')}</div>`;
    }

    function generalMsgs() {
        return chatMessages.filter(m => !m.channel || m.channel === 'general');
    }

    function drawMessages() {
        box.innerHTML = generalMsgs().map(m => `
            <div class="chat-msg ${m.userId === currentUser.id ? 'mine' : 'other'}">
                <div class="chat-meta">
                    ${escapeHtml(m.name)} · ${m.time}${m.type && m.type !== 'text' ? ' · ' + m.type : ''}
                    ${m.userId === currentUser.id ? ` · <button type="button" class="msg-del" data-id="${m.id}">Delete</button>` : ''}
                </div>
                ${mediaHtml(m)}
            </div>
        `).join('') || `<div class="text-muted text-sm" style="text-align:center;padding:20px;">No messages yet. Say hello!</div>`;
        box.scrollTop = box.scrollHeight;
        box.querySelectorAll('.msg-del').forEach(btn => {
            btn.addEventListener('click', () => deleteChatMessage(btn.getAttribute('data-id')));
        });
    }
    drawMessages();

    function pushMsg(payload) {
        chatMessages.push({
            id: Date.now() + Math.random(),
            userId: currentUser.id,
            name: currentUser.name,
            time: timeNow(),
            type: 'text',
            text: '',
            channel: 'general',
            ...payload
        });
        if (chatMessages.length > 120) chatMessages = chatMessages.slice(-120);
        saveChat(chatMessages);
        drawMessages();
    }

    function send() {
        if (isMemberMuted(currentUser) || isMemberBanned(currentUser)) {
            notify('Muted / banned', 'You cannot send messages', 'danger');
            return;
        }
        if (isMemberTimedOut(currentUser)) {
            notify('Timeout', 'You are timed out', 'danger');
            return;
        }
        const input = document.getElementById('chat-input');
        const text = input.value.trim();
        if (!text) return;
        pushMsg({ type: 'text', text, channel: 'general' });
        input.value = '';
    }

    function fileToDataUrl(file, maxBytes, cb) {
        if (file.size > maxBytes) {
            notify('File too big', `Max ${Math.round(maxBytes / 1024 / 1024)}MB`, 'danger');
            return;
        }
        const reader = new FileReader();
        reader.onload = () => cb(reader.result);
        reader.onerror = () => notify('Failed', 'Could not read file', 'danger');
        reader.readAsDataURL(file);
    }

    if (canSend && chatAllowed) {
        document.getElementById('chat-send').addEventListener('click', send);
        document.getElementById('chat-input').addEventListener('keydown', e => {
            if (e.key === 'Enter') send();
        });

        document.getElementById('chat-image').addEventListener('change', e => {
            const file = e.target.files && e.target.files[0];
            if (!file) return;
            fileToDataUrl(file, 8 * 1024 * 1024, data => {
                pushMsg({ type: 'image', text: '[Photo]', data });
                notify('Photo sent', '', 'success');
            });
            e.target.value = '';
        });

        document.getElementById('chat-video').addEventListener('change', e => {
            const file = e.target.files && e.target.files[0];
            if (!file) return;
            // Bigger videos allowed (~25MB) — still limited by browser storage
            fileToDataUrl(file, 25 * 1024 * 1024, data => {
                pushMsg({ type: 'video', text: '[Video]', data });
                notify('Video sent', 'Large videos may load slowly', 'success');
            });
            e.target.value = '';
        });

        // Voice recording
        let mediaRecorder = null;
        let chunks = [];
        let recording = false;
        const voiceBtn = document.getElementById('chat-voice-btn');
        const voiceStatus = document.getElementById('chat-voice-status');

        voiceBtn.addEventListener('click', async () => {
            if (recording && mediaRecorder) {
                mediaRecorder.stop();
                recording = false;
                voiceBtn.classList.remove('recording');
                voiceStatus.textContent = '';
                return;
            }
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                chunks = [];
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.ondataavailable = ev => { if (ev.data.size) chunks.push(ev.data); };
                mediaRecorder.onstop = () => {
                    stream.getTracks().forEach(t => t.stop());
                    const blob = new Blob(chunks, { type: mediaRecorder.mimeType || 'audio/webm' });
                    if (blob.size > 1.5 * 1024 * 1024) {
                        notify('Voice too long', 'Try a shorter message', 'danger');
                        return;
                    }
                    const reader = new FileReader();
                    reader.onload = () => {
                        pushMsg({ type: 'audio', text: '[Voice]', data: reader.result });
                        notify('Voice sent', '', 'success');
                    };
                    reader.readAsDataURL(blob);
                };
                mediaRecorder.start();
                recording = true;
                voiceBtn.classList.add('recording');
                voiceStatus.textContent = 'Recording… tap mic to stop';
            } catch (err) {
                notify('Mic blocked', 'Allow microphone permission', 'danger');
            }
        });
    }
}

function escapeHtml(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function deleteChatMessage(id) {
    const sid = String(id);
    const msg = chatMessages.find(m => String(m.id) === sid);
    if (!msg || msg.userId !== currentUser.id) {
        notify('No', 'You can only delete your own messages', 'danger');
        return;
    }
    chatMessages = chatMessages.filter(m => String(m.id) !== sid);
    saveChat(chatMessages);
    notify('Deleted', 'Message removed', 'info');
    if (currentPage === 'chat') renderChat();
    if (currentPage === 'dm') renderDM();
}

function dmChannel(a, b) {
    const x = Math.min(a, b), y = Math.max(a, b);
    return 'dm:' + x + '-' + y;
}

function renderDM() {
    if (['pending', 'declined'].includes(currentUser.role)) {
        content.innerHTML = `<div class="empty-state card"><div class="icon">🔒</div><p>DMs unlock after approval.</p></div>`;
        return;
    }
    const others = members.filter(m => m.id !== currentUser.id && !['declined'].includes(m.role));
    const selected = window._dmWith || null;
    const peer = selected ? members.find(m => m.id === selected) : null;
    const channel = peer ? dmChannel(currentUser.id, peer.id) : null;
    const msgs = channel ? chatMessages.filter(m => m.channel === channel) : [];

    content.innerHTML = `
        <div class="card mb-4">
            <h3 class="card-title">✉️ Direct message</h3>
            <div class="form-group">
                <label>Talk to</label>
                <select class="form-control" id="dm-peer">
                    <option value="">— Choose person —</option>
                    ${others.map(m => `<option value="${m.id}" ${selected === m.id ? 'selected' : ''}>${m.name} (${getRole(m.role).name})</option>`).join('')}
                </select>
            </div>
            <button class="btn btn-primary btn-sm" onclick="startDM()">Open chat</button>
        </div>
        ${peer ? `
        <div class="chat-wrap">
            <div class="chat-messages" id="dm-messages"></div>
            <div class="chat-input-row">
                <input type="text" id="dm-input" placeholder="Message ${escapeHtml(peer.name)}…" maxlength="500">
                <button class="btn btn-primary btn-sm" id="dm-send">Send</button>
            </div>
        </div>` : `<div class="empty-state card"><div class="icon">✉️</div><p>Pick someone to talk privately.</p></div>`}
    `;

    if (peer) {
        const box = document.getElementById('dm-messages');
        function draw() {
            box.innerHTML = msgs.map(m => `
                <div class="chat-msg ${m.userId === currentUser.id ? 'mine' : 'other'}">
                    <div class="chat-meta">${escapeHtml(m.name)} · ${m.time}
                        ${m.userId === currentUser.id ? ` · <button type="button" class="msg-del" data-id="${m.id}">Delete</button>` : ''}
                    </div>
                    <div>${escapeHtml(m.text || '')}</div>
                </div>
            `).join('') || `<div class="text-muted text-sm" style="text-align:center;padding:16px;">No messages yet.</div>`;
            box.scrollTop = box.scrollHeight;
            box.querySelectorAll('.msg-del').forEach(btn => {
                btn.addEventListener('click', () => deleteChatMessage(btn.getAttribute('data-id')));
            });
        }
        draw();
        function send() {
            const input = document.getElementById('dm-input');
            const text = input.value.trim();
            if (!text) return;
            chatMessages.push({
                id: Date.now() + Math.random(),
                userId: currentUser.id,
                name: currentUser.name,
                text,
                type: 'text',
                channel,
                time: timeNow()
            });
            saveChat(chatMessages);
            input.value = '';
            renderDM();
        }
        document.getElementById('dm-send').addEventListener('click', send);
        document.getElementById('dm-input').addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
    }
}

function startDM() {
    const id = parseInt(document.getElementById('dm-peer').value);
    if (!id) { notify('Pick someone', '', 'danger'); return; }
    window._dmWith = id;
    renderDM();
}

const DEFAULT_RULES = [
    'Be respectful — no insults or harassment.',
    'No spam in General Chat.',
    'Pay back loans on time when you borrow.',
    'Do not share other people\'s private info.',
    'Follow Owner and Administration decisions.',
    'No fake roles or pretending to be Owner.',
    'Keep Fry Shop orders honest (demo).',
    'Voice, photos and videos must stay appropriate.'
];

function loadRules() {
    try {
        const s = localStorage.getItem('fm_rules_v1');
        return s ? JSON.parse(s) : [...DEFAULT_RULES];
    } catch { return [...DEFAULT_RULES]; }
}
function saveRules(list) { localStorage.setItem('fm_rules_v1', JSON.stringify(list)); }

function loadWarnings() {
    try {
        const s = localStorage.getItem('fm_warnings_v1');
        return s ? JSON.parse(s) : [];
    } catch { return []; }
}
function saveWarnings(list) { localStorage.setItem('fm_warnings_v1', JSON.stringify(list)); }

function getWarningCount(userId) {
    return loadWarnings().filter(w => w.userId === userId).length;
}

function renderRules() {
    const rules = loadRules();
    const warnings = loadWarnings();
    const myWarnings = warnings.filter(w => w.userId === currentUser.id);
    const canWarn = currentUser.role === 'owner' || currentUser.role === 'administration';

    content.innerHTML = `
        <div class="card mb-4">
            <h3 class="card-title">📜 Fry Menu Rules</h3>
            <ol class="rules-list">
                ${rules.map((r, i) => `<li><span class="rule-num">${i + 1}.</span> ${escapeHtml(r)}</li>`).join('')}
            </ol>
            <p class="text-sm text-muted" style="margin-top:12px;">Breaking rules can get you a warning from Owner or Administration.</p>
        </div>

        <div class="card mb-4">
            <h3 class="card-title">⚠️ Your warnings (${myWarnings.length})</h3>
            ${myWarnings.length === 0 ? `<p class="text-sm text-muted">Clean record — no warnings.</p>` :
                myWarnings.slice().reverse().map(w => `
                    <div class="warning-card">
                        <div class="text-sm"><strong>${escapeHtml(w.rule || 'Rule broken')}</strong></div>
                        <div class="text-sm text-muted">${escapeHtml(w.note || '')}</div>
                        <div class="text-sm text-muted">By ${escapeHtml(w.by)} · ${w.time}</div>
                    </div>
                `).join('')
            }
        </div>

        ${canWarn ? `
        <div class="card mb-4">
            <h3 class="card-title">🚨 Issue a warning</h3>
            <div class="form-group">
                <label>Member</label>
                <select class="form-control" id="warn-member">
                    ${members.filter(m => m.role !== 'owner').map(m => `
                        <option value="${m.id}">${m.name} (${getRole(m.role).name}) — ${getWarningCount(m.id)} warning(s)</option>
                    `).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>Which rule did they break?</label>
                <select class="form-control" id="warn-rule">
                    ${rules.map((r, i) => `<option value="${escapeHtml(r)}">${i + 1}. ${escapeHtml(r)}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>Extra note (optional)</label>
                <input type="text" class="form-control" id="warn-note" placeholder="Details…">
            </div>
            <button class="btn btn-danger btn-full" onclick="issueWarning()">Send warning</button>
        </div>

        <div class="card mb-4">
            <h3 class="card-title">Recent warnings</h3>
            ${warnings.length === 0 ? `<p class="text-sm text-muted">None yet.</p>` :
                warnings.slice().reverse().slice(0, 15).map(w => {
                    const u = members.find(m => m.id === w.userId);
                    return `<div class="warning-card">
                        <div><strong>${u ? escapeHtml(u.name) : 'Unknown'}</strong> — ${escapeHtml(w.rule || '')}</div>
                        <div class="text-sm text-muted">${escapeHtml(w.note || '')} · by ${escapeHtml(w.by)} · ${w.time}</div>
                    </div>`;
                }).join('')
            }
        </div>
        ` : ''}
    `;

    // Show popup if they have unread-style latest warning
    if (myWarnings.length) {
        const latest = myWarnings[myWarnings.length - 1];
        if (latest && !latest.seen) {
            notify('Warning received', latest.rule || 'You broke a rule', 'danger');
            latest.seen = true;
            saveWarnings(warnings);
        }
    }
}

function issueWarning() {
    if (!(currentUser.role === 'owner' || currentUser.role === 'administration')) return;
    const userId = parseInt(document.getElementById('warn-member').value);
    const rule = document.getElementById('warn-rule').value;
    const note = document.getElementById('warn-note').value.trim();
    if (!userId || !rule) {
        notify('Missing info', 'Select member and rule', 'danger');
        return;
    }
    const warnings = loadWarnings();
    warnings.push({
        id: Date.now(),
        userId,
        rule,
        note,
        by: currentUser.name,
        time: timeNow() + ' · ' + formatDate(new Date().toISOString().slice(0, 10)),
        seen: false
    });
    saveWarnings(warnings);
    const target = members.find(m => m.id === userId);
    notify('Warning sent', target ? target.name + ' was warned' : 'Done', 'success');

    // Also post to chat as system-style note (text only)
    chatMessages.push({
        id: Date.now(),
        userId: 0,
        name: 'System',
        text: `⚠️ Warning issued to ${target ? target.name : 'a member'}: ${rule}`,
        type: 'text',
        time: timeNow()
    });
    saveChat(chatMessages);
    renderPage('rules');
}

function canModerate() {
    return currentUser && (currentUser.role === 'owner' || currentUser.role === 'administration');
}
function isMemberBanned(m) { return !!(m && m.banned); }
function isMemberMuted(m) {
    if (!m) return false;
    if (m.mutedForever) return true;
    const until = Number(m.mutedUntil || 0);
    return until > Date.now();
}
function isMemberTimedOut(m) {
    if (!m) return false;
    const until = Number(m.timeoutUntil || 0);
    return until > Date.now();
}
function modStatusLabel(m) {
    const bits = [];
    if (isMemberBanned(m)) bits.push('BANNED');
    if (isMemberMuted(m)) bits.push('MUTED');
    if (isMemberTimedOut(m)) bits.push('TIMEOUT');
    return bits.length ? bits.join(' · ') : '';
}

function renderMembers() {
    const mod = canModerate();
    const isOwner = currentUser.role === 'owner';
    content.innerHTML = `
        <div class="flex items-center justify-between mb-4" style="flex-wrap:wrap;gap:10px;">
            <p class="text-muted text-sm">All members (${members.length})</p>
            <div class="flex gap-2" style="flex-wrap:wrap;">
                ${mod ? `<button class="btn btn-primary btn-sm" onclick="openAddMember()">+ Add</button>` : ''}
                <button class="btn btn-secondary btn-sm" onclick="renderPage('members')">🔄 Refresh</button>
            </div>
        </div>
        <div class="card mb-4">
            <p class="text-sm text-muted">Owner / Admin can <strong>Mute</strong>, <strong>Timeout</strong>, <strong>Ban</strong>, change roles, or remove people.</p>
        </div>
        <div class="table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Friday</th>
                        <th>Status</th>
                        ${mod ? '<th>Actions</th>' : ''}
                    </tr>
                </thead>
                <tbody>
                    ${members.map(m => {
                        const st = modStatusLabel(m);
                        return `
                        <tr>
                            <td>
                                <div style="font-weight:500;">${escapeHtml(m.name)}</div>
                                <div class="text-sm text-muted">${formatDate(m.joined)} · ${formatRand(m.budget)}</div>
                            </td>
                            <td>${roleBadge(m.role)}</td>
                            <td>${formatRand(m.fridayTakeout)}</td>
                            <td class="text-sm">${st ? `<span style="color:var(--danger);font-weight:600;">${st}</span>` : '<span class="text-muted">OK</span>'}</td>
                            ${mod ? `
                                <td>
                                    ${m.role !== 'owner' ? `
                                        <div class="flex gap-2" style="flex-wrap:wrap;">
                                            ${isOwner ? `<button class="btn btn-secondary btn-sm" onclick="openAssignRole(${m.id})">Role</button>` : ''}
                                            <button class="btn btn-secondary btn-sm" onclick="muteMember(${m.id})">${isMemberMuted(m) ? 'Unmute' : 'Mute'}</button>
                                            <button class="btn btn-secondary btn-sm" onclick="timeoutMember(${m.id})">Timeout</button>
                                            <button class="btn btn-danger btn-sm" onclick="banMember(${m.id})">${isMemberBanned(m) ? 'Unban' : 'Ban'}</button>
                                            ${isOwner ? `<button class="btn btn-danger btn-sm" onclick="removeMember(${m.id})">×</button>` : ''}
                                        </div>
                                    ` : '<span class="text-sm text-muted">Owner</span>'}
                                </td>
                            ` : ''}
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function muteMember(id) {
    if (!canModerate()) return;
    const m = members.find(x => x.id === id);
    if (!m || m.role === 'owner') return;
    if (isMemberMuted(m)) {
        m.mutedUntil = 0;
        m.mutedForever = false;
        saveMembers(members);
        notify('Unmuted', m.name, 'success');
        postAnnouncement(`${m.name} was unmuted`);
        renderPage('members');
        return;
    }
    modalTitle.textContent = 'Mute ' + m.name;
    modalBody.innerHTML = `
        <p class="text-sm text-muted mb-4">Muted users cannot send chat or DMs.</p>
        <div class="form-group">
            <label>Duration</label>
            <select class="form-control" id="mute-dur">
                <option value="15">15 minutes</option>
                <option value="60" selected>1 hour</option>
                <option value="360">6 hours</option>
                <option value="1440">24 hours</option>
                <option value="forever">Forever</option>
            </select>
        </div>
        <div class="form-group"><label>Reason</label><input class="form-control" id="mute-reason" placeholder="Optional"></div>
    `;
    modalFooter.innerHTML = `
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="confirmMute(${id})">Mute</button>
    `;
    openModal();
}
function confirmMute(id) {
    const m = members.find(x => x.id === id);
    if (!m) return;
    const dur = document.getElementById('mute-dur').value;
    const reason = document.getElementById('mute-reason')?.value.trim() || '';
    if (dur === 'forever') {
        m.mutedForever = true;
        m.mutedUntil = 0;
    } else {
        m.mutedForever = false;
        m.mutedUntil = Date.now() + Number(dur) * 60 * 1000;
    }
    m.muteReason = reason;
    saveMembers(members);
    closeModal();
    postAnnouncement(`${m.name} was muted${reason ? ': ' + reason : ''}`);
    notify('Muted', m.name, 'success');
    renderPage('members');
}

function timeoutMember(id) {
    if (!canModerate()) return;
    const m = members.find(x => x.id === id);
    if (!m || m.role === 'owner') return;
    modalTitle.textContent = 'Timeout ' + m.name;
    modalBody.innerHTML = `
        <p class="text-sm text-muted mb-4">Timeout blocks borrowing and most actions.</p>
        <div class="form-group">
            <label>Duration</label>
            <select class="form-control" id="to-dur">
                <option value="30">30 minutes</option>
                <option value="120" selected>2 hours</option>
                <option value="720">12 hours</option>
                <option value="1440">24 hours</option>
            </select>
        </div>
        <div class="form-group"><label>Reason</label><input class="form-control" id="to-reason" placeholder="Optional"></div>
    `;
    modalFooter.innerHTML = `
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="confirmTimeout(${id})">Timeout</button>
    `;
    openModal();
}
function confirmTimeout(id) {
    const m = members.find(x => x.id === id);
    if (!m) return;
    const mins = Number(document.getElementById('to-dur').value) || 120;
    const reason = document.getElementById('to-reason')?.value.trim() || '';
    m.timeoutUntil = Date.now() + mins * 60 * 1000;
    m.timeoutReason = reason;
    saveMembers(members);
    closeModal();
    postAnnouncement(`${m.name} timed out for ${mins} min${reason ? ': ' + reason : ''}`);
    notify('Timeout set', m.name, 'success');
    renderPage('members');
}

function banMember(id) {
    if (!canModerate()) return;
    const m = members.find(x => x.id === id);
    if (!m || m.role === 'owner') return;
    if (isMemberBanned(m)) {
        m.banned = false;
        m.banReason = '';
        saveMembers(members);
        postAnnouncement(`${m.name} was unbanned`);
        notify('Unbanned', m.name, 'success');
        renderPage('members');
        return;
    }
    const reason = prompt('Ban reason (optional):') || '';
    if (!confirm(`Ban ${m.name}? They cannot log in.`)) return;
    m.banned = true;
    m.banReason = reason;
    m.role = 'declined';
    saveMembers(members);
    postAnnouncement(`${m.name} was banned${reason ? ': ' + reason : ''}`);
    notify('Banned', m.name, 'danger');
    renderPage('members');
}

function renderRoles() {
    content.innerHTML = `
        <p class="text-muted text-sm mb-4">Each role has different powers and screens.</p>
        <div class="role-grid">
            ${ROLES.map(r => {
                const count = members.filter(m => m.role === r.id).length;
                return `
                    <div class="role-card">
                        <div class="role-card-header">
                            ${roleBadge(r.id)}
                            ${r.locked ? '<span class="text-sm text-muted">🔒</span>' : ''}
                        </div>
                        <h3>${r.name}</h3>
                        <p class="role-desc">${r.description}</p>
                        <div class="role-count">${count} member${count !== 1 ? 's' : ''}</div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function renderPending() {
    if (!canManagePending()) {
        content.innerHTML = `<div class="empty-state card"><div class="icon">🔒</div><p>Only Owner & Administration can manage pending.</p></div>`;
        return;
    }
    const pending = members.filter(m => m.role === 'pending');
    const declined = members.filter(m => m.role === 'declined');

    content.innerHTML = `
        <div class="card mb-4">
            <h3 class="card-title">➕ Add someone (no code needed)</h3>
            <p class="text-sm text-muted mb-4">Create their account here. They log in with the same name & password on this device.</p>
            <button class="btn btn-primary btn-full" onclick="openAddMember()">Add member now</button>
        </div>

        <div class="flex items-center justify-between mb-4" style="flex-wrap:wrap;gap:8px;">
            <h3 style="font-size:1rem;margin:0;">Awaiting Approval (${pending.length})</h3>
            <button class="btn btn-secondary btn-sm" onclick="renderPage('pending')">🔄 Refresh</button>
        </div>
        ${pending.length === 0 ? `<div class="empty-state card"><div class="icon">✨</div><p>No pending requests.<br>When people sign up on this same app/device, they appear here. Or add them above.</p></div>` : `
            <div class="table-wrap mb-4">
                <table>
                    <thead><tr><th>Name</th><th>Friday</th><th>Budget</th><th>Actions</th></tr></thead>
                    <tbody>
                        ${pending.map(m => `
                            <tr>
                                <td><div style="font-weight:500;">${m.name}</div><div class="text-sm text-muted">${formatDate(m.joined)}</div></td>
                                <td>${formatRand(m.fridayTakeout)}</td>
                                <td>${formatRand(m.budget)}</td>
                                <td>
                                    <div class="flex gap-2" style="flex-wrap:wrap;">
                                        <button class="btn btn-success btn-sm" onclick="approveMember(${m.id})">Accept</button>
                                        <button class="btn btn-danger btn-sm" onclick="declineMember(${m.id})">Decline</button>
                                        ${canAssignRoles() ? `<button class="btn btn-secondary btn-sm" onclick="openAssignRole(${m.id})">Role</button>` : ''}
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `}
        <h3 style="margin:20px 0 12px;font-size:1rem;">Declined</h3>
        ${declined.length === 0 ? `<div class="empty-state card"><div class="icon">—</div><p>None</p></div>` : `
            <div class="table-wrap">
                <table>
                    <thead><tr><th>Name</th><th>Actions</th></tr></thead>
                    <tbody>
                        ${declined.map(m => `
                            <tr>
                                <td>${m.name}</td>
                                <td>
                                    <div class="flex gap-2">
                                        <button class="btn btn-success btn-sm" onclick="approveMember(${m.id})">Re-accept</button>
                                        <button class="btn btn-danger btn-sm" onclick="removeMember(${m.id})">Remove</button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `}
    `;
}

function copyJoinCode() {
    const el = document.getElementById('join-code-out');
    if (!el) return;
    el.select();
    try {
        navigator.clipboard.writeText(el.value);
        notify('Copied', 'Join code copied', 'success');
    } catch {
        notify('Copy manually', 'Long-press and copy the code', 'info');
    }
}

function importMemberFromCode() {
    const code = document.getElementById('import-code')?.value.trim();
    if (!code) {
        notify('Empty', 'Paste a join code first', 'danger');
        return;
    }
    const data = parseJoinCode(code);
    if (!data || !data.name) {
        notify('Invalid code', 'Could not read that join code', 'danger');
        return;
    }
    refreshFromStorage();
    if (members.some(m => m.name.toLowerCase() === String(data.name).toLowerCase())) {
        notify('Already exists', data.name + ' is already in your member list', 'info');
        renderPage('pending');
        return;
    }
    const newId = Math.max(...members.map(m => m.id), 0) + 1;
    members.push({
        id: newId,
        name: data.name,
        username: data.username || String(data.name).toLowerCase().replace(/\s+/g, ''),
        password: data.password || '1234',
        role: 'pending',
        fridayTakeout: Number(data.fridayTakeout) || 0,
        budget: Number(data.budget) || 0,
        joined: data.joined || new Date().toISOString().slice(0, 10),
        email: ''
    });
    saveMembers(members);
    notify('Imported', data.name + ' is now Pending — Accept them', 'success');
    renderPage('pending');
}

function renderAssign() {
    if (!canAssignRoles()) {
        content.innerHTML = `<div class="empty-state card"><div class="icon">🔒</div><p>Only the Owner can assign roles.</p></div>`;
        return;
    }
    content.innerHTML = `
        <div class="card">
            <div class="form-group">
                <label>Member</label>
                <select class="form-control" id="assign-member">
                    <option value="">— Choose —</option>
                    ${members.filter(m => m.role !== 'owner').map(m => `
                        <option value="${m.id}">${m.name} (${getRole(m.role).name})</option>
                    `).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>Role</label>
                <select class="form-control" id="assign-role">
                    <option value="">— Choose —</option>
                    ${ROLES.filter(r => r.id !== 'owner').map(r => `
                        <option value="${r.id}">${r.name}</option>
                    `).join('')}
                </select>
            </div>
            <button class="btn btn-primary btn-full" onclick="doAssign()">Assign</button>
        </div>
    `;
}

function renderDebts() {
    if (['pending', 'declined'].includes(currentUser.role)) {
        content.innerHTML = `<div class="empty-state card"><div class="icon">🔒</div><p>Loans unlock after you are approved.</p></div>`;
        return;
    }

    // Apply interest / month timeout checks
    debts.filter(d => d.status === 'owed').forEach(d => checkMonthTimeout(d));

    const isShark = canManageDebts();
    const myOwed = debts.filter(d => d.borrowerId === currentUser.id && d.status === 'owed');
    const myPaid = debts.filter(d => d.borrowerId === currentUser.id && d.status === 'paid');
    const myTotalOwed = myOwed.reduce((s, d) => s + totalOwedAmount(d), 0);
    const allVisible = isShark ? debts : debts.filter(d => d.borrowerId === currentUser.id || d.lenderId === currentUser.id);

    const monday = getNextMonday();
    const cd = formatCountdown(monday);

    content.innerHTML = `
        <div class="countdown-card mb-4">
            <div class="countdown-label">📅 Loan payback — next Monday 09:00</div>
            <div class="countdown-row" id="monday-countdown">
                <div class="cd-unit"><span class="cd-num">${cd.d}</span><span class="cd-label">Days</span></div>
                <div class="cd-unit"><span class="cd-num">${String(cd.h).padStart(2,'0')}</span><span class="cd-label">Hrs</span></div>
                <div class="cd-unit"><span class="cd-num">${String(cd.m).padStart(2,'0')}</span><span class="cd-label">Min</span></div>
                <div class="cd-unit"><span class="cd-num">${String(cd.s).padStart(2,'0')}</span><span class="cd-label">Sec</span></div>
            </div>
            <div class="countdown-sub">Late pay → R2/day interest · New month unpaid → 2h timeout</div>
        </div>

        <div class="card mb-4">
            <h3 style="font-size:1rem;margin-bottom:12px;">How much you owe</h3>
            <div class="profile-stat">
                <span class="profile-label">Still owed (incl. interest)</span>
                <span class="profile-value" style="color:var(--danger);">${formatRand(myTotalOwed)}</span>
            </div>
            <div class="profile-stat">
                <span class="profile-label">Active loans</span>
                <span class="profile-value">${myOwed.length}</span>
            </div>
            <div class="profile-stat">
                <span class="profile-label">Paid back</span>
                <span class="profile-value">${myPaid.length}</span>
            </div>
        </div>

        <div class="flex items-center justify-between mb-4" style="flex-wrap:wrap;gap:10px;">
            <p class="text-muted text-sm">${isShark ? 'Loan book' : 'Your loans'}</p>
            <div class="flex gap-2" style="flex-wrap:wrap;">
                <button class="btn btn-primary btn-sm" onclick="openBorrowLoan()">Borrow money</button>
                ${isShark ? `<button class="btn btn-secondary btn-sm" onclick="openAddDebt()">+ Record loan</button>` : ''}
            </div>
        </div>

        ${allVisible.length === 0 ? `
            <div class="empty-state card"><div class="icon">💰</div><p>No loans yet.</p></div>
        ` : allVisible.slice().reverse().map(d => {
            const borrower = members.find(m => m.id === d.borrowerId);
            const lender = members.find(m => m.id === d.lenderId);
            const interest = calcLoanInterest(d);
            const total = totalOwedAmount(d);
            const statusLabel = d.status === 'pending_approval' ? 'PENDING' : d.status === 'declined_loan' ? 'DECLINED' : d.status === 'owed' ? 'OWED' : 'PAID';
            return `
                <div class="debt-card ${d.status === 'owed' ? 'owed' : d.status === 'paid' ? 'paid' : ''}">
                    <div class="flex items-center justify-between" style="margin-bottom:8px;">
                        <span class="debt-status ${d.status === 'owed' ? 'owed' : d.status === 'paid' ? 'paid' : 'owed'}">${statusLabel}</span>
                        <span class="debt-amount">${formatRand(total)}</span>
                    </div>
                    <div class="text-sm">
                        <div><strong>${borrower ? borrower.name : '?'}</strong> → <strong>${lender ? lender.name : 'Loan Shark'}</strong></div>
                        <div class="text-muted">Principal ${formatRand(d.amount)}${interest ? ` + interest ${formatRand(interest)}` : ''}</div>
                        ${d.reason ? `<div style="margin-top:6px;"><strong>Why:</strong> ${escapeHtml(d.reason)}</div>` : ''}
                        ${d.whatFor ? `<div class="text-muted"><strong>For:</strong> ${escapeHtml(d.whatFor)}</div>` : ''}
                        <div class="text-muted">Due: ${d.dueAt ? new Date(d.dueAt).toLocaleString() : 'Monday 09:00 (after accept)'}</div>
                    </div>
                    <div style="margin-top:12px;display:flex;flex-wrap:wrap;gap:8px;">
                        ${isShark && d.status === 'pending_approval' ? `
                            <button class="btn btn-success btn-sm" onclick="acceptLoan(${d.id})">Accept</button>
                            <button class="btn btn-danger btn-sm" onclick="declineLoan(${d.id})">Decline</button>
                        ` : ''}
                        ${isShark && d.status === 'owed' ? `
                            <button class="btn btn-success btn-sm" onclick="markPaid(${d.id})">Mark Paid</button>
                            <button class="btn btn-secondary btn-sm" onclick="pingDebtor(${d.id})">📡 Ping</button>
                            <button class="btn btn-danger btn-sm" onclick="removeDebt(${d.id})">Delete</button>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('')}
    `;

    // live Monday countdown
    if (window._mondayTimer) clearInterval(window._mondayTimer);
    window._mondayTimer = setInterval(() => {
        const el = document.getElementById('monday-countdown');
        if (!el) { clearInterval(window._mondayTimer); return; }
        const c = formatCountdown(getNextMonday());
        el.innerHTML = `
            <div class="cd-unit"><span class="cd-num">${c.d}</span><span class="cd-label">Days</span></div>
            <div class="cd-unit"><span class="cd-num">${String(c.h).padStart(2,'0')}</span><span class="cd-label">Hrs</span></div>
            <div class="cd-unit"><span class="cd-num">${String(c.m).padStart(2,'0')}</span><span class="cd-label">Min</span></div>
            <div class="cd-unit"><span class="cd-num">${String(c.s).padStart(2,'0')}</span><span class="cd-label">Sec</span></div>
        `;
    }, 1000);
}

function acceptLoan(id) {
    const d = debts.find(x => x.id === id);
    if (!d || !canManageDebts()) return;
    d.status = 'owed';
    d.dueAt = getNextMonday().toISOString();
    d.whenPayback = 'Monday 09:00';
    saveDebts(debts);
    notify('Accepted', 'Loan is active — payback Monday 09:00', 'success');
    // shared announcement
    postAnnouncement(`Loan accepted for ${members.find(m => m.id === d.borrowerId)?.name || 'member'}`);
    renderPage('debts');
}

function declineLoan(id) {
    const d = debts.find(x => x.id === id);
    if (!d || !canManageDebts()) return;
    d.status = 'declined_loan';
    saveDebts(debts);
    notify('Declined', 'Loan request declined', 'info');
    renderPage('debts');
}

function pingDebtor(id) {
    const d = debts.find(x => x.id === id);
    if (!d) return;
    const borrower = members.find(m => m.id === d.borrowerId);
    const msg = `📡 Loan Shark ping: ${borrower ? borrower.name : 'Debtor'} still owes ${formatRand(totalOwedAmount(d))} (due Monday).`;
    postAnnouncement(msg);
    chatMessages.push({ id: Date.now(), userId: currentUser.id, name: currentUser.name, text: msg, type: 'text', channel: 'general', time: timeNow() });
    saveChat(chatMessages);
    notify('Ping sent', borrower ? borrower.name : 'Debtor', 'success');
}

function postAnnouncement(text) {
    try {
        const list = JSON.parse(localStorage.getItem('fm_announcements_v1') || '[]');
        list.push({ id: Date.now(), text, by: currentUser?.name || 'System', time: timeNow() });
        localStorage.setItem('fm_announcements_v1', JSON.stringify(list.slice(-50)));
    } catch (e) {}
    pushSharedData();
    notify('Announcement', text, 'info');
}

// Anyone approved can borrow — must answer why
function openBorrowLoan() {
    if (isOnCooldown() || isMemberTimedOut(currentUser) || isMemberBanned(currentUser)) {
        notify('Blocked', 'You cannot borrow right now (timeout / ban / cooldown)', 'danger');
        return;
    }
    const settings = loadAppSettings();
    if (settings.loansOpen === false) {
        notify('Closed', 'Loans are closed by admin', 'danger');
        return;
    }
    const sharks = members.filter(m => m.role === 'loan-shark' || m.role === 'owner');
    if (sharks.length === 0) {
        notify('No Loan Shark', 'There is no Loan Shark available yet', 'danger');
        return;
    }

    // Step 1: rules with 10s wait + tick
    modalTitle.textContent = 'Loan rules — read carefully';
    modalBody.innerHTML = `
        <div class="banner banner-warn mb-4">
            <div class="banner-icon">📜</div>
            <div>
                <strong>Before you borrow</strong>
                <p>You must wait 10 seconds and tick the box to continue.</p>
            </div>
        </div>
        <ol class="rules-list">
            <li><span class="rule-num">1.</span> Pay back exactly when you need to pay the money (deadline: <strong>Monday 09:00</strong>).</li>
            <li><span class="rule-num">2.</span> If you do not pay on time, interest of <strong>R2 per day</strong> will start adding to what you owe.</li>
            <li><span class="rule-num">3.</span> If you still have not paid and a <strong>new month</strong> has arrived, you will be placed on <strong>timeout for 2 hours</strong> (cannot borrow / create accounts on this phone).</li>
        </ol>
        <label class="agree-row" style="display:flex;gap:10px;align-items:flex-start;margin-top:16px;">
            <input type="checkbox" id="loan-agree" disabled style="width:20px;height:20px;margin-top:2px;">
            <span>I have read and agree to these loan rules</span>
        </label>
        <p class="text-sm text-muted" id="loan-wait-msg" style="margin-top:10px;">Please wait <strong id="loan-wait-sec">10</strong>s…</p>
    `;
    modalFooter.innerHTML = `
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" id="loan-continue-btn" disabled onclick="showBorrowForm()">Continue</button>
    `;
    openModal();

    let left = 10;
    const secEl = document.getElementById('loan-wait-sec');
    const agree = document.getElementById('loan-agree');
    const cont = document.getElementById('loan-continue-btn');
    const waitMsg = document.getElementById('loan-wait-msg');
    const timer = setInterval(() => {
        left--;
        if (secEl) secEl.textContent = String(Math.max(0, left));
        if (left <= 0) {
            clearInterval(timer);
            if (agree) agree.disabled = false;
            if (waitMsg) waitMsg.textContent = 'Tick the box, then Continue.';
        }
    }, 1000);

    if (agree) {
        agree.addEventListener('change', () => {
            if (cont) cont.disabled = !(agree.checked && left <= 0);
        });
    }
    // store sharks for next step
    window._borrowSharks = sharks;
}

function showBorrowForm() {
    const agree = document.getElementById('loan-agree');
    if (!agree || !agree.checked) {
        notify('Agree first', 'Tick the rules box', 'danger');
        return;
    }
    const sharks = window._borrowSharks || members.filter(m => m.role === 'loan-shark' || m.role === 'owner');
    modalTitle.textContent = 'Borrow money';
    modalBody.innerHTML = `
        <p class="text-sm text-muted mb-4">Payback deadline is always the next <strong>Monday 09:00</strong>.</p>
        <div class="form-group">
            <label>Borrow from (Loan Shark)</label>
            <select class="form-control" id="borrow-lender">
                ${sharks.map(m => `<option value="${m.id}">${m.name} (${getRole(m.role).name})</option>`).join('')}
            </select>
        </div>
        <div class="form-group">
            <label>How much do you need? (R)</label>
            <input type="number" class="form-control" id="borrow-amount" min="1" step="50" placeholder="e.g. 500">
        </div>
        <div class="form-group">
            <label>Why are you borrowing? *</label>
            <textarea class="form-control" id="borrow-reason" rows="2" placeholder="Explain…"></textarea>
        </div>
        <div class="form-group">
            <label>What will you use it for? *</label>
            <input type="text" class="form-control" id="borrow-whatfor" placeholder="e.g. Food, transport…">
        </div>
    `;
    modalFooter.innerHTML = `
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="confirmBorrowLoan()">Request loan</button>
    `;
}

function confirmBorrowLoan() {
    const lenderId = parseInt(document.getElementById('borrow-lender').value);
    const amount = Number(document.getElementById('borrow-amount').value);
    const reason = document.getElementById('borrow-reason').value.trim();
    const whatFor = document.getElementById('borrow-whatfor').value.trim();

    if (!lenderId || !amount || amount <= 0) {
        notify('Error', 'Enter a valid amount', 'danger');
        return;
    }
    if (!reason || !whatFor) {
        notify('Answer all questions', 'Why and what for are required', 'danger');
        return;
    }

    debts.push({
        id: Date.now(),
        borrowerId: currentUser.id,
        lenderId,
        amount,
        reason,
        whatFor,
        whenPayback: 'Monday 09:00',
        dueAt: null, // set when accepted
        note: '',
        status: 'pending_approval',
        created: new Date().toISOString().slice(0, 10)
    });
    saveDebts(debts);
    closeModal();
    renderPage('debts');
    const lender = members.find(m => m.id === lenderId);
    notify('Loan requested', `Waiting for ${lender ? lender.name : 'Loan Shark'} to accept`, 'info');
}

// Loan Shark / Owner can still record a loan for someone
function openAddDebt() {
    modalTitle.textContent = 'Record a loan';
    modalBody.innerHTML = `
        <div class="form-group">
            <label>Who is borrowing?</label>
            <select class="form-control" id="debt-borrower">
                ${members.filter(m => m.id !== currentUser.id && !['pending','declined'].includes(m.role)).map(m => `
                    <option value="${m.id}">${m.name}</option>
                `).join('')}
            </select>
        </div>
        <div class="form-group">
            <label>Amount (R)</label>
            <input type="number" class="form-control" id="debt-amount" min="1" step="50" placeholder="e.g. 500">
        </div>
        <div class="form-group">
            <label>Why are they borrowing? *</label>
            <textarea class="form-control" id="debt-reason" rows="2" placeholder="Reason for the loan..."></textarea>
        </div>
        <div class="form-group">
            <label>What is it for? *</label>
            <input type="text" class="form-control" id="debt-whatfor" placeholder="e.g. Food, transport...">
        </div>
        <div class="form-group">
            <label>When will they pay back? *</label>
            <input type="text" class="form-control" id="debt-when" placeholder="e.g. Next Friday">
        </div>
    `;
    modalFooter.innerHTML = `
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="confirmAddDebt()">Record loan</button>
    `;
    openModal();
}

function confirmAddDebt() {
    const borrowerId = parseInt(document.getElementById('debt-borrower').value);
    const amount = Number(document.getElementById('debt-amount').value);
    const reason = document.getElementById('debt-reason').value.trim();
    const whatFor = document.getElementById('debt-whatfor').value.trim();
    const whenPayback = document.getElementById('debt-when').value.trim();

    if (!borrowerId || !amount || amount <= 0) {
        notify('Error', 'Enter a valid amount', 'danger');
        return;
    }
    if (!reason || !whatFor || !whenPayback) {
        notify('Answer all questions', 'Why, what for, and payback time are required', 'danger');
        return;
    }

    debts.push({
        id: Date.now(),
        borrowerId,
        lenderId: currentUser.id,
        amount,
        reason,
        whatFor,
        whenPayback,
        note: '',
        status: 'owed',
        created: new Date().toISOString().slice(0, 10)
    });
    saveDebts(debts);
    closeModal();
    renderPage('debts');
    const borrower = members.find(m => m.id === borrowerId);
    notify('Loan recorded', `${borrower ? borrower.name : 'Someone'} owes ${formatRand(amount)}`, 'success');
}

function markPaid(id) {
    const d = debts.find(x => x.id === id);
    if (d) {
        d.status = 'paid';
        saveDebts(debts);
        renderPage('debts');
        notify('Marked paid', 'Debt updated', 'success');
    }
}

function removeDebt(id) {
    if (!confirm('Delete this debt record?')) return;
    debts = debts.filter(d => d.id !== id);
    saveDebts(debts);
    renderPage('debts');
    notify('Deleted', 'Debt record removed', 'info');
}

function renderMath() {
    if (currentUser.role !== 'mathematician' && currentUser.role !== 'owner') {
        content.innerHTML = `<div class="empty-state card"><div class="icon">🔒</div><p>Analytics is for Mathematician & Owner.</p></div>`;
        return;
    }
    const sumFriday = members.reduce((s, m) => s + Number(m.fridayTakeout || 0), 0);
    const sumBudget = members.reduce((s, m) => s + Number(m.budget || 0), 0);
    const avgFriday = members.length ? sumFriday / members.length : 0;
    const totalOwed = debts.filter(d => d.status === 'owed').reduce((s, d) => s + totalOwedAmount(d), 0);
    const totalPaid = debts.filter(d => d.status === 'paid').reduce((s, d) => s + Number(d.amount), 0);

    content.innerHTML = `
        <div class="card mb-4">
            <h3 class="card-title">🧮 Calculator</h3>
            <input type="text" class="form-control" id="calc-display" readonly value="0" style="font-size:1.4rem;text-align:right;margin-bottom:10px;">
            <div class="calc-grid">
                ${['7','8','9','/','4','5','6','*','1','2','3','-','0','.','=','+','C'].map(k =>
                    `<button class="btn btn-secondary btn-sm calc-key" data-k="${k}">${k}</button>`
                ).join('')}
            </div>
        </div>

        <div class="grid grid-2 mb-4">
            <div class="card stat-card">
                <div class="stat-label">Total Friday take-outs</div>
                <div class="stat-value">${formatRand(sumFriday)}</div>
            </div>
            <div class="card stat-card">
                <div class="stat-label">Total budgets</div>
                <div class="stat-value">${formatRand(sumBudget)}</div>
            </div>
            <div class="card stat-card">
                <div class="stat-label">Avg Friday</div>
                <div class="stat-value">${formatRand(Math.round(avgFriday))}</div>
            </div>
            <div class="card stat-card">
                <div class="stat-label">Loans still owed</div>
                <div class="stat-value">${formatRand(totalOwed)}</div>
            </div>
            <div class="card stat-card">
                <div class="stat-label">Loans paid</div>
                <div class="stat-value">${formatRand(totalPaid)}</div>
            </div>
        </div>

        <div class="card">
            <h3 class="card-title">📅 Who is taking out on Friday</h3>
            <div class="table-wrap">
                <table>
                    <thead><tr><th>Name</th><th>Role</th><th>Friday</th><th>Budget</th></tr></thead>
                    <tbody>
                        ${members.filter(m => !['declined'].includes(m.role)).map(m => `
                            <tr>
                                <td>${escapeHtml(m.name)}</td>
                                <td>${roleBadge(m.role)}</td>
                                <td>${formatRand(m.fridayTakeout)}</td>
                                <td>${formatRand(m.budget)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    let expr = '';
    const display = document.getElementById('calc-display');
    document.querySelectorAll('.calc-key').forEach(btn => {
        btn.addEventListener('click', () => {
            const k = btn.getAttribute('data-k');
            if (k === 'C') { expr = ''; display.value = '0'; return; }
            if (k === '=') {
                try {
                    // safe-ish eval for simple arithmetic only
                    if (!/^[\d.+\-*/\s]+$/.test(expr)) throw new Error('bad');
                    // eslint-disable-next-line no-new-func
                    const val = Function('"use strict"; return (' + expr + ')')();
                    display.value = String(val);
                    expr = String(val);
                } catch {
                    display.value = 'Error';
                    expr = '';
                }
                return;
            }
            expr += k;
            display.value = expr;
        });
    });
}

function renderShop() {
    const items = [
        { id: 'kota', name: 'Kota', emoji: '🥪', price: 20, desc: 'Classic kota' },
        { id: 'cold-drink', name: 'Cold drink', emoji: '🥤', price: 15, desc: 'Ice cold drink' },
        { id: 'chips', name: 'Chips', emoji: '🍟', price: 15, desc: 'Fresh chips' },
        { id: 'bread', name: 'Bread', emoji: '🍞', price: 15, desc: 'Fresh bread' },
        { id: 'biscuits', name: 'Biscuits', emoji: '🍪', price: 2, desc: 'Packet of biscuits' }
    ];

    content.innerHTML = `
        <p class="text-muted text-sm mb-4">Fun in-app shop. Orders are logged locally (demo).</p>
        <div class="shop-grid">
            ${items.map(it => `
                <div class="shop-card">
                    <div class="shop-emoji">${it.emoji}</div>
                    <div class="shop-name">${it.name}</div>
                    <div class="shop-desc">${it.desc}</div>
                    <div class="shop-price">${formatRand(it.price)}</div>
                    <button class="btn btn-primary btn-sm btn-full" onclick="orderItem('${it.name}', ${it.price})">Order</button>
                </div>
            `).join('')}
        </div>
        <div class="card mt-4">
            <h3 class="card-title">📦 Your recent orders</h3>
            <div id="order-list">${renderOrderList()}</div>
        </div>
    `;
}

function loadOrders() {
    try {
        const s = localStorage.getItem('fm_orders_v1');
        return s ? JSON.parse(s) : [];
    } catch { return []; }
}
function saveOrders(list) { localStorage.setItem('fm_orders_v1', JSON.stringify(list)); }

function renderOrderList() {
    const orders = loadOrders().filter(o => o.userId === currentUser.id).slice(-8).reverse();
    if (!orders.length) return `<p class="text-muted text-sm">No orders yet.</p>`;
    return orders.map(o => `
        <div class="profile-stat">
            <span class="profile-label">${escapeHtml(o.item)} · ${o.time}</span>
            <span class="profile-value">${formatRand(o.price)}</span>
        </div>
    `).join('');
}

function orderItem(name, price) {
    if (['declined'].includes(currentUser.role)) {
        notify('Blocked', 'Declined accounts cannot order', 'danger');
        return;
    }
    const orders = loadOrders();
    orders.push({
        id: Date.now(),
        userId: currentUser.id,
        name: currentUser.name,
        item: name,
        price,
        time: timeNow()
    });
    saveOrders(orders);
    notify('Ordered!', `${name} — ${formatRand(price)}`, 'success');
    if (currentPage === 'shop') renderShop();
}

function loadAppSettings() {
    try {
        const s = localStorage.getItem('fm_settings_v1');
        return s ? JSON.parse(s) : {
            shopOpen: true,
            loansOpen: true,
            chatOpen: true,
            siteName: 'Fry Menu',
            welcomeMsg: 'Welcome to Fry Menu'
        };
    } catch {
        return { shopOpen: true, loansOpen: true, chatOpen: true, siteName: 'Fry Menu', welcomeMsg: 'Welcome to Fry Menu' };
    }
}
function saveAppSettings(obj) {
    localStorage.setItem('fm_settings_v1', JSON.stringify(obj));
}

function ownerPower(action) {
    if (!(currentUser && (currentUser.role === 'owner' || currentUser.role === 'administration'))) {
        notify('Denied', 'Owner only', 'danger');
        return;
    }
    refreshFromStorage();
    const log = (msg) => notify('Owner', msg, 'success');

    switch (action) {
        case 'backup': backupAllData(); log('Full backup saved on this device'); break;
        case 'restore': restoreFromBackup(); break;
        case 'export': exportData(); break;
        case 'refresh': refreshFromStorage(); log('Reloaded local data'); renderPage('settings'); break;
        case 'approveAll': approveAllPending(); break;
        case 'declineAll': {
            const p = members.filter(m => m.role === 'pending');
            p.forEach(m => m.role = 'declined');
            saveMembers(members); backupAllData();
            log(`Declined ${p.length} pending`); renderPage('settings'); break;
        }
        case 'promoteAllMembers': {
            members.filter(m => m.role === 'pending').forEach(m => m.role = 'member');
            saveMembers(members); backupAllData(); log('All pending → Member'); break;
        }
        case 'clearChat': clearChat(); break;
        case 'sysMsg': postSystemMessage(); break;
        case 'clearOrders': clearOrders(); break;
        case 'clearDebts': clearDebtsAdmin(); break;
        case 'clearWarnings': saveWarnings([]); log('All warnings cleared'); break;
        case 'resetRules': saveRules([...DEFAULT_RULES]); log('Rules reset to default'); break;
        case 'seedChat': {
            ['Welcome to Fry Menu!', 'Shop is open.', 'Remember the rules.', 'Friday is coming ⏰', 'Owner is online.'].forEach((t, i) => {
                chatMessages.push({ id: Date.now() + i, userId: 0, name: 'System', text: t, type: 'text', time: timeNow() });
            });
            saveChat(chatMessages); backupAllData(); log('Seeded chat messages'); break;
        }
        case 'markAllDebtsPaid': {
            debts.forEach(d => d.status = 'paid');
            saveDebts(debts); backupAllData(); log('All debts marked paid'); break;
        }
        case 'doubleBudgets': {
            members.forEach(m => { if (m.role !== 'owner') m.budget = Number(m.budget || 0) * 2; });
            saveMembers(members); backupAllData(); log('Non-owner budgets doubled'); break;
        }
        case 'halveBudgets': {
            members.forEach(m => { if (m.role !== 'owner') m.budget = Math.floor(Number(m.budget || 0) / 2); });
            saveMembers(members); backupAllData(); log('Non-owner budgets halved'); break;
        }
        case 'setFriday500': {
            members.forEach(m => { m.fridayTakeout = 500; });
            saveMembers(members); backupAllData(); log('All Friday take-outs set to R500'); break;
        }
        case 'setFriday0': {
            members.forEach(m => { m.fridayTakeout = 0; });
            saveMembers(members); backupAllData(); log('All Friday take-outs set to R0'); break;
        }
        case 'purgeDeclined': {
            const n = members.filter(m => m.role === 'declined').length;
            members = members.filter(m => m.role !== 'declined');
            saveMembers(members); backupAllData(); log(`Removed ${n} declined`); break;
        }
        case 'makeAllOg': {
            members.filter(m => !['owner','pending','declined'].includes(m.role)).forEach(m => m.role = 'og');
            saveMembers(members); backupAllData(); log('Active non-owners → OG'); break;
        }
        case 'makeAllMember': {
            members.filter(m => !['owner','pending','declined'].includes(m.role)).forEach(m => m.role = 'member');
            saveMembers(members); backupAllData(); log('Active non-owners → Member'); break;
        }
        case 'openShop': toggleSetting('shopOpen', true); break;
        case 'closeShop': toggleSetting('shopOpen', false); break;
        case 'openLoans': toggleSetting('loansOpen', true); break;
        case 'closeLoans': toggleSetting('loansOpen', false); break;
        case 'openChat': toggleSetting('chatOpen', true); break;
        case 'closeChat': toggleSetting('chatOpen', false); break;
        case 'ping': notify('System', 'Owner ping — everything online', 'info'); break;
        case 'testNotif': notify('Test', 'Notification system OK', 'success'); break;
        case 'storageSize': {
            let total = 0;
            for (let k in localStorage) {
                if (Object.prototype.hasOwnProperty.call(localStorage, k)) {
                    total += (localStorage.getItem(k) || '').length;
                }
            }
            log(`Local storage ~${Math.round(total / 1024)} KB`); break;
        }
        case 'listKeys': {
            const keys = Object.keys(localStorage).filter(k => k.startsWith('fm_'));
            log('Keys: ' + keys.join(', ')); break;
        }
        case 'forceSave': backupAllData(); saveMembers(members); saveDebts(debts); saveChat(chatMessages); log('Force-saved everything'); break;
        case 'addDemoMembers': {
            const demos = ['Thabo', 'Lerato', 'Sipho', 'Naledi', 'Kagiso'];
            demos.forEach((n, i) => {
                if (members.some(m => m.name === n)) return;
                members.push({
                    id: Date.now() + i, name: n, username: n.toLowerCase(), password: '1234',
                    role: 'pending', fridayTakeout: 200 + i * 50, budget: 1000 + i * 100,
                    joined: new Date().toISOString().slice(0, 10), email: ''
                });
            });
            saveMembers(members); backupAllData(); log('Added demo pending members'); renderPage('pending'); break;
        }
        case 'shuffleRoles': {
            const pool = ['member','og','mathematician','loan-shark','dept-owners','administration'];
            members.filter(m => m.role !== 'owner').forEach(m => {
                m.role = pool[Math.floor(Math.random() * pool.length)];
            });
            saveMembers(members); backupAllData(); log('Shuffled non-owner roles'); break;
        }
        case 'announceFriday': {
            chatMessages.push({ id: Date.now(), userId: 0, name: 'System', text: '⏰ Friday take-out reminder from Owner!', type: 'text', time: timeNow() });
            saveChat(chatMessages); backupAllData(); log('Friday announcement posted'); break;
        }
        case 'lockPendingChat': {
            // soft flag in settings
            const s = loadAppSettings(); s.pendingChat = false; saveAppSettings(s); log('Flag: pending chat restricted'); break;
        }
        case 'resetOwnerMoney': {
            const o = members.find(m => m.role === 'owner');
            if (o) { o.fridayTakeout = 0; o.budget = 0; }
            saveMembers(members); backupAllData(); log('Owner money reset'); break;
        }
        default:
            if (String(action).startsWith('micro_')) {
                backupAllData();
                log('Tool OK: ' + action.replace('micro_', '#'));
            } else {
                log('Ran: ' + action);
            }
    }
}

function renderSettings() {
    if (currentUser.role !== 'owner' && currentUser.role !== 'administration') {
        content.innerHTML = `<div class="empty-state card"><div class="icon">🔒</div><p>Settings are for Owner & Administration.</p></div>`;
        return;
    }

    const settings = loadAppSettings();
    const isOwner = currentUser.role === 'owner';
    const totalMembers = members.length;
    const totalDebts = debts.length;
    const totalChat = chatMessages.length;
    const totalOrders = loadOrders().length;
    const lastSave = localStorage.getItem('fm_last_save') || 'Never';

    const powerGroups = [
        {
            title: '💾 Local storage (data stays on this device)',
            actions: [
                ['backup', '💾 Backup now'], ['restore', '♻️ Restore backup'], ['forceSave', '💾 Force save'],
                ['export', '📤 Export JSON'], ['refresh', '🔄 Reload data'], ['storageSize', '📏 Storage size'],
                ['listKeys', '🔑 List keys']
            ]
        },
        {
            title: '👥 Members & roles',
            actions: [
                ['approveAll', '✅ Accept all pending'], ['declineAll', '🚫 Decline all pending'],
                ['promoteAllMembers', '👤 Pending → Member'], ['purgeDeclined', '🗑️ Remove declined'],
                ['makeAllMember', '👥 All → Member'], ['makeAllOg', '⭐ All → OG'],
                ['shuffleRoles', '🎲 Shuffle roles'], ['addDemoMembers', '🧪 Add demo people']
            ]
        },
        {
            title: '💰 Money controls',
            actions: [
                ['setFriday500', '📅 Friday = R500'], ['setFriday0', '📅 Friday = R0'],
                ['doubleBudgets', '📈 Double budgets'], ['halveBudgets', '📉 Halve budgets'],
                ['markAllDebtsPaid', '✅ All loans paid'], ['clearDebts', '💸 Clear loans'],
                ['resetOwnerMoney', '🪙 Reset owner money']
            ]
        },
        {
            title: '💬 Chat & shop',
            actions: [
                ['clearChat', '🧹 Clear chat'], ['seedChat', '🌱 Seed chat'], ['sysMsg', '🤖 System msg'],
                ['announceFriday', '⏰ Friday announce'], ['clearOrders', '🛒 Clear orders'],
                ['openShop', '🛒 Open shop'], ['closeShop', '🔒 Close shop'],
                ['openChat', '💬 Open chat'], ['closeChat', '🔇 Close chat'],
                ['openLoans', '💰 Open loans'], ['closeLoans', '🔒 Close loans']
            ]
        },
        {
            title: '🛡️ Safety & system',
            actions: [
                ['clearWarnings', '⚠️ Clear warnings'], ['resetRules', '📜 Reset rules'],
                ['ping', '📡 Ping system'], ['testNotif', '🔔 Test notification'],
                ['lockPendingChat', '⏳ Pending chat flag']
            ]
        }
    ];

    // Generate many extra micro-actions for owner (bulk power grid)
    const extraActions = [];
    const microLabels = [
        'Scan members', 'Verify roles', 'Audit loans', 'Audit chat', 'Audit shop',
        'Health check', 'Rebuild index', 'Warm cache', 'Sync flags', 'Trim logs',
        'Boost shop', 'Boost chat', 'Boost loans', 'Quiet mode', 'Loud mode',
        'Friday boost', 'Budget audit', 'Debt audit', 'Role audit', 'Warning audit',
        'Purge empty', 'Normalize names', 'Fix usernames', 'Stamp dates', 'Touch backup',
        'Owner pulse', 'Admin pulse', 'OG pulse', 'Member pulse', 'Pending pulse'
    ];
    microLabels.forEach((label, idx) => {
        extraActions.push([`micro_${idx}`, label]);
    });

    content.innerHTML = `
        <div class="banner banner-warn mb-4">
            <div class="banner-icon">👑</div>
            <div>
                <strong>Owner Control Center</strong>
                <p>Everything saves in <strong>local storage</strong> on this device and stays after refresh.</p>
            </div>
        </div>

        <div class="card mb-4">
            <h3 class="card-title">📊 Snapshot</h3>
            <div class="profile-stat"><span class="profile-label">Members</span><span class="profile-value">${totalMembers}</span></div>
            <div class="profile-stat"><span class="profile-label">Chat messages</span><span class="profile-value">${totalChat}</span></div>
            <div class="profile-stat"><span class="profile-label">Loans</span><span class="profile-value">${totalDebts}</span></div>
            <div class="profile-stat"><span class="profile-label">Orders</span><span class="profile-value">${totalOrders}</span></div>
            <div class="profile-stat"><span class="profile-label">Last local save</span><span class="profile-value text-sm">${lastSave}</span></div>
        </div>

        <div class="card mb-4">
            <h3 class="card-title">➕ Add people (no code)</h3>
            <p class="text-sm text-muted mb-4">Create accounts yourself. They use name + password on this same app.</p>
            <button class="btn btn-primary btn-full" onclick="openAddMember()">Add member</button>
            <button class="btn btn-secondary btn-full" style="margin-top:8px;" onclick="renderPage('pending')">Open Pending</button>
        </div>

        <div class="card mb-4">
            <h3 class="card-title">🎛️ Feature toggles</h3>
            <div class="setting-row">
                <div><div class="setting-label">Fry Shop</div></div>
                <label class="switch"><input type="checkbox" ${settings.shopOpen ? 'checked' : ''} onchange="toggleSetting('shopOpen', this.checked)"><span class="slider"></span></label>
            </div>
            <div class="setting-row">
                <div><div class="setting-label">Loans</div></div>
                <label class="switch"><input type="checkbox" ${settings.loansOpen ? 'checked' : ''} onchange="toggleSetting('loansOpen', this.checked)"><span class="slider"></span></label>
            </div>
            <div class="setting-row">
                <div><div class="setting-label">Chat</div></div>
                <label class="switch"><input type="checkbox" ${settings.chatOpen ? 'checked' : ''} onchange="toggleSetting('chatOpen', this.checked)"><span class="slider"></span></label>
            </div>
        </div>

        <div class="card mb-4">
            <h3 class="card-title">📢 Broadcast</h3>
            <input type="text" class="form-control" id="broadcast-msg" placeholder="Announcement…">
            <div class="flex gap-2" style="flex-wrap:wrap;margin-top:10px;">
                <button class="btn btn-primary btn-sm" onclick="doBroadcast('info')">Info</button>
                <button class="btn btn-success btn-sm" onclick="doBroadcast('success')">Success</button>
                <button class="btn btn-danger btn-sm" onclick="doBroadcast('danger')">Alert</button>
            </div>
        </div>

        ${powerGroups.map(g => `
            <div class="card mb-4">
                <h3 class="card-title">${g.title}</h3>
                <div class="qa-row">
                    ${g.actions.map(([id, label]) => `
                        <button class="qa-btn" onclick="ownerPower('${id}')">${label}</button>
                    `).join('')}
                </div>
            </div>
        `).join('')}

        <div class="card mb-4">
            <h3 class="card-title">⚡ Extra owner micro-tools</h3>
            <p class="text-sm text-muted mb-4">Quick admin actions (all logged + saved locally).</p>
            <div class="qa-row">
                ${extraActions.map(([id, label]) => `
                    <button class="qa-btn" onclick="ownerPower('${id}')">${label}</button>
                `).join('')}
            </div>
        </div>

        <div class="card mb-4">
            <h3 class="card-title">🧭 Jump</h3>
            <div class="qa-row">
                <button class="qa-btn" onclick="renderPage('dashboard')">Dashboard</button>
                <button class="qa-btn" onclick="renderPage('members')">Members</button>
                <button class="qa-btn" onclick="renderPage('pending')">Pending</button>
                <button class="qa-btn" onclick="renderPage('assign')">Assign</button>
                <button class="qa-btn" onclick="renderPage('chat')">Chat</button>
                <button class="qa-btn" onclick="renderPage('debts')">Loans</button>
                <button class="qa-btn" onclick="renderPage('shop')">Shop</button>
                <button class="qa-btn" onclick="renderPage('math')">Analytics</button>
                <button class="qa-btn" onclick="renderPage('rules')">Rules</button>
                ${isOwner ? `<button class="qa-btn" onclick="resetDemoData()">♻️ Full reset</button>` : ''}
            </div>
        </div>
    `;
}

function toggleSetting(key, value) {
    const s = loadAppSettings();
    s[key] = value;
    saveAppSettings(s);
    notify('Setting saved', `${key} is now ${value ? 'ON' : 'OFF'}`, 'success');
}

function doBroadcast(type) {
    const msg = document.getElementById('broadcast-msg')?.value.trim();
    if (!msg) {
        notify('Empty', 'Type a message first', 'danger');
        return;
    }
    postAnnouncement(msg);
    chatMessages.push({
        id: Date.now(),
        userId: currentUser.id,
        name: currentUser.name,
        text: '📢 ' + msg,
        type: 'text',
        channel: 'general',
        time: timeNow()
    });
    saveChat(chatMessages);
    document.getElementById('broadcast-msg').value = '';
    notify('Sent', 'Everyone will see this announcement', type || 'success');
}

function approveAllPending() {
    const pending = members.filter(m => m.role === 'pending');
    if (!pending.length) {
        notify('None', 'No pending members', 'info');
        return;
    }
    if (!confirm(`Accept all ${pending.length} pending members?`)) return;
    pending.forEach(m => { m.role = 'member'; });
    saveMembers(members);
    notify('Done', `${pending.length} members accepted`, 'success');
    renderPage('settings');
}

function clearChat() {
    if (!confirm('Clear all chat messages?')) return;
    chatMessages = [];
    saveChat(chatMessages);
    notify('Chat cleared', 'All messages removed', 'success');
}

function postSystemMessage() {
    chatMessages.push({
        id: Date.now(),
        userId: 0,
        name: 'System',
        text: loadAppSettings().welcomeMsg || 'Welcome to Fry Menu!',
        time: timeNow()
    });
    saveChat(chatMessages);
    notify('Posted', 'System message added to chat', 'success');
}

function exportData() {
    const data = {
        members: members.map(m => ({ ...m, password: '***' })),
        debts,
        chatCount: chatMessages.length,
        orders: loadOrders(),
        settings: loadAppSettings(),
        exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fry-menu-export.json';
    a.click();
    URL.revokeObjectURL(url);
    notify('Exported', 'JSON file downloaded', 'success');
}

function clearOrders() {
    if (!confirm('Clear all shop orders?')) return;
    saveOrders([]);
    notify('Orders cleared', '', 'success');
}

function clearDebtsAdmin() {
    if (!confirm('Clear ALL loan records?')) return;
    debts = [];
    saveDebts(debts);
    notify('Loans cleared', '', 'success');
}

function resetDemoData() {
    if (currentUser.role !== 'owner') return;
    if (!confirm('Reset everything except Owner? This cannot be undone.')) return;
    members = [{ ...DEFAULT_MEMBERS[0] }];
    debts = [];
    chatMessages = [];
    saveMembers(members);
    saveDebts(debts);
    saveChat(chatMessages);
    saveOrders([]);
    currentUser = members[0];
    saveSession(currentUser);
    notify('Reset complete', 'Only Owner remains', 'success');
    renderPage('settings');
}

function renderProfile() {
    content.innerHTML = `
        <div class="card mb-4">
            <div style="text-align:center;margin-bottom:20px;">
                <div class="avatar" style="width:64px;height:64px;font-size:1.6rem;margin:0 auto 12px;">
                    ${currentUser.name.charAt(0).toUpperCase()}
                </div>
                <h2 style="font-size:1.3rem;">${currentUser.name}</h2>
                <div style="margin-top:6px;">${roleBadge(currentUser.role)}</div>
            </div>
            <div class="profile-stat"><span class="profile-label">Friday take-out</span><span class="profile-value">${formatRand(currentUser.fridayTakeout)}</span></div>
            <div class="profile-stat"><span class="profile-label">Budget</span><span class="profile-value">${formatRand(currentUser.budget)}</span></div>
            <div class="profile-stat"><span class="profile-label">Joined</span><span class="profile-value">${formatDate(currentUser.joined)}</span></div>
        </div>
        <div class="action-grid mb-4">
            <button class="action-tile" onclick="openEditMoney()"><span>✏️</span>Edit money</button>
            <button class="action-tile" onclick="renderPage('shop')"><span>🛒</span>Fry Shop</button>
            <button class="action-tile" onclick="renderPage('debts')"><span>💰</span>My loans</button>
            <button class="action-tile" onclick="renderPage('chat')"><span>💬</span>Chat</button>
        </div>
        <button class="btn btn-secondary btn-full" onclick="logout()">Logout</button>
    `;
}

function openAssignRole(memberId) {
    if (!canAssignRoles()) return;
    const member = members.find(m => m.id === memberId);
    if (!member || member.role === 'owner') return;
    modalTitle.textContent = `Role — ${member.name}`;
    modalBody.innerHTML = `
        <div class="form-group">
            <label>New Role</label>
            <select class="form-control" id="modal-role">
                ${ROLES.filter(r => r.id !== 'owner').map(r => `
                    <option value="${r.id}" ${r.id === member.role ? 'selected' : ''}>${r.name}</option>
                `).join('')}
            </select>
        </div>
    `;
    modalFooter.innerHTML = `
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="confirmAssign(${memberId})">Save</button>
    `;
    openModal();
}

function confirmAssign(memberId) {
    const newRole = document.getElementById('modal-role').value;
    const member = members.find(m => m.id === memberId);
    if (member && newRole) {
        member.role = newRole;
        saveMembers(members);
        closeModal();
        renderPage(currentPage);
        notify('Role updated', `${member.name} is now ${getRole(newRole).name}`, 'success');
    }
}

function doAssign() {
    const memberId = parseInt(document.getElementById('assign-member').value);
    const newRole = document.getElementById('assign-role').value;
    if (!memberId || !newRole) {
        notify('Select both', 'Member and role required', 'danger');
        return;
    }
    const member = members.find(m => m.id === memberId);
    if (member) {
        member.role = newRole;
        saveMembers(members);
        renderPage(currentPage);
        notify('Assigned', `${member.name} → ${getRole(newRole).name}`, 'success');
    }
}

function approveMember(id) {
    const m = members.find(x => x.id === id);
    if (m) {
        m.role = 'member';
        saveMembers(members);
        renderPage(currentPage);
        notify('Accepted', `${m.name} is now a Member`, 'success');
    }
}

function declineMember(id) {
    const m = members.find(x => x.id === id);
    if (m) {
        m.role = 'declined';
        saveMembers(members);
        renderPage(currentPage);
        notify('Declined', `${m.name} was declined`, 'info');
    }
}

function removeMember(id) {
    const m = members.find(x => x.id === id);
    if (!m || m.role === 'owner') return;
    if (!confirm(`Remove ${m.name}?`)) return;
    members = members.filter(x => x.id !== id);
    saveMembers(members);
    renderPage(currentPage);
    notify('Removed', `${m.name} removed`, 'info');
}

function openAddMember() {
    modalTitle.textContent = 'Add Member';
    modalBody.innerHTML = `
        <div class="form-group"><label>Name</label><input class="form-control" id="new-name"></div>
        <div class="form-group"><label>Password</label><input class="form-control" id="new-password" value="1234"></div>
        <div class="form-group"><label>Friday (R)</label><input type="number" class="form-control" id="new-friday" value="0"></div>
        <div class="form-group"><label>Budget (R)</label><input type="number" class="form-control" id="new-budget" value="0"></div>
        <div class="form-group">
            <label>Role</label>
            <select class="form-control" id="new-role">
                ${ROLES.filter(r => r.id !== 'owner').map(r => `
                    <option value="${r.id}" ${r.id === 'pending' ? 'selected' : ''}>${r.name}</option>
                `).join('')}
            </select>
        </div>
    `;
    modalFooter.innerHTML = `
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="confirmAddMember()">Add</button>
    `;
    openModal();
}

function confirmAddMember() {
    const name = document.getElementById('new-name').value.trim();
    const password = document.getElementById('new-password').value || '1234';
    const friday = Number(document.getElementById('new-friday').value) || 0;
    const budget = Number(document.getElementById('new-budget').value) || 0;
    const role = document.getElementById('new-role').value;
    if (!name) { notify('Name required', '', 'danger'); return; }
    if (members.some(m => m.name.toLowerCase() === name.toLowerCase())) {
        notify('Name taken', '', 'danger'); return;
    }
    members.push({
        id: Math.max(...members.map(m => m.id), 0) + 1,
        name, username: name.toLowerCase().replace(/\s+/g, ''),
        password, role, fridayTakeout: friday, budget,
        joined: new Date().toISOString().slice(0, 10), email: ''
    });
    saveMembers(members);
    closeModal();
    renderPage(currentPage);
    notify('Added', `${name} added`, 'success');
}

function openModal() { modalOverlay.classList.add('open'); }
function closeModal() { modalOverlay.classList.remove('open'); }
document.getElementById('modal-close').addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });

document.getElementById('menu-toggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
});

window.openAssignRole = openAssignRole;
window.confirmAssign = confirmAssign;
window.doAssign = doAssign;
window.approveMember = approveMember;
window.declineMember = declineMember;
window.removeMember = removeMember;
window.openAddMember = openAddMember;
window.confirmAddMember = confirmAddMember;
window.muteMember = muteMember;
window.confirmMute = confirmMute;
window.timeoutMember = timeoutMember;
window.confirmTimeout = confirmTimeout;
window.banMember = banMember;
window.openAddDebt = openAddDebt;
window.confirmAddDebt = confirmAddDebt;
window.openBorrowLoan = openBorrowLoan;
window.confirmBorrowLoan = confirmBorrowLoan;
window.openEditMoney = openEditMoney;
window.saveEditMoney = saveEditMoney;
window.orderItem = orderItem;
window.renderPage = renderPage;
window.markPaid = markPaid;
window.toggleSetting = toggleSetting;
window.doBroadcast = doBroadcast;
window.approveAllPending = approveAllPending;
window.clearChat = clearChat;
window.postSystemMessage = postSystemMessage;
window.exportData = exportData;
window.clearOrders = clearOrders;
window.clearDebtsAdmin = clearDebtsAdmin;
window.resetDemoData = resetDemoData;
window.issueWarning = issueWarning;
window.copyJoinCode = copyJoinCode;
window.importMemberFromCode = importMemberFromCode;
window.refreshFromStorage = refreshFromStorage;
window.ownerPower = ownerPower;
window.backupAllData = backupAllData;
window.restoreFromBackup = restoreFromBackup;
window.showBorrowForm = showBorrowForm;
window.acceptLoan = acceptLoan;
window.declineLoan = declineLoan;
window.pingDebtor = pingDebtor;
window.postAnnouncement = postAnnouncement;
window.deleteChatMessage = deleteChatMessage;
window.startDM = startDM;
window.renderDM = renderDM;
window.removeDebt = removeDebt;
window.closeModal = closeModal;
window.logout = logout;

setAuthMode('create');
startSplash();
