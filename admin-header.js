/**
 * CleanTrack Admin Header Component
 * File: admin-header.js
 * Updated: With functional Notification Dropdown
 */

function renderAdminHeader(activePage) {
    // Style Config
    const activeClass = "text-sm font-bold text-primary border-b-2 border-primary py-4"; 
    const inactiveClass = "text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary transition-colors py-4";
    
    // Logic Active State
    const isDash = activePage === 'dashboard' ? activeClass : inactiveClass;
    const isReports = activePage === 'reports' ? activeClass : inactiveClass;
    const isUsers = activePage === 'users' ? activeClass : inactiveClass;
    const isMap = activePage === 'map' ? activeClass : inactiveClass;

    const headerHTML = `
    <header class="sticky top-0 z-50 bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-md border-b border-border-light dark:border-border-dark shadow-sm transition-all duration-300">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                
                <a href="AdministratorDashboard.html" class="flex items-center gap-3 text-text-primary-light dark:text-text-primary-dark hover:opacity-80 transition-opacity">
                    <div class="bg-gray-800 text-white dark:bg-white dark:text-gray-900 p-2 rounded-lg shadow-md">
                        <span class="material-symbols-outlined text-2xl">admin_panel_settings</span>
                    </div>
                    <div class="flex flex-col leading-none">
                        <h2 class="text-lg font-bold tracking-tight">CleanTrack</h2>
                        <span class="text-[10px] font-black tracking-[0.2em] text-primary uppercase">Admin Panel</span>
                    </div>
                </a>

                <nav class="hidden md:flex flex-1 justify-center gap-8 h-full items-center">
                    <a href="AdministratorDashboard.html" class="${isDash}">Dashboard</a>
                    <a href="AdminReports.html" class="${isReports}">Reports Management</a>
                    <a href="AdminMap.html" class="${isMap}">Ops Map</a>
                    <a href="AdminUsers.html" class="${isUsers}">Users</a>
                </nav>

                <div class="flex items-center gap-4">
                    
                    <div class="relative">
                        <button onclick="toggleAdminNotif()" class="relative flex items-center justify-center rounded-full size-10 text-text-secondary-light hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none">
                            <span class="material-symbols-outlined text-xl">notifications</span>
                            <span id="notif-indicator" class="hidden absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-surface-dark animate-pulse"></span>
                        </button>

                        <div id="admin-notif-dropdown" class="hidden absolute right-0 mt-2 w-80 bg-white dark:bg-surface-dark rounded-xl shadow-xl border border-border-light dark:border-border-dark overflow-hidden z-50 origin-top-right transition-all">
                            <div class="p-4 border-b border-border-light dark:border-border-dark flex justify-between items-center">
                                <h3 class="font-bold text-sm">Notifications</h3>
                                <span class="text-[10px] text-primary font-bold cursor-pointer hover:underline">Mark all read</span>
                            </div>
                            <div id="notif-list" class="max-h-64 overflow-y-auto">
                                </div>
                            <a href="AdminReports.html" class="block p-3 text-center text-xs font-bold text-primary bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                View All Reports
                            </a>
                        </div>
                    </div>

                    <div class="h-6 w-px bg-border-light dark:bg-border-dark mx-1"></div>

                    <div class="flex items-center gap-3 pl-1">
                        <div class="text-right hidden sm:block">
                            <p class="text-sm font-bold text-text-primary-light dark:text-text-primary-dark leading-none mb-1">Super Admin</p>
                            <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark leading-none">Access Level 1</p>
                        </div>
                        <button onclick="window.location.href='Login.html'" class="group relative flex items-center justify-center size-10 rounded-full bg-gray-100 dark:bg-gray-800 ring-2 ring-transparent hover:ring-primary transition-all overflow-hidden" title="Logout">
                             <div class="bg-center bg-no-repeat bg-cover size-full"
                                style='background-image: url("https://ui-avatars.com/api/?name=Admin+System&background=1a1a1a&color=fff&bold=true");'>
                            </div>
                            <div class="absolute inset-0 bg-red-600/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span class="material-symbols-outlined text-white text-sm">logout</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </header>
    `;

    const target = document.getElementById('app-header');
    if (target) target.innerHTML = headerHTML;

    // Initialize Indicator
    updateNotifIndicator();
}

// --- LOGIC TAMBAHAN UNTUK NOTIFIKASI ---

function toggleAdminNotif() {
    const dropdown = document.getElementById('admin-notif-dropdown');
    const list = document.getElementById('notif-list');
    
    // Toggle Visibility
    dropdown.classList.toggle('hidden');

    if (!dropdown.classList.contains('hidden')) {
        // Load Real Data from LocalStorage
        const reports = JSON.parse(localStorage.getItem('masterReports')) || [];
        const pendingReports = reports.filter(r => r.status === 'Pending');

        if (pendingReports.length === 0) {
            list.innerHTML = `
                <div class="flex flex-col items-center justify-center p-6 text-gray-400">
                    <span class="material-symbols-outlined text-3xl mb-2">notifications_off</span>
                    <p class="text-xs">No pending tasks.</p>
                </div>
            `;
        } else {
            list.innerHTML = pendingReports.map(r => `
                <div class="p-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors" onclick="window.location.href='AdminReportDetail.html?id=${r.id}'">
                    <div class="flex items-start gap-3">
                        <div class="shrink-0 mt-1 bg-red-100 text-red-600 rounded-full p-1">
                            <span class="material-symbols-outlined text-sm">warning</span>
                        </div>
                        <div>
                            <p class="text-sm font-bold text-gray-800 dark:text-gray-200">New ${r.category}</p>
                            <p class="text-xs text-gray-500 line-clamp-1">${r.description}</p>
                            <p class="text-[10px] text-gray-400 mt-1">${r.date}</p>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }
}

function updateNotifIndicator() {
    const reports = JSON.parse(localStorage.getItem('masterReports')) || [];
    const hasPending = reports.some(r => r.status === 'Pending');
    const indicator = document.getElementById('notif-indicator');
    
    if (indicator) {
        if (hasPending) {
            indicator.classList.remove('hidden');
        } else {
            indicator.classList.add('hidden');
        }
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('admin-notif-dropdown');
    const button = document.querySelector('button[onclick="toggleAdminNotif()"]');
    
    if (dropdown && button && !dropdown.contains(event.target) && !button.contains(event.target)) {
        dropdown.classList.add('hidden');
    }
});