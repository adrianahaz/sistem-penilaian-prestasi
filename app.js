/**
 * Bagian 1: Membership function
 *
 * Menghitung derajat keanggotaan (membership degree) untuk variabel IPK
 * dalam tiga himpunan fuzzy: rendah, sedang, dan tinggi
 *
 * Fungsi ini menggunakan fungsi keanggotaan segitiga (triangular membership)
 * untuk menentukan sejauh mana suatu nilai IPK termasuk ke dalam masing-masing kategori
 *
 * Logika:
 * - IPK rendah bernilai 1 jika IPK <= 2, menurun linear ke 0 pada IPK = 2.75.
 * - IPK sedang bernilai 0 di bawah 2 atau di atas 3.5, naik linear antara 2-2.75 dan turun linear antara 2.75-3.5.
 * - IPK tinggi bernilai 0 jika IPK <= 3, naik linear ke 1 pada IPK = 3.5 dan tetap 1 jika di atasnya.
 *
 * @param {number} ipk - Nilai IPK mahasiswa (antara 0.0 sampai 4.0)
 * @returns {{ rendah: number, sedang: number, tinggi: number }}
 *
 * @example
 * // Contoh pengunaan:
 * const hasil = muIPK(3.2);
 * console.log(hasil);
 * // Output: { rendah: 0, sedang: 0.4, tinggi: 0.4 }
 */
function muIPK(ipk) {
  return {
    rendah: ipk <= 2 ? 1 : ipk < 2.75 ? (2.75 - ipk) / 0.75 : 0,
    sedang: ipk <= 2 || ipk >= 3.5 ? 0 : ipk < 2.75 ? (ipk - 2) / 0.75 : (3.5 - ipk) / 0.75,
    tinggi: ipk <= 3 ? 0 : ipk < 3.5 ? (ipk - 3) / 0.5 : 1,
  };
}

/**
 * Bagian 1: Membership function
 *
 * Menghitung derajat keanggotaan (membership degree) untuk variabel aktif
 * dalam tiga himpunan fuzzy: rendah, sedang, dan tinggi
 *
 * Fungsi ini menggunakan fungsi keanggotaan segitiga (triangular membership)
 * untuk menentukan sejauh mana suatu nilai keaktifan termasuk ke dalam masing-masing kategori
 *
 * Logika:
 * - Aktif rendah bernilai 1 jika a <= 40, menurun linear ke 0 pada aktif = 60.
 * - Aktif sedang bernilai 0 di bawah 40 atau di atas 80, naik linear antara 40-60 dan turun linear antara 60-80.
 * - Aktif tinggi bernilai 0 jika aktif <= 60, naik linear ke 1 pada aktif = 80 dan tetap 1 jika di atasnya.
 *
 * @param {number} a - Nilai keaktifan mahasiswa (antara 0 sampai 100)
 * @returns {{ rendah: number, sedang: number, tinggi: number }}
 *
 * @example
 * // Contoh pengunaan:
 * const hasil = muAktif(80);
 * console.log(hasil);
 * // Output: { rendah: 0, sedang: 0, tinggi: 1 }
 */
function muAktif(a) {
  return {
    rendah: a <= 40 ? 1 : a < 60 ? (60 - a) / 20 : 0,
    sedang: a <= 40 || a >= 80 ? 0 : a < 60 ? (a - 40) / 20 : (80 - a) / 20,
    tinggi: a <= 60 ? 0 : a < 80 ? (a - 60) / 20 : 1,
  };
}

// Bagian 2: Fuzzy Rules
const rules = [
  { ipk: 'tinggi', aktif: 'tinggi', hasil: 'tinggi' },
  { ipk: 'tinggi', aktif: 'sedang', hasil: 'tinggi' },
  { ipk: 'tinggi', aktif: 'rendah', hasil: 'sedang' },
  { ipk: 'sedang', aktif: 'tinggi', hasil: 'tinggi' },
  { ipk: 'sedang', aktif: 'sedang', hasil: 'sedang' },
  { ipk: 'sedang', aktif: 'rendah', hasil: 'rendah' },
  { ipk: 'rendah', aktif: 'tinggi', hasil: 'sedang' },
  { ipk: 'rendah', aktif: 'sedang', hasil: 'rendah' },
  { ipk: 'rendah', aktif: 'rendah', hasil: 'rendah' },
];

/**
 * Bagian 3: Fuzzy Inference
 *
 * Melakukan perhitungan sistem logika fuzzy untuk menentukan tingkat prestasi
 * berdasarkan dua variabel input IPK dan keaktifan.
 *
 * Fungsi ini melakukan seluruh tahapan sistem inferensi fuzzy, mulai dari fuzzyfikasi,
 * penerapan aturan (inference engine), hingga defuzzifikasi (menghasilkan nilai crisp).
 *
 * Prosesnya meliputi:
 * 1. Fuzzifikasi: Menghitung derajaat keanggotaan dari IPK dan keaktifan menggunakan fungsi keanggotaan masing-masing.
 * 2. Inferensi (Rule Evaluation): Menerapkan setiap aturan fuzzy yang ada di variabel 'rules' menggunakan operator MIN untuk menentukan nilai firing strength dari tiap aturan.
 * 3. Agregasi: Mengambil nilai MAX dari hasil aturan untuk setiap kategori hasil (rendah, sedang, tinggi).
 * 4. Defuzzifikasi: Menghitung nilai akhir (crisp value) menggunakan metode Weighted Average (centroid).
 *
 * @param {number} ipk - Nilai IPK mahasiswa (0.0-4.0).
 * @param {number} aktif - Nilai tingkat keaktifan mahasiswa (0-100 atau skala serupa).
 * @returns {{ hasil: string, kategori: string }}
 * Objek hasil perhitungan fuzzy yang berisi:
 * - `hasil`: nilai hasil defuzzifikasi (crisp value) dalam bentuk string dengan 2 desimal.
 * - `kategori`: hasil kategorisasi akhir berdasarkan nilai defuzzfikasi (`Rendah`, `Sedang`, atau `Tinggi`).
 *
 * @example
 * // Contoh penggunaan:
 * const result = hitungFuzzy(3.2,72);
 * console.log(result);
 * // Output: { hasil: "65", kategori: "Sedang" }
 *
 * @description
 * Nilai-nilai pada variabel `z` (rendah: 30, sedang: 60, tinggi: 90)
 * mewakili titik pusat (centroid) dari masing-masing himpunan fuzzy hasil.
 * Semakin tinggi nilai defuzzifikasi, semakin tinggi tingkat prestasi mahasiswa.
 */
function hitungFuzzy(ipk, aktif) {
  const keanggotaanIPK = muIPK(ipk);
  const keanggotaanAktif = muAktif(aktif);

  let a = { rendah: 0, sedang: 0, tinggi: 0 };

  // ===== Tahap 1–3: Fuzzifikasi dan Inferensi =====
  for (const rule of rules) {
    const fire = Math.min(keanggotaanIPK[rule.ipk], keanggotaanAktif[rule.aktif]);
    a[rule.hasil] = Math.max(a[rule.hasil], fire);
  }
  // ===== Tahap 4: Defuzzifikasi (Weighted Average) =====
  const z = { rendah: 20, sedang: 50, tinggi: 80 };
  const numerator = a.rendah * z.rendah + a.sedang * z.sedang + a.tinggi * z.tinggi;
  const denominator = a.rendah + a.sedang + a.tinggi;
  const hasil = numerator / denominator;

  let kategori = hasil < 60 ? 'Rendah' : hasil < 80 ? 'Sedang' : 'Tinggi';

  return { hasil: hasil.toFixed(2), kategori };
}

// ==== Bagian 5: Tampilkan hasil ====
document.getElementById('formMahasiswa').addEventListener('submit', function (e) {
  e.preventDefault();

  const nama = document.getElementById('nama').value;
  const nim = document.getElementById('nim').value;
  const ipk = parseFloat(document.getElementById('ipk').value);
  const aktif = parseFloat(document.getElementById('aktif').value);
  console.log(nama, nim, ipk, aktif);

  if (!nama || !nim || isNaN(ipk) || isNaN(aktif)) {
    alert('Mohon isi semua data dengan benar!');
    return;
  }

  const hasil = hitungFuzzy(ipk, aktif);
  const table = document.querySelector('#hasilTable tbody');

  const row = `
      <tr>
        <td>${nama}</td>
        <td>${nim}</td>
        <td>${ipk}</td>
        <td>${aktif}</td>
        <td>${hasil.hasil}</td>
        <td>${hasil.kategori}</td>
      </tr>
    `;
  table.insertAdjacentHTML('beforeend', row);
});
