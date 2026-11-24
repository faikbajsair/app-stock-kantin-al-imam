/**
 * Authentication Service - Kantin Al-Imam
 * Akun Pengguna:
 * 1. Admin / Bu Shalatina (Pengelola Kantin)
 * 2. Staf Kantin / Kak Dini (Staf Operasional Stok & Titipan)
 */

export const USERS = [
  {
    username: 'shalatina',
    aliasUsername: 'admin',
    password: 'shalatina123',
    name: 'Bu Shalatina',
    role: 'admin',
    roleLabel: 'Admin / Pengelola Kantin',
    description: 'Akses penuh seluruh stok, laporan finansial, dan setup database.'
  },
  {
    username: 'kakdini',
    aliasUsername: 'dini',
    password: 'dini123',
    name: 'Kak Dini',
    role: 'staff',
    roleLabel: 'Staf Kantin',
    description: 'Operasional harian stok snack, minuman, ice cream, dan titipan guru.'
  }
];

const AUTH_STORAGE_KEY = 'kantin_alimam_auth_session';

export const authService = {
  login(username, password) {
    const cleanUser = String(username || '').trim().toLowerCase();
    const cleanPass = String(password || '').trim();

    const matchedUser = USERS.find(
      u => (u.username === cleanUser || u.aliasUsername === cleanUser) && u.password === cleanPass
    );

    if (matchedUser) {
      const sessionData = {
        username: matchedUser.username,
        name: matchedUser.name,
        role: matchedUser.role,
        roleLabel: matchedUser.roleLabel,
        loginAt: new Date().toISOString()
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionData));
      return { success: true, user: sessionData };
    }

    return { 
      success: false, 
      message: 'Username atau password salah. Silakan periksa kembali!' 
    };
  },

  logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },

  getCurrentUser() {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error membaca sesi login:', e);
    }
    return null;
  },

  isAuthenticated() {
    return this.getCurrentUser() !== null;
  }
};
