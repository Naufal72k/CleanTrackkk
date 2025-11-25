/**
 * CleanTrack Admin Sidebar Component
 * File: sidebar.js
 */

function renderSidebar(activePage) {
    // Definisi Style untuk menu Aktif vs Tidak Aktif
    const activeClass = "flex items-center gap-3 px-3 py-2 bg-primary/20 text-primary rounded-lg transition-colors font-bold";
    const inactiveClass = "flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium";

    // Menentukan kelas mana yang dipakai berdasarkan parameter 'activePage'
    const isDash = activePage === 'dashboard' ? activeClass : inactiveClass;
    const isReports = activePage === 'reports' ? activeClass : inactiveClass;
    const isStaff = activePage === 'staff' ? activeClass : inactiveClass;

    const sidebarHTML = `
    <aside class="w-64 bg-card-light dark:bg-card-dark flex flex-col justify-between p-4 border-r border-border-light dark:border-border-dark h-full min-h-screen">
        <div class="flex flex-col gap-4">
            <div class="flex gap-3 items-center px-3">
                <span class="material-symbols-outlined text-primary text-4xl">recycling</span>
                <div class="flex flex-col">
                    <h1 class="text-text-light dark:text-text-dark text-lg font-bold">CleanTrack</h1>
                    <p class="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Admin Panel</p>
                </div>
            </div>

            <nav class="flex flex-col gap-2 mt-6">
                <a id="nav-link-dashboard" class="${isDash}" href="AdministratorDashboard.html">
                    <span class="material-symbols-outlined">dashboard</span>
                    <p class="text-sm leading-normal">Dashboard</p>
                </a>
                <a id="nav-link-reports" class="${isReports}" href="ReportManagement.html">
                    <span class="material-symbols-outlined">description</span>
                    <p class="text-sm leading-normal">Reports</p>
                </a>
                <a id="nav-link-staff" class="${isStaff}" href="StaffManagement.html">
                    <span class="material-symbols-outlined">group</span>
                    <p class="text-sm leading-normal">Staff</p>
                </a>
            </nav>
        </div>

        <div class="flex flex-col gap-1 border-t border-border-light dark:border-border-dark pt-4">
            <a class="${inactiveClass}" href="#">
                <span class="material-symbols-outlined text-xl">help</span>
                <p class="text-sm">Help Center</p>
            </a>
            <a class="${inactiveClass} text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20" href="Login.html">
                <span class="material-symbols-outlined text-xl">logout</span>
                <p class="text-sm">Logout</p>
            </a>
        </div>
    </aside>
    `;

    // Inject ke dalam HTML
    const placeholder = document.getElementById('sidebar-placeholder');
    if (placeholder) {
        placeholder.innerHTML = sidebarHTML;
    } else {
        console.error("Error: Element #sidebar-placeholder tidak ditemukan.");
    }
}