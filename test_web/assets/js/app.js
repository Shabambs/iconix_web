/* ==========================================================================
   MAIN APP CONTROLLER - MEMBERS HUB & BIOLINK MANAGER (WITH DISCORD AUTH & ADMIN SIDE)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Canvas Particles & Audio Controller
    const particles = new ParticleEngine('bg-canvas');
    const audioController = new MusicController();

    // Default Demo Data Fallback
    const defaultMembers = [
        {
            id: 'mem-1',
            discordId: '990000000000000001',
            displayName: 'Sakura',
            handle: '@skrwr1d',
            avatar: 'assets/images/default_avatar.svg',
            status: 'dnd',
            statusText: 'Do Not Disturb',
            bio: '*rise | 🖤🎶',
            badges: ['ICONIX', '1CNX', 'Verified Creator'],
            links: { ig: 'https://instagram.com/skrwr1d', yt: 'https://youtube.com', tt: 'https://tiktok.com/@sakurawrld', dc: 'skrwr1d', sp: 'https://spotify.com', tw: 'https://twitch.tv', fb: '' },
            musicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
            approved: true
        },
        {
            id: 'mem-2',
            discordId: '990000000000000002',
            displayName: 'Brooke',
            handle: '@brooke_vibes',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
            status: 'online',
            statusText: 'Online',
            bio: 'fake it till you make it',
            badges: ['ICONIX', 'Vibe'],
            links: { ig: 'https://instagram.com', yt: '', tt: 'https://tiktok.com', dc: 'brooke#1111', sp: '', tw: '', fb: '' },
            musicUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=chill-abstract-intention-12099.mp3',
            approved: true
        },
        {
            id: 'mem-3',
            discordId: '990000000000000003',
            displayName: 'Dior',
            handle: '@dior_mode',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
            status: 'idle',
            statusText: 'Idle',
            bio: 'by any means necessary',
            badges: ['ICONIX', 'Lead'],
            links: { ig: 'https://instagram.com', yt: 'https://youtube.com', tt: '', dc: 'dior#9999', sp: '', tw: '', fb: '' },
            musicUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f7e090.mp3?filename=aesthetic-night-lofi-124976.mp3',
            approved: true
        }
    ];

    // State Variables
    let members = [];
    let activeMemberId = null;
    let editingMemberId = null;
    let session = { logged_in: false, user_id: null, user: null, is_admin: false };
    let systemSettings = { require_approval: true };

    // DOM Elements
    const entryScreen = document.getElementById('entry-screen');
    const mainApp = document.getElementById('main-app');
    const chanlerCardsGrid = document.getElementById('chanler-cards-grid');
    const memberSearchInput = document.getElementById('member-search-input');
    const pendingApprovalBanner = document.getElementById('pending-approval-banner');

    // Header Auth Elements
    const loginDiscordBtn = document.getElementById('login-discord-btn');
    const userProfilePill = document.getElementById('user-profile-pill');
    const userPillAvatar = document.getElementById('user-pill-avatar');
    const userPillName = document.getElementById('user-pill-name');
    const userPillEditBtn = document.getElementById('user-pill-edit-btn');
    const userPillLogoutBtn = document.getElementById('user-pill-logout-btn');
    const adminTriggerBtn = document.getElementById('admin-trigger-btn');
    const adminBadgeCount = document.getElementById('admin-badge-count');

    // Discord Auth Modal Elements
    const discordAuthModal = document.getElementById('discord-auth-modal');
    const closeDiscordAuthBtn = document.getElementById('close-discord-auth-btn');

    // Admin Auth Modal Elements
    const adminLoginModal = document.getElementById('admin-login-modal');
    const closeAdminLoginBtn = document.getElementById('close-admin-login-btn');
    const adminPassInput = document.getElementById('admin-pass-input');
    const submitAdminLoginBtn = document.getElementById('submit-admin-login-btn');

    // Admin Dashboard Modal Elements
    const adminDashboardModal = document.getElementById('admin-dashboard-modal');
    const closeAdminDashboardBtn = document.getElementById('close-admin-dashboard-btn');
    const adminPendingQueueList = document.getElementById('admin-pending-queue-list');
    const adminRosterTbody = document.getElementById('admin-roster-tbody');
    const adminLogoutBtn = document.getElementById('admin-logout-btn');
    const adminSaveSettingsBtn = document.getElementById('admin-save-settings-btn');
    const settingRequireApproval = document.getElementById('setting-require-approval');
    const settingNewAdminPass = document.getElementById('setting-new-admin-pass');
    const settingDiscordClientId = document.getElementById('setting-discord-client-id');
    const settingDiscordClientSecret = document.getElementById('setting-discord-client-secret');
    const settingDiscordRedirectUri = document.getElementById('setting-discord-redirect-uri');

    // Profile View Modal Elements
    const profileViewModal = document.getElementById('profile-view-modal');
    const closeProfileModalBtn = document.getElementById('close-profile-modal-btn');
    const modalCopyDiscordBtn = document.getElementById('modal-copy-discord-btn');
    const modalShareBtn = document.getElementById('modal-share-btn');

    // Edit Settings Modal Elements
    const settingsModal = document.getElementById('settings-modal');
    const openSettingsBtn = document.getElementById('open-settings-btn');
    const closeSettingsBtn = document.getElementById('close-settings-btn');
    const saveSettingsBtn = document.getElementById('save-settings-btn');
    const resetSettingsBtn = document.getElementById('reset-settings-btn');
    const deleteMemberBtn = document.getElementById('delete-member-btn');
    const modalAddMemberBtn = document.getElementById('modal-add-member-btn');

    // INITIALIZATION
    loadInitialData();

    // Check for Discord OAuth redirects
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('login_success')) {
        setTimeout(() => showToast('✅ ' + urlParams.get('login_success').replace(/\+/g, ' ')), 500);
        window.history.replaceState({}, document.title, window.location.pathname);
        if (entryScreen) entryScreen.click(); // Auto-enter
    } else if (urlParams.has('login_error')) {
        setTimeout(() => showToast('❌ ' + urlParams.get('login_error').replace(/\+/g, ' ')), 500);
        window.history.replaceState({}, document.title, window.location.pathname);
        if (entryScreen) entryScreen.click(); // Auto-enter
    } else if (urlParams.has('member')) {
        // Direct profile link — bypass entry screen and open the profile immediately
        const targetMemberId = urlParams.get('member');
        entryScreen?.classList.add('fade-out');
        mainApp?.classList.remove('hidden');
        // Wait for members data to load then open the profile
        window._directProfileId = targetMemberId;
    }

    /* ENTRY OVERLAY UNLOCK */
    entryScreen?.addEventListener('click', () => {
        entryScreen.classList.add('fade-out');
        mainApp.classList.remove('hidden');
    });

    /* SEARCH FILTER FOR CARDS GRID */
    memberSearchInput?.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        renderChanlerGrid(query);
    });

    /* API DATA FETCHING & SESSION SYNC */
    async function loadInitialData() {
        try {
            const res = await fetch('api.php?action=get_members');
            if (!res.ok) throw new Error('API offline');
            const data = await res.json();
            if (data.success) {
                members = data.members || [];
                session = data.session || session;
                systemSettings.require_approval = data.require_approval ?? true;
                updateSessionUI();
                renderChanlerGrid();
                if (session.is_admin) {
                    fetchAdminData();
                }
                // Auto-open profile if opened via direct share link
                if (window._directProfileId) {
                    openProfileViewModal(window._directProfileId);
                }
                return;
            }
        } catch (err) {
            console.log('Falling back to local data:', err);
            loadMembersFromLocalStorage();
        }
    }

    function loadMembersFromLocalStorage() {
        const saved = localStorage.getItem('sakura_biolink_members');
        members = saved ? JSON.parse(saved) : defaultMembers;
        renderChanlerGrid();
        // Auto-open profile if opened via direct share link
        if (window._directProfileId) {
            openProfileViewModal(window._directProfileId);
        }
    }

    /* UPDATE HEADER SESSION UI */
    function updateSessionUI() {
        if (session.logged_in && !session.is_admin && session.user) {
            // Logged in as Discord Member
            loginDiscordBtn?.classList.add('hidden');
            adminTriggerBtn?.classList.add('hidden');
            userProfilePill?.classList.remove('hidden');
            if (userPillAvatar) userPillAvatar.src = session.user.avatar || 'assets/images/default_avatar.svg';
            if (userPillName) userPillName.textContent = session.user.displayName || 'Member';

            // Show pending banner if user account is pending approval
            if (!session.user.approved) {
                pendingApprovalBanner?.classList.remove('hidden');
            } else {
                pendingApprovalBanner?.classList.add('hidden');
            }
        } else if (session.is_admin) {
            // Logged in as Admin
            loginDiscordBtn?.classList.add('hidden');
            userProfilePill?.classList.remove('hidden');
            if (userPillAvatar) userPillAvatar.src = 'iconix_red_tiger_logo.png';
            if (userPillName) userPillName.textContent = 'Admin Mode';
            pendingApprovalBanner?.classList.add('hidden');
        } else {
            // Logged Out
            loginDiscordBtn?.classList.remove('hidden');
            adminTriggerBtn?.classList.remove('hidden');
            userProfilePill?.classList.add('hidden');
            pendingApprovalBanner?.classList.add('hidden');
        }
    }

    /* DISCORD AUTH BUTTONS & MODAL LOGIC */
    loginDiscordBtn?.addEventListener('click', () => {
        discordAuthModal?.classList.remove('hidden');
    });

    closeDiscordAuthBtn?.addEventListener('click', () => {
        discordAuthModal?.classList.add('hidden');
    });

    // 1. LOGIN EXISTING ACCOUNT FORM SUBMIT
    const discordLoginForm = document.getElementById('discord-login-only-form');
    discordLoginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const handle = document.getElementById('dc-login-handle').value.trim();

        if (!handle) {
            showToast('⚠️ Please enter your Discord Tag / Handle.');
            return;
        }

        try {
            const res = await fetch('api.php?action=discord_login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mode: 'login_only', handle })
            });
            const data = await res.json();
            if (data.success) {
                session = {
                    logged_in: true,
                    user_id: data.member.id,
                    user: data.member,
                    is_admin: false
                };
                discordAuthModal?.classList.add('hidden');
                showToast(data.message);
                loadInitialData();
            } else {
                showToast(`❌ ${data.message}`);
            }
        } catch (err) {
            showToast('❌ Error connecting to server.');
        }
    });

    // Registration avatar file handling
    const dcInputAvatar = document.getElementById('dc-input-avatar');
    const browseDcAvatarBtn = document.getElementById('browse-dc-avatar-btn');
    const selectedDcAvatarName = document.getElementById('selected-dc-avatar-name');
    let dcAvatarDataUrl = '';

    if (browseDcAvatarBtn && dcInputAvatar) {
        browseDcAvatarBtn.addEventListener('click', () => {
            dcInputAvatar.click();
        });

        dcInputAvatar.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                if (selectedDcAvatarName) selectedDcAvatarName.textContent = file.name;
                const reader = new FileReader();
                reader.onload = (ev) => {
                    dcAvatarDataUrl = ev.target.result;
                };
                reader.readAsDataURL(file);
            } else {
                if (selectedDcAvatarName) selectedDcAvatarName.textContent = '';
                dcAvatarDataUrl = '';
            }
        });
    }

    // 2. NEW REGISTRATION FORM SUBMIT
    const discordRegisterForm = document.getElementById('discord-register-form');
    discordRegisterForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const displayName = document.getElementById('dc-input-display-name').value.trim();
        const handle = document.getElementById('dc-input-handle').value.trim();
        const avatar = dcAvatarDataUrl || 'assets/images/default_avatar.svg';
        const bio = document.getElementById('dc-input-bio').value.trim();

        if (!displayName || !handle) {
            showToast('⚠️ Please fill out Display Name and Discord Tag for registration.');
            return;
        }

        try {
            const res = await fetch('api.php?action=discord_login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mode: 'register_new', displayName, handle, avatar, bio })
            });
            const data = await res.json();
            if (data.success) {
                showToast(data.message || '✅ Client registered successfully!');
                discordRegisterForm.reset();
                if (selectedDcAvatarName) selectedDcAvatarName.textContent = '';
                dcAvatarDataUrl = '';

                loadInitialData();
                if (session.is_admin) {
                    fetchAdminData();
                    // Go to roster tab to see the newly created user
                    document.querySelector('[data-admin-tab="admin-tab-roster"]')?.click();
                }
            } else {
                showToast(`❌ ${data.message}`);
            }
        } catch (err) {
            showToast('❌ Error connecting to server.');
        }
    });

    /* ADMIN TRIGGER BUTTON & AUTH */
    adminTriggerBtn?.addEventListener('click', () => {
        if (session.is_admin) {
            adminDashboardModal?.classList.remove('hidden');
            fetchAdminData();
        } else {
            adminLoginModal?.classList.remove('hidden');
        }
    });

    closeAdminLoginBtn?.addEventListener('click', () => {
        adminLoginModal?.classList.add('hidden');
    });

    submitAdminLoginBtn?.addEventListener('click', async () => {
        const adminUserInput = document.getElementById('admin-user-input');
        const username = adminUserInput ? adminUserInput.value.trim() : '';
        const password = adminPassInput?.value.trim();
        if (!password || !username) {
            showToast('⚠️ Enter Admin Username & Password.');
            return;
        }
        try {
            const res = await fetch('api.php?action=admin_login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (data.success) {
                adminLoginModal?.classList.add('hidden');
                session.is_admin = true;
                adminDashboardModal?.classList.remove('hidden');
                showToast('👑 Authenticated as Admin!');
                if (adminPassInput) adminPassInput.value = '';
                loadInitialData();
            } else {
                showToast(`❌ ${data.message}`);
            }
        } catch (err) {
            showToast('❌ Auth server error.');
        }
    });

    closeAdminDashboardBtn?.addEventListener('click', () => {
        adminDashboardModal?.classList.add('hidden');
    });

    /* ADMIN DASHBOARD TAB NAVIGATION */
    const adminTabBtns = document.querySelectorAll('[data-admin-tab]');
    const adminTabContents = document.querySelectorAll('.admin-tab-content');

    adminTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            adminTabBtns.forEach(b => b.classList.remove('active'));
            adminTabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const targetId = btn.getAttribute('data-admin-tab');
            document.getElementById(targetId)?.classList.add('active');
        });
    });

    /* FETCH & RENDER ADMIN DASHBOARD DATA */
    async function fetchAdminData() {
        try {
            const res = await fetch('api.php?action=admin_get_all');
            const data = await res.json();
            if (data.success) {
                // Update stats counters
                if (document.getElementById('stat-pending-count')) document.getElementById('stat-pending-count').textContent = data.stats.pending;
                if (document.getElementById('stat-approved-count')) document.getElementById('stat-approved-count').textContent = data.stats.approved;
                if (document.getElementById('stat-total-count')) document.getElementById('stat-total-count').textContent = data.stats.total;
                if (document.getElementById('admin-tab-pending-num')) document.getElementById('admin-tab-pending-num').textContent = data.stats.pending;

                if (adminBadgeCount) {
                    if (data.stats.pending > 0) {
                        adminBadgeCount.textContent = data.stats.pending;
                        adminBadgeCount.classList.remove('hidden');
                    } else {
                        adminBadgeCount.classList.add('hidden');
                    }
                }

                // Render Pending Queue
                renderAdminPendingQueue(data.members.filter(m => !m.approved));

                // Render Roster Table
                renderAdminRosterTable(data.members);

                // Update settings form
                if (settingRequireApproval) settingRequireApproval.checked = data.settings.require_approval;
                if (settingDiscordClientId) settingDiscordClientId.value = data.settings.discord_client_id || '';
                if (settingDiscordClientSecret) settingDiscordClientSecret.value = data.settings.discord_client_secret || '';
                if (settingDiscordRedirectUri) settingDiscordRedirectUri.value = data.settings.discord_redirect_uri || '';
            }
        } catch (err) {
            console.log('Error fetching admin data:', err);
        }
    }

    function renderAdminPendingQueue(pendingList) {
        if (!adminPendingQueueList) return;
        adminPendingQueueList.innerHTML = '';

        if (pendingList.length === 0) {
            adminPendingQueueList.innerHTML = `
                <div style="text-align:center; padding: 40px; color: var(--text-muted);">
                    <i class="fa-solid fa-circle-check" style="font-size:2rem; color:#22c55e; margin-bottom:10px;"></i><br>
                    No pending Discord registrations right now! All accounts are processed.
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

            adminPendingQueueList.appendChild(card);
        });
    }

    function renderAdminRosterTable(allMembers) {
        if (!adminRosterTbody) return;
        adminRosterTbody.innerHTML = '';

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
                        ${!mem.approved ? `<button class="btn btn-sm btn-primary btn-approve-sm" data-id="${mem.id}"><i class="fa-solid fa-check"></i></button>` : ''}
                        <button class="btn btn-sm btn-secondary btn-edit-sm" data-id="${mem.id}"><i class="fa-solid fa-pen"></i> Edit</button>
                        <button class="btn btn-sm btn-danger btn-delete-sm" data-id="${mem.id}"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </td>
            `;

            const approveBtn = tr.querySelector('.btn-approve-sm');
            if (approveBtn) approveBtn.onclick = () => approveMember(mem.id);
            tr.querySelector('.btn-edit-sm').onclick = () => {
                adminDashboardModal.classList.add('hidden');
                openEditModalForMember(mem.id);
            };
            tr.querySelector('.btn-delete-sm').onclick = () => rejectMember(mem.id);

            adminRosterTbody.appendChild(tr);
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
                showToast('✅ Member approved & published!');
                fetchAdminData();
                loadInitialData();
            }
        } catch (err) {
            showToast('❌ Approval failed.');
        }
    }

    async function rejectMember(id) {
        if (!confirm('Are you sure you want to reject/remove this registration?')) return;
        try {
            const res = await fetch('api.php?action=admin_reject', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            const data = await res.json();
            if (data.success) {
                showToast('🗑️ Member removed.');
                fetchAdminData();
                loadInitialData();
            }
        } catch (err) {
            showToast('❌ Action failed.');
        }
    }

    /* SAVE ADMIN SETTINGS */
    adminSaveSettingsBtn?.addEventListener('click', async () => {
        const payload = {
            require_approval: settingRequireApproval ? settingRequireApproval.checked : true,
            admin_password: settingNewAdminPass?.value.trim() || undefined,
            discord_client_id: settingDiscordClientId?.value.trim() || '',
            discord_client_secret: settingDiscordClientSecret?.value.trim() || '',
            discord_redirect_uri: settingDiscordRedirectUri?.value.trim() || ''
        };

        try {
            const res = await fetch('api.php?action=admin_update_settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                showToast('⚙️ Admin settings updated successfully!');
                if (settingNewAdminPass) settingNewAdminPass.value = '';
                fetchAdminData();
            } else {
                showToast(`❌ ${data.message}`);
            }
        } catch (err) {
            showToast('❌ Save settings failed.');
        }
    });

    /* ADMIN LOGOUT */
    adminLogoutBtn?.addEventListener('click', async () => {
        try {
            await fetch('api.php?action=logout');
            session = { logged_in: false, user_id: null, user: null, is_admin: false };
            adminDashboardModal.classList.add('hidden');
            showToast('Logged out from Admin mode.');
            loadInitialData();
        } catch (e) { }
    });

    userPillLogoutBtn?.addEventListener('click', async () => {
        try {
            await fetch('api.php?action=logout');
            session = { logged_in: false, user_id: null, user: null, is_admin: false };
            showToast('Logged out.');
            loadInitialData();
        } catch (e) { }
    });

    /* RENDER CHANLER MEMBER CARDS GRID */
    function renderChanlerGrid(filterQuery = '') {
        if (!chanlerCardsGrid) return;
        chanlerCardsGrid.innerHTML = '';

        const filtered = members.filter(m =>
            m.displayName.toLowerCase().includes(filterQuery) ||
            m.handle.toLowerCase().includes(filterQuery) ||
            (m.bio && m.bio.toLowerCase().includes(filterQuery))
        );

        if (filtered.length === 0) {
            chanlerCardsGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align:center; padding: 50px; color: var(--text-muted);">
                    No approved squad members found matching "${filterQuery}"
                </div>
            `;
            return;
        }

        filtered.forEach(mem => {
            const card = document.createElement('div');
            card.className = 'chanler-card';

            const statusDotClass = `${mem.status || 'online'}-dot`;

            card.innerHTML = `
                <div class="chanler-avatar-box">
                    <img src="${mem.avatar}" alt="${mem.displayName}" class="chanler-avatar-img" onerror="this.src='assets/images/default_avatar.svg'">
                    <span class="status-dot ${statusDotClass} chanler-status-dot" data-dsid="${mem.discordId || ''}"></span>
                </div>
                <h3 class="chanler-card-name">${mem.displayName}</h3>
                <p class="chanler-card-bio">${mem.bio || '—'}</p>
            `;

            card.addEventListener('click', () => {
                openProfileViewModal(mem.id);
            });

            chanlerCardsGrid.appendChild(card);
        });

        // Initialize Real-time Lanyard WebSocket for all displayed members
        const discordIds = filtered.map(m => m.discordId).filter(id => id);
        if (discordIds.length > 0) {
            initLanyardWS(discordIds);
        }
    }

    /* OPEN MEMBER PROFILE VIEW MODAL & PLAY AUDIO ON CLICK */
    function openProfileViewModal(id) {
        const mem = members.find(m => m.id === id);
        if (!mem) return;

        activeMemberId = id;

        // Fetch Lanyard Presence data if discordId is available
        const spotifyCard = document.getElementById('modal-spotify-status');
        if (spotifyCard) spotifyCard.classList.add('hidden');

        if (mem.discordId) {
            fetch(`https://api.lanyard.rest/v1/users/${mem.discordId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.data && data.data.spotify) {
                        const sp = data.data.spotify;
                        document.getElementById('spotify-album-art').src = sp.album_art_url;
                        document.getElementById('spotify-track-name').textContent = sp.song;
                        document.getElementById('spotify-artist-name').textContent = 'by ' + sp.artist;
                        if (spotifyCard) spotifyCard.classList.remove('hidden');
                    }
                    if (data.success && data.data) {
                        updateLanyardUI(mem.discordId, data.data);
                    }
                })
                .catch(err => console.log('Lanyard API error:', err));
        }

        // Update DOM elements on modal profile
        document.getElementById('modal-profile-avatar').src = mem.avatar;

        const decalEl = document.getElementById('modal-profile-decoration');
        if (mem.decorationUrl) {
            decalEl.src = mem.decorationUrl;
            decalEl.classList.remove('hidden');
        } else {
            decalEl.classList.add('hidden');
            decalEl.src = '';
        }

        document.getElementById('modal-profile-name').textContent = mem.displayName;
        document.getElementById('modal-profile-handle').textContent = mem.handle;
        document.getElementById('modal-profile-status-text').textContent = mem.statusText || mem.status || 'Online';
        document.getElementById('modal-profile-bio').textContent = mem.bio || '';

        // Fullscreen dynamic background GIF applied to the separate blurred div
        const dynamicBg = document.getElementById('dynamic-modal-bg');
        if (dynamicBg) {
            if (mem.bannerUrl) {
                dynamicBg.style.backgroundImage = `url('${mem.bannerUrl}')`;
            } else {
                dynamicBg.style.backgroundImage = '';
            }
        }

        // Just in case, reset the banner element so it's not overriding CSS
        const bannerElement = document.querySelector('.profile-modal-banner');
        if (bannerElement) {
            bannerElement.style.backgroundImage = '';
        }

        // Status Indicator
        const statusBadge = document.getElementById('modal-profile-status-badge');
        const statusDot = document.getElementById('modal-profile-status-dot');
        const currentStatus = mem.status || 'online';
        statusBadge.className = `status-indicator ${currentStatus}`;
        statusDot.className = `status-dot ${currentStatus}-dot`;

        // Badges
        const badgesContainer = document.getElementById('modal-profile-badges');
        badgesContainer.innerHTML = '';
        (mem.badges || ['ICONIX']).forEach((b, idx) => {
            const colorClass = idx === 0 ? 'badge-pink' : idx === 1 ? 'badge-purple' : 'badge-blue';
            const badgeEl = document.createElement('span');
            badgeEl.className = `badge ${colorClass}`;
            badgeEl.innerHTML = `<i class="fa-solid fa-sparkles"></i> ${b}`;
            badgesContainer.appendChild(badgeEl);
        });

        // Render Social Links
        renderModalSocialButtons(mem.links);

        // Copy discord tag listener
        modalCopyDiscordBtn.onclick = () => {
            const tag = mem.links?.dc || mem.handle;
            copyToClipboard(tag, `💬 Copied Discord Tag: ${tag}`);
        };

        // Share profile listener — generates a direct link with ?member=<id>
        modalShareBtn.onclick = () => {
            const base = window.location.origin + window.location.pathname;
            const shareUrl = `${base}?member=${mem.id}`;
            copyToClipboard(shareUrl, `🔗 Profile link copied! Share it to let anyone view ${mem.displayName}'s profile.`);
        };

        // PLAY MEMBER MUSIC — each profile plays its own track, or nothing if no music set
        const modalMusicPlayer = document.querySelector('.modal-music-player');
        const modalTrackTitle = document.getElementById('modal-track-title');
        const modalPlayPauseBtn = document.getElementById('modal-play-pause-btn');
        const modalPlayIcon = document.getElementById('modal-play-icon');
        const modalVolumeSlider = document.getElementById('modal-volume-slider');
        const trackArtist = document.querySelector('.track-artist');

        if (mem.musicUrl && audioController.audio) {
            // Show music player
            if (modalMusicPlayer) modalMusicPlayer.style.display = '';
            if (modalTrackTitle) modalTrackTitle.textContent = `${mem.displayName}'s Anthem`;
            if (trackArtist) trackArtist.textContent = 'Member Background Audio';

            audioController.audio.src = mem.musicUrl;

            if (window._directProfileId && window._directProfileId === id) {
                // Direct link: browser blocks autoplay — wait for first interaction
                if (modalPlayIcon) modalPlayIcon.className = 'fa-solid fa-play';
                if (trackArtist) trackArtist.textContent = '🎵 Tap anywhere to play music';

                const startOnInteraction = () => {
                    audioController.startPlayback();
                    if (modalPlayIcon) modalPlayIcon.className = 'fa-solid fa-pause';
                    if (trackArtist) trackArtist.textContent = 'Member Background Audio';
                };
                document.addEventListener('click', startOnInteraction, { once: true });
                document.addEventListener('touchstart', startOnInteraction, { once: true });
            } else {
                // Normal open (card click = user gesture already happened)
                audioController.startPlayback();
                if (modalPlayIcon) modalPlayIcon.className = 'fa-solid fa-pause';
            }
        } else {
            // No music set for this profile — stop whatever is playing and hide the player
            if (audioController) audioController.pausePlayback();
            if (audioController.audio) audioController.audio.src = '';
            if (modalMusicPlayer) modalMusicPlayer.style.display = 'none';
        }

        // Wire modal play/pause button
        if (modalPlayPauseBtn) {
            modalPlayPauseBtn.onclick = () => {
                audioController.togglePlay();
                if (modalPlayIcon) {
                    modalPlayIcon.className = audioController.isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play';
                }
            };
        }

        // Wire modal volume slider
        if (modalVolumeSlider) {
            modalVolumeSlider.value = audioController.audio.volume;
            modalVolumeSlider.oninput = (e) => {
                audioController.setVolume(e.target.value);
            };
        }

        profileViewModal.classList.remove('hidden');

        // Show footer actions ONLY when the logged-in Discord user views their OWN profile
        const footerActions = document.getElementById('modal-footer-actions');
        if (footerActions) {
            const isOwnProfile = session.logged_in && !session.is_admin && session.user_id === id;
            footerActions.classList.toggle('hidden', !isOwnProfile);
        }
    }

    /* CLOSE PROFILE MODAL & PAUSE MUSIC IMMEDIATELY */
    function closeProfileModal() {
        profileViewModal?.classList.add('hidden');
        if (audioController) {
            audioController.pausePlayback();
        }
    }

    closeProfileModalBtn?.addEventListener('click', closeProfileModal);
    profileViewModal?.addEventListener('click', (e) => {
        if (e.target === profileViewModal) closeProfileModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeProfileModal();
    });

    /* RENDER DYNAMIC SOCIAL MEDIA BUTTONS */
    function renderModalSocialButtons(links = {}) {
        const grid = document.getElementById('modal-profile-socials');
        if (!grid) return;
        grid.innerHTML = '';

        const socialConfig = [
            { key: 'tw', name: 'Twitch', icon: 'fa-brands fa-twitch', class: 'twitch' },
            { key: 'ig', name: 'Instagram', icon: 'fa-brands fa-instagram', class: 'instagram' },
            { key: 'yt', name: 'YouTube', icon: 'fa-brands fa-youtube', class: 'youtube' },
            { key: 'tt', name: 'TikTok', icon: 'fa-brands fa-tiktok', class: 'tiktok' }
        ];

        socialConfig.forEach(soc => {
            const urlVal = links[soc.key];
            if (urlVal && urlVal.trim() !== '') {
                let formattedUrl = urlVal.trim();
                if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
                    formattedUrl = 'https://' + formattedUrl;
                }

                const a = document.createElement('a');
                a.href = formattedUrl;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.className = `social-btn ${soc.class}`;
                a.innerHTML = `
                    <i class="${soc.icon}"></i>
                    <span class="social-label">${soc.name}</span>
                    <i class="fa-solid fa-arrow-up-right-from-square external-icon"></i>
                `;
                grid.appendChild(a);
            }
        });

        if (grid.children.length === 0) {
            grid.innerHTML = `<span style="font-size:0.8rem; color:var(--text-muted); grid-column:1/-1;">No social links added yet.</span>`;
        }
    }

    /* MODAL TAB SWITCHING FOR EDIT SETTINGS MODAL */
    const tabBtns = document.querySelectorAll('.tab-btn:not([data-admin-tab])');
    const tabContents = document.querySelectorAll('.tab-content:not(.admin-tab-content)');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(tabId)?.classList.add('active');
        });
    });

    /* EDIT PROFILE BUTTON HANDLERS */
    openSettingsBtn?.addEventListener('click', () => {
        checkEditPermissionsAndOpen();
    });

    userPillEditBtn?.addEventListener('click', () => {
        checkEditPermissionsAndOpen();
    });

    function checkEditPermissionsAndOpen() {
        if (!session.logged_in && !session.is_admin) {
            showToast('🔑 Kailangan mong mag-login gamit ang Discord para ma-edit ang iyong profile.');
            discordAuthModal?.classList.remove('hidden');
            return;
        }

        if (session.is_admin) {
            // Admin can edit any profile card
            openEditModalForMember(editingMemberId || activeMemberId || (members[0] ? members[0].id : null));
        } else {
            // Regular User can ONLY edit THEIR OWN profile
            openEditModalForMember(session.user_id);
        }
    }

    closeSettingsBtn?.addEventListener('click', () => {
        settingsModal.classList.add('hidden');
    });

    settingsModal?.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.classList.add('hidden');
        }
    });

    /* OPEN MODAL FOR SPECIFIC MEMBER WITH PERMISSION LOCK */
    function openEditModalForMember(id) {
        editingMemberId = id;
        renderModalMemberSelector();
        populateModalInputs(id);

        // PERMISSION LOCK FOR REGULAR DISCORD USERS:
        const selectTabBtn = document.querySelector('[data-tab="tab-select-member"]');
        if (!session.is_admin && session.logged_in) {
            // Hide member selector tab & hide delete button for non-admin
            if (selectTabBtn) selectTabBtn.style.display = 'none';
            if (deleteMemberBtn) deleteMemberBtn.style.display = 'none';

            // Auto activate Profile Info Tab
            document.querySelector('[data-tab="tab-profile"]')?.click();
        } else {
            if (selectTabBtn) selectTabBtn.style.display = 'inline-block';
            if (deleteMemberBtn) deleteMemberBtn.style.display = 'inline-block';
        }

        settingsModal.classList.remove('hidden');
    }

    function renderModalMemberSelector() {
        const grid = document.getElementById('modal-member-selector-grid');
        if (!grid) return;
        grid.innerHTML = '';

        members.forEach(mem => {
            const card = document.createElement('div');
            card.className = `modal-member-card ${mem.id === editingMemberId ? 'active' : ''}`;
            card.innerHTML = `
                <img src="${mem.avatar}" alt="${mem.displayName}" onerror="this.src='assets/images/default_avatar.svg'">
                <span>${mem.displayName}</span>
            `;
            card.addEventListener('click', () => {
                editingMemberId = mem.id;
                renderModalMemberSelector();
                populateModalInputs(mem.id);
            });
            grid.appendChild(card);
        });
    }

    function populateModalInputs(id) {
        const mem = members.find(m => m.id === id);
        if (!mem) return;

        document.getElementById('input-display-name').value = mem.displayName || '';
        document.getElementById('input-handle').value = mem.handle || '';
        document.getElementById('input-avatar-url').value = (mem.avatar && mem.avatar.startsWith('data:')) ? '[Uploaded Image]' : (mem.avatar || '');
        document.getElementById('input-status').value = mem.status || 'online';
        document.getElementById('input-status-text').value = mem.statusText || '';
        document.getElementById('input-bio').value = mem.bio || '';
        document.getElementById('input-badges').value = (mem.badges || []).join(', ');

        const l = mem.links || {};
        if (document.getElementById('input-tw')) document.getElementById('input-tw').value = l.tw || '';
        if (document.getElementById('input-ig')) document.getElementById('input-ig').value = l.ig || '';
        if (document.getElementById('input-yt')) document.getElementById('input-yt').value = l.yt || '';
        if (document.getElementById('input-tt')) document.getElementById('input-tt').value = l.tt || '';

        if (mem.musicUrl && document.getElementById('input-music-url')) {
            document.getElementById('input-music-url').value = mem.musicUrl.startsWith('data:') ? '[Uploaded MP3 File]' : mem.musicUrl;
        }

        if (document.getElementById('input-banner-url')) {
            document.getElementById('input-banner-url').value = mem.bannerUrl || '';
            const selectedBannerName = document.getElementById('selected-banner-name');
            if (selectedBannerName) selectedBannerName.textContent = mem.bannerUrl ? '✅ Banner Present' : '';
        }
    }

    // FILE PICKERS FOR AVATAR & MUSIC
    const browseAvatarBtn = document.getElementById('browse-avatar-btn');
    const inputAvatarFile = document.getElementById('input-avatar-file');
    const selectedAvatarName = document.getElementById('selected-avatar-name');

    browseAvatarBtn?.addEventListener('click', () => inputAvatarFile?.click());
    inputAvatarFile?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            selectedAvatarName.textContent = `⏳ Loading ${file.name}...`;
            const reader = new FileReader();
            reader.onload = (event) => {
                document.getElementById('input-avatar-url').value = event.target.result;
                selectedAvatarName.textContent = `🖼️ Selected: ${file.name}`;
                showToast(`🖼️ Avatar loaded: ${file.name}`);
            };
            reader.readAsDataURL(file);
        }
    });

    const browseMp3Btn = document.getElementById('browse-mp3-btn');
    const inputMusicFile = document.getElementById('input-music-file');
    const selectedFileName = document.getElementById('selected-file-name');

    browseMp3Btn?.addEventListener('click', () => inputMusicFile?.click());
    inputMusicFile?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            selectedFileName.textContent = `⏳ Loading ${file.name}...`;
            const reader = new FileReader();
            reader.onload = (event) => {
                document.getElementById('input-music-url').value = event.target.result;
                selectedFileName.textContent = `🎵 Selected: ${file.name}`;
                showToast(`🎵 Uploaded MP3: ${file.name}`);
            };
            reader.readAsDataURL(file);
        }
    });

    const browseBannerBtn = document.getElementById('browse-banner-btn');
    const inputBannerFile = document.getElementById('input-banner-file');
    const selectedBannerName = document.getElementById('selected-banner-name');

    browseBannerBtn?.addEventListener('click', () => inputBannerFile?.click());
    inputBannerFile?.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            selectedBannerName.textContent = `⏳ Uploading ${file.name}...`;
            const formData = new FormData();
            formData.append('file', file);

            try {
                const res = await fetch('api.php?action=upload_file', {
                    method: 'POST',
                    body: formData
                });
                const data = await res.json();
                if (data.success) {
                    document.getElementById('input-banner-url').value = data.url;
                    selectedBannerName.textContent = `✅ Uploaded: ${file.name}`;
                    showToast(`🖼️ Banner uploaded: ${file.name}`);
                } else {
                    selectedBannerName.textContent = `❌ Upload failed`;
                    showToast(`❌ ${data.message}`);
                }
            } catch (err) {
                selectedBannerName.textContent = `❌ Upload error`;
                showToast(`❌ Error uploading file.`);
            }
        }
    });

    /* SAVE MODAL EDITS VIA API */
    saveSettingsBtn?.addEventListener('click', async () => {
        if (!editingMemberId) return;

        const updatedBadges = document.getElementById('input-badges')?.value
            .split(',')
            .map(b => b.trim())
            .filter(b => b !== '') || [];

        const payload = {
            id: editingMemberId,
            displayName: document.getElementById('input-display-name')?.value || 'Member',
            handle: document.getElementById('input-handle')?.value || '@user',
            avatar: (document.getElementById('input-avatar-url')?.value === '[Uploaded Image]')
                ? undefined
                : (document.getElementById('input-avatar-url')?.value || 'assets/images/default_avatar.svg'),
            status: document.getElementById('input-status')?.value || 'online',
            statusText: document.getElementById('input-status-text')?.value || '',
            bio: document.getElementById('input-bio')?.value || '',
            badges: updatedBadges,
            links: {
                tw: document.getElementById('input-tw')?.value || '',
                ig: document.getElementById('input-ig')?.value || '',
                yt: document.getElementById('input-yt')?.value || '',
                tt: document.getElementById('input-tt')?.value || ''
            },
            musicUrl: (document.getElementById('input-music-url')?.value === '[Uploaded MP3 File]')
                ? undefined
                : (document.getElementById('input-music-url')?.value || ''),
            bannerUrl: document.getElementById('input-banner-url')?.value || ''
        };

        try {
            const res = await fetch('api.php?action=update_profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                showToast('✨ Profile updated & saved successfully!');
                settingsModal.classList.add('hidden');
                loadInitialData();
            } else {
                showToast(`❌ ${data.message}`);
            }
        } catch (err) {
            showToast('❌ Failed to update profile.');
        }
    });

    /* DELETE MEMBER ACTION */
    deleteMemberBtn?.addEventListener('click', async () => {
        if (!editingMemberId) return;
        if (!confirm('Are you sure you want to delete this member profile?')) return;

        try {
            const res = await fetch('api.php?action=delete_member', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: editingMemberId })
            });
            const data = await res.json();
            if (data.success) {
                showToast('🗑️ Member profile deleted.');
                settingsModal.classList.add('hidden');
                loadInitialData();
            } else {
                showToast(`❌ ${data.message}`);
            }
        } catch (err) {
            showToast('❌ Delete failed.');
        }
    });

    /* COPY TO CLIPBOARD HELPERS */
    function copyToClipboard(text, message) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(message);
        }).catch(() => {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showToast(message);
        });
    }

    /* TOAST NOTIFICATION */
    function showToast(message) {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<span>${message}</span>`;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(() => toast.remove(), 300);
        }, 3200);
    }

    /* REAL-TIME LANYARD WEBSOCKET LOGIC */
    let lanyardSocket = null;
    let lanyardHeartbeat = null;
    let activeSubscriptions = [];

    function initLanyardWS(discordIds) {
        // Prevent duplicate setups for same IDs
        if (lanyardSocket && lanyardSocket.readyState === WebSocket.OPEN) {
            return;
        }

        if (lanyardSocket) {
            lanyardSocket.close();
            clearInterval(lanyardHeartbeat);
        }

        activeSubscriptions = discordIds;
        lanyardSocket = new WebSocket('wss://api.lanyard.rest/socket');

        lanyardSocket.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            if (msg.op === 1) { // Hello event
                const interval = msg.d.heartbeat_interval;
                lanyardHeartbeat = setInterval(() => {
                    if (lanyardSocket.readyState === WebSocket.OPEN) {
                        lanyardSocket.send(JSON.stringify({ op: 3 }));
                    }
                }, interval);

                // Subscribe to all presence updates
                lanyardSocket.send(JSON.stringify({
                    op: 2,
                    d: { subscribe_to_ids: activeSubscriptions }
                }));
            } else if (msg.op === 0) { // Event
                if (msg.t === 'INIT_STATE') {
                    for (const dId in msg.d) {
                        updateLanyardUI(dId, msg.d[dId]);
                    }
                } else if (msg.t === 'PRESENCE_UPDATE') {
                    updateLanyardUI(msg.d.discord_user.id, msg.d);
                }
            }
        };

        lanyardSocket.onclose = () => {
            clearInterval(lanyardHeartbeat);
            lanyardSocket = null;
            // Attempt to reconnect after 5 seconds if we still have subscriptions
            if (activeSubscriptions.length > 0) {
                setTimeout(() => initLanyardWS(activeSubscriptions), 5000);
            }
        };
    }

    function updateLanyardUI(discordId, data) {
        if (!data) return;

        const statusMap = {
            online: 'online',
            idle: 'idle',
            dnd: 'dnd',
            offline: 'offline'
        };
        const discordStatus = statusMap[data.discord_status] || 'offline';

        // 1. Update Grid Cards
        const gridDots = document.querySelectorAll(`.chanler-status-dot[data-dsid="${discordId}"]`);
        gridDots.forEach(dot => {
            dot.className = `status-dot ${discordStatus}-dot chanler-status-dot`;
        });

        // 2. Update Profile Modal (if it's the active member)
        if (activeMemberId) {
            const mem = members.find(m => m.id === activeMemberId);
            if (mem && mem.discordId === discordId) {
                const statusBadge = document.getElementById('modal-profile-status-badge');
                const statusDot = document.getElementById('modal-profile-status-dot');
                const statusTextEl = document.getElementById('modal-profile-status-text');

                if (statusBadge && statusDot) {
                    statusBadge.className = `status-indicator ${discordStatus}`;
                    statusDot.className = `status-dot ${discordStatus}-dot`;
                }

                // Update Status Text (Support Custom Status or Fallback to Online/DND/Idle)
                if (statusTextEl) {
                    let customText = null;
                    if (data.activities && data.activities.length > 0) {
                        const customActivity = data.activities.find(a => a.type === 4);
                        if (customActivity && customActivity.state) {
                            customText = customActivity.state;
                            // Optionally prepend emoji if it exists
                            if (customActivity.emoji && customActivity.emoji.name) {
                                customText = customActivity.emoji.name + ' ' + customText;
                            }
                        }
                    }
                    const textMap = { online: 'Online', idle: 'Idle', dnd: 'Do Not Disturb', offline: 'Offline' };
                    statusTextEl.textContent = customText || textMap[discordStatus] || 'Offline';
                }

                // Live Spotify Update
                const spotifyCard = document.getElementById('modal-spotify-status');
                if (data.listening_to_spotify && data.spotify) {
                    const sp = data.spotify;
                    document.getElementById('spotify-album-art').src = sp.album_art_url;
                    document.getElementById('spotify-track-name').textContent = sp.song;
                    document.getElementById('spotify-artist-name').textContent = 'by ' + sp.artist;
                    if (spotifyCard) spotifyCard.classList.remove('hidden');
                } else {
                    if (spotifyCard) spotifyCard.classList.add('hidden');
                }
            }
        }
    }
});
