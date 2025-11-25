/**
 * CleanTrack Admin Utilities (INTEGRATED)
 * File: admin-utils.js
 * Deskripsi: 
 * - Jembatan antara Halaman Admin dan Database Session.
 * - Membaca/Menulis ke 'shared_reports' dan 'shared_users'.
 * - Menyediakan helper statistik dan formatting.
 */

// KUNCI DATABASE (Harus sama persis dengan user-utils.js)
const KEYS = {
    REPORTS: 'shared_reports',
    USERS: 'shared_users'
};

// ==========================================
// 1. DATABASE ACCESS (READ/WRITE)
// ==========================================

/**
 * Ambil data laporan dari Session Storage
 */
function getReports() {
    const data = sessionStorage.getItem(KEYS.REPORTS);
    return data ? JSON.parse(data) : [];
}

/**
 * Simpan perubahan laporan (Status Update)
 * Efek: User akan melihat status baru di aplikasi mereka
 */
function saveReports(reports) {
    sessionStorage.setItem(KEYS.REPORTS, JSON.stringify(reports));
    // Dispatch event agar halaman admin lain (jika terbuka di tab lain) ikut update
    window.dispatchEvent(new Event('storageUpdated'));
}

/**
 * Ambil data user (Untuk menu User Management)
 */
function getUsers() {
    const data = sessionStorage.getItem(KEYS.USERS);
    return data ? JSON.parse(data) : [];
}

/**
 * Simpan perubahan user (Blokir/Unblock)
 * Efek: User yang diblokir akan otomatis ter-logout
 */
function saveUsers(users) {
    sessionStorage.setItem(KEYS.USERS, JSON.stringify(users));
}

/**
 * Cari laporan spesifik by ID
 */
function getReportById(id) {
    const reports = getReports();
    return reports.find(r => r.id === id);
}

// ==========================================
// 2. INITIALIZATION CHECK
// ==========================================

function initAdminData() {
    // Cek koneksi ke data shared
    const reports = getReports();
    const users = getUsers();
    
    if (reports.length === 0 && users.length === 0) {
        console.warn("[CleanTrack Admin] Database Kosong!");
        console.info("Tips: Silakan buka halaman Login/User terlebih dahulu untuk men-generate data simulasi.");
    } else {
        console.log(`[CleanTrack Admin] Terhubung. Memuat ${reports.length} laporan & ${users.length} user.`);
    }
}

// ==========================================
// 3. STATISTICS ENGINE
// ==========================================

function getAdminStats() {
    const reports = getReports();
    const users = getUsers();
    
    const total = reports.length;
    const pending = reports.filter(r => r.status === 'Pending').length;
    const inProgress = reports.filter(r => r.status === 'In Progress').length;
    const resolved = reports.filter(r => r.status === 'Resolved').length;
    
    // Hitung user aktif (kecuali admin)
    const activeUsers = users.filter(u => u.role === 'USER' && u.status === 'Active').length;

    // Hitung persentase penyelesaian
    const completionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    return {
        total,
        pending,
        inProgress,
        resolved,
        completionRate,
        activeUsers
    };
}

// ==========================================
// 4. UI FORMATTERS (Helpers)
// ==========================================

function getStatusColor(status) {
    switch (status) {
        case 'Resolved': 
            return { badge: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500' };
        case 'In Progress': 
            return { badge: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500' };
        case 'Pending': 
            return { badge: 'bg-yellow-100 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500' };
        default: 
            return { badge: 'bg-gray-100 text-gray-700 border-gray-200', dot: 'bg-gray-500' };
    }
}

function getPriorityColor(priority) {
    switch (priority) {
        case 'High': return 'text-red-600 bg-red-50 border border-red-100';
        case 'Medium': return 'text-orange-600 bg-orange-50 border border-orange-100';
        case 'Low': return 'text-gray-600 bg-gray-50 border border-gray-100';
        default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
}

function truncateText(text, length = 50) {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
}