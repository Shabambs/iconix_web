<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ICONIX Admin Portal — Member Approval & Roster Management</title>
    <meta name="description" content="Admin Control Panel for ICONIX Squad Hub.">
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
    
    <!-- FontAwesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- App Stylesheet -->
    <link rel="stylesheet" href="assets/css/style.css">
    
    <style>
        body {
            background-color: var(--bg-dark);
            color: var(--text-main);
            font-family: var(--font-body);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .admin-page-container {
            width: 100%;
            max-width: 1000px;
            margin: 0 auto;
        }

        .admin-auth-box {
            max-width: 440px;
            margin: 80px auto;
            background: rgba(16, 10, 14, 0.92);
            border: 1px solid rgba(230, 0, 0, 0.4);
            border-radius: 28px;
            padding: 36px 30px;
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(230, 0, 0, 0.25);
            backdrop-filter: blur(20px);
            text-align: center;
        }

        .admin-brand-logo {
            height: 70px;
            width: auto;
            margin-bottom: 12px;
            filter: drop-shadow(0 0 20px rgba(230, 0, 0, 0.9));
        }

        .admin-auth-title {
            font-family: var(--font-heading);
            font-size: 1.8rem;
            font-weight: 900;
            background: linear-gradient(180deg, #ff3333 0%, #d00000 55%, #800000 100%);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: 1px;
            margin-bottom: 6px;
        }

        .admin-auth-subtitle {
            font-size: 0.85rem;
            color: var(--text-muted);
            margin-bottom: 28px;
        }

        .form-group {
            text-align: left;
            margin-bottom: 18px;
        }

        .form-group label {
            display: block;
            font-size: 0.82rem;
            font-weight: 700;
            color: var(--text-muted);
            margin-bottom: 8px;
        }

        .form-group input {
            width: 100%;
            background: rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 14px;
            padding: 12px 16px;
            color: #fff;
            font-size: 0.9rem;
            outline: none;
            transition: var(--transition-fast);
        }

        .form-group input:focus {
            border-color: var(--primary-pink);
            box-shadow: 0 0 15px var(--neon-glow);
        }

        .btn-admin-login {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #e60000 0%, #b91c1c 100%);
            color: #fff;
            border: none;
            border-radius: 16px;
            font-size: 0.95rem;
            font-weight: 800;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
            box-shadow: 0 0 20px rgba(230, 0, 0, 0.4);
            transition: var(--transition-fast);
            margin-top: 10px;
        }

        .btn-admin-login:hover {
            transform: translateY(-2px);
            box-shadow: 0 0 30px rgba(230, 0, 0, 0.7);
        }

        .back-to-site-link {
            display: inline-block;
            margin-top: 20px;
            font-size: 0.82rem;
            color: var(--text-muted);
            text-decoration: none;
            transition: var(--transition-fast);
        }

        .back-to-site-link:hover {
            color: #fff;
        }

        /* ADMIN PANEL STYLES WHEN LOGGED IN */
        .admin-main-panel {
            background: rgba(16, 10, 14, 0.9);
            border: 1px solid rgba(230, 0, 0, 0.35);
            border-radius: 28px;
            padding: 30px;
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(230, 0, 0, 0.2);
            backdrop-filter: blur(20px);
        }

        .admin-top-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 28px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            padding-bottom: 20px;
        }

        .admin-title-group {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .admin-title-group h1 {
            font-family: var(--font-heading);
            font-size: 1.6rem;
            font-weight: 900;
            color: #fff;
        }

        .admin-badge-pill {
            background: rgba(34, 197, 94, 0.15);
            border: 1px solid rgba(34, 197, 94, 0.4);
            color: #4ade80;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .admin-badge-pill i {
            font-size: 0.5rem;
        }
    </style>
</head>
<body class="theme-dark">

    <div class="bg-overlay"></div>

    <div class="admin-page-container">

        <!-- 1. ADMIN AUTH BOX (WHEN NOT LOGGED IN) -->
        <div id="admin-auth-box" class="admin-auth-box">
            <img src="iconix_red_tiger_logo.png" alt="ICONIX Logo" class="admin-brand-logo">
            <h1 class="admin-auth-title">ICONIX ADMIN</h1>
            <p class="admin-auth-subtitle">Restricted Management Portal — Login required</p>

            <form id="admin-login-form" onsubmit="return false;">
                <div class="form-group">
                    <label for="admin-username-input"><i class="fa-solid fa-user"></i> Admin Username</label>
                    <input type="text" id="admin-username-input" placeholder="Default: admin" required>
                </div>
                <div class="form-group">
                    <label for="admin-password-input"><i class="fa-solid fa-key"></i> Admin Password</label>
                    <input type="password" id="admin-password-input" placeholder="Default: admin123" required>
                </div>
                <button type="submit" id="btn-submit-admin-login" class="btn-admin-login">
                    <i class="fa-solid fa-shield-halved"></i> Authenticate & Enter Admin Panel
                </button>
            </form>

            <a href="index.html" class="back-to-site-link"><i class="fa-solid fa-arrow-left"></i> Back to Main Website Roster</a>
        </div>

        <!-- 2. ADMIN MAIN PANEL (WHEN LOGGED IN) -->
        <div id="admin-main-panel" class="admin-main-panel hidden">
            
            <div class="admin-top-header">
                <div class="admin-title-group">
                    <img src="iconix_red_tiger_logo.png" alt="ICONIX" style="height:42px;">
                    <div>
                        <h1>ICONIX Admin Management Center</h1>
                        <span class="admin-badge-pill"><i class="fa-solid fa-circle"></i> Authorized Administrator</span>
                    </div>
                </div>
                <div style="display:flex; gap:12px;">
                    <a href="index.html" target="_blank" class="btn btn-secondary" style="text-decoration:none;"><i class="fa-solid fa-eye"></i> View Public Site</a>
                    <button class="btn btn-danger" id="admin-panel-logout-btn"><i class="fa-solid fa-right-from-bracket"></i> Logout</button>
                </div>
            </div>

            <!-- ADMIN STATS HEADER -->
            <div class="admin-stats-grid">
                <div class="admin-stat-card pending-stat">
                    <div class="stat-icon"><i class="fa-solid fa-clock-rotate-left"></i></div>
                    <div class="stat-info">
                        <span class="stat-number" id="stat-pending-count">0</span>
                        <span class="stat-label">Pending Approvals</span>
                    </div>
                </div>
                <div class="admin-stat-card approved-stat">
                    <div class="stat-icon"><i class="fa-solid fa-circle-check"></i></div>
                    <div class="stat-info">
                        <span class="stat-number" id="stat-approved-count">0</span>
                        <span class="stat-label">Approved Members</span>
                    </div>
                </div>
                <div class="admin-stat-card total-stat">
                    <div class="stat-icon"><i class="fa-solid fa-users"></i></div>
                    <div class="stat-info">
                        <span class="stat-number" id="stat-total-count">0</span>
                        <span class="stat-label">Total Registered Accounts</span>
                    </div>
                </div>
            </div>

            <!-- ADMIN TAB NAVIGATION -->
            <div class="tab-nav admin-tabs" style="margin-bottom: 20px;">
                <button class="tab-btn active" data-tab="admin-tab-pending">
                    <i class="fa-solid fa-user-clock"></i> Pending Approvals (<span id="admin-tab-pending-num">0</span>)
                </button>
                <button class="tab-btn" data-tab="admin-tab-roster">
                    <i class="fa-solid fa-users-gear"></i> All Members Roster
                </button>
                <button class="tab-btn" data-tab="admin-tab-settings">
                    <i class="fa-solid fa-sliders"></i> Admin & Discord Settings
                </button>
            </div>

            <!-- TAB 1: PENDING APPROVAL QUEUE -->
            <div class="admin-tab-content active" id="admin-tab-pending">
                <div class="pending-queue-list" id="admin-pending-queue-list">
                    <!-- Dynamic Pending Cards Injected via JS -->
                </div>
            </div>

            <!-- TAB 2: ALL MEMBERS ROSTER -->
            <div class="admin-tab-content" id="admin-tab-roster">
                <div class="table-responsive">
                    <table class="members-table">
                        <thead>
                            <tr>
                                <th>Member Info</th>
                                <th>Discord Handle</th>
                                <th>Approval Status</th>
                                <th>Registration Date</th>
                                <th>Admin Actions</th>
                            </tr>
                        </thead>
                        <tbody id="admin-roster-tbody">
                            <!-- Dynamic Roster Rows -->
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- TAB 3: ADMIN SETTINGS -->
            <div class="admin-tab-content" id="admin-tab-settings">
                <div class="admin-settings-section">
                    <h3><i class="fa-solid fa-shield-halved"></i> Registration & Approval Settings</h3>
                    <div class="toggle-setting-box">
                        <div class="setting-info">
                            <strong>Require Admin Approval for Discord Registrations</strong>
                            <p>When turned ON, new users who link their Discord must be manually approved by Admin before appearing on the website roster.</p>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="setting-require-approval" checked>
                            <span class="slider round"></span>
                        </label>
                    </div>

                    <h3 style="margin-top: 25px;"><i class="fa-solid fa-lock"></i> Change Admin Credentials</h3>
                    <div class="form-group">
                        <label for="setting-new-admin-user">New Admin Username</label>
                        <input type="text" id="setting-new-admin-user" placeholder="Enter new username to change">
                    </div>
                    <div class="form-group">
                        <label for="setting-new-admin-pass">New Admin Password</label>
                        <input type="password" id="setting-new-admin-pass" placeholder="Enter new password to change">
                    </div>

                    <h3 style="margin-top: 25px;"><i class="fa-brands fa-discord"></i> Discord OAuth2 App Credentials (Optional)</h3>
                    <div class="form-group">
                        <label for="setting-discord-client-id">Discord Application Client ID</label>
                        <input type="text" id="setting-discord-client-id" placeholder="e.g. 123456789012345678">
                    </div>
                    <div class="form-group">
                        <label for="setting-discord-redirect-uri">Discord OAuth Redirect URI</label>
                        <input type="text" id="setting-discord-redirect-uri" placeholder="https://iconix-members101.page.gd/api.php?action=discord_callback">
                    </div>

                    <button class="btn btn-primary" id="admin-save-settings-btn" style="margin-top: 20px;"><i class="fa-solid fa-floppy-disk"></i> Save Admin Settings</button>
                </div>
            </div>

        </div>

    </div>

    <!-- TOAST NOTIFICATIONS -->
    <div id="toast-container" class="toast-container"></div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const adminAuthBox = document.getElementById('admin-auth-box');
            const adminMainPanel = document.getElementById('admin-main-panel');
            const adminLoginForm = document.getElementById('admin-login-form');
            const adminUsernameInput = document.getElementById('admin-username-input');
            const adminPasswordInput = document.getElementById('admin-password-input');
            const adminPanelLogoutBtn = document.getElementById('admin-panel-logout-btn');

            // Tabs
            const tabBtns = document.querySelectorAll('.tab-btn');
            const tabContents = document.querySelectorAll('.admin-tab-content');

            tabBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    tabBtns.forEach(b => b.classList.remove('active'));
                    tabContents.forEach(c => c.classList.remove('active'));

                    btn.classList.add('active');
                    const tabId = btn.getAttribute('data-tab');
                    document.getElementById(tabId)?.classList.add('active');
                });
            });

            // Check Session
            checkAdminSession();

            async function checkAdminSession() {
                try {
                    const res = await fetch('api.php?action=get_session');
                    const data = await res.json();
                    if (data.is_admin) {
                        showAdminPanel();
                    } else {
                        showAuthBox();
                    }
                } catch (e) {
                    showAuthBox();
                }
            }

            function showAuthBox() {
                adminAuthBox.classList.remove('hidden');
                adminMainPanel.classList.add('hidden');
            }

            function showAdminPanel() {
                adminAuthBox.classList.add('hidden');
                adminMainPanel.classList.remove('hidden');
                fetchAdminData();
            }

            adminLoginForm.addEventListener('submit', async () => {
                const username = adminUsernameInput.value.trim();
                const password = adminPasswordInput.value.trim();
                if (!password || !username) return;

                try {
                    const res = await fetch('api.php?action=admin_login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username, password })
                    });
                    const data = await res.json();
                    if (data.success) {
                        showToast('👑 Authenticated as Admin!');
                        showAdminPanel();
                    } else {
                        showToast(`❌ ${data.message}`);
                    }
                } catch (err) {
                    showToast('❌ Server error.');
                }
            });

            adminPanelLogoutBtn.addEventListener('click', async () => {
                await fetch('api.php?action=logout');
                showToast('Logged out from Admin Portal.');
                showAuthBox();
            });

            async function fetchAdminData() {
                try {
                    const res = await fetch('api.php?action=admin_get_all');
                    const data = await res.json();
                    if (data.success) {
                        document.getElementById('stat-pending-count').textContent = data.stats.pending;
                        document.getElementById('stat-approved-count').textContent = data.stats.approved;
                        document.getElementById('stat-total-count').textContent = data.stats.total;
                        document.getElementById('admin-tab-pending-num').textContent = data.stats.pending;

                        renderPendingQueue(data.members.filter(m => !m.approved));
                        renderRosterTable(data.members);

                        document.getElementById('setting-require-approval').checked = data.settings.require_approval;
                        document.getElementById('setting-discord-client-id').value = data.settings.discord_client_id || '';
                        document.getElementById('setting-discord-redirect-uri').value = data.settings.discord_redirect_uri || '';
                    }
                } catch (err) {
                    console.log(err);
                }
            }

            function renderPendingQueue(pendingList) {
                const listEl = document.getElementById('admin-pending-queue-list');
                listEl.innerHTML = '';

                if (pendingList.length === 0) {
                    listEl.innerHTML = `
                        <div style="text-align:center; padding: 50px; color: var(--text-muted);">
                            <i class="fa-solid fa-circle-check" style="font-size:2.2rem; color:#22c55e; margin-bottom:12px;"></i><br>
                            All registrations approved! There are no pending Discord profiles waiting.
                        </div>
                    `;
                    return;
                }

                pendingList.forEach(mem => {
                    const card = document.createElement('div');
                    card.className = 'pending-card';
                    card.innerHTML = `
                        <div class="pending-user-info">
                            <img src="${mem.avatar}" alt="${mem.displayName}" class="pending-avatar" onerror="this.src='assets/images/default_avatar.svg'">
                            <div class="pending-details">
                                <h4>${mem.displayName}</h4>
                                <div class="pending-handle">${mem.handle}</div>
                                <div class="pending-bio">${mem.bio || 'No bio provided'}</div>
                            </div>
                        </div>
                        <div class="pending-actions">
                            <button class="btn-approve" data-id="${mem.id}"><i class="fa-solid fa-check"></i> Approve</button>
                            <button class="btn-reject" data-id="${mem.id}"><i class="fa-solid fa-xmark"></i> Reject</button>
                        </div>
                    `;

                    card.querySelector('.btn-approve').onclick = () => approveMember(mem.id);
                    card.querySelector('.btn-reject').onclick = () => rejectMember(mem.id);

                    listEl.appendChild(card);
                });
            }

            function renderRosterTable(allMembers) {
                const tbody = document.getElementById('admin-roster-tbody');
                tbody.innerHTML = '';

                allMembers.forEach(mem => {
                    const tr = document.createElement('tr');
                    const statusBadge = mem.approved 
                        ? `<span class="badge-approved"><i class="fa-solid fa-check"></i> Approved</span>`
                        : `<span class="badge-pending"><i class="fa-solid fa-hourglass-half"></i> Pending</span>`;

                    tr.innerHTML = `
                        <td>
                            <div class="table-profile-cell">
                                <div class="table-avatar-box">
                                    <img src="${mem.avatar}" alt="${mem.displayName}" onerror="this.src='assets/images/default_avatar.svg'">
                                </div>
                                <div class="table-member-details">
                                    <span class="table-member-name">${mem.displayName}</span>
                                    <span class="table-member-handle">${mem.handle}</span>
                                </div>
                            </div>
                        </td>
                        <td>${mem.links?.dc || mem.handle}</td>
                        <td>${statusBadge}</td>
                        <td><span style="font-size:0.78rem; color:var(--text-muted);">${mem.createdAt || 'N/A'}</span></td>
                        <td>
                            <div style="display:flex; gap:6px;">
                                ${!mem.approved ? `<button class="btn btn-sm btn-primary btn-approve-sm"><i class="fa-solid fa-check"></i></button>` : ''}
                                <button class="btn btn-sm btn-danger btn-delete-sm"><i class="fa-solid fa-trash"></i></button>
                            </div>
                        </td>
                    `;

                    const approveBtn = tr.querySelector('.btn-approve-sm');
                    if (approveBtn) approveBtn.onclick = () => approveMember(mem.id);
                    tr.querySelector('.btn-delete-sm').onclick = () => rejectMember(mem.id);

                    tbody.appendChild(tr);
                });
            }

            async function approveMember(id) {
                try {
                    const res = await fetch('api.php?action=admin_approve', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id })
                    });
                    const data = await res.json();
                    if (data.success) {
                        showToast('✅ Member approved & published to website roster!');
                        fetchAdminData();
                    }
                } catch (err) {
                    showToast('❌ Approval failed.');
                }
            }

            async function rejectMember(id) {
                if (!confirm('Are you sure you want to remove this member profile?')) return;
                try {
                    const res = await fetch('api.php?action=admin_reject', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id })
                    });
                    const data = await res.json();
                    if (data.success) {
                        showToast('🗑️ Registration removed.');
                        fetchAdminData();
                    }
                } catch (err) {
                    showToast('❌ Action failed.');
                }
            }

            document.getElementById('admin-save-settings-btn').addEventListener('click', async () => {
                const payload = {
                    require_approval: document.getElementById('setting-require-approval').checked,
                    admin_username: document.getElementById('setting-new-admin-user').value.trim() || undefined,
                    admin_password: document.getElementById('setting-new-admin-pass').value.trim() || undefined,
                    discord_client_id: document.getElementById('setting-discord-client-id').value.trim(),
                    discord_redirect_uri: document.getElementById('setting-discord-redirect-uri').value.trim()
                };

                try {
                    const res = await fetch('api.php?action=admin_update_settings', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    const data = await res.json();
                    if (data.success) {
                        showToast('⚙️ Admin settings saved successfully!');
                        document.getElementById('setting-new-admin-user').value = '';
                        document.getElementById('setting-new-admin-pass').value = '';
                        fetchAdminData();
                    }
                } catch (e) {
                    showToast('❌ Failed saving settings.');
                }
            });

            function showToast(message) {
                const toastContainer = document.getElementById('toast-container');
                const toast = document.createElement('div');
                toast.className = 'toast';
                toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${message}</span>`;
                toastContainer.appendChild(toast);
                setTimeout(() => {
                    toast.style.opacity = '0';
                    toast.style.transform = 'translateY(10px)';
                    setTimeout(() => toast.remove(), 300);
                }, 3200);
            }
        });
    </script>
</body>
</html>
