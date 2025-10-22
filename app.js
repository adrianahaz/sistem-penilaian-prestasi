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

function muAktif(a) {
  return {
    rendah: a <= 40 ? 1 : a < 60 ? (60 - a) / 20 : 0,
    sedang: a <= 40 || a >= 80 ? 0 : a < 60 ? (a - 40) / 20 : (80 - a) / 20,
    tinggi: a <= 60 ? 0 : a < 80 ? (a - 60) / 20 : 1,
  };
}

// ==== Bagian 2: Fuzzy Rules ====
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

// ==== Bagian 3: Fuzzy Inference ====
function hitungFuzzy(ipk, aktif) {
  const µipk = muIPK(ipk);
  const µaktif = muAktif(aktif);

  let α = { rendah: 0, sedang: 0, tinggi: 0 };

  for (const rule of rules) {
    const fire = Math.min(µipk[rule.ipk], µaktif[rule.aktif]);
    α[rule.hasil] = Math.max(α[rule.hasil], fire);
  }

  // ==== Bagian 4: Defuzzifikasi (Weighted Average) ====
  const z = { rendah: 30, sedang: 60, tinggi: 90 };
  const numerator = α.rendah * z.rendah + α.sedang * z.sedang + α.tinggi * z.tinggi;
  const denominator = α.rendah + α.sedang + α.tinggi;
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
