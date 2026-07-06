import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Helper paths
const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');
const DATABASE_FILE = path.join(DATA_DIR, 'database.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Default system config
const defaultSystemConfig = {
  org_name: "Dinas Pendidikan & Kebudayaan Kabupaten Sejahtera",
  logo_preset: "preset-wallet",
  logo_url: "",
  deadline_t1: "2026-07-31",
  deadline_t2: "2027-01-31"
};

// Initial data templates to seed if database.json doesn't exist
const initialSchools = [
  { npsn: "20310912", nama: "SDN 1 Sejahtera Utama", kecamatan: "Kec. Sejahtera Barat", jumlah_siswa: 100, pagu_per_siswa: 900000, pagu_t1: 45000000, pagu_t2: 45000000, status: "Aktif" },
  { npsn: "20310913", nama: "SDN 2 Sejahtera Utama", kecamatan: "Kec. Sejahtera Timur", jumlah_siswa: 100, pagu_per_siswa: 900000, pagu_t1: 45000000, pagu_t2: 45000000, status: "Aktif" },
  { npsn: "20310914", nama: "SDN 3 Berkarya", kecamatan: "Kec. Sejahtera Utara", jumlah_siswa: 100, pagu_per_siswa: 900000, pagu_t1: 45000000, pagu_t2: 45000000, status: "Aktif" },
  { npsn: "20326648", nama: "SD NEGERI SEKARDOJA", kecamatan: "LARANGAN", jumlah_siswa: 200, pagu_per_siswa: 1050000, pagu_t1: 105000000, pagu_t2: 105000000, status: "Aktif" }
];

const initialOperators = [
  { nama: "Administrator Utama", username: "admin", password: "admin123", role: "Admin", instansi: "Dinas Pendidikan Kab. Sejahtera", status: "Offline" },
  { nama: "Anggota Sekolah 1", username: "sekolah", password: "school123", role: "Anggota", instansi: "SDN 1 Sejahtera Utama", status: "Offline" },
  { nama: "RUSNOTO", username: "rusnoto.prasasti@gmail.com", password: "Sekardoja123", role: "Anggota", instansi: "SD NEGERI SEKARDOJA", status: "Offline" }
];

const initialMonthlyPagu = [
  { sekolah: "SD NEGERI SEKARDOJA", bulan: "Januari", pagu: 10000000 },
  { sekolah: "SD NEGERI SEKARDOJA", bulan: "Februari", pagu: 15000000 },
  { sekolah: "SD NEGERI SEKARDOJA", bulan: "Maret", pagu: 15000000 },
  { sekolah: "SD NEGERI SEKARDOJA", bulan: "April", pagu: 20000000 },
  { sekolah: "SD NEGERI SEKARDOJA", bulan: "Mei", pagu: 15000000 },
  { sekolah: "SD NEGERI SEKARDOJA", bulan: "Juni", pagu: 15000000 },
  { sekolah: "SD NEGERI SEKARDOJA", bulan: "Juli", pagu: 15000000 },
  { sekolah: "SD NEGERI SEKARDOJA", bulan: "Agustus", pagu: 15000000 },
  { sekolah: "SD NEGERI SEKARDOJA", bulan: "September", pagu: 10000000 },
  { sekolah: "SD NEGERI SEKARDOJA", bulan: "Oktober", pagu: 15000000 },
  { sekolah: "SD NEGERI SEKARDOJA", bulan: "November", pagu: 8000000 },
  { sekolah: "SD NEGERI SEKARDOJA", bulan: "Desember", pagu: 12000000 },
  
  { sekolah: "SDN 1 Sejahtera Utama", bulan: "Januari", pagu: 5000000 },
  { sekolah: "SDN 1 Sejahtera Utama", bulan: "Februari", pagu: 8000000 },
  { sekolah: "SDN 1 Sejahtera Utama", bulan: "Maret", pagu: 8000000 },
  { sekolah: "SDN 1 Sejahtera Utama", bulan: "April", pagu: 10000000 },
  { sekolah: "SDN 1 Sejahtera Utama", bulan: "Mei", pagu: 7000000 },
  { sekolah: "SDN 1 Sejahtera Utama", bulan: "Juni", pagu: 7000000 },
  { sekolah: "SDN 1 Sejahtera Utama", bulan: "Juli", pagu: 7000000 },
  { sekolah: "SDN 1 Sejahtera Utama", bulan: "Agustus", pagu: 8000000 },
  { sekolah: "SDN 1 Sejahtera Utama", bulan: "September", pagu: 5000000 },
  { sekolah: "SDN 1 Sejahtera Utama", bulan: "Oktober", pagu: 8000000 },
  { sekolah: "SDN 1 Sejahtera Utama", bulan: "November", pagu: 5000000 },
  { sekolah: "SDN 1 Sejahtera Utama", bulan: "Desember", pagu: 12000000 }
];

const initialRAB = [
  { id: "RAB-B01", nama: "Pengadaan Buku Paket Matematika Kls IV", sekolah: "SD NEGERI SEKARDOJA", kategori: "BUKU", alokasi: 20000000 },
  { id: "RAB-B02", nama: "Pengadaan Buku Cerita Novel Utama", sekolah: "SDN 1 Sejahtera Utama", kategori: "BUKU", alokasi: 5000000 },
  { id: "RAB-A01", nama: "Pengadaan Laptop Chromebook Guru", sekolah: "SD NEGERI SEKARDOJA", kategori: "ALAT", alokasi: 25000000 },
  { id: "RAB-A02", nama: "Pengadaan Proyektor Kelas", sekolah: "SDN 2 Sejahtera Utama", kategori: "ALAT", alokasi: 8000000 },
  { id: "RAB-S01", nama: "Pembelian Kertas HVS A4 & ATK Sekolah", sekolah: "SD NEGERI SEKARDOJA", kategori: "SIPLAH", alokasi: 5000000 }
];

const initialTransactions = [
  { id: "B01", rab_id: "RAB-B01", nama_barang: "Buku Paket Matematika Kls IV", sekolah: "SD NEGERI SEKARDOJA", npsn: "20326648", kategori: "BUKU", jumlah: "50 pcs", total_biaya: 15000000, tanggal: "2026-02-15", status: "Disetujui" },
  { id: "B02", rab_id: "RAB-B02", nama_barang: "Buku Cerita Novel Utama", sekolah: "SDN 1 Sejahtera Utama", npsn: "20310912", kategori: "BUKU", jumlah: "30 pcs", total_biaya: 4500000, tanggal: "2026-03-10", status: "Pending" },
  { id: "B03", rab_id: "RAB-A01", nama_barang: "Laptop Chromebook Asus", sekolah: "SD NEGERI SEKARDOJA", npsn: "20326648", kategori: "ALAT", jumlah: "2 pcs", total_biaya: 16000000, tanggal: "2026-04-05", status: "Disetujui" },
  { id: "B04", rab_id: "RAB-S01", nama_barang: "Pembelian Kertas HVS A4 & ATK Sekolah", sekolah: "SD NEGERI SEKARDOJA", npsn: "20326648", kategori: "SIPLAH", jumlah: "10 Rim", total_biaya: 3500000, tanggal: "2026-02-28", status: "Disetujui" }
];

const initialTarikTunai = [
  { id: "TRK-01", sekolah: "SD NEGERI SEKARDOJA", bulan: "Januari", pagu_bulanan: 10000000, nilai: 10000000, status: "Selesai", verifikator: "Administrator Utama" }
];

// Helper: Read JSON file safely
const readJsonFile = (filePath: string, defaultValue: any) => {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return defaultValue;
};

// Helper: Write JSON file safely
const writeJsonFile = (filePath: string, data: any) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
    return false;
  }
};

