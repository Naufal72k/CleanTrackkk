/**
 * CleanTrack User Header Component (REAL-TIME VERSION)
 * File: user-header.js
 * Fitur:
 * 1. Auto-Update Poin & Profil tanpa refresh page.
 * 2. Navigasi Responsif.
 * 3. Indikator Notifikasi Cerdas.
 */

function renderHeader(activePage) {
    // 1. Cek Sesi
    const currentUser = getActiveSession(); // dari user-utils.js
    if (!currentUser) {
        window.location.href = 'Login.html';
        return;
    }

    // 2. Style Config
    const activeClass = "text-sm font-bold text-primary border-b-2 border-primary py-4"; 
    const inactiveClass = "text-sm font-medium text-gray-500 hover:text-primary transition-colors py-4";
    
    // Logic Active State
    const isReports = activePage === 'reports' ? activeClass : inactiveClass;
    const isNew = activePage === 'new' ? activeClass : inactiveClass;
    
    // 3. HTML Template
    const headerHTML = `
    <header class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                
                <a href="MyWasteReports.html" class="flex items-center gap-2 group">
                    <div class="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <span class="material-symbols-outlined text-primary text-2xl">recycling</span>
                    </div>
                    <span class="text-xl font-bold tracking-tight text-gray-800">CleanTrack</span>
                </a>

                <nav class="hidden md:flex gap-8">
                    <a href="MyWasteReports.html" class="${isReports}">Laporan Saya</a>
                    <a href="ReportNew.html" class="${isNew}">Buat Laporan</a>
                    <a href="UserProfile.html" class="${activePage === 'profile' ? activeClass : inactiveClass}">Dompet & Profil</a>
                </nav>

                <div class="flex items-center gap-2 sm:gap-4">
                    
                    <a href="Notifications.html" class="relative flex items-center justify-center rounded-full size-10 text-gray-400 hover:bg-gray-100 transition-colors">
                        <span class="material-symbols-outlined text-xl">notifications</span>
                        <span id="header-notif-dot" class="hidden absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>
                    </a>

                    <div class="h-6 w-px bg-gray-200 mx-1 hidden sm:block"></div>

                    <a href="UserProfile.html" class="hidden sm:flex items-center gap-3 hover:bg-gray-50 py-1 px-2 rounded-full transition-colors group">
                        <img id="header-avatar" src="${currentUser.avatar}" class="size-8 rounded-full bg-gray-200 border border-gray-300 object-cover" alt="Avatar">
                        <div class="flex flex-col items-start leading-none">
                            <span id="header-name" class="text-sm font-bold text-gray-700 group-hover:text-primary transition-colors">${currentUser.name.split(' ')[0]}</span>
                            <span id="header-points" class="text-[10px] text-gray-400 font-mono">${currentUser.points} Pts</span>
                        </div>
                    </a>

                    <button onclick="logoutUser()" class="hidden sm:flex items-center justify-center size-10 rounded-full text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors" title="Keluar">
                        <span class="material-symbols-outlined text-xl">logout</span>
                    </button>

                    <button id="mobile-menu-btn" class="md:hidden flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-primary hover:bg-gray-100 focus:outline-none">
                        <span class="material-symbols-outlined text-2xl">menu</span>
                    </button>
                </div>
            </div>
        </div>

        <div id="mobile-menu" class="hidden md:hidden border-t border-gray-100 bg-white">
            <div class="px-4 pt-4 pb-4 space-y-2">
                <div class="flex items-center gap-3 px-2 mb-4 pb-4 border-b border-gray-100" onclick="window.location.href='UserProfile.html'">
                    <img id="mobile-avatar" src="${currentUser.avatar}" class="size-10 rounded-full bg-gray-200 object-cover">
                    <div>
                        <p id="mobile-name" class="font-bold text-gray-800">${currentUser.name}</p>
                        <p id="mobile-points" class="text-xs text-gray-500">${currentUser.points} Poin Eco</p>
                    </div>
                </div>

                <a href="MyWasteReports.html" class="block px-4 py-2.5 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-primary font-medium">Laporan Saya</a>
                <a href="ReportNew.html" class="block px-4 py-2.5 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-primary font-medium">Buat Laporan Baru</a>
                <a href="UserProfile.html" class="block px-4 py-2.5 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-primary font-medium">Dompet & Profil</a>
                
                <button onclick="logoutUser()" class="w-full text-left px-4 py-2.5 rounded-lg text-red-600 font-bold hover:bg-red-50 flex items-center gap-2 mt-2">
                    <span class="material-symbols-outlined">logout</span> Keluar Aplikasi
                </button>
            </div>
        </div>
    </header>
    `;

    // Render ke DOM
    const target = document.getElementById('app-header');
    if (target) {
        target.innerHTML = headerHTML;
        
        // Initialize Logic
        initMobileMenu();
        checkSmartNotification();
        
        // --- REAL-TIME LISTENER ---
        // Ini kuncinya: Header akan update sendiri saat ada sinyal perubahan
        window.addEventListener('walletUpdated', updateHeaderVisuals);
        window.addEventListener('profileUpdated', updateHeaderVisuals);
    }
}

// --- FUNGSI UPDATE VISUAL (Real-time) ---
function updateHeaderVisuals() {
    // Ambil data sesi terbaru (yang sudah diupdate user-utils.js)
    const updatedSession = getActiveSession();
    if (!updatedSession) return;

    // Update Desktop Elements
    const nameEl = document.getElementById('header-name');
    const pointsEl = document.getElementById('header-points');
    const avatarEl = document.getElementById('header-avatar');

    if (nameEl) nameEl.textContent = updatedSession.name.split(' ')[0];
    if (pointsEl) pointsEl.textContent = updatedSession.points + ' Pts';
    if (avatarEl) avatarEl.src = updatedSession.avatar;

    // Update Mobile Elements
    const mName = document.getElementById('mobile-name');
    const mPoints = document.getElementById('mobile-points');
    const mAvatar = document.getElementById('mobile-avatar');

    if (mName) mName.textContent = updatedSession.name;
    if (mPoints) mPoints.textContent = updatedSession.points + ' Poin Eco';
    if (mAvatar) mAvatar.src = updatedSession.avatar;
    
    console.log("Header updated automatically!");
}

// --- LOGIC MOBILE MENU ---
function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');

    if (btn && menu) {
        btn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
            const icon = btn.querySelector('span');
            if (menu.classList.contains('hidden')) {
                icon.textContent = 'menu';
            } else {
                icon.textContent = 'close';
            }
        });
    }
}

// --- LOGIC NOTIFIKASI ---
function checkSmartNotification() {
    const currentUser = getActiveSession();
    if (!currentUser) return;

    const reports = JSON.parse(sessionStorage.getItem('shared_reports')) || [];
    // Cek jika ada laporan 'Resolved' milik user ini
    const hasUnread = reports.some(r => r.userId === currentUser.id && r.status === 'Resolved' && !r.rating);
    
    const dot = document.getElementById('header-notif-dot');
    if (dot) {
        if (hasUnread) {
            dot.classList.remove('hidden');
        } else {
            dot.classList.add('hidden');
        }
    }
}