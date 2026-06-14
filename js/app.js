// ================================================================
// AMERTA LOKA RESORT — Housekeeping & Inventori Module
// Vue 3 (CDN Global Build) | Design: Earthy Natural
// Primary #6B704C | Secondary #B8977E | Tertiary #3E2A1F
// ================================================================

const { createApp, ref, reactive, computed, onMounted, nextTick, watch } = Vue;

// ── API Service ───────────────────────────────────────────────
const API_BASE = '/api/v1';
const api = {
  async get(path, params = {}) {
    try { const res = await axios.get(API_BASE + path, { params }); return res.data; }
    catch (e) { console.warn('[API] GET', path, '→ mock mode:', e.message); return null; }
  },
  async post(path, data = {}) {
    try { const res = await axios.post(API_BASE + path, data); return res.data; }
    catch (e) { console.warn('[API] POST', path, '→ mock mode:', e.message); return null; }
  },
  async put(path, data = {}) {
    try { const res = await axios.put(API_BASE + path, data); return res.data; }
    catch (e) { console.warn('[API] PUT', path, '→ mock mode:', e.message); return null; }
  }
};

// ── Helpers ───────────────────────────────────────────────────
function getInitials(name) {
  return (name || '').split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
}
function formatRp(val) {
  if (!val) return 'Rp 0';
  if (val >= 1000000000) return 'Rp ' + (val / 1000000000).toFixed(1) + 'M';
  if (val >= 1000000) return 'Rp ' + (val / 1000000).toFixed(1) + 'Jt';
  return 'Rp ' + val.toLocaleString('id-ID');
}

// ── Chart Defaults ─────────────────────────────────────────────
function setChartDefaults() {
  Chart.defaults.color = '#9A9978';
  Chart.defaults.borderColor = 'rgba(107,112,76,0.12)';
  Chart.defaults.font.family = 'Plus Jakarta Sans';
  Chart.defaults.font.size = 11;
}

// ── MOCK DATA ─────────────────────────────────────────────────
const MOCK = {
  hotel: { name: 'Amerta Loka Resort', location: 'Ubud, Bali', stars: 5 },

  // Staff housekeeping (dari screenshot)
  staff: [
    {
      id: 1, name: 'Gede Hirohito', role: 'Housekeeping Supervisor',
      email: 'hirohito@gmail.com', type: 'Employee',
      initial: 'G', color: '#B8977E',
      status: 'online', tasksDone: 12, tasksTotal: 15,
      shift: 'Pagi (06:00–14:00)', phone: '+62 812-1001-2001',
      area: 'Lantai 1–2, Lobby'
    },
    {
      id: 2, name: 'I Gusti Gede Wakabayashi', role: 'Housekeeping Technician',
      email: 'wakayashi@yahoo.com', type: 'Employee',
      initial: 'I', color: '#4A7C59',
      status: 'busy', tasksDone: 8, tasksTotal: 10,
      shift: 'Pagi (06:00–14:00)', phone: '+62 813-2002-3002',
      area: 'Maintenance & Teknis'
    },
    {
      id: 3, name: 'Ketut Mussolini', role: 'Housekeeping Manajer',
      email: 'mussolini@gmail.com', type: 'Employee',
      initial: 'K', color: '#6B704C',
      status: 'online', tasksDone: 5, tasksTotal: 5,
      shift: 'Pagi (06:00–14:00)', phone: '+62 811-3003-4003',
      area: 'Semua Area'
    },
    {
      id: 4, name: 'Made Steve Housekeeping', role: 'Housekeeping Staff',
      email: 'madesteve@gmial.com', type: 'Employee',
      initial: 'M', color: '#7B4FA6',
      status: 'offline', tasksDone: 6, tasksTotal: 9,
      shift: 'Siang (14:00–22:00)', phone: '+62 812-4004-5004',
      area: 'Lantai 3, Villa Selatan'
    },
    {
      id: 5, name: 'Nyoman John Housekeeping', role: 'Housekeeping Staff',
      email: 'johnyoman@gmail.com', type: 'Employee',
      initial: 'N', color: '#6B4C9A',
      status: 'busy', tasksDone: 7, tasksTotal: 8,
      shift: 'Siang (14:00–22:00)', phone: '+62 813-5005-6005',
      area: 'Kolam Renang, Taman'
    },
    {
      id: 6, name: 'Putu Alex Housekeeping', role: 'Housekeeping Staff',
      email: 'alex@gmail.com', type: 'Employee',
      initial: 'P', color: '#B85C2A',
      status: 'online', tasksDone: 9, tasksTotal: 11,
      shift: 'Malam (22:00–06:00)', phone: '+62 811-6006-7006',
      area: 'Lantai 4, Villa Utara'
    }
  ],

  // Kamar & status kebersihan
  rooms: [
    { id: '101', type: 'Superior', floor: 1, status: 'clean',    assignee: 1, priority: 'normal', checkout: null,   checkin: null },
    { id: '102', type: 'Superior', floor: 1, status: 'dirty',    assignee: 4, priority: 'high',   checkout: '10:30', checkin: '14:00' },
    { id: '103', type: 'Superior', floor: 1, status: 'cleaning', assignee: 5, priority: 'high',   checkout: '11:00', checkin: '14:00' },
    { id: '104', type: 'Superior', floor: 1, status: 'occupied', assignee: null, priority: 'normal', checkout: null, checkin: null },
    { id: '105', type: 'Superior', floor: 1, status: 'inspect',  assignee: 1, priority: 'normal', checkout: null,   checkin: null },
    { id: '201', type: 'Deluxe',   floor: 2, status: 'clean',    assignee: 6, priority: 'normal', checkout: null,   checkin: null },
    { id: '202', type: 'Deluxe',   floor: 2, status: 'dirty',    assignee: 4, priority: 'high',   checkout: '09:45', checkin: '15:00' },
    { id: '203', type: 'Deluxe',   floor: 2, status: 'occupied', assignee: null, priority: 'normal', checkout: null, checkin: null },
    { id: '204', type: 'Deluxe',   floor: 2, status: 'cleaning', assignee: 6, priority: 'normal', checkout: '12:00', checkin: '15:00' },
    { id: '205', type: 'Deluxe',   floor: 2, status: 'clean',    assignee: 5, priority: 'normal', checkout: null,   checkin: null },
    { id: '301', type: 'Joglo Suite', floor: 3, status: 'dirty',  assignee: 4, priority: 'high',  checkout: '10:00', checkin: '13:00' },
    { id: '302', type: 'Joglo Suite', floor: 3, status: 'occupied', assignee: null, priority: 'normal', checkout: null, checkin: null },
    { id: '303', type: 'Joglo Suite', floor: 3, status: 'clean',  assignee: 1, priority: 'normal', checkout: null,  checkin: null },
    { id: '401', type: 'Villa Suite', floor: 4, status: 'occupied', assignee: null, priority: 'normal', checkout: null, checkin: null },
    { id: '402', type: 'Villa Suite', floor: 4, status: 'dirty',  assignee: 6, priority: 'urgent', checkout: '09:00', checkin: '12:00' },
    { id: '501', type: 'Presidential Villa', floor: 5, status: 'clean', assignee: 3, priority: 'normal', checkout: null, checkin: null },
    { id: '502', type: 'Presidential Villa', floor: 5, status: 'inspect', assignee: 3, priority: 'normal', checkout: null, checkin: null },
  ],

  // Inventori item (dari screenshot)
  inventory: [
    // Amenities kamar
    { id: 1,  name: 'Air Freshener',  category: 'Amenities', icon: 'air', iconColor: '#4A6E8A', iconBg: 'rgba(74,110,138,0.12)', qty: 0,   unit: 'pcs', price: 0,     minStock: 50,  starred: true },
    { id: 2,  name: 'Bath Towel',     category: 'Linen',     icon: 'dry_cleaning', iconColor: '#4A7C59', iconBg: 'rgba(74,124,89,0.12)', qty: 0,   unit: 'pcs', price: 75000, minStock: 100, starred: true },
    { id: 3,  name: 'Bed Sheets',     category: 'Linen',     icon: 'bed',  iconColor: '#6B704C', iconBg: 'rgba(107,112,76,0.12)', qty: 0,   unit: 'set', price: 0,     minStock: 80,  starred: true },
    { id: 4,  name: 'Pillow Cover',   category: 'Linen',     icon: 'king_bed', iconColor: '#B8977E', iconBg: 'rgba(184,151,126,0.12)', qty: 0, unit: 'pcs', price: 0,   minStock: 60,  starred: true },
    { id: 5,  name: 'Shampoo Bottle', category: 'Amenities', icon: 'local_drink', iconColor: '#4A6E8A', iconBg: 'rgba(74,110,138,0.12)', qty: 0, unit: 'pcs', price: 3000, minStock: 200, starred: true },
    { id: 6,  name: 'Soap Bar',       category: 'Amenities', icon: 'soap', iconColor: '#9A7860', iconBg: 'rgba(184,151,126,0.10)', qty: 0,   unit: 'pcs', price: 2000, minStock: 200, starred: true },
    { id: 7,  name: 'Toothbrush Kit', category: 'Amenities', icon: 'brush', iconColor: '#6B704C', iconBg: 'rgba(107,112,76,0.10)', qty: 0,  unit: 'set', price: 8000, minStock: 150, starred: true },
    // Minuman & Makanan
    { id: 8,  name: 'Mineral Water',  category: 'Minuman',   icon: 'water_drop', iconColor: '#4A6E8A', iconBg: 'rgba(74,110,138,0.12)', qty: 0, unit: 'btl', price: 6000, minStock: 500, starred: true },
    { id: 9,  name: 'Coca-Cola',      category: 'Minuman',   icon: 'local_drink', iconColor: '#B84040', iconBg: 'rgba(184,64,64,0.10)', qty: 0, unit: 'can', price: 10000, minStock: 100, starred: true },
    { id: 10, name: 'Fanta',          category: 'Minuman',   icon: 'local_drink', iconColor: '#C4832A', iconBg: 'rgba(196,131,42,0.10)', qty: 0, unit: 'can', price: 10000, minStock: 80,  starred: true },
    { id: 11, name: 'Sprite',         category: 'Minuman',   icon: 'local_drink', iconColor: '#4A7C59', iconBg: 'rgba(74,124,89,0.10)', qty: 0, unit: 'can', price: 10000, minStock: 80,  starred: true },
    { id: 12, name: 'Beer',           category: 'Minuman',   icon: 'sports_bar', iconColor: '#C4832A', iconBg: 'rgba(196,131,42,0.10)', qty: 0, unit: 'can', price: 35000, minStock: 60,  starred: true },
    { id: 13, name: 'Red Bull',       category: 'Minuman',   icon: 'energy_savings_leaf', iconColor: '#B84040', iconBg: 'rgba(184,64,64,0.10)', qty: 0, unit: 'can', price: 50000, minStock: 50, starred: true },
    { id: 14, name: 'Susu',           category: 'Minuman',   icon: 'local_drink', iconColor: '#B8977E', iconBg: 'rgba(184,151,126,0.12)', qty: 0, unit: 'pcs', price: 10000, minStock: 60, starred: true },
    { id: 15, name: 'Teh Kemasan',    category: 'Minuman',   icon: 'emoji_food_beverage', iconColor: '#6B704C', iconBg: 'rgba(107,112,76,0.10)', qty: 0, unit: 'pcs', price: 7000, minStock: 80, starred: true },
    { id: 16, name: 'Snack',          category: 'Makanan',   icon: 'fastfood', iconColor: '#C4832A', iconBg: 'rgba(196,131,42,0.10)', qty: 0, unit: 'pcs', price: 5000, minStock: 100, starred: true },
    { id: 17, name: 'Chocolate Bar',  category: 'Makanan',   icon: 'cake', iconColor: '#3E2A1F', iconBg: 'rgba(62,42,31,0.10)', qty: 0, unit: 'pcs', price: 20000, minStock: 80, starred: true },
    // Peralatan & Furnitur
    { id: 18, name: 'Air Conditioner',category: 'Peralatan', icon: 'ac_unit', iconColor: '#4A6E8A', iconBg: 'rgba(74,110,138,0.12)', qty: 1, unit: 'unit', price: 0, minStock: 1, starred: true },
    { id: 19, name: 'Floor Lamp',     category: 'Furnitur',  icon: 'lightbulb', iconColor: '#C4832A', iconBg: 'rgba(196,131,42,0.10)', qty: 1, unit: 'unit', price: 0, minStock: 1, starred: true },
    { id: 20, name: 'Smart TV 32 Inch', category: 'Elektronik', icon: 'tv', iconColor: '#3E2A1F', iconBg: 'rgba(62,42,31,0.10)', qty: 1, unit: 'unit', price: 0, minStock: 1, starred: true },
    { id: 21, name: 'Smart TV QLED 75 Inch', category: 'Elektronik', icon: 'live_tv', iconColor: '#6B704C', iconBg: 'rgba(107,112,76,0.12)', qty: 1, unit: 'unit', price: 0, minStock: 1, starred: true },
    { id: 22, name: 'TV LED 32 Inch', category: 'Elektronik', icon: 'tv', iconColor: '#4A7C59', iconBg: 'rgba(74,124,89,0.10)', qty: 1, unit: 'unit', price: 0, minStock: 1, starred: true },
    { id: 23, name: 'Single Bed',     category: 'Furnitur',  icon: 'bed', iconColor: '#B8977E', iconBg: 'rgba(184,151,126,0.12)', qty: 1, unit: 'unit', price: 0, minStock: 1, starred: true },
    { id: 24, name: 'Queen Size Bed', category: 'Furnitur',  icon: 'king_bed', iconColor: '#9A7860', iconBg: 'rgba(184,151,126,0.12)', qty: 1, unit: 'unit', price: 0, minStock: 1, starred: true },
    { id: 25, name: 'King Size Bed',  category: 'Furnitur',  icon: 'king_bed', iconColor: '#6B704C', iconBg: 'rgba(107,112,76,0.12)', qty: 1, unit: 'unit', price: 0, minStock: 1, starred: true },
    { id: 26, name: 'Kursi',          category: 'Furnitur',  icon: 'chair', iconColor: '#B8977E', iconBg: 'rgba(184,151,126,0.10)', qty: 1, unit: 'unit', price: 0, minStock: 1, starred: true },
    { id: 27, name: 'Kursi Premium',  category: 'Furnitur',  icon: 'chair', iconColor: '#3E2A1F', iconBg: 'rgba(62,42,31,0.10)', qty: 1, unit: 'unit', price: 0, minStock: 1, starred: true },
    { id: 28, name: 'Meja',           category: 'Furnitur',  icon: 'table_restaurant', iconColor: '#9A9978', iconBg: 'rgba(154,153,120,0.12)', qty: 1, unit: 'unit', price: 0, minStock: 1, starred: true },
    { id: 29, name: 'Meja Premium',   category: 'Furnitur',  icon: 'table_restaurant', iconColor: '#6B704C', iconBg: 'rgba(107,112,76,0.12)', qty: 1, unit: 'unit', price: 0, minStock: 1, starred: true },
    { id: 30, name: 'Sofa',           category: 'Furnitur',  icon: 'weekend', iconColor: '#B8977E', iconBg: 'rgba(184,151,126,0.12)', qty: 1, unit: 'unit', price: 0, minStock: 1, starred: true },
    // Dekorasi
    { id: 31, name: 'Hiasan Dinding', category: 'Dekorasi',  icon: 'photo_frame', iconColor: '#9A7860', iconBg: 'rgba(184,151,126,0.10)', qty: 1, unit: 'pcs', price: 0, minStock: 1, starred: true },
    { id: 32, name: 'Karpet',         category: 'Dekorasi',  icon: 'texture', iconColor: '#B8977E', iconBg: 'rgba(184,151,126,0.12)', qty: 1, unit: 'pcs', price: 0, minStock: 1, starred: true },
    { id: 33, name: 'Tanaman Hias',   category: 'Dekorasi',  icon: 'local_florist', iconColor: '#4A7C59', iconBg: 'rgba(74,124,89,0.12)', qty: 1, unit: 'pot', price: 0, minStock: 1, starred: true },
    // Kebersihan
    { id: 34, name: 'Floor Cleaner',  category: 'Kebersihan', icon: 'cleaning_services', iconColor: '#4A7C59', iconBg: 'rgba(74,124,89,0.12)', qty: 0, unit: 'btl', price: 0, minStock: 30, starred: true },
    { id: 35, name: 'Glass Cleaner',  category: 'Kebersihan', icon: 'water', iconColor: '#4A6E8A', iconBg: 'rgba(74,110,138,0.12)', qty: 0, unit: 'btl', price: 0, minStock: 20, starred: true },
  ],

  // Jadwal & tugas cleaning
  tasks: [
    { id: 1,  room: '102', type: 'Checkout Clean', assignee: 4, priority: 'high',   status: 'pending',    startTime: '10:30', estDuration: '45m', notes: 'Tamu check-in 14:00' },
    { id: 2,  room: '202', type: 'Checkout Clean', assignee: 4, priority: 'high',   status: 'pending',    startTime: '09:45', estDuration: '45m', notes: 'Tamu check-in 15:00' },
    { id: 3,  room: '301', type: 'Checkout Clean', assignee: 4, priority: 'high',   status: 'pending',    startTime: '10:00', estDuration: '60m', notes: 'Joglo Suite' },
    { id: 4,  room: '103', type: 'Checkout Clean', assignee: 5, priority: 'high',   status: 'in_progress',startTime: '11:00', estDuration: '45m', notes: 'Sedang berlangsung' },
    { id: 5,  room: '204', type: 'Turndown',        assignee: 6, priority: 'normal', status: 'in_progress',startTime: '12:00', estDuration: '30m', notes: '' },
    { id: 6,  room: '402', type: 'Checkout Clean', assignee: 6, priority: 'urgent', status: 'pending',    startTime: '09:00', estDuration: '90m', notes: 'Villa Suite – segera!' },
    { id: 7,  room: '101', type: 'Daily Clean',    assignee: 1, priority: 'normal', status: 'done',       startTime: '08:00', estDuration: '30m', notes: '' },
    { id: 8,  room: '201', type: 'Daily Clean',    assignee: 6, priority: 'normal', status: 'done',       startTime: '08:30', estDuration: '30m', notes: '' },
    { id: 9,  room: '303', type: 'Daily Clean',    assignee: 1, priority: 'normal', status: 'done',       startTime: '09:00', estDuration: '30m', notes: '' },
    { id: 10, room: '105', type: 'Inspection',     assignee: 1, priority: 'normal', status: 'pending',    startTime: '13:00', estDuration: '15m', notes: '' },
    { id: 11, room: '502', type: 'Inspection',     assignee: 3, priority: 'normal', status: 'pending',    startTime: '14:00', estDuration: '15m', notes: 'Pra VIP check-in' },
    { id: 12, room: '501', type: 'Daily Clean',    assignee: 3, priority: 'normal', status: 'done',       startTime: '07:30', estDuration: '60m', notes: 'Presidential Villa' },
  ],

  // Predictive Maintenance
  maintenance: [
    { id: 1, room: '201', facility: 'AC Split', usageDays: 92, maxDays: 90,  status: 'overdue',  icon: 'ac_unit' },
    { id: 2, room: '103', facility: 'Water Heater', usageDays: 78, maxDays: 90, status: 'soon', icon: 'hot_tub' },
    { id: 3, room: '401', facility: 'AC Split', usageDays: 65, maxDays: 90,  status: 'normal',   icon: 'ac_unit' },
    { id: 4, room: '302', facility: 'TV LED',   usageDays: 85, maxDays: 180, status: 'normal',   icon: 'tv' },
    { id: 5, room: '502', facility: 'AC Split', usageDays: 88, maxDays: 90,  status: 'soon',     icon: 'ac_unit' },
    { id: 6, room: '101', facility: 'Water Pump',usageDays: 45, maxDays: 120,status: 'normal',   icon: 'water' },
  ],

  // Lost & Found data
  lostFound: [
    { id: 1, kode_lf: 'LF001', room_number: '301', item_name: 'Jam Tangan Rolex', description: 'Jam tangan mewah warna perak, ditemukan di atas meja nakas', found_by: 4, found_date: '2026-06-14', storage_location: 'Locker A-01', photo: null, status: 'STORED', claimed_by: null, claim_date: null },
    { id: 2, kode_lf: 'LF002', room_number: '202', item_name: 'Charger iPhone', description: 'Charger iPhone warna putih dengan kabel USB-C', found_by: 5, found_date: '2026-06-13', storage_location: 'Locker A-02', photo: null, status: 'CLAIMED', claimed_by: 'Budi Santoso', claim_date: '2026-06-14' },
    { id: 3, kode_lf: 'LF003', room_number: '402', item_name: 'Kacamata Rayban', description: 'Kacamata hitam merk Rayban, frame logam', found_by: 6, found_date: '2026-06-13', storage_location: 'Locker B-01', photo: null, status: 'STORED', claimed_by: null, claim_date: null },
    { id: 4, kode_lf: 'LF004', room_number: '105', item_name: 'Dompet Kulit', description: 'Dompet kulit coklat berisi beberapa kartu', found_by: 1, found_date: '2026-06-12', storage_location: 'Locker A-03', photo: null, status: 'CLOSED', claimed_by: 'Dewi Rahayu', claim_date: '2026-06-13' },
    { id: 5, kode_lf: 'LF005', room_number: '303', item_name: 'Buku Passport', description: 'Passport WNA berwarna hijau, nama Mr. James Wilson', found_by: 1, found_date: '2026-06-12', storage_location: 'Locker C-01', photo: null, status: 'FOUND', claimed_by: null, claim_date: null },
    { id: 6, kode_lf: 'LF006', room_number: '201', item_name: 'Laptop Charger', description: 'Charger laptop merek Asus 65W, kabel hitam', found_by: 6, found_date: '2026-06-11', storage_location: 'Locker A-04', photo: null, status: 'STORED', claimed_by: null, claim_date: null },
    { id: 7, kode_lf: 'LF007', room_number: '102', item_name: 'Gelang Emas', description: 'Gelang emas 24 karat, tidak ada nama/inisial', found_by: 4, found_date: '2026-06-11', storage_location: 'Locker C-02', photo: null, status: 'STORED', claimed_by: null, claim_date: null },
    { id: 8, kode_lf: 'LF008', room_number: '501', item_name: 'Kamera DSLR', description: 'Kamera Canon EOS 5D dengan lensa standar 18-55mm', found_by: 3, found_date: '2026-06-10', storage_location: 'Locker B-02', photo: null, status: 'CLAIMED', claimed_by: 'Ahmad Rizky', claim_date: '2026-06-12' },
    { id: 9, kode_lf: 'LF009', room_number: '204', item_name: 'Sepatu Nike', description: 'Sepatu olahraga Nike warna putih ukuran 42', found_by: 6, found_date: '2026-06-10', storage_location: 'Locker D-01', photo: null, status: 'CLOSED', claimed_by: 'Siti Aminah', claim_date: '2026-06-11' },
    { id: 10, kode_lf: 'LF010', room_number: '302', item_name: 'Tablet Samsung', description: 'Samsung Galaxy Tab S8, warna hitam, tanpa casing', found_by: 1, found_date: '2026-06-09', storage_location: 'Locker C-03', photo: null, status: 'FOUND', claimed_by: null, claim_date: null },
  ],

  // Aktivitas log
  activities: [
    { id: 1, text: 'Kamar 402 – Villa Suite selesai dibersihkan oleh Putu Alex', time: '08:42', icon: 'check_circle', color: 'var(--color-success)' },
    { id: 2, text: 'Permintaan linen tambahan – Kamar 302 (Joglo Suite)', time: '09:15', icon: 'local_laundry_service', color: 'var(--color-secondary)' },
    { id: 3, text: 'AC Kamar 201 perlu servis segera (overdue 2 hari)', time: '09:30', icon: 'warning', color: 'var(--color-danger)' },
    { id: 4, text: 'Ketut Mussolini menyelesaikan inspeksi Kamar 501', time: '10:00', icon: 'verified', color: 'var(--color-primary)' },
    { id: 5, text: 'Stok Shampoo Bottle hampir habis – perlu reorder', time: '10:22', icon: 'inventory_2', color: 'var(--color-warning)' },
    { id: 6, text: 'Kamar 103 sedang dibersihkan – Nyoman John in-progress', time: '11:03', icon: 'cleaning_services', color: 'var(--color-info)' },
  ]
};

// ── STATUS & PRIORITY HELPERS ─────────────────────────────────
const statusLabel = { dirty: 'Kotor', cleaning: 'Sedang Dibersihkan', clean: 'Bersih', inspect: 'Inspeksi', occupied: 'Terisi' };
const statusBadge = { dirty: 'badge-danger', cleaning: 'badge-warning', clean: 'badge-success', inspect: 'badge-info', occupied: 'badge-primary' };
const priorityBadge = { urgent: 'badge-danger', high: 'badge-warning', normal: 'badge-neutral' };
const priorityLabel = { urgent: 'Darurat', high: 'Tinggi', normal: 'Normal' };
const taskStatusLabel = { done: 'Selesai', in_progress: 'Berlangsung', pending: 'Menunggu' };
const taskStatusBadge = { done: 'badge-success', in_progress: 'badge-warning', pending: 'badge-neutral' };
const maintStatusColor = { overdue: 'var(--color-danger)', soon: 'var(--color-warning)', normal: 'var(--color-success)' };
const maintStatusBadge = { overdue: 'badge-danger', soon: 'badge-warning', normal: 'badge-success' };

// ── COMPONENT: Sidebar ────────────────────────────────────────
const SidebarComp = {
  name: 'SidebarComp',
  props: { currentPage: String, collapsed: Boolean },
  emits: ['navigate', 'toggle'],
  template: `
    <aside class="sidebar" :class="{ collapsed }">
      <div class="sidebar-logo">
        <div class="sidebar-logo-icon">AL</div>
        <div class="sidebar-logo-text">
          <div class="sidebar-brand">Amerta Loka</div>
          <div class="sidebar-sub">Resort ERP v2.0</div>
        </div>
      </div>

      <nav class="sidebar-nav">
        <div class="sidebar-section"><div class="sidebar-section-label">Utama</div></div>
        <div class="sidebar-item" :class="{ active: currentPage === 'dashboard' }" @click="$emit('navigate','dashboard')">
          <span class="material-icons-round">dashboard</span>
          <span class="sidebar-item-label">Dashboard</span>
        </div>

        <div class="sidebar-section"><div class="sidebar-section-label">Operasional</div></div>
        <div class="sidebar-item" :class="{ active: currentPage === 'housekeeping' }" @click="$emit('navigate','housekeeping')">
          <span class="material-icons-round">cleaning_services</span>
          <span class="sidebar-item-label">Housekeeping</span>
          <span class="sidebar-badge">5</span>
        </div>
        <div class="sidebar-item" :class="{ active: currentPage === 'inventory' }" @click="$emit('navigate','inventory')">
          <span class="material-icons-round">inventory_2</span>
          <span class="sidebar-item-label">Inventori</span>
        </div>
        <div class="sidebar-item" :class="{ active: currentPage === 'staff' }" @click="$emit('navigate','staff')">
          <span class="material-icons-round">badge</span>
          <span class="sidebar-item-label">Staf Housekeeping</span>
        </div>
        <div class="sidebar-item" :class="{ active: currentPage === 'maintenance' }" @click="$emit('navigate','maintenance')">
          <span class="material-icons-round">build_circle</span>
          <span class="sidebar-item-label">Predictive Maintenance</span>
          <span class="sidebar-badge" style="background:var(--color-danger)">2</span>
        </div>
        <div class="sidebar-item" :class="{ active: currentPage === 'lostFound' }" @click="$emit('navigate','lostfound')">
          <span class="material-icons-round">manage_search</span>
          <span class="sidebar-item-label">Lost &amp; Found</span>
          <span class="sidebar-badge" style="background:var(--color-warning)">3</span>
        </div>

        <div class="sidebar-section"><div class="sidebar-section-label">Modul Lain</div></div>
        <div class="sidebar-item" @click="$emit('navigate','dashboard')">
          <span class="material-icons-round">hub</span>
          <span class="sidebar-item-label">Channel Manager</span>
        </div>
        <div class="sidebar-item" @click="$emit('navigate','dashboard')">
          <span class="material-icons-round">people</span>
          <span class="sidebar-item-label">CRM</span>
        </div>
        <div class="sidebar-item" @click="$emit('navigate','dashboard')">
          <span class="material-icons-round">book_online</span>
          <span class="sidebar-item-label">Reservasi</span>
        </div>
      </nav>

      <div class="sidebar-footer">
        <button class="sidebar-toggle" @click="$emit('toggle')">
          <span class="material-icons-round">{{ collapsed ? 'chevron_right' : 'chevron_left' }}</span>
          <span v-if="!collapsed" style="font-size:12px">Tutup Panel</span>
        </button>
      </div>
    </aside>
  `
};

// ── COMPONENT: Topbar ─────────────────────────────────────────
const TopbarComp = {
  name: 'TopbarComp',
  props: { pageTitle: String },
  emits: ['showToast'],
  template: `
    <header class="topbar">
      <div class="topbar-breadcrumb">
        <span class="topbar-crumb">Amerta Loka</span>
        <span class="material-icons-round topbar-sep">chevron_right</span>
        <span class="topbar-current">{{ pageTitle }}</span>
      </div>
      <div class="topbar-right">
        <div class="live-badge"><div class="live-dot"></div>Real-time</div>
        <div class="search-field">
          <span class="material-icons-round">search</span>
          <input type="text" placeholder="Cari kamar, staf, item...">
        </div>
        <button class="icon-btn" @click="$emit('showToast','2 tugas housekeeping mendesak','warning')">
          <span class="material-icons-round">notifications</span>
          <span class="notif-dot"></span>
        </button>
        <button class="icon-btn"><span class="material-icons-round">settings</span></button>
        <div class="user-avatar">KM</div>
      </div>
    </header>
  `
};

// ── PAGE: Dashboard Housekeeping ──────────────────────────────
const PageDashboard = {
  name: 'PageDashboard',
  props: ['mockData', 'api'],
  emits: ['showToast', 'navigate'],
  template: `
    <div>
      <div class="page-header">
        <div>
          <h1 class="page-title">Dashboard Housekeeping 🌿</h1>
          <p class="page-subtitle">Sabtu, 7 Juni 2026 &nbsp;·&nbsp; Ringkasan operasional harian</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-outlined" @click="$emit('navigate','maintenance')">
            <span class="material-icons-round">build_circle</span> Maintenance
          </button>
          <button class="btn btn-primary" @click="$emit('navigate','housekeeping')">
            <span class="material-icons-round">cleaning_services</span> Kelola Kamar
          </button>
        </div>
      </div>

      <!-- Stats -->
      <div class="stat-grid">
        <div class="stat-card">
          <div class="stat-icon stat-icon-danger"><span class="material-icons-round">dangerous</span></div>
          <div class="stat-value">{{ dirtyCount }}</div>
          <div class="stat-label">Kamar Kotor</div>
          <div class="stat-change down"><span class="material-icons-round">error_outline</span>Perlu segera</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-icon-warning"><span class="material-icons-round">cleaning_services</span></div>
          <div class="stat-value">{{ cleaningCount }}</div>
          <div class="stat-label">Sedang Dibersihkan</div>
          <div class="stat-change up"><span class="material-icons-round">schedule</span>In-progress</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-icon-success"><span class="material-icons-round">check_circle</span></div>
          <div class="stat-value">{{ cleanCount }}</div>
          <div class="stat-label">Kamar Bersih</div>
          <div class="stat-change up"><span class="material-icons-round">arrow_upward</span>Siap tamu</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-icon-primary"><span class="material-icons-round">hotel</span></div>
          <div class="stat-value">{{ occupiedCount }}</div>
          <div class="stat-label">Kamar Terisi</div>
          <div class="stat-change up"><span class="material-icons-round">people</span>Hunian aktif</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-icon-info"><span class="material-icons-round">fact_check</span></div>
          <div class="stat-value">{{ inspectCount }}</div>
          <div class="stat-label">Perlu Inspeksi</div>
          <div class="stat-change"><span class="material-icons-round">verified_user</span>QC berlangsung</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-icon-secondary"><span class="material-icons-round">badge</span></div>
          <div class="stat-value">{{ activeStaff }}</div>
          <div class="stat-label">Staf Aktif Hari Ini</div>
          <div class="stat-change up"><span class="material-icons-round">check_circle</span>Online & bertugas</div>
        </div>
      </div>

      <div class="grid-2 mb-5">
        <!-- Room Status Pie -->
        <div class="card">
          <div class="card-header">
            <div><div class="card-title">Status Kamar Keseluruhan</div><div class="card-subtitle">{{ mockData.rooms.length }} kamar total</div></div>
          </div>
          <canvas id="dash-room-status" height="200"></canvas>
          <div class="flex gap-4 mt-4 wrap">
            <div v-for="s in roomStatusLegend" :key="s.label" class="flex items-center gap-2 text-sm">
              <span style="width:10px;height:10px;border-radius:3px;flex-shrink:0" :style="{ background: s.color }"></span>
              <span class="text-muted">{{ s.label }}</span>
              <span class="font-semibold">{{ s.value }}</span>
            </div>
          </div>
        </div>
        <!-- Task Progress -->
        <div class="card">
          <div class="card-header">
            <div><div class="card-title">Progress Tugas Hari Ini</div><div class="card-subtitle">{{ doneTasks }}/{{ mockData.tasks.length }} selesai</div></div>
            <button class="btn btn-ghost btn-sm" @click="$emit('navigate','housekeeping')">Lihat Semua</button>
          </div>
          <div style="margin-bottom:16px">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm text-muted">Total Progress</span>
              <span class="font-semibold text-sm">{{ Math.round(doneTasks/mockData.tasks.length*100) }}%</span>
            </div>
            <div class="progress"><div class="progress-bar success" :style="{width: (doneTasks/mockData.tasks.length*100)+'%'}"></div></div>
          </div>
          <div class="timeline">
            <div v-for="act in mockData.activities" :key="act.id" class="timeline-item">
              <div class="timeline-dot" :style="{ borderColor: act.color }">
                <span class="material-icons-round" :style="{ color: act.color, fontSize:'13px' }">{{ act.icon }}</span>
              </div>
              <div class="timeline-body">
                <div class="timeline-title">{{ act.text }}</div>
                <div class="timeline-time">{{ act.time }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Staff Overview -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Staf Bertugas Hari Ini</div>
          <button class="btn btn-ghost btn-sm" @click="$emit('navigate','staff')">Lihat Semua Staf</button>
        </div>
        <div class="staff-grid">
          <div v-for="s in mockData.staff" :key="s.id" class="staff-card" @click="$emit('navigate','staff')">
            <div class="flex items-center gap-3 mb-3">
              <div class="staff-avatar" :style="{ background: s.color }">{{ s.initial }}</div>
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <div class="staff-name truncate" style="max-width:140px">{{ s.name }}</div>
                  <span class="staff-status-dot" :class="s.status"></span>
                </div>
                <div class="staff-role">{{ s.role }}</div>
                <div class="staff-email">
                  <span class="material-icons-round" style="font-size:11px">mail_outline</span>
                  <span class="truncate" style="max-width:140px">{{ s.email }}</span>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs text-muted">{{ s.tasksDone }}/{{ s.tasksTotal }} tugas</span>
              <span class="text-xs font-semibold" :style="{ color: s.tasksDone===s.tasksTotal ? 'var(--color-success)' : 'var(--color-primary)' }">{{ Math.round(s.tasksDone/s.tasksTotal*100) }}%</span>
            </div>
            <div class="progress">
              <div class="progress-bar" :class="s.tasksDone===s.tasksTotal ? 'success' : ''" :style="{ width: (s.tasksDone/s.tasksTotal*100)+'%' }"></div>
            </div>
            <div class="flex items-center gap-2 mt-3">
              <span class="badge badge-neutral text-xs">{{ s.type }}</span>
              <span class="badge text-xs" :class="s.status==='online'?'badge-success':s.status==='busy'?'badge-warning':'badge-neutral'">
                {{ s.status==='online'?'Online':s.status==='busy'?'Sibuk':'Offline' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  setup(props, { emit }) {
    const dirtyCount    = computed(() => props.mockData.rooms.filter(r => r.status === 'dirty').length);
    const cleaningCount = computed(() => props.mockData.rooms.filter(r => r.status === 'cleaning').length);
    const cleanCount    = computed(() => props.mockData.rooms.filter(r => r.status === 'clean').length);
    const occupiedCount = computed(() => props.mockData.rooms.filter(r => r.status === 'occupied').length);
    const inspectCount  = computed(() => props.mockData.rooms.filter(r => r.status === 'inspect').length);
    const activeStaff   = computed(() => props.mockData.staff.filter(s => s.status !== 'offline').length);
    const doneTasks     = computed(() => props.mockData.tasks.filter(t => t.status === 'done').length);

    const roomStatusLegend = [
      { label: 'Kotor',    value: 0, color: 'var(--color-danger)' },
      { label: 'Cleaning', value: 0, color: 'var(--color-warning)' },
      { label: 'Bersih',   value: 0, color: 'var(--color-success)' },
      { label: 'Terisi',   value: 0, color: 'var(--color-primary)' },
      { label: 'Inspeksi', value: 0, color: 'var(--color-info)' },
    ];

    onMounted(() => {
      setChartDefaults();
      const r = props.mockData.rooms;
      const counts = [
        r.filter(x => x.status==='dirty').length,
        r.filter(x => x.status==='cleaning').length,
        r.filter(x => x.status==='clean').length,
        r.filter(x => x.status==='occupied').length,
        r.filter(x => x.status==='inspect').length,
      ];
      counts.forEach((v,i) => roomStatusLegend[i].value = v);

      const el = document.getElementById('dash-room-status');
      if (el) new Chart(el, {
        type: 'doughnut',
        data: {
          labels: ['Kotor','Cleaning','Bersih','Terisi','Inspeksi'],
          datasets: [{ data: counts, backgroundColor: ['#B84040','#C4832A','#4A7C59','#6B704C','#4A6E8A'], borderWidth: 0, hoverOffset: 6 }]
        },
        options: { responsive: true, cutout: '65%', plugins: { legend: { display: false } } }
      });
    });

    return { dirtyCount, cleaningCount, cleanCount, occupiedCount, inspectCount, activeStaff, doneTasks, roomStatusLegend };
  }
};

// ── PAGE: Housekeeping (Room Status + Tasks) ──────────────────
const PageHousekeeping = {
  name: 'PageHousekeeping',
  props: ['mockData', 'api'],
  emits: ['showToast'],
  template: `
    <div>
      <div class="page-header">
        <div>
          <h1 class="page-title">Manajemen Housekeeping</h1>
          <p class="page-subtitle">Status kamar real-time & penugasan staf kebersihan</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-outlined" @click="$emit('showToast','Laporan harian diunduh','success')">
            <span class="material-icons-round">download</span> Laporan
          </button>
          <button class="btn btn-primary" @click="addTaskModal=true">
            <span class="material-icons-round">assignment_add</span> Buat Tugas
          </button>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="stat-grid mb-5">
        <div class="stat-card" v-for="s in stats" :key="s.label" style="cursor:pointer" @click="filterStatus=s.filter">
          <div class="stat-icon" :class="s.iconClass"><span class="material-icons-round">{{ s.icon }}</span></div>
          <div class="stat-value">{{ s.value }}</div>
          <div class="stat-label">{{ s.label }}</div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tab-bar">
        <div class="tab-item" :class="{active: tab==='rooms'}" @click="tab='rooms';filterStatus=''">
          <span class="material-icons-round">grid_view</span> Peta Kamar
        </div>
        <div class="tab-item" :class="{active: tab==='tasks'}" @click="tab='tasks'">
          <span class="material-icons-round">assignment</span> Daftar Tugas
          <span class="badge badge-warning ml-auto" style="margin-left:8px">{{ pendingTasks }}</span>
        </div>
        <div class="tab-item" :class="{active: tab==='schedule'}" @click="tab='schedule'">
          <span class="material-icons-round">calendar_today</span> Jadwal Staf
        </div>
      </div>

      <!-- ── ROOMS TAB ── -->
      <div v-if="tab==='rooms'">
        <!-- Filter -->
        <div class="flex gap-3 mb-4 wrap">
          <button v-for="f in statusFilters" :key="f.val" class="btn btn-sm" :class="filterStatus===f.val?'btn-primary':'btn-secondary'" @click="filterStatus=f.val">
            {{ f.label }}
          </button>
          <div class="ml-auto flex gap-2 items-center">
            <span class="text-sm text-muted">Lantai:</span>
            <select class="form-select" style="width:110px" v-model="filterFloor">
              <option value="">Semua</option>
              <option v-for="fl in floors" :key="fl" :value="fl">Lantai {{ fl }}</option>
            </select>
          </div>
        </div>

        <div class="room-grid">
          <div v-for="room in filteredRooms" :key="room.id" class="room-card" :class="room.status" @click="selectedRoom=room; roomDrawer=true">
            <div class="flex items-start justify-between">
              <div>
                <div class="room-number">{{ room.id }}</div>
                <div class="room-type-label">{{ room.type }}</div>
              </div>
              <span class="badge text-xs" :class="statusBadge[room.status]">{{ statusLabel[room.status] }}</span>
            </div>
            <div class="room-status-row">
              <div class="room-assignee" v-if="getStaff(room.assignee)">
                <div class="room-assignee-dot" :style="{ background: getStaff(room.assignee).color }">
                  {{ getStaff(room.assignee).initial }}
                </div>
                <span>{{ getStaff(room.assignee).name.split(' ')[0] }}</span>
              </div>
              <span v-else class="text-xs text-muted">—</span>
              <span class="badge text-xs" :class="priorityBadge[room.priority]" v-if="room.priority !== 'normal'">
                {{ priorityLabel[room.priority] }}
              </span>
            </div>
            <div v-if="room.checkout" class="text-xs text-muted mt-2">CO: {{ room.checkout }}</div>
          </div>
        </div>
        <div v-if="filteredRooms.length===0" class="card mt-4" style="text-align:center;padding:48px;color:var(--text-muted)">
          <span class="material-icons-round" style="font-size:40px;opacity:0.3">search_off</span>
          <div class="mt-3">Tidak ada kamar ditemukan</div>
        </div>
      </div>

      <!-- ── TASKS TAB ── -->
      <div v-if="tab==='tasks'">
        <div class="flex gap-3 mb-4 wrap">
          <button v-for="f in taskFilters" :key="f.val" class="btn btn-sm" :class="taskFilter===f.val?'btn-primary':'btn-secondary'" @click="taskFilter=f.val">
            {{ f.label }}
          </button>
          <div class="ml-auto">
            <select class="form-select" style="width:160px" v-model="taskAssigneeFilter">
              <option value="">Semua Staf</option>
              <option v-for="s in mockData.staff" :key="s.id" :value="s.id">{{ s.name.split(' ')[0] }} {{ s.name.split(' ')[1] }}</option>
            </select>
          </div>
        </div>
        <div class="card">
          <div class="task-item" v-for="task in filteredTasks" :key="task.id" @click="$emit('showToast','Membuka detail tugas kamar '+task.room,'info')">
            <div class="task-checkbox" :class="{done: task.status==='done'}" @click.stop="task.status = task.status==='done'?'pending':'done'">
              <span class="material-icons-round" v-if="task.status==='done'">check</span>
            </div>
            <div class="flex-1">
              <div class="task-room" :class="{'done-text': task.status==='done'}">Kamar {{ task.room }} — {{ task.type }}</div>
              <div class="task-detail">{{ getStaffName(task.assignee) }} &nbsp;·&nbsp; {{ task.startTime }} &nbsp;·&nbsp; ~{{ task.estDuration }}</div>
              <div class="task-detail text-warning" v-if="task.notes">{{ task.notes }}</div>
            </div>
            <div class="flex items-center gap-2">
              <span class="badge text-xs" :class="priorityBadge[task.priority]">{{ priorityLabel[task.priority] }}</span>
              <span class="badge text-xs" :class="taskStatusBadge[task.status]">{{ taskStatusLabel[task.status] }}</span>
            </div>
          </div>
          <div v-if="filteredTasks.length===0" style="text-align:center;padding:32px;color:var(--text-muted)">
            <span class="material-icons-round" style="font-size:32px;opacity:0.3">task_alt</span>
            <div class="mt-2">Tidak ada tugas ditemukan</div>
          </div>
        </div>
      </div>

      <!-- ── SCHEDULE TAB ── -->
      <div v-if="tab==='schedule'">
        <div class="card">
          <div class="card-header">
            <div class="card-title">Jadwal & Beban Kerja Staf — 7 Juni 2026</div>
          </div>
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Staf</th><th>Jabatan</th><th>Shift</th><th>Area</th>
                  <th>Tugas Selesai</th><th>Progress</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="s in mockData.staff" :key="s.id" @click="selectedStaff=s; staffDrawer=true">
                  <td>
                    <div class="flex items-center gap-2">
                      <div class="room-assignee-dot" style="width:32px;height:32px;font-size:13px;border-radius:50%" :style="{ background: s.color }">{{ s.initial }}</div>
                      <span class="font-semibold">{{ s.name }}</span>
                    </div>
                  </td>
                  <td class="text-muted">{{ s.role }}</td>
                  <td><span class="badge badge-neutral">{{ s.shift }}</span></td>
                  <td class="text-muted">{{ s.area }}</td>
                  <td><strong>{{ s.tasksDone }}</strong>/{{ s.tasksTotal }}</td>
                  <td>
                    <div class="flex items-center gap-2">
                      <div class="progress" style="width:80px"><div class="progress-bar" :class="s.tasksDone===s.tasksTotal?'success':''" :style="{width:(s.tasksDone/s.tasksTotal*100)+'%'}"></div></div>
                      <span class="text-xs">{{ Math.round(s.tasksDone/s.tasksTotal*100) }}%</span>
                    </div>
                  </td>
                  <td>
                    <span class="badge" :class="s.status==='online'?'badge-success':s.status==='busy'?'badge-warning':'badge-neutral'">
                      <span class="badge-dot"></span>
                      {{ s.status==='online'?'Online':s.status==='busy'?'Sibuk':'Offline' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Room Detail Drawer -->
      <transition name="drawer">
        <div class="side-drawer" v-if="roomDrawer && selectedRoom">
          <div class="flex items-center justify-between mb-6">
            <div style="font-size:18px;font-weight:800">Kamar {{ selectedRoom.id }}</div>
            <button class="icon-btn" @click="roomDrawer=false"><span class="material-icons-round">close</span></button>
          </div>
          <div class="flex gap-3 mb-4">
            <span class="badge text-sm" :class="statusBadge[selectedRoom.status]">{{ statusLabel[selectedRoom.status] }}</span>
            <span class="badge text-sm" :class="priorityBadge[selectedRoom.priority]">{{ priorityLabel[selectedRoom.priority] }}</span>
          </div>
          <div class="card mb-4" style="background:var(--surface-bg)">
            <div class="card-title mb-3">Detail Kamar</div>
            <div class="flex flex-col gap-2 text-sm">
              <div class="flex justify-between"><span class="text-muted">Tipe</span><span class="font-semibold">{{ selectedRoom.type }}</span></div>
              <div class="flex justify-between"><span class="text-muted">Lantai</span><span class="font-semibold">Lantai {{ selectedRoom.floor }}</span></div>
              <div class="flex justify-between" v-if="selectedRoom.checkout"><span class="text-muted">Check-out</span><span class="font-semibold">{{ selectedRoom.checkout }}</span></div>
              <div class="flex justify-between" v-if="selectedRoom.checkin"><span class="text-muted">Check-in Berikutnya</span><span class="font-semibold text-danger">{{ selectedRoom.checkin }}</span></div>
            </div>
          </div>
          <div class="card mb-4" style="background:var(--surface-bg)" v-if="getStaff(selectedRoom.assignee)">
            <div class="card-title mb-3">Petugas Cleaning</div>
            <div class="flex items-center gap-3">
              <div class="staff-avatar" style="width:44px;height:44px;font-size:16px" :style="{ background: getStaff(selectedRoom.assignee).color }">{{ getStaff(selectedRoom.assignee).initial }}</div>
              <div>
                <div class="font-semibold">{{ getStaff(selectedRoom.assignee).name }}</div>
                <div class="text-sm text-muted">{{ getStaff(selectedRoom.assignee).role }}</div>
                <span class="badge badge-neutral mt-1">{{ getStaff(selectedRoom.assignee).shift }}</span>
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <button class="btn btn-success-soft w-full" @click="updateRoomStatus(selectedRoom,'clean')">
              <span class="material-icons-round">check_circle</span> Tandai Bersih
            </button>
            <button class="btn btn-warning-soft w-full" @click="updateRoomStatus(selectedRoom,'inspect')">
              <span class="material-icons-round">verified_user</span> Minta Inspeksi
            </button>
            <button class="btn btn-danger-soft w-full" @click="updateRoomStatus(selectedRoom,'dirty')">
              <span class="material-icons-round">cancel</span> Tandai Kotor
            </button>
          </div>
        </div>
      </transition>
      <div v-if="roomDrawer" @click="roomDrawer=false" style="position:fixed;inset:0;z-index:199;background:rgba(62,42,31,0.25)" @click.self="roomDrawer=false"></div>

      <!-- Staff Detail Drawer -->
      <transition name="drawer">
        <div class="side-drawer" v-if="staffDrawer && selectedStaff">
          <div class="flex items-center justify-between mb-6">
            <div style="font-size:18px;font-weight:800">Detail Staf</div>
            <button class="icon-btn" @click="staffDrawer=false"><span class="material-icons-round">close</span></button>
          </div>
          <div class="flex items-center gap-4 mb-5">
            <div class="staff-avatar" style="width:64px;height:64px;font-size:24px" :style="{ background: selectedStaff.color }">{{ selectedStaff.initial }}</div>
            <div>
              <div style="font-size:16px;font-weight:800">{{ selectedStaff.name }}</div>
              <div class="text-muted text-sm">{{ selectedStaff.role }}</div>
              <div class="staff-email mt-1"><span class="material-icons-round" style="font-size:12px">mail</span> {{ selectedStaff.email }}</div>
            </div>
          </div>
          <div class="card mb-4" style="background:var(--surface-bg)">
            <div class="card-title mb-3">Info Tugas</div>
            <div class="flex flex-col gap-3">
              <div>
                <div class="flex justify-between mb-1">
                  <span class="text-sm text-muted">Progress Tugas</span>
                  <span class="text-sm font-semibold">{{ selectedStaff.tasksDone }}/{{ selectedStaff.tasksTotal }}</span>
                </div>
                <div class="progress"><div class="progress-bar success" :style="{width:(selectedStaff.tasksDone/selectedStaff.tasksTotal*100)+'%'}"></div></div>
              </div>
              <div class="flex justify-between text-sm"><span class="text-muted">Shift</span><span class="font-semibold">{{ selectedStaff.shift }}</span></div>
              <div class="flex justify-between text-sm"><span class="text-muted">Area</span><span class="font-semibold">{{ selectedStaff.area }}</span></div>
              <div class="flex justify-between text-sm"><span class="text-muted">Telepon</span><span class="font-semibold">{{ selectedStaff.phone }}</span></div>
            </div>
          </div>
          <div class="card" style="background:var(--surface-bg)">
            <div class="card-title mb-3">Tugas Hari Ini</div>
            <div v-for="t in getStaffTasks(selectedStaff.id)" :key="t.id" class="flex items-center gap-3 py-2" style="border-bottom:1px solid var(--surface-border-light)">
              <div class="task-checkbox" :class="{done:t.status==='done'}">
                <span class="material-icons-round" v-if="t.status==='done'" style="font-size:12px;color:#fff">check</span>
              </div>
              <div class="flex-1">
                <div class="text-sm font-semibold">Kamar {{ t.room }}</div>
                <div class="text-xs text-muted">{{ t.type }} — {{ t.startTime }}</div>
              </div>
              <span class="badge text-xs" :class="taskStatusBadge[t.status]">{{ taskStatusLabel[t.status] }}</span>
            </div>
          </div>
        </div>
      </transition>
      <div v-if="staffDrawer" @click="staffDrawer=false" style="position:fixed;inset:0;z-index:199;background:rgba(62,42,31,0.25)"></div>

      <!-- Add Task Modal -->
      <transition name="scale">
        <div class="modal-backdrop" v-if="addTaskModal" @click.self="addTaskModal=false">
          <div class="modal">
            <div class="modal-header">
              <div class="modal-title">Buat Tugas Cleaning Baru</div>
              <button class="icon-btn" @click="addTaskModal=false"><span class="material-icons-round">close</span></button>
            </div>
            <div class="modal-body">
              <div class="grid-2 gap-4">
                <div class="form-group">
                  <label class="form-label">Nomor Kamar *</label>
                  <select class="form-select" v-model="newTask.room">
                    <option value="">Pilih kamar</option>
                    <option v-for="r in mockData.rooms" :key="r.id" :value="r.id">{{ r.id }} – {{ r.type }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Jenis Tugas *</label>
                  <select class="form-select" v-model="newTask.type">
                    <option>Checkout Clean</option>
                    <option>Daily Clean</option>
                    <option>Turndown</option>
                    <option>Inspection</option>
                    <option>Deep Clean</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Tugaskan ke</label>
                  <select class="form-select" v-model="newTask.assignee">
                    <option value="">Pilih staf</option>
                    <option v-for="s in mockData.staff" :key="s.id" :value="s.id">{{ s.name }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Prioritas</label>
                  <select class="form-select" v-model="newTask.priority">
                    <option value="urgent">Darurat</option>
                    <option value="high">Tinggi</option>
                    <option value="normal">Normal</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Waktu Mulai</label>
                  <input class="form-input" type="time" v-model="newTask.startTime">
                </div>
                <div class="form-group">
                  <label class="form-label">Estimasi Durasi</label>
                  <input class="form-input" v-model="newTask.estDuration" placeholder="30m">
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Catatan</label>
                <textarea class="form-textarea" v-model="newTask.notes" placeholder="Instruksi tambahan..."></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-ghost" @click="addTaskModal=false">Batal</button>
              <button class="btn btn-primary" @click="saveTask">
                <span class="material-icons-round">save</span> Simpan Tugas
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  `,
  setup(props, { emit }) {
    const tab = ref('rooms');
    const filterStatus = ref('');
    const filterFloor = ref('');
    const taskFilter = ref('');
    const taskAssigneeFilter = ref('');
    const roomDrawer = ref(false);
    const staffDrawer = ref(false);
    const addTaskModal = ref(false);
    const selectedRoom = ref(null);
    const selectedStaff = ref(null);
    const newTask = reactive({ room: '', type: 'Daily Clean', assignee: '', priority: 'normal', startTime: '', estDuration: '30m', notes: '' });

    const statusFilters = [
      { val: '', label: 'Semua' },
      { val: 'dirty', label: '🔴 Kotor' },
      { val: 'cleaning', label: '🟡 Cleaning' },
      { val: 'clean', label: '🟢 Bersih' },
      { val: 'occupied', label: '🔵 Terisi' },
      { val: 'inspect', label: '🔷 Inspeksi' },
    ];
    const taskFilters = [
      { val: '', label: 'Semua' },
      { val: 'pending', label: '⏳ Menunggu' },
      { val: 'in_progress', label: '🔄 Berlangsung' },
      { val: 'done', label: '✅ Selesai' },
    ];

    const floors = computed(() => [...new Set(props.mockData.rooms.map(r => r.floor))].sort());

    const filteredRooms = computed(() => props.mockData.rooms.filter(r =>
      (!filterStatus.value || r.status === filterStatus.value) &&
      (!filterFloor.value || r.floor === filterFloor.value)
    ));

    const filteredTasks = computed(() => props.mockData.tasks.filter(t =>
      (!taskFilter.value || t.status === taskFilter.value) &&
      (!taskAssigneeFilter.value || t.assignee === taskAssigneeFilter.value)
    ));

    const pendingTasks = computed(() => props.mockData.tasks.filter(t => t.status !== 'done').length);
    const stats = computed(() => {
      const r = props.mockData.rooms;
      return [
        { label: 'Kotor',    value: r.filter(x=>x.status==='dirty').length,    icon: 'dangerous',         iconClass: 'stat-icon-danger',   filter: 'dirty' },
        { label: 'Cleaning', value: r.filter(x=>x.status==='cleaning').length, icon: 'cleaning_services', iconClass: 'stat-icon-warning',  filter: 'cleaning' },
        { label: 'Bersih',   value: r.filter(x=>x.status==='clean').length,    icon: 'check_circle',      iconClass: 'stat-icon-success',  filter: 'clean' },
        { label: 'Terisi',   value: r.filter(x=>x.status==='occupied').length, icon: 'hotel',             iconClass: 'stat-icon-primary',  filter: 'occupied' },
        { label: 'Inspeksi', value: r.filter(x=>x.status==='inspect').length,  icon: 'fact_check',        iconClass: 'stat-icon-info',     filter: 'inspect' },
      ];
    });

    function getStaff(id) { return id ? props.mockData.staff.find(s => s.id === id) : null; }
    function getStaffName(id) { const s = getStaff(id); return s ? s.name : '—'; }
    function getStaffTasks(id) { return props.mockData.tasks.filter(t => t.assignee === id); }

    function updateRoomStatus(room, status) {
      room.status = status;
      emit('showToast', `Kamar ${room.id} diperbarui → ${statusLabel[status]}`, 'success');
      roomDrawer.value = false;
    }

    function saveTask() {
      if (!newTask.room) { emit('showToast', 'Pilih nomor kamar terlebih dahulu', 'error'); return; }
      emit('showToast', `Tugas untuk Kamar ${newTask.room} berhasil dibuat`, 'success');
      addTaskModal.value = false;
      Object.assign(newTask, { room: '', type: 'Daily Clean', assignee: '', priority: 'normal', startTime: '', estDuration: '30m', notes: '' });
    }

    return {
      tab, filterStatus, filterFloor, taskFilter, taskAssigneeFilter, roomDrawer, staffDrawer,
      addTaskModal, selectedRoom, selectedStaff, newTask, statusFilters, taskFilters, floors,
      filteredRooms, filteredTasks, pendingTasks, stats,
      getStaff, getStaffName, getStaffTasks, updateRoomStatus, saveTask,
      statusLabel, statusBadge, priorityBadge, priorityLabel, taskStatusLabel, taskStatusBadge
    };
  }
};

// ── PAGE: Inventory ───────────────────────────────────────────
const PageInventory = {
  name: 'PageInventory',
  props: ['mockData', 'api'],
  emits: ['showToast'],
  template: `
    <div>
      <div class="page-header">
        <div>
          <h1 class="page-title">Manajemen Inventori</h1>
          <p class="page-subtitle">Kelola stok perlengkapan kamar, amenities, dan aset hotel</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-outlined" @click="$emit('showToast','Laporan inventori diunduh','success')">
            <span class="material-icons-round">download</span> Ekspor
          </button>
          <button class="btn btn-primary" @click="addItemModal=true">
            <span class="material-icons-round">add_box</span> Tambah Item
          </button>
        </div>
      </div>

      <!-- Stats -->
      <div class="stat-grid mb-5">
        <div class="stat-card">
          <div class="stat-icon stat-icon-primary"><span class="material-icons-round">inventory_2</span></div>
          <div class="stat-value">{{ totalItems }}</div>
          <div class="stat-label">Total Jenis Item</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-icon-success"><span class="material-icons-round">check_box</span></div>
          <div class="stat-value">{{ inStockItems }}</div>
          <div class="stat-label">Item Tersedia</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-icon-warning"><span class="material-icons-round">warning</span></div>
          <div class="stat-value">{{ lowStockItems }}</div>
          <div class="stat-label">Stok Rendah</div>
          <div class="stat-change down"><span class="material-icons-round">arrow_downward</span>Perlu reorder</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-icon-danger"><span class="material-icons-round">remove_shopping_cart</span></div>
          <div class="stat-value">{{ outStockItems }}</div>
          <div class="stat-label">Stok Habis</div>
          <div class="stat-change down"><span class="material-icons-round">error</span>Segera restock</div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tab-bar">
        <div class="tab-item" :class="{active: tab==='all'}" @click="tab='all'">
          <span class="material-icons-round">apps</span> Semua Item
        </div>
        <div class="tab-item" :class="{active: tab==='amenities'}" @click="tab='amenities'">
          <span class="material-icons-round">local_drink</span> Amenities
        </div>
        <div class="tab-item" :class="{active: tab==='linen'}" @click="tab='linen'">
          <span class="material-icons-round">dry_cleaning</span> Linen
        </div>
        <div class="tab-item" :class="{active: tab==='furniture'}" @click="tab='furniture'">
          <span class="material-icons-round">chair</span> Furnitur & Elektronik
        </div>
        <div class="tab-item" :class="{active: tab==='cleaning'}" @click="tab='cleaning'">
          <span class="material-icons-round">cleaning_services</span> Kebersihan
        </div>
        <div class="tab-item" :class="{active: tab==='food'}" @click="tab='food'">
          <span class="material-icons-round">restaurant</span> Makanan & Minuman
        </div>
      </div>

      <!-- Search + Filter -->
      <div class="flex gap-3 mb-4 wrap">
        <div class="search-field" style="width:280px">
          <span class="material-icons-round">search</span>
          <input type="text" v-model="q" placeholder="Cari nama item...">
        </div>
        <select class="form-select" style="width:140px" v-model="stockFilter">
          <option value="">Semua Stok</option>
          <option value="low">Stok Rendah</option>
          <option value="out">Habis</option>
          <option value="ok">Tersedia</option>
        </select>
        <button class="btn btn-sm ml-auto" :class="viewMode==='grid'?'btn-primary':'btn-secondary'" @click="viewMode='grid'">
          <span class="material-icons-round">grid_view</span>
        </button>
        <button class="btn btn-sm" :class="viewMode==='table'?'btn-primary':'btn-secondary'" @click="viewMode='table'">
          <span class="material-icons-round">table_rows</span>
        </button>
      </div>

      <!-- Grid View -->
      <div v-if="viewMode==='grid'" class="inv-grid">
        <div v-for="item in filteredItems" :key="item.id" class="inv-card"
          :class="{ 'low-stock': isLowStock(item), 'out-stock': item.qty === 0 && item.minStock > 0 }"
          @click="selectedItem=item; itemDrawer=true">
          <div class="flex items-start justify-between mb-3">
            <div class="inv-icon" :style="{ background: item.iconBg }">
              <span class="material-icons-round" :style="{ color: item.iconColor }">{{ item.icon }}</span>
            </div>
            <span class="material-icons-round" style="font-size:16px;color:var(--color-warning)" v-if="item.starred">star</span>
          </div>
          <div class="inv-name">{{ item.name }}</div>
          <div class="inv-category">{{ item.category }}</div>
          <div class="inv-stock-row">
            <div>
              <div class="inv-qty" :style="{ color: item.qty===0&&item.minStock>0 ? 'var(--color-danger)' : isLowStock(item) ? 'var(--color-warning)' : 'var(--text-primary)' }">{{ item.qty }}</div>
              <div class="inv-unit">{{ item.unit }}</div>
            </div>
            <span class="badge text-xs" :class="item.qty===0&&item.minStock>0?'badge-danger':isLowStock(item)?'badge-warning':'badge-success'">
              {{ item.qty===0&&item.minStock>0?'Habis':isLowStock(item)?'Rendah':'OK' }}
            </span>
          </div>
          <div class="inv-price" v-if="item.price > 0">{{ formatRp(item.price) }} / {{ item.unit }}</div>
          <div class="progress mt-2" v-if="item.minStock > 0 && item.qty > 0">
            <div class="progress-bar" :class="isLowStock(item)?'warning':'success'" :style="{ width: Math.min(100, item.qty/item.minStock*100)+'%' }"></div>
          </div>
        </div>
        <div v-if="filteredItems.length===0" class="card col-3" style="text-align:center;padding:48px;color:var(--text-muted)">
          <span class="material-icons-round" style="font-size:40px;opacity:0.3">search_off</span>
          <div class="mt-3">Tidak ada item ditemukan</div>
        </div>
      </div>

      <!-- Table View -->
      <div v-if="viewMode==='table'" class="card">
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Item</th><th>Kategori</th><th>Stok</th><th>Min. Stok</th><th>Satuan</th><th>Harga</th><th>Status</th><th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredItems" :key="item.id" @click="selectedItem=item; itemDrawer=true">
                <td>
                  <div class="flex items-center gap-2">
                    <div class="inv-icon" style="width:28px;height:28px;margin:0" :style="{ background: item.iconBg }">
                      <span class="material-icons-round" style="font-size:14px" :style="{ color: item.iconColor }">{{ item.icon }}</span>
                    </div>
                    <span class="font-semibold">{{ item.name }}</span>
                  </div>
                </td>
                <td><span class="badge badge-neutral">{{ item.category }}</span></td>
                <td>
                  <span class="font-bold" :style="{ color: item.qty===0&&item.minStock>0?'var(--color-danger)':isLowStock(item)?'var(--color-warning)':'var(--text-primary)' }">{{ item.qty }}</span>
                </td>
                <td class="text-muted">{{ item.minStock }}</td>
                <td class="text-muted">{{ item.unit }}</td>
                <td>{{ item.price > 0 ? formatRp(item.price) : '—' }}</td>
                <td>
                  <span class="badge text-xs" :class="item.qty===0&&item.minStock>0?'badge-danger':isLowStock(item)?'badge-warning':'badge-success'">
                    {{ item.qty===0&&item.minStock>0?'Habis':isLowStock(item)?'Stok Rendah':'Tersedia' }}
                  </span>
                </td>
                <td>
                  <button class="btn btn-ghost btn-sm" @click.stop="restock(item)">
                    <span class="material-icons-round" style="font-size:14px">add_shopping_cart</span> Restock
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Item Detail Drawer -->
      <transition name="drawer">
        <div class="side-drawer" v-if="itemDrawer && selectedItem">
          <div class="flex items-center justify-between mb-6">
            <div style="font-size:18px;font-weight:800">Detail Item</div>
            <button class="icon-btn" @click="itemDrawer=false"><span class="material-icons-round">close</span></button>
          </div>
          <div class="flex items-center gap-4 mb-5">
            <div style="width:64px;height:64px;border-radius:16px;display:flex;align-items:center;justify-content:center" :style="{ background: selectedItem.iconBg }">
              <span class="material-icons-round" style="font-size:32px" :style="{ color: selectedItem.iconColor }">{{ selectedItem.icon }}</span>
            </div>
            <div>
              <div style="font-size:18px;font-weight:800">{{ selectedItem.name }}</div>
              <span class="badge badge-neutral">{{ selectedItem.category }}</span>
            </div>
          </div>
          <div class="card mb-4" style="background:var(--surface-bg)">
            <div class="card-title mb-3">Informasi Stok</div>
            <div class="flex flex-col gap-3">
              <div class="flex justify-between">
                <span class="text-sm text-muted">Stok Saat Ini</span>
                <span class="font-bold text-lg" :style="{ color: selectedItem.qty===0&&selectedItem.minStock>0?'var(--color-danger)':isLowStock(selectedItem)?'var(--color-warning)':'var(--color-success)' }">
                  {{ selectedItem.qty }} {{ selectedItem.unit }}
                </span>
              </div>
              <div class="flex justify-between"><span class="text-sm text-muted">Stok Minimum</span><span class="font-semibold">{{ selectedItem.minStock }} {{ selectedItem.unit }}</span></div>
              <div class="flex justify-between" v-if="selectedItem.price > 0"><span class="text-sm text-muted">Harga Satuan</span><span class="font-semibold">{{ formatRp(selectedItem.price) }}</span></div>
            </div>
          </div>
          <div class="card mb-4" style="background:var(--surface-bg)">
            <div class="card-title mb-3">Tambah Stok</div>
            <div class="flex gap-2">
              <input class="form-input" type="number" v-model.number="restockQty" placeholder="Jumlah" min="1">
              <button class="btn btn-primary" @click="doRestock">
                <span class="material-icons-round">add</span> Tambah
              </button>
            </div>
          </div>
          <button class="btn btn-outlined w-full" @click="$emit('showToast','Order pembelian dibuat untuk '+selectedItem.name,'success')">
            <span class="material-icons-round">shopping_cart</span> Buat Purchase Order
          </button>
        </div>
      </transition>
      <div v-if="itemDrawer" @click="itemDrawer=false" style="position:fixed;inset:0;z-index:199;background:rgba(62,42,31,0.25)"></div>

      <!-- Add Item Modal -->
      <transition name="scale">
        <div class="modal-backdrop" v-if="addItemModal" @click.self="addItemModal=false">
          <div class="modal">
            <div class="modal-header">
              <div class="modal-title">Tambah Item Inventori</div>
              <button class="icon-btn" @click="addItemModal=false"><span class="material-icons-round">close</span></button>
            </div>
            <div class="modal-body">
              <div class="grid-2 gap-4">
                <div class="form-group">
                  <label class="form-label">Nama Item *</label>
                  <input class="form-input" v-model="newItem.name" placeholder="Nama item">
                </div>
                <div class="form-group">
                  <label class="form-label">Kategori *</label>
                  <select class="form-select" v-model="newItem.category">
                    <option>Amenities</option><option>Linen</option><option>Furnitur</option>
                    <option>Elektronik</option><option>Kebersihan</option><option>Minuman</option><option>Makanan</option><option>Dekorasi</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Stok Awal</label>
                  <input class="form-input" type="number" v-model.number="newItem.qty" placeholder="0" min="0">
                </div>
                <div class="form-group">
                  <label class="form-label">Stok Minimum</label>
                  <input class="form-input" type="number" v-model.number="newItem.minStock" placeholder="0" min="0">
                </div>
                <div class="form-group">
                  <label class="form-label">Satuan</label>
                  <input class="form-input" v-model="newItem.unit" placeholder="pcs, btl, set...">
                </div>
                <div class="form-group">
                  <label class="form-label">Harga (Rp)</label>
                  <input class="form-input" type="number" v-model.number="newItem.price" placeholder="0">
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-ghost" @click="addItemModal=false">Batal</button>
              <button class="btn btn-primary" @click="saveItem">
                <span class="material-icons-round">save</span> Simpan Item
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  `,
  setup(props, { emit }) {
    const tab = ref('all');
    const q = ref('');
    const stockFilter = ref('');
    const viewMode = ref('grid');
    const itemDrawer = ref(false);
    const addItemModal = ref(false);
    const selectedItem = ref(null);
    const restockQty = ref(1);
    const newItem = reactive({ name: '', category: 'Amenities', qty: 0, minStock: 0, unit: 'pcs', price: 0 });

    const categoryMap = {
      amenities: ['Amenities'],
      linen: ['Linen'],
      furniture: ['Furnitur', 'Elektronik', 'Dekorasi'],
      cleaning: ['Kebersihan'],
      food: ['Minuman', 'Makanan'],
    };

    const totalItems   = computed(() => props.mockData.inventory.length);
    const inStockItems = computed(() => props.mockData.inventory.filter(i => i.qty > 0 || i.minStock === 0).length);
    const lowStockItems= computed(() => props.mockData.inventory.filter(i => isLowStock(i)).length);
    const outStockItems= computed(() => props.mockData.inventory.filter(i => i.qty === 0 && i.minStock > 0).length);

    function isLowStock(item) { return item.qty > 0 && item.qty < item.minStock && item.minStock > 0; }

    const filteredItems = computed(() => {
      let list = props.mockData.inventory;
      if (tab.value !== 'all') { const cats = categoryMap[tab.value] || []; list = list.filter(i => cats.includes(i.category)); }
      if (q.value) list = list.filter(i => i.name.toLowerCase().includes(q.value.toLowerCase()));
      if (stockFilter.value === 'low') list = list.filter(i => isLowStock(i));
      if (stockFilter.value === 'out') list = list.filter(i => i.qty === 0 && i.minStock > 0);
      if (stockFilter.value === 'ok') list = list.filter(i => i.qty > 0 && !isLowStock(i));
      return list;
    });

    function restock(item) { emit('showToast', `Restock ${item.name} berhasil dicatat`, 'success'); }
    function doRestock() {
      if (selectedItem.value && restockQty.value > 0) {
        selectedItem.value.qty += restockQty.value;
        emit('showToast', `+${restockQty.value} ${selectedItem.value.unit} ditambahkan ke ${selectedItem.value.name}`, 'success');
        restockQty.value = 1;
        itemDrawer.value = false;
      }
    }
    function saveItem() {
      if (!newItem.name) { emit('showToast', 'Masukkan nama item', 'error'); return; }
      emit('showToast', `Item "${newItem.name}" berhasil ditambahkan`, 'success');
      addItemModal.value = false;
      Object.assign(newItem, { name: '', category: 'Amenities', qty: 0, minStock: 0, unit: 'pcs', price: 0 });
    }

    return { tab, q, stockFilter, viewMode, itemDrawer, addItemModal, selectedItem, restockQty, newItem, totalItems, inStockItems, lowStockItems, outStockItems, filteredItems, isLowStock, restock, doRestock, saveItem, formatRp };
  }
};

// ── PAGE: Staff ───────────────────────────────────────────────
const PageStaff = {
  name: 'PageStaff',
  props: ['mockData', 'api'],
  emits: ['showToast'],
  template: `
    <div>
      <div class="page-header">
        <div>
          <h1 class="page-title">Staf Housekeeping</h1>
          <p class="page-subtitle">Data pegawai yang mengelola kebersihan dan perawatan kamar</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-outlined" @click="$emit('showToast','Jadwal staf diekspor','success')">
            <span class="material-icons-round">download</span> Ekspor Jadwal
          </button>
          <button class="btn btn-primary" @click="addStaffModal=true">
            <span class="material-icons-round">person_add</span> Tambah Staf
          </button>
        </div>
      </div>

      <!-- Stats -->
      <div class="stat-grid mb-5">
        <div class="stat-card">
          <div class="stat-icon stat-icon-primary"><span class="material-icons-round">badge</span></div>
          <div class="stat-value">{{ mockData.staff.length }}</div>
          <div class="stat-label">Total Staf</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-icon-success"><span class="material-icons-round">check_circle</span></div>
          <div class="stat-value">{{ onlineStaff }}</div>
          <div class="stat-label">Online Sekarang</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-icon-warning"><span class="material-icons-round">pending</span></div>
          <div class="stat-value">{{ busyStaff }}</div>
          <div class="stat-label">Sedang Bertugas</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-icon-secondary"><span class="material-icons-round">task_alt</span></div>
          <div class="stat-value">{{ totalTasksDone }}/{{ totalTasksAll }}</div>
          <div class="stat-label">Total Tugas Selesai</div>
        </div>
      </div>

      <!-- Search & Filter -->
      <div class="flex gap-3 mb-5 wrap">
        <div class="search-field" style="width:280px">
          <span class="material-icons-round">search</span>
          <input type="text" v-model="q" placeholder="Cari nama atau jabatan...">
        </div>
        <select class="form-select" style="width:150px" v-model="statusFilter">
          <option value="">Semua Status</option>
          <option value="online">Online</option>
          <option value="busy">Sibuk</option>
          <option value="offline">Offline</option>
        </select>
      </div>

      <!-- Staff Cards -->
      <div class="staff-grid">
        <div v-for="s in filteredStaff" :key="s.id" class="staff-card" @click="selected=s">
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="staff-avatar" :style="{ background: s.color }">{{ s.initial }}</div>
              <div>
                <div class="staff-name">{{ s.name }}</div>
                <div class="staff-role">
                  <span class="material-icons-round" style="font-size:12px;vertical-align:middle;margin-right:2px">work</span>
                  {{ s.role }}
                </div>
                <div class="staff-email">
                  <span class="material-icons-round" style="font-size:11px">mail_outline</span>
                  {{ s.email }}
                </div>
              </div>
            </div>
            <span class="staff-status-dot mt-1" :class="s.status"></span>
          </div>

          <div class="flex gap-2 mb-3 wrap">
            <span class="badge badge-neutral">{{ s.type }}</span>
            <span class="badge" :class="s.status==='online'?'badge-success':s.status==='busy'?'badge-warning':'badge-neutral'">
              {{ s.status==='online'?'Online':s.status==='busy'?'Sibuk':'Offline' }}
            </span>
          </div>

          <div class="staff-stats">
            <div>
              <div class="staff-stat-val">{{ s.tasksDone }}/{{ s.tasksTotal }}</div>
              <div class="staff-stat-lbl">Tugas</div>
            </div>
            <div>
              <div class="staff-stat-val">{{ Math.round(s.tasksDone/s.tasksTotal*100) }}%</div>
              <div class="staff-stat-lbl">Progress</div>
            </div>
            <div class="flex-1 flex items-end">
              <div class="progress w-full"><div class="progress-bar" :class="s.tasksDone===s.tasksTotal?'success':''" :style="{width:(s.tasksDone/s.tasksTotal*100)+'%'}"></div></div>
            </div>
          </div>

          <div class="flex gap-2 mt-4">
            <button class="btn btn-ghost btn-sm" @click.stop="$emit('showToast','Memulai chat dengan '+s.name,'info')">
              <span class="material-icons-round" style="font-size:14px">chat</span>
            </button>
            <button class="btn btn-ghost btn-sm" @click.stop="$emit('showToast','Menelepon '+s.name,'info')">
              <span class="material-icons-round" style="font-size:14px">call</span>
            </button>
            <button class="btn btn-outlined btn-sm ml-auto" @click.stop="selected=s">
              <span class="material-icons-round" style="font-size:14px">visibility</span> Detail
            </button>
          </div>
        </div>
      </div>

      <!-- Staff Detail Modal -->
      <transition name="scale">
        <div class="modal-backdrop" v-if="selected" @click.self="selected=null">
          <div class="modal modal-lg">
            <div class="modal-header">
              <div class="flex items-center gap-4">
                <div class="staff-avatar" style="width:56px;height:56px;font-size:22px" :style="{ background: selected.color }">{{ selected.initial }}</div>
                <div>
                  <div class="modal-title">{{ selected.name }}</div>
                  <div class="text-muted text-sm">{{ selected.role }}</div>
                </div>
              </div>
              <button class="icon-btn" @click="selected=null"><span class="material-icons-round">close</span></button>
            </div>
            <div class="modal-body">
              <div class="grid-2 gap-4">
                <div class="card" style="background:var(--surface-bg)">
                  <div class="card-title mb-3">Informasi Pribadi</div>
                  <div class="flex flex-col gap-2 text-sm">
                    <div class="flex gap-2"><span class="material-icons-round text-muted" style="font-size:15px">mail</span><span>{{ selected.email }}</span></div>
                    <div class="flex gap-2"><span class="material-icons-round text-muted" style="font-size:15px">phone</span><span>{{ selected.phone }}</span></div>
                    <div class="flex gap-2"><span class="material-icons-round text-muted" style="font-size:15px">badge</span><span>{{ selected.type }}</span></div>
                  </div>
                </div>
                <div class="card" style="background:var(--surface-bg)">
                  <div class="card-title mb-3">Jadwal & Area</div>
                  <div class="flex flex-col gap-2 text-sm">
                    <div class="flex gap-2"><span class="material-icons-round text-muted" style="font-size:15px">schedule</span><span>{{ selected.shift }}</span></div>
                    <div class="flex gap-2"><span class="material-icons-round text-muted" style="font-size:15px">map</span><span>{{ selected.area }}</span></div>
                    <div class="flex items-center gap-2">
                      <span class="staff-status-dot" :class="selected.status"></span>
                      <span>{{ selected.status==='online'?'Online & Aktif':selected.status==='busy'?'Sedang Bertugas':'Offline' }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card" style="background:var(--surface-bg)">
                <div class="card-title mb-3">Progress Tugas Hari Ini</div>
                <div class="flex items-center gap-4 mb-3">
                  <div style="font-size:28px;font-weight:800;color:var(--color-primary)">{{ Math.round(selected.tasksDone/selected.tasksTotal*100) }}%</div>
                  <div class="flex-1">
                    <div class="progress"><div class="progress-bar success" :style="{width:(selected.tasksDone/selected.tasksTotal*100)+'%'}"></div></div>
                    <div class="text-xs text-muted mt-1">{{ selected.tasksDone }} dari {{ selected.tasksTotal }} tugas selesai</div>
                  </div>
                </div>
                <div v-for="t in getStaffTasks(selected.id)" :key="t.id" class="flex items-center gap-3 py-2" style="border-bottom:1px solid var(--surface-border-light)">
                  <div class="task-checkbox" :class="{done:t.status==='done'}">
                    <span class="material-icons-round" v-if="t.status==='done'" style="font-size:12px;color:#fff">check</span>
                  </div>
                  <div class="flex-1">
                    <div class="text-sm font-semibold">Kamar {{ t.room }} — {{ t.type }}</div>
                    <div class="text-xs text-muted">{{ t.startTime }} &nbsp;·&nbsp; ~{{ t.estDuration }}</div>
                  </div>
                  <span class="badge text-xs" :class="taskStatusBadge[t.status]">{{ taskStatusLabel[t.status] }}</span>
                  <span class="badge text-xs" :class="priorityBadge[t.priority]">{{ priorityLabel[t.priority] }}</span>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-ghost" @click="selected=null">Tutup</button>
              <button class="btn btn-outlined" @click="$emit('showToast','Email terkirim ke '+selected.name,'success'); selected=null">
                <span class="material-icons-round">mail</span> Kirim Email
              </button>
              <button class="btn btn-primary" @click="$emit('showToast','Jadwal staf disimpan','success'); selected=null">
                <span class="material-icons-round">edit_calendar</span> Edit Jadwal
              </button>
            </div>
          </div>
        </div>
      </transition>

      <!-- Add Staff Modal -->
      <transition name="scale">
        <div class="modal-backdrop" v-if="addStaffModal" @click.self="addStaffModal=false">
          <div class="modal">
            <div class="modal-header">
              <div class="modal-title">Tambah Staf Housekeeping</div>
              <button class="icon-btn" @click="addStaffModal=false"><span class="material-icons-round">close</span></button>
            </div>
            <div class="modal-body">
              <div class="grid-2 gap-4">
                <div class="form-group">
                  <label class="form-label">Nama Lengkap *</label>
                  <input class="form-input" v-model="newStaff.name" placeholder="Nama lengkap">
                </div>
                <div class="form-group">
                  <label class="form-label">Email *</label>
                  <input class="form-input" v-model="newStaff.email" type="email" placeholder="email@contoh.com">
                </div>
                <div class="form-group">
                  <label class="form-label">Jabatan *</label>
                  <select class="form-select" v-model="newStaff.role">
                    <option>Housekeeping Staff</option>
                    <option>Housekeeping Supervisor</option>
                    <option>Housekeeping Manajer</option>
                    <option>Housekeeping Technician</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Shift</label>
                  <select class="form-select" v-model="newStaff.shift">
                    <option>Pagi (06:00–14:00)</option>
                    <option>Siang (14:00–22:00)</option>
                    <option>Malam (22:00–06:00)</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">No. Telepon</label>
                  <input class="form-input" v-model="newStaff.phone" placeholder="+62 ...">
                </div>
                <div class="form-group">
                  <label class="form-label">Area Tugas</label>
                  <input class="form-input" v-model="newStaff.area" placeholder="Lantai 1, Villa...">
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-ghost" @click="addStaffModal=false">Batal</button>
              <button class="btn btn-primary" @click="saveStaff">
                <span class="material-icons-round">save</span> Simpan Staf
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  `,
  setup(props, { emit }) {
    const q = ref('');
    const statusFilter = ref('');
    const selected = ref(null);
    const addStaffModal = ref(false);
    const newStaff = reactive({ name: '', email: '', role: 'Housekeeping Staff', shift: 'Pagi (06:00–14:00)', phone: '', area: '' });

    const onlineStaff = computed(() => props.mockData.staff.filter(s => s.status === 'online').length);
    const busyStaff   = computed(() => props.mockData.staff.filter(s => s.status === 'busy').length);
    const totalTasksDone = computed(() => props.mockData.staff.reduce((s, st) => s + st.tasksDone, 0));
    const totalTasksAll  = computed(() => props.mockData.staff.reduce((s, st) => s + st.tasksTotal, 0));

    const filteredStaff = computed(() => props.mockData.staff.filter(s =>
      (!q.value || s.name.toLowerCase().includes(q.value.toLowerCase()) || s.role.toLowerCase().includes(q.value.toLowerCase())) &&
      (!statusFilter.value || s.status === statusFilter.value)
    ));

    function getStaffTasks(id) { return props.mockData.tasks.filter(t => t.assignee === id); }
    function saveStaff() {
      if (!newStaff.name) { emit('showToast', 'Masukkan nama staf', 'error'); return; }
      emit('showToast', `Staf "${newStaff.name}" berhasil ditambahkan`, 'success');
      addStaffModal.value = false;
      Object.assign(newStaff, { name: '', email: '', role: 'Housekeeping Staff', shift: 'Pagi (06:00–14:00)', phone: '', area: '' });
    }

    return { q, statusFilter, selected, addStaffModal, newStaff, onlineStaff, busyStaff, totalTasksDone, totalTasksAll, filteredStaff, getStaffTasks, saveStaff, taskStatusBadge, taskStatusLabel, priorityBadge, priorityLabel };
  }
};

// ── PAGE: Predictive Maintenance ──────────────────────────────
const PageMaintenance = {
  name: 'PageMaintenance',
  props: ['mockData', 'api'],
  emits: ['showToast'],
  template: `
    <div>
      <div class="page-header">
        <div>
          <h1 class="page-title">Predictive Maintenance</h1>
          <p class="page-subtitle">Analitik cerdas prediksi jadwal perawatan fasilitas kamar berdasarkan riwayat penggunaan</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-outlined" @click="$emit('showToast','Laporan maintenance diekspor','success')">
            <span class="material-icons-round">download</span> Laporan
          </button>
          <button class="btn btn-primary" @click="addModal=true">
            <span class="material-icons-round">add_task</span> Jadwalkan Servis
          </button>
        </div>
      </div>

      <!-- Stats -->
      <div class="stat-grid mb-5">
        <div class="stat-card">
          <div class="stat-icon stat-icon-danger"><span class="material-icons-round">warning</span></div>
          <div class="stat-value">{{ overdueCount }}</div>
          <div class="stat-label">Overdue Servis</div>
          <div class="stat-change down"><span class="material-icons-round">error</span>Segera ditangani</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-icon-warning"><span class="material-icons-round">schedule</span></div>
          <div class="stat-value">{{ soonCount }}</div>
          <div class="stat-label">Akan Jatuh Tempo</div>
          <div class="stat-change down"><span class="material-icons-round">calendar_today</span>Dalam 7 hari</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-icon-success"><span class="material-icons-round">check_circle</span></div>
          <div class="stat-value">{{ normalCount }}</div>
          <div class="stat-label">Kondisi Normal</div>
          <div class="stat-change up"><span class="material-icons-round">thumb_up</span>Tidak perlu servis</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-icon-primary"><span class="material-icons-round">build</span></div>
          <div class="stat-value">{{ mockData.maintenance.length }}</div>
          <div class="stat-label">Total Dipantau</div>
        </div>
      </div>

      <div class="grid-2 mb-5">
        <!-- Maintenance List -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">Status Fasilitas Kamar</div>
          </div>
          <div v-for="m in mockData.maintenance" :key="m.id" class="maint-item">
            <div class="maint-icon" :style="{ background: m.status==='overdue'?'rgba(184,64,64,0.12)':m.status==='soon'?'rgba(196,131,42,0.12)':'rgba(74,124,89,0.12)' }">
              <span class="material-icons-round" :style="{ color: maintStatusColor[m.status] }">{{ m.icon }}</span>
            </div>
            <div class="maint-bar-wrap">
              <div class="flex items-center justify-between mb-1">
                <div>
                  <div class="maint-room">Kamar {{ m.room }} — {{ m.facility }}</div>
                </div>
                <span class="badge text-xs" :class="maintStatusBadge[m.status]">
                  {{ m.status==='overdue'?'Overdue':m.status==='soon'?'Segera':'Normal' }}
                </span>
              </div>
              <div class="progress">
                <div class="progress-bar" :class="m.status==='overdue'?'danger':m.status==='soon'?'warning':'success'"
                  :style="{ width: Math.min(100, m.usageDays/m.maxDays*100)+'%' }"></div>
              </div>
              <div class="maint-days">{{ m.usageDays }}/{{ m.maxDays }} hari ({{ Math.round(m.usageDays/m.maxDays*100) }}%)</div>
            </div>
          </div>
        </div>

        <!-- Chart & Detail -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">Distribusi Kondisi Fasilitas</div>
          </div>
          <canvas id="maint-chart" height="200"></canvas>
          <div class="flex flex-col gap-3 mt-4">
            <div v-for="m in mockData.maintenance" :key="m.id" class="flex items-center gap-3">
              <span class="material-icons-round" style="font-size:16px" :style="{ color: maintStatusColor[m.status] }">{{ m.icon }}</span>
              <div class="flex-1">
                <div class="text-sm font-semibold">Kamar {{ m.room }} — {{ m.facility }}</div>
                <div class="text-xs text-muted">
                  Sisa waktu: {{ m.status==='overdue' ? 'Terlambat '+(m.usageDays-m.maxDays)+' hari' : (m.maxDays-m.usageDays)+' hari' }}
                </div>
              </div>
              <button class="btn btn-sm btn-ghost" @click="$emit('showToast','Jadwal servis '+m.facility+' kamar '+m.room+' dibuat','success')">
                <span class="material-icons-round" style="font-size:14px">build</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- History Table -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Riwayat Servis</div>
          <button class="btn btn-ghost btn-sm" @click="$emit('showToast','Riwayat servis lengkap dimuat','info')">Lihat Semua</button>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Kamar</th><th>Fasilitas</th><th>Penggunaan</th><th>Maks. Siklus</th><th>Status</th><th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="m in mockData.maintenance" :key="m.id" @click="$emit('showToast','Detail '+m.facility+' kamar '+m.room,'info')">
                <td class="font-semibold">{{ m.room }}</td>
                <td>
                  <div class="flex items-center gap-2">
                    <span class="material-icons-round" style="font-size:15px" :style="{ color: maintStatusColor[m.status] }">{{ m.icon }}</span>
                    {{ m.facility }}
                  </div>
                </td>
                <td>{{ m.usageDays }} hari</td>
                <td>{{ m.maxDays }} hari</td>
                <td>
                  <span class="badge" :class="maintStatusBadge[m.status]">
                    {{ m.status==='overdue'?'Overdue':m.status==='soon'?'Segera Jatuh Tempo':'Normal' }}
                  </span>
                </td>
                <td>
                  <button class="btn btn-outlined btn-sm" @click.stop="$emit('showToast','Jadwal servis '+m.facility+' kamar '+m.room+' dibuat','success')">
                    <span class="material-icons-round">build</span> Jadwalkan Servis
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add Maintenance Modal -->
      <transition name="scale">
        <div class="modal-backdrop" v-if="addModal" @click.self="addModal=false">
          <div class="modal">
            <div class="modal-header">
              <div class="modal-title">Jadwalkan Servis</div>
              <button class="icon-btn" @click="addModal=false"><span class="material-icons-round">close</span></button>
            </div>
            <div class="modal-body">
              <div class="grid-2 gap-4">
                <div class="form-group">
                  <label class="form-label">Nomor Kamar *</label>
                  <select class="form-select" v-model="newMaint.room">
                    <option value="">Pilih kamar</option>
                    <option v-for="r in mockData.rooms" :key="r.id" :value="r.id">{{ r.id }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Fasilitas *</label>
                  <select class="form-select" v-model="newMaint.facility">
                    <option>AC Split</option><option>Water Heater</option><option>TV LED</option>
                    <option>Water Pump</option><option>Lift</option><option>Lainnya</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Tanggal Servis</label>
                  <input class="form-input" type="date" v-model="newMaint.date">
                </div>
                <div class="form-group">
                  <label class="form-label">Teknisi</label>
                  <select class="form-select" v-model="newMaint.tech">
                    <option value="">Pilih staf</option>
                    <option v-for="s in mockData.staff" :key="s.id">{{ s.name }}</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Catatan Servis</label>
                <textarea class="form-textarea" v-model="newMaint.notes" placeholder="Deskripsi pekerjaan servis..."></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-ghost" @click="addModal=false">Batal</button>
              <button class="btn btn-primary" @click="saveMaint">
                <span class="material-icons-round">save</span> Simpan
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  `,
  setup(props, { emit }) {
    const addModal = ref(false);
    const newMaint = reactive({ room: '', facility: 'AC Split', date: '', tech: '', notes: '' });

    const overdueCount = computed(() => props.mockData.maintenance.filter(m => m.status === 'overdue').length);
    const soonCount    = computed(() => props.mockData.maintenance.filter(m => m.status === 'soon').length);
    const normalCount  = computed(() => props.mockData.maintenance.filter(m => m.status === 'normal').length);

    onMounted(() => {
      setChartDefaults();
      const el = document.getElementById('maint-chart');
      if (el) new Chart(el, {
        type: 'doughnut',
        data: {
          labels: ['Overdue','Segera','Normal'],
          datasets: [{ data: [overdueCount.value, soonCount.value, normalCount.value], backgroundColor: ['#B84040','#C4832A','#4A7C59'], borderWidth: 0, hoverOffset: 6 }]
        },
        options: { responsive: true, cutout: '65%', plugins: { legend: { position: 'bottom', labels: { padding: 16 } } } }
      });
    });

    function saveMaint() {
      if (!newMaint.room) { emit('showToast', 'Pilih nomor kamar', 'error'); return; }
      emit('showToast', `Jadwal servis ${newMaint.facility} kamar ${newMaint.room} berhasil disimpan`, 'success');
      addModal.value = false;
      Object.assign(newMaint, { room: '', facility: 'AC Split', date: '', tech: '', notes: '' });
    }

    return { addModal, newMaint, overdueCount, soonCount, normalCount, saveMaint, maintStatusColor, maintStatusBadge };
  }
};

// ── PAGE: Lost & Found ────────────────────────────────────────
const PageLostFound = {
  name: 'PageLostFound',
  props: ['mockData', 'api'],
  emits: ['showToast'],
  template: `
    <div>
      <div class="page-header">
        <div>
          <h1 class="page-title">Lost &amp; Found 🔍</h1>
          <p class="page-subtitle">Manajemen barang temuan tamu — Amerta Loka Resort</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-outlined" @click="$emit('showToast','Laporan Lost & Found diunduh','success')">
            <span class="material-icons-round">download</span> Laporan
          </button>
          <button class="btn btn-primary" @click="openAddModal">
            <span class="material-icons-round">add_circle</span> Tambah Temuan
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stat-grid mb-5">
        <div class="stat-card">
          <div class="stat-icon stat-icon-primary"><span class="material-icons-round">inventory_2</span></div>
          <div class="stat-value">{{ items.length }}</div>
          <div class="stat-label">Total Temuan</div>
          <div class="stat-change"><span class="material-icons-round">calendar_today</span>Semua waktu</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-icon-warning"><span class="material-icons-round">pending_actions</span></div>
          <div class="stat-value">{{ unclaimed }}</div>
          <div class="stat-label">Belum Diklaim</div>
          <div class="stat-change down"><span class="material-icons-round">watch_later</span>Menunggu pemilik</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-icon-success"><span class="material-icons-round">check_circle</span></div>
          <div class="stat-value">{{ claimed }}</div>
          <div class="stat-label">Sudah Diklaim</div>
          <div class="stat-change up"><span class="material-icons-round">arrow_upward</span>Berhasil dikembalikan</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-icon-danger"><span class="material-icons-round">notification_important</span></div>
          <div class="stat-value">{{ needsVerification }}</div>
          <div class="stat-label">Menunggu Verifikasi</div>
          <div class="stat-change"><span class="material-icons-round">supervisor_account</span>Perlu supervisor</div>
        </div>
      </div>

      <!-- Workflow Banner -->
      <div class="card mb-5" style="background: linear-gradient(135deg, rgba(107,112,76,0.08) 0%, rgba(184,151,126,0.08) 100%); border: 1px solid rgba(107,112,76,0.2)">
        <div class="card-header" style="margin-bottom:12px">
          <div class="card-title">Alur Kerja Lost &amp; Found</div>
        </div>
        <div class="flex items-center gap-2 wrap" style="font-size:13px">
          <div v-for="(step, i) in workflow" :key="i" class="flex items-center gap-2">
            <div class="flex items-center gap-2 px-3 py-2 rounded-lg" :style="{ background: step.bg, color: step.color, fontWeight: 600 }">
              <span class="material-icons-round" style="font-size:16px">{{ step.icon }}</span>
              {{ step.label }}
            </div>
            <span v-if="i < workflow.length-1" class="material-icons-round text-muted" style="font-size:18px">arrow_forward</span>
          </div>
        </div>
      </div>

      <!-- Filter & Search -->
      <div class="flex gap-3 mb-4 wrap">
        <div class="flex gap-2">
          <button v-for="f in statusFilters" :key="f.val" class="btn btn-sm" :class="filterStatus===f.val?'btn-primary':'btn-secondary'" @click="filterStatus=f.val">
            <span class="material-icons-round" style="font-size:14px">{{ f.icon }}</span> {{ f.label }}
            <span v-if="f.count" class="badge badge-neutral ml-1" style="margin-left:6px;font-size:10px">{{ f.count }}</span>
          </button>
        </div>
        <div class="ml-auto flex gap-2 items-center">
          <div class="search-field" style="background:var(--surface-card)">
            <span class="material-icons-round">search</span>
            <input type="text" placeholder="Cari barang, kamar..." v-model="searchQ" style="border:none;outline:none;background:transparent;font-family:inherit;font-size:13px;width:180px">
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="card">
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Kode</th>
                <th>Nama Barang</th>
                <th>Kamar</th>
                <th>Ditemukan Oleh</th>
                <th>Tgl Temuan</th>
                <th>Lokasi Simpan</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredItems" :key="item.id" @click="openDetail(item)" style="cursor:pointer">
                <td><span class="font-semibold" style="color:var(--color-primary)">{{ item.kode_lf }}</span></td>
                <td>
                  <div class="flex items-center gap-2">
                    <div class="lf-item-icon">
                      <span class="material-icons-round" style="font-size:16px;color:var(--color-secondary)">{{ getItemIcon(item.item_name) }}</span>
                    </div>
                    <div>
                      <div class="font-semibold">{{ item.item_name }}</div>
                      <div class="text-xs text-muted" style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ item.description }}</div>
                    </div>
                  </div>
                </td>
                <td><span class="badge badge-neutral">Kamar {{ item.room_number }}</span></td>
                <td>
                  <div class="flex items-center gap-2" v-if="getStaff(item.found_by)">
                    <div class="room-assignee-dot" style="width:26px;height:26px;font-size:11px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0" :style="{ background: getStaff(item.found_by).color }">{{ getStaff(item.found_by).initial }}</div>
                    <span class="text-sm">{{ getStaff(item.found_by).name.split(' ').slice(0,2).join(' ') }}</span>
                  </div>
                </td>
                <td class="text-sm text-muted">{{ formatDate(item.found_date) }}</td>
                <td>
                  <div class="flex items-center gap-1 text-sm">
                    <span class="material-icons-round" style="font-size:14px;color:var(--color-primary)">lock</span>
                    {{ item.storage_location }}
                  </div>
                </td>
                <td>
                  <span class="badge" :class="lfStatusBadge[item.status]">
                    <span class="material-icons-round" style="font-size:12px;vertical-align:middle;margin-right:3px">{{ lfStatusIcon[item.status] }}</span>
                    {{ lfStatusLabel[item.status] }}
                  </span>
                </td>
                <td>
                  <div class="flex gap-1" @click.stop>
                    <button v-if="item.status==='FOUND'" class="btn btn-outlined btn-sm" @click.stop="advanceStatus(item,'STORED')">
                      <span class="material-icons-round">verified</span> Verifikasi
                    </button>
                    <button v-if="item.status==='STORED'" class="btn btn-outlined btn-sm" style="border-color:var(--color-success);color:var(--color-success)" @click.stop="openClaimModal(item)">
                      <span class="material-icons-round">how_to_reg</span> Klaim
                    </button>
                    <button v-if="item.status==='CLAIMED'" class="btn btn-outlined btn-sm" style="border-color:var(--color-info);color:var(--color-info)" @click.stop="advanceStatus(item,'CLOSED')">
                      <span class="material-icons-round">task_alt</span> Tutup
                    </button>
                    <button class="btn btn-ghost btn-sm" @click.stop="openDetail(item)">
                      <span class="material-icons-round">visibility</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="filteredItems.length===0" style="text-align:center;padding:48px;color:var(--text-muted)">
            <span class="material-icons-round" style="font-size:40px;opacity:0.3">search_off</span>
            <div class="mt-3">Tidak ada barang ditemukan</div>
          </div>
        </div>
      </div>

      <!-- Add Modal -->
      <transition name="scale">
        <div class="modal-backdrop" v-if="addModal" @click.self="addModal=false">
          <div class="modal" style="max-width:600px">
            <div class="modal-header">
              <div class="modal-title">
                <span class="material-icons-round" style="vertical-align:middle;margin-right:8px;color:var(--color-primary)">add_circle</span>
                Input Barang Temuan
              </div>
              <button class="icon-btn" @click="addModal=false"><span class="material-icons-round">close</span></button>
            </div>
            <div class="modal-body">
              <div class="grid-2 gap-4">
                <div class="form-group">
                  <label class="form-label">ID Temuan *</label>
                  <input class="form-input" v-model="newItem.kode_lf" placeholder="LF011" />
                </div>
                <div class="form-group">
                  <label class="form-label">Nomor Kamar *</label>
                  <select class="form-select" v-model="newItem.room_number">
                    <option value="">Pilih kamar</option>
                    <option v-for="r in mockData.rooms" :key="r.id" :value="r.id">{{ r.id }} – {{ r.type }}</option>
                  </select>
                </div>
                <div class="form-group" style="grid-column:1/-1">
                  <label class="form-label">Nama Barang *</label>
                  <input class="form-input" v-model="newItem.item_name" placeholder="Contoh: Jam Tangan Rolex" />
                </div>
                <div class="form-group" style="grid-column:1/-1">
                  <label class="form-label">Deskripsi Barang</label>
                  <textarea class="form-textarea" v-model="newItem.description" placeholder="Warna, ukuran, merek, ciri khusus..."></textarea>
                </div>
                <div class="form-group">
                  <label class="form-label">Ditemukan Oleh *</label>
                  <select class="form-select" v-model="newItem.found_by">
                    <option value="">Pilih staf</option>
                    <option v-for="s in mockData.staff" :key="s.id" :value="s.id">{{ s.name }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Tanggal Temuan</label>
                  <input class="form-input" type="date" v-model="newItem.found_date" />
                </div>
                <div class="form-group">
                  <label class="form-label">Lokasi Simpan</label>
                  <input class="form-input" v-model="newItem.storage_location" placeholder="Contoh: Locker A-01" />
                </div>
                <div class="form-group">
                  <label class="form-label">Foto Barang</label>
                  <div class="form-input" style="cursor:pointer;color:var(--text-muted);display:flex;align-items:center;gap:8px" @click="$emit('showToast','Upload foto (simulasi)','info')">
                    <span class="material-icons-round" style="font-size:18px">photo_camera</span>
                    Upload Foto Barang
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-ghost" @click="addModal=false">Batal</button>
              <button class="btn btn-primary" @click="saveItem">
                <span class="material-icons-round">save</span> Simpan Temuan
              </button>
            </div>
          </div>
        </div>
      </transition>

      <!-- Claim Modal -->
      <transition name="scale">
        <div class="modal-backdrop" v-if="claimModal && claimTarget" @click.self="claimModal=false">
          <div class="modal" style="max-width:480px">
            <div class="modal-header">
              <div class="modal-title">
                <span class="material-icons-round" style="vertical-align:middle;margin-right:8px;color:var(--color-success)">how_to_reg</span>
                Proses Klaim Barang
              </div>
              <button class="icon-btn" @click="claimModal=false"><span class="material-icons-round">close</span></button>
            </div>
            <div class="modal-body">
              <div class="card mb-4" style="background:var(--surface-bg)">
                <div class="text-sm text-muted mb-1">Barang</div>
                <div class="font-semibold">{{ claimTarget.item_name }}</div>
                <div class="text-sm text-muted">{{ claimTarget.kode_lf }} · Kamar {{ claimTarget.room_number }}</div>
              </div>
              <div class="form-group">
                <label class="form-label">Nama Pengklaim *</label>
                <input class="form-input" v-model="claimName" placeholder="Nama lengkap tamu/pemilik" />
              </div>
              <div class="form-group">
                <label class="form-label">Tanggal Klaim</label>
                <input class="form-input" type="date" v-model="claimDate" />
              </div>
              <div class="form-group">
                <label class="form-label">Bukti Identitas</label>
                <div class="form-input" style="cursor:pointer;color:var(--text-muted);display:flex;align-items:center;gap:8px" @click="$emit('showToast','Upload KTP/Passport (simulasi)','info')">
                  <span class="material-icons-round" style="font-size:18px">badge</span>
                  Upload KTP / Passport
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-ghost" @click="claimModal=false">Batal</button>
              <button class="btn btn-primary" style="background:var(--color-success)" @click="processClaim">
                <span class="material-icons-round">check_circle</span> Konfirmasi Klaim
              </button>
            </div>
          </div>
        </div>
      </transition>

      <!-- Detail Drawer -->
      <transition name="drawer">
        <div class="side-drawer" v-if="detailDrawer && detailItem" style="width:380px">
          <div class="flex items-center justify-between mb-6">
            <div style="font-size:18px;font-weight:800">Detail Barang Temuan</div>
            <button class="icon-btn" @click="detailDrawer=false"><span class="material-icons-round">close</span></button>
          </div>

          <div class="flex items-center gap-3 mb-5">
            <div style="width:56px;height:56px;border-radius:16px;background:rgba(184,151,126,0.15);display:flex;align-items:center;justify-content:center;flex-shrink:0">
              <span class="material-icons-round" style="font-size:28px;color:var(--color-secondary)">{{ getItemIcon(detailItem.item_name) }}</span>
            </div>
            <div>
              <div style="font-size:17px;font-weight:700">{{ detailItem.item_name }}</div>
              <div class="text-muted text-sm">{{ detailItem.kode_lf }}</div>
              <span class="badge mt-1" :class="lfStatusBadge[detailItem.status]">{{ lfStatusLabel[detailItem.status] }}</span>
            </div>
          </div>

          <!-- Status Timeline -->
          <div class="card mb-4" style="background:var(--surface-bg)">
            <div class="card-title mb-3">Status Workflow</div>
            <div class="flex gap-2 items-center" style="font-size:12px">
              <div v-for="(s,i) in ['FOUND','STORED','CLAIMED','CLOSED']" :key="s" class="flex items-center gap-1">
                <div class="flex flex-col items-center gap-1">
                  <div style="width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;transition:all .2s"
                    :style="{ background: isStatusReached(detailItem.status, s) ? getStatusColor(s) : 'rgba(154,153,120,0.2)', color: isStatusReached(detailItem.status, s) ? '#fff' : 'var(--text-muted)' }">
                    <span class="material-icons-round" style="font-size:14px">{{ lfStatusIcon[s] }}</span>
                  </div>
                  <div :style="{ color: isStatusReached(detailItem.status, s) ? getStatusColor(s) : 'var(--text-muted)', fontWeight: detailItem.status===s?'700':'400' }">
                    {{ lfStatusLabel[s] }}
                  </div>
                </div>
                <div v-if="i<3" style="width:24px;height:2px;background:rgba(154,153,120,0.3);margin-bottom:16px;flex-shrink:0"
                  :style="{ background: isStatusReached(detailItem.status, ['FOUND','STORED','CLAIMED','CLOSED'][i+1]) ? getStatusColor(detailItem.status) : 'rgba(154,153,120,0.2)' }"></div>
              </div>
            </div>
          </div>

          <div class="card mb-3" style="background:var(--surface-bg)">
            <div class="card-title mb-3">Info Barang</div>
            <div class="flex flex-col gap-2 text-sm">
              <div class="flex justify-between"><span class="text-muted">Kamar</span><span class="font-semibold">{{ detailItem.room_number }}</span></div>
              <div class="flex justify-between"><span class="text-muted">Tanggal Temuan</span><span class="font-semibold">{{ formatDate(detailItem.found_date) }}</span></div>
              <div class="flex justify-between"><span class="text-muted">Lokasi Simpan</span><span class="font-semibold">{{ detailItem.storage_location }}</span></div>
              <div class="flex justify-between" v-if="getStaff(detailItem.found_by)"><span class="text-muted">Ditemukan Oleh</span><span class="font-semibold">{{ getStaff(detailItem.found_by).name.split(' ').slice(0,2).join(' ') }}</span></div>
            </div>
          </div>

          <div class="card mb-3" style="background:var(--surface-bg)" v-if="detailItem.description">
            <div class="card-title mb-2">Deskripsi</div>
            <div class="text-sm text-muted">{{ detailItem.description }}</div>
          </div>

          <div class="card mb-5" style="background:var(--surface-bg)" v-if="detailItem.claimed_by">
            <div class="card-title mb-3">Info Klaim</div>
            <div class="flex flex-col gap-2 text-sm">
              <div class="flex justify-between"><span class="text-muted">Diklaim Oleh</span><span class="font-semibold">{{ detailItem.claimed_by }}</span></div>
              <div class="flex justify-between"><span class="text-muted">Tanggal Klaim</span><span class="font-semibold">{{ formatDate(detailItem.claim_date) }}</span></div>
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <button v-if="detailItem.status==='FOUND'" class="btn btn-primary w-full" @click="advanceStatus(detailItem,'STORED'); detailDrawer=false">
              <span class="material-icons-round">verified</span> Verifikasi & Simpan
            </button>
            <button v-if="detailItem.status==='STORED'" class="btn w-full" style="background:var(--color-success);color:#fff" @click="detailDrawer=false; openClaimModal(detailItem)">
              <span class="material-icons-round">how_to_reg</span> Proses Klaim
            </button>
            <button v-if="detailItem.status==='CLAIMED'" class="btn w-full" style="background:var(--color-info);color:#fff" @click="advanceStatus(detailItem,'CLOSED'); detailDrawer=false">
              <span class="material-icons-round">task_alt</span> Tutup Kasus
            </button>
            <button class="btn btn-ghost w-full" @click="detailDrawer=false">Tutup</button>
          </div>
        </div>
      </transition>
    </div>
  `,
  setup(props, { emit }) {
    const items = ref([...props.mockData.lostFound]);
    const addModal = ref(false);
    const claimModal = ref(false);
    const claimTarget = ref(null);
    const claimName = ref('');
    const claimDate = ref('2026-06-14');
    const detailDrawer = ref(false);
    const detailItem = ref(null);
    const filterStatus = ref('');
    const searchQ = ref('');

    const lfStatusLabel = { FOUND: 'Ditemukan', STORED: 'Disimpan', CLAIMED: 'Diklaim', CLOSED: 'Selesai' };
    const lfStatusBadge = { FOUND: 'badge-warning', STORED: 'badge-info', CLAIMED: 'badge-success', CLOSED: 'badge-neutral' };
    const lfStatusIcon  = { FOUND: 'search', STORED: 'lock', CLAIMED: 'how_to_reg', CLOSED: 'task_alt' };
    const statusOrder = ['FOUND', 'STORED', 'CLAIMED', 'CLOSED'];

    const workflow = [
      { label: 'Housekeeping Temukan', icon: 'cleaning_services', bg: 'rgba(107,112,76,0.12)', color: 'var(--color-primary)' },
      { label: 'Input Sistem', icon: 'edit_note', bg: 'rgba(74,110,138,0.12)', color: 'var(--color-info)' },
      { label: 'Supervisor Verifikasi', icon: 'verified_user', bg: 'rgba(196,131,42,0.12)', color: 'var(--color-warning)' },
      { label: 'Barang Disimpan', icon: 'lock', bg: 'rgba(62,42,31,0.08)', color: 'var(--color-secondary)' },
      { label: 'Tamu Klaim', icon: 'how_to_reg', bg: 'rgba(74,124,89,0.12)', color: 'var(--color-success)' },
      { label: 'Kasus Ditutup', icon: 'task_alt', bg: 'rgba(154,153,120,0.12)', color: 'var(--text-muted)' },
    ];

    const statusFilters = computed(() => [
      { val: '', label: 'Semua', icon: 'list', count: items.value.length },
      { val: 'FOUND', label: 'Ditemukan', icon: 'search', count: items.value.filter(i=>i.status==='FOUND').length },
      { val: 'STORED', label: 'Disimpan', icon: 'lock', count: items.value.filter(i=>i.status==='STORED').length },
      { val: 'CLAIMED', label: 'Diklaim', icon: 'how_to_reg', count: items.value.filter(i=>i.status==='CLAIMED').length },
      { val: 'CLOSED', label: 'Selesai', icon: 'task_alt', count: items.value.filter(i=>i.status==='CLOSED').length },
    ]);

    const unclaimed = computed(() => items.value.filter(i => i.status === 'FOUND' || i.status === 'STORED').length);
    const claimed   = computed(() => items.value.filter(i => i.status === 'CLAIMED').length);
    const needsVerification = computed(() => items.value.filter(i => i.status === 'FOUND').length);

    const filteredItems = computed(() => {
      let list = items.value;
      if (filterStatus.value) list = list.filter(i => i.status === filterStatus.value);
      if (searchQ.value) {
        const q = searchQ.value.toLowerCase();
        list = list.filter(i => i.item_name.toLowerCase().includes(q) || i.room_number.includes(q) || i.kode_lf.toLowerCase().includes(q));
      }
      return list;
    });

    const newItem = reactive({
      kode_lf: '', room_number: '', item_name: '', description: '',
      found_by: '', found_date: '2026-06-14', storage_location: '', photo: null
    });

    function getStaff(id) { return props.mockData.staff.find(s => s.id === id); }
    function formatDate(d) {
      if (!d) return '—';
      const [y, m, day] = d.split('-');
      const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
      return `${day} ${months[+m-1]} ${y}`;
    }
    function getItemIcon(name) {
      const n = (name || '').toLowerCase();
      if (n.includes('jam') || n.includes('watch')) return 'watch';
      if (n.includes('kamera') || n.includes('camera')) return 'photo_camera';
      if (n.includes('laptop') || n.includes('charger')) return 'laptop';
      if (n.includes('tablet') || n.includes('ipad')) return 'tablet';
      if (n.includes('hp') || n.includes('phone') || n.includes('iphone')) return 'smartphone';
      if (n.includes('kacamata') || n.includes('glasses')) return 'visibility';
      if (n.includes('dompet') || n.includes('wallet')) return 'account_balance_wallet';
      if (n.includes('gelang') || n.includes('cincin') || n.includes('kalung')) return 'diamond';
      if (n.includes('sepatu') || n.includes('sandal')) return 'directions_walk';
      if (n.includes('baju') || n.includes('buku')) return 'menu_book';
      if (n.includes('passport') || n.includes('ktp')) return 'badge';
      return 'inventory_2';
    }
    function isStatusReached(current, check) {
      return statusOrder.indexOf(current) >= statusOrder.indexOf(check);
    }
    function getStatusColor(s) {
      const map = { FOUND:'var(--color-warning)', STORED:'var(--color-info)', CLAIMED:'var(--color-success)', CLOSED:'var(--text-muted)' };
      return map[s] || 'var(--color-primary)';
    }

    function openAddModal() {
      const nextId = Math.max(...items.value.map(i=>i.id)) + 1;
      Object.assign(newItem, { kode_lf: `LF${String(nextId).padStart(3,'0')}`, room_number: '', item_name: '', description: '', found_by: '', found_date: '2026-06-14', storage_location: '', photo: null });
      addModal.value = true;
    }
    function saveItem() {
      if (!newItem.item_name || !newItem.room_number || !newItem.found_by) {
        emit('showToast', 'Lengkapi nama barang, kamar, dan penemuan', 'error'); return;
      }
      const nextId = Math.max(...items.value.map(i=>i.id)) + 1;
      items.value.unshift({ id: nextId, ...JSON.parse(JSON.stringify(newItem)), status: 'FOUND', claimed_by: null, claim_date: null });
      emit('showToast', `Barang "${newItem.item_name}" berhasil dicatat sebagai ${newItem.kode_lf}`, 'success');
      addModal.value = false;
    }
    function openClaimModal(item) {
      claimTarget.value = item;
      claimName.value = '';
      claimDate.value = '2026-06-14';
      claimModal.value = true;
    }
    function processClaim() {
      if (!claimName.value) { emit('showToast', 'Masukkan nama pengklaim', 'error'); return; }
      claimTarget.value.status = 'CLAIMED';
      claimTarget.value.claimed_by = claimName.value;
      claimTarget.value.claim_date = claimDate.value;
      emit('showToast', `Barang "${claimTarget.value.item_name}" berhasil diklaim oleh ${claimName.value}`, 'success');
      claimModal.value = false;
    }
    function advanceStatus(item, nextStatus) {
      item.status = nextStatus;
      const msgs = { STORED: `Barang "${item.item_name}" berhasil diverifikasi & disimpan`, CLOSED: `Kasus ${item.kode_lf} ditutup` };
      emit('showToast', msgs[nextStatus] || 'Status diperbarui', 'success');
    }
    function openDetail(item) {
      detailItem.value = item;
      detailDrawer.value = true;
    }

    return {
      items, addModal, claimModal, claimTarget, claimName, claimDate, detailDrawer, detailItem,
      filterStatus, searchQ, newItem, workflow,
      unclaimed, claimed, needsVerification, filteredItems, statusFilters,
      lfStatusLabel, lfStatusBadge, lfStatusIcon,
      getStaff, formatDate, getItemIcon, isStatusReached, getStatusColor,
      openAddModal, saveItem, openClaimModal, processClaim, advanceStatus, openDetail
    };
  }
};

// ── ROOT APP ──────────────────────────────────────────────────
const App = {
  name: 'App',
  components: { SidebarComp, TopbarComp, PageDashboard, PageHousekeeping, PageInventory, PageStaff, PageMaintenance, PageLostFound },
  template: `
    <div style="display:flex;height:100vh;overflow:hidden">
      <sidebar-comp
        :current-page="page"
        :collapsed="sidebarCollapsed"
        @navigate="goTo"
        @toggle="sidebarCollapsed=!sidebarCollapsed"
      />
      <div class="main-area">
        <topbar-comp :page-title="pageTitle" @show-toast="toast" />
        <main class="page-content">
          <transition name="slide" mode="out-in">
            <component
              :is="pageComp"
              :key="page"
              :mock-data="MOCK"
              :api="api"
              @show-toast="toast"
              @navigate="goTo"
            />
          </transition>
        </main>
      </div>

      <!-- Toasts -->
      <div class="toast-container">
        <transition-group name="slide">
          <div v-for="t in toasts" :key="t.id" class="toast" :class="t.type">
            <span class="material-icons-round" style="font-size:17px;flex-shrink:0"
              :style="{ color: t.type==='success'?'var(--color-success)':t.type==='error'?'var(--color-danger)':t.type==='warning'?'var(--color-warning)':'var(--color-primary)' }">
              {{ {success:'check_circle',error:'error',warning:'warning',info:'info'}[t.type] }}
            </span>
            <span class="toast-msg">{{ t.msg }}</span>
            <button class="icon-btn" style="width:22px;height:22px;flex-shrink:0" @click="closeToast(t.id)">
              <span class="material-icons-round" style="font-size:14px">close</span>
            </button>
          </div>
        </transition-group>
      </div>
    </div>
  `,
  setup() {
    const page = ref('dashboard');
    const sidebarCollapsed = ref(false);
    const toasts = ref([]);
    let tid = 0;

    const pages = {
  dashboard:   { title: 'Dashboard Housekeeping', comp: 'PageDashboard' },
  housekeeping:{ title: 'Manajemen Housekeeping', comp: 'PageHousekeeping' },
  inventory:   { title: 'Inventori',              comp: 'PageInventory' },
  staff:       { title: 'Staf Housekeeping',      comp: 'PageStaff' },
  maintenance: { title: 'Predictive Maintenance', comp: 'PageMaintenance' },
  lostfound:   { title: 'Lost & Found',           comp: 'PageLostFound'}
};

    const pageTitle = computed(() => pages[page.value]?.title || 'Dashboard');
    const pageComp  = computed(() => pages[page.value]?.comp  || 'PageDashboard');

    function goTo(p) { if (pages[p]) page.value = p; }
    function toast(msg, type = 'info') {
      const id = ++tid;
      toasts.value.push({ id, msg, type });
      setTimeout(() => closeToast(id), 4500);
    }
    function closeToast(id) {
      const i = toasts.value.findIndex(t => t.id === id);
      if (i !== -1) toasts.value.splice(i, 1);
    }

    return { page, sidebarCollapsed, toasts, pageTitle, pageComp, goTo, toast, closeToast, MOCK, api };
  }
};

// ── MOUNT ──────────────────────────────────────────────────────
const app = createApp(App);
app.mount('#app');