// --- API Endpoints ---

// Get active API URL and system configurations
app.get('/api/config', (req, res) => {
  const config = readJsonFile(CONFIG_FILE, {
    apiUrl: process.env.VITE_API_URL || '',
    systemConfig: defaultSystemConfig
  });
  res.json({ success: true, ...config });
});

// Update active API URL and system configurations
app.post('/api/config', (req, res) => {
  const { apiUrl, systemConfig } = req.body;
  const current = readJsonFile(CONFIG_FILE, { apiUrl: '', systemConfig: defaultSystemConfig });
  
  const updated = {
    apiUrl: apiUrl !== undefined ? apiUrl : current.apiUrl,
    systemConfig: systemConfig !== undefined ? systemConfig : current.systemConfig
  };
  
  writeJsonFile(CONFIG_FILE, updated);
  res.json({ success: true, ...updated });
});

// Get general database (Simulator mode fallback database)
app.get('/api/local-db', (req, res) => {
  const defaultDb = {
    schools: initialSchools,
    operators: initialOperators,
    monthlyPagu: initialMonthlyPagu,
    rabList: initialRAB,
    transactions: initialTransactions,
    tarikTunaiList: initialTarikTunai,
    systemConfig: defaultSystemConfig
  };
  const db = readJsonFile(DATABASE_FILE, defaultDb);
  res.json({ success: true, ...db });
});

// Save general database (Simulator mode fallback database)
app.post('/api/local-db', (req, res) => {
  const { schools, operators, monthlyPagu, rabList, transactions, tarikTunaiList, systemConfig } = req.body;
  const current = readJsonFile(DATABASE_FILE, {});
  
  const updated = {
    schools: schools || current.schools || initialSchools,
    operators: operators || current.operators || initialOperators,
    monthlyPagu: monthlyPagu || current.monthlyPagu || initialMonthlyPagu,
    rabList: rabList || current.rabList || initialRAB,
    transactions: transactions || current.transactions || initialTransactions,
    tarikTunaiList: tarikTunaiList || current.tarikTunaiList || initialTarikTunai,
    systemConfig: systemConfig || current.systemConfig || defaultSystemConfig
  };
  
  writeJsonFile(DATABASE_FILE, updated);
  res.json({ success: true });
});

// Start server
async function startServer() {
  // Vite dev mode integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
