let daftarNilai = [
  { id: 1, matkul: "BAHASA INGGRIS", sks: 2, nilai: "A", bobot: 4.0, semester: 1, lulus: true },
  { id: 2, matkul: "MATEMATIKA DISKRIT", sks: 2, nilai: "AB", bobot: 3.5, semester: 1, lulus: true },
  { id: 3, matkul: "ETIKA PENGEMBANGAN TEKNOLOGI SIBER", sks: 2, nilai: "A", bobot: 4.0, semester: 1, lulus: true },
  { id: 4, matkul: "SISTEM BASIS DATA", sks: 3, nilai: "AB", bobot: 3.5, semester: 2, lulus: true },
  { id: 5, matkul: "PEMROGRAMAN BERORIENTASI OBJEK", sks: 4, nilai: "A", bobot: 4.0, semester: 2, lulus: true },
  { id: 6, matkul: "INTERAKSI MANUSIA KOMPUTER", sks: 3, nilai: "AB", bobot: 3.5, semester: 2, lulus: true }
];

const mapBobot = {
  "A": 4.0, "AB": 3.5, "A-": 3.7, "B+": 3.3, "B": 3.0, "B-": 2.7,
  "C+": 2.3, "C": 2.0, "D": 1.0, "E": 0.0
};


function tampilkanSemuaMK() {
    console.log("\n--- DAFTAR MATA KULIAH (SEMESTER 1 & 2) ---");
    for (const mk of daftarNilai) {
        let status = mk.lulus ? "LULUS" : "TIDAK LULUS";
        let totalPoin = mk.sks * mk.bobot;
        console.log(`[Semester ${mk.semester}] ${mk.matkul} (${mk.sks} SKS) - Nilai: ${totalPoin.toFixed(2)} [Status: ${status}]`);
    }
}

function tampilkanMKLulus(semesterPilihan) {
    console.log(`\n--- Detail Mata Kuliah Lulus (Semester ${semesterPilihan}) ---`);
    let jumlah = 0;

    for (const mk of daftarNilai) {
        if (mk.semester === semesterPilihan && mk.lulus === true) {
            let totalPoin = mk.sks * mk.bobot;
            console.log(`✓ ${mk.matkul} (${mk.sks} SKS) | Nilai Poin: ${totalPoin.toFixed(2)}`);
            jumlah++;
        }
    }

    if (jumlah === 0) {
        console.log(`Tidak ada mata kuliah yang lulus pada semester ${semesterPilihan}.`);
    }
}

function hitungRataRataNilaiConsole() {
    let totalNilaiPoin = 0;
    let totalSKS = 0;

    daftarNilai.forEach((mk) => {
        totalNilaiPoin += (mk.sks * mk.bobot);
        totalSKS += mk.sks;
    });

    let rataRata = totalSKS > 0 ? totalNilaiPoin / daftarNilai.length : 0;
    console.log(`\n========================================`);
    console.log(`--- RINGKASAN AKADEMIK KESELURUHAN ---`);
    console.log(`Total Mata Kuliah : ${daftarNilai.length} Mata Kuliah`);
    console.log(`Total SKS Diambil  : ${totalSKS} SKS`);
    console.log(`Rata-rata Nilai    : ${rataRata.toFixed(2)}`);
    console.log(`========================================`);
}

console.log("=== BIODATA DIRI - RIWAYAT AKADEMIK ===");
tampilkanSemuaMK();
tampilkanMKLulus(1);
tampilkanMKLulus(2);
hitungRataRataNilaiConsole();

const tableBody = document.getElementById("nilaiTableBody");
const totalSksEl = document.getElementById("totalSKS");
const ipkValueEl = document.getElementById("ipkValue");
const searchInput = document.getElementById("searchInput");
const toggleBtn = document.getElementById("toggleSummaryBtn");
const summaryCard = document.getElementById("summaryCard");
const formNilai = document.getElementById("formNilai");

function renderTable(data) {
  tableBody.innerHTML = "";

  if (data.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">Data tidak ditemukan</td></tr>`;
    return;
  }

  data.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.matkul}</td>
      <td>${item.sks}</td>
      <td><span class="badge ${getBadgeClass(item.nilai)}">${item.nilai}</span></td>
      <td>${item.bobot.toFixed(1)}</td>
    `;
    tableBody.appendChild(row);
  });

  hitungIpkWeb();
}

function getBadgeClass(nilai) {
  if (nilai.startsWith("A")) return "bg-success";
  if (nilai.startsWith("B")) return "bg-merah";
  if (nilai.startsWith("C")) return "bg-warning text-dark";
  return "bg-danger";
}

function hitungIpkWeb() {
  let totalSks = 0;
  let totalPoin = 0;

  daftarNilai.forEach(item => {
    totalSks += item.sks;
    totalPoin += (item.sks * item.bobot);
  });

  const ipk = totalSks > 0 ? (totalPoin / totalSks).toFixed(2) : "0.00";

  totalSksEl.textContent = totalSks;
  ipkValueEl.textContent = ipk;
}

searchInput.addEventListener("input", function (e) {
  const keyword = e.target.value.toLowerCase().trim();

  const filteredData = daftarNilai.filter(item => {
    const matkulMatch = item.matkul.toLowerCase().includes(keyword);
    const nilaiMatch = item.nilai.toLowerCase().includes(keyword);
    const sksMatch = item.sks.toString().includes(keyword);

    return matkulMatch || nilaiMatch || sksMatch;
  });

  renderTable(filteredData);
});

toggleBtn.addEventListener("click", function () {
  summaryCard.classList.toggle("d-none");
});

formNilai.addEventListener("submit", function (e) {
  e.preventDefault();

  const inputMatkul = document.getElementById("inputMatkul");
  const inputSks = document.getElementById("inputSks");
  const inputNilai = document.getElementById("inputNilai");

  let isValid = true;

  [inputMatkul, inputSks, inputNilai].forEach(input => {
    input.classList.remove("is-invalid");
  });

  if (inputMatkul.value.trim() === "") {
    inputMatkul.classList.add("is-invalid");
    isValid = false;
  }

  const sksVal = parseInt(inputSks.value);
  if (isNaN(sksVal) || sksVal < 1 || sksVal > 6) {
    inputSks.classList.add("is-invalid");
    isValid = false;
  }

  if (inputNilai.value === "" || !(inputNilai.value in mapBobot)) {
    inputNilai.classList.add("is-invalid");
    isValid = false;
  }

  if (isValid) {
    const newItem = {
      id: Date.now(),
      matkul: inputMatkul.value.trim().toUpperCase(),
      sks: sksVal,
      nilai: inputNilai.value,
      bobot: mapBobot[inputNilai.value],
      semester: 3,
      lulus: true
    };

    daftarNilai.push(newItem);
    renderTable(daftarNilai);
    formNilai.reset();

    console.log("\n=== DATA BARU DITAMBAHKAN ===");
    hitungRataRataNilaiConsole();
  }
});

renderTable(daftarNilai);