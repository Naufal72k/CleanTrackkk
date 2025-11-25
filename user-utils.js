/**
 * CleanTrack Core Utilities (FIXED & COMPLETE VERSION)
 * File: user-utils.js
 * * FITUR:
 * 1. Auto-Generate Data (Laporan tidak akan hilang).
 * 2. Sinkronisasi Poin Real-time (Header - Profil - Admin).
 * 3. Generator Token Listrik 20 Digit.
 */

const KEYS = {
    REPORTS: 'shared_reports',      // Data Laporan
    USERS: 'shared_users',          // Data User
    TRANSACTIONS: 'shared_tx',      // Riwayat Transaksi
    CURRENT_SESSION: 'active_session', // User Login
    INIT_FLAG: 'cleanTrack_v4_fixed'   // Ubah key ini agar browser mereset data lama yang error
};

// ==========================================
// 1. DATA FACTORY (PABRIK DATA)
// ==========================================

(function initSharedData() {
    // Hanya jalankan jika data belum ada
    if (!sessionStorage.getItem(KEYS.INIT_FLAG)) {
        console.log("🚀 Initializing CleanTrack Data Ecosystem...");

        // A. USER DUMMY (Naufal = 150 Poin)
        const users = [
            { 
                id: 'USR-001', 
                name: 'Naufal Ihsanul', 
                email: 'naufal@student.unram.ac.id', 
                password: '123', 
                role: 'USER', 
                phone: '081234567890', 
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Naufal', 
                joined: '15/08/2025', 
                status: 'Active', 
                points: 150 // Saldo Awal
            },
            { 
                id: 'ADM-001', 
                name: 'Super Admin', 
                email: 'admin', 
                password: 'admin', 
                role: 'ADMIN', 
                phone: '-', 
                avatar: 'https://ui-avatars.com/api/?name=Admin', 
                joined: '01/01/2025', 
                status: 'Active', 
                points: 9999 
            }
        ];
        sessionStorage.setItem(KEYS.USERS, JSON.stringify(users));

        // B. LAPORAN DUMMY (10 Data agar tidak kosong)
        const categories = ['Illegal Dumping', 'Overflowing Bin', 'Litter', 'Graffiti'];
        const locations = ["Jl. Udayana, Mataram", "Taman Sangkareang", "Pasar Kebon Roek", "Pantai Ampenan", "Jl. Majapahit"];
        let reports = [];
        
        for (let i = 0; i < 10; i++) {
            const status = ['Pending', 'In Progress', 'Resolved'][Math.floor(Math.random() * 3)];
            const date = new Date(); date.setDate(date.getDate() - i);

            reports.push({
                id: `CTR-${10000 + i}`,
                userId: 'USR-001', // Semua punya Naufal biar kelihatan di MyReports
                reporterName: 'Naufal Ihsanul',
                category: categories[i % 4],
                location: locations[i % 5],
                description: `Laporan simulasi otomatis nomor ${i+1}.`,
                status: status,
                priority: 'Medium',
                date: date.toLocaleDateString('id-ID'),
                photos: [`https://picsum.photos/seed/${i + 55}/600/400`],
                rating: status === 'Resolved' ? 0 : null, // Belum dirating
                timeline: [{ status: 'Submitted', date: date.toLocaleDateString('id-ID'), latest: true }]
            });
        }
        sessionStorage.setItem(KEYS.REPORTS, JSON.stringify(reports));

        // C. TRANSAKSI AWAL
        const txs = [
            { id: 'TX-001', date: '01/11/2025', type: 'CREDIT', amount: 50, description: 'Bonus Pengguna Baru' },
            { id: 'TX-002', date: '10/11/2025', type: 'CREDIT', amount: 100, description: 'Reward Laporan Sampah' }
        ];
        sessionStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(txs));

        // Kunci Inisialisasi
        sessionStorage.setItem(KEYS.INIT_FLAG, 'true');
    }
})();

// ==========================================
// 2. POINT SYSTEM (SINKRONISASI TOTAL)
// ==========================================

// Ambil Saldo Terbaru (Langsung dari DB Shared)
function getCurrentBalance() {
    const session = getActiveSession();
    if (!session) return 0;
    
    const users = getSharedUsers();
    const freshUser = users.find(u => u.id === session.id);
    return freshUser ? freshUser.points : 0;
}

// Update Poin (DB + Session + Event)
function updateUserPoints(userId, amount, description) {
    const users = getSharedUsers();
    const index = users.findIndex(u => u.id === userId);

    if (index !== -1) {
        // 1. Update Database Utama
        users[index].points = (users[index].points || 0) + amount;
        saveSharedUsers(users);

        // 2. Catat History
        const txs = JSON.parse(sessionStorage.getItem(KEYS.TRANSACTIONS)) || [];
        txs.unshift({
            id: `TX-${Math.floor(Date.now()/1000)}`,
            userId: userId,
            date: new Date().toLocaleString('id-ID'),
            type: amount > 0 ? 'CREDIT' : 'DEBIT',
            amount: Math.abs(amount),
            description: description
        });
        sessionStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(txs));

        // 3. Update Sesi Login (Agar Header Berubah)
        const currentSession = getActiveSession();
        if (currentSession && currentSession.id === userId) {
            currentSession.points = users[index].points;
            sessionStorage.setItem(KEYS.CURRENT_SESSION, JSON.stringify(currentSession));
        }

        // 4. Broadcast ke UI
        window.dispatchEvent(new Event('walletUpdated'));
        window.dispatchEvent(new Event('profileUpdated'));
        return true;
    }
    return false;
}

// ==========================================
// 3. TOKEN GENERATOR (SESUAI REQUEST)
// ==========================================

function generateRedeemCode(type) {
    if (type === 'PLN') {
        // Format Token Listrik: 20 Digit (4 blok 5 angka atau 5 blok 4 angka)
        // Standar PLN biasanya 20 digit angka.
        // Contoh: 1234-5678-9012-3456-7890
        let token = "";
        for (let i = 0; i < 5; i++) {
            // Generate 4 digit angka random
            let block = Math.floor(1000 + Math.random() * 9000);
            token += block + (i < 4 ? "-" : "");
        }
        return token;
    } else {
        // Format Voucher Biasa: V-XXXXXX
        return "V-" + Math.random().toString(36).substring(2, 8).toUpperCase() + "-2025";
    }
}

// ==========================================
// 4. DATABASE HELPERS
// ==========================================

function getSharedUsers() { return JSON.parse(sessionStorage.getItem(KEYS.USERS)) || []; }
function saveSharedUsers(u) { sessionStorage.setItem(KEYS.USERS, JSON.stringify(u)); }

function getSharedReports() { return JSON.parse(sessionStorage.getItem(KEYS.REPORTS)) || []; }
function saveSharedReports(r) { 
    sessionStorage.setItem(KEYS.REPORTS, JSON.stringify(r)); 
    window.dispatchEvent(new Event('storageUpdated')); 
}

function getTransactionHistory() {
    // Filter transaksi milik user yg login
    const session = getActiveSession();
    const all = JSON.parse(sessionStorage.getItem(KEYS.TRANSACTIONS)) || [];
    if(!session) return [];
    return all.filter(tx => !tx.userId || tx.userId === session.id);
}

// ==========================================
// 5. AUTHENTICATION
// ==========================================

function getActiveSession() { return JSON.parse(sessionStorage.getItem(KEYS.CURRENT_SESSION)); }

function loginUser(email, password) {
    const users = getSharedUsers();
    const found = users.find(u => (u.email === email || u.name === email) && u.password === password);
    
    if (found) {
        if(found.status === 'Blocked') return { success: false, message: 'Akun diblokir Admin.' };
        
        const sessionData = { ...found };
        delete sessionData.password;
        sessionStorage.setItem(KEYS.CURRENT_SESSION, JSON.stringify(sessionData));
        return { success: true };
    }
    return { success: false, message: 'Login gagal.' };
}

function logoutUser() {
    sessionStorage.removeItem(KEYS.CURRENT_SESSION);
    window.location.href = 'Login.html';
}

function requireLogin() {
    const session = getActiveSession();
    if (!session) { window.location.href = 'Login.html'; return null; }
    
    // Cek Live Status (Takutnya baru diblokir admin)
    const users = getSharedUsers();
    const fresh = users.find(u => u.id === session.id);
    if(!fresh || fresh.status === 'Blocked') {
        alert("Sesi berakhir.");
        logoutUser();
        return null;
    }
    return fresh;
}

// ==========================================
// 6. UI HELPERS
// ==========================================

function getStatusConfig(status) {
    switch (status) {
        case 'Resolved': return { badge: 'bg-green-100 text-green-700 border-green-200', icon: 'check_circle' };
        case 'In Progress': return { badge: 'bg-blue-100 text-blue-700 border-blue-200', icon: 'sync' };
        case 'Pending': return { badge: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: 'hourglass_top' };
        default: return { badge: 'bg-gray-100 text-gray-600 border-gray-200', icon: 'help' };
    }
}

function getUserProfile() {
    const session = getActiveSession();
    const users = getSharedUsers();
    return users.find(u => u.id === session.id) || session;
}