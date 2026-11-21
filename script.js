// === NAVIGASI TAB ===
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// === TAB 1: SIMULASI PERKOTAAN & TABUNG FILTER ===
const layerData = {
  inlet: {
    badge: 'KOMPONEN 1 DARI 4',
    title: 'Diffuser & Pre-Filter Mekanis',
    desc: 'Mendistribusikan aliran limbah cair UMKM secara merata sekaligus menahan padatan tersuspensi kasar seperti sisa ampas tahu, lemak, dan serat kain batik.',
    role: 'Pemisahan Padatan Kasar & Pemerataan Tekanan',
    target: 'TSS (Total Suspended Solids) & Minyak Kasar',
    eff: 'Menurunkan kekeruhan awal hingga 45%'
  },
  bioshell: {
    badge: 'KOMPONEN 2 DARI 4',
    title: 'Bio-Sorbent Cangkang Kerang/Telur (CaO)',
    desc: 'Serbuk cangkang hasil kalsinasi 400°C kaya akan Kalsium Oksida (CaO) berpori mikro yang berfungsi menetralkan pH limbah asam dan mengadsorpsi ion logam berat.',
    role: 'Netralisasi pH & Adsorpsi Ion Logam Berat',
    target: 'Logam Berat (Pb, Cr, Cu) & Keasaman Limbah',
    eff: 'Menurunkan kadar logam berat hingga 88%'
  },
  membrane: {
    badge: 'KOMPONEN 3 DARI 4',
    title: 'Membran Komposit Bio-ChitoShell',
    desc: 'Lapisan inti berbahan kitosan dan CaO dengan pori nano-mikro yang menyaring zat warna sintetis batik, senyawa organik COD/BOD, serta menghambat bakteri patogen.',
    role: 'Ultrafiltrasi Molekul Warna & Antimikroba Alami',
    target: 'Zat Warna Sintetis, BOD, COD, dan Bakteri Coliform',
    eff: 'Reduksi warna & COD mencapai 94%'
  },
  outlet: {
    badge: 'KOMPONEN 4 DARI 4',
    title: 'Polishing Karbon Aktif & Outlet Bersih',
    desc: 'Tahap pemurnian akhir untuk menghilangkan sisa bau tidak sedap sehingga air keluaran memenuhi baku mutu lingkungan dan aman untuk irigasi taman kota.',
    role: 'Penghilang Bau & Stabilisasi Kualitas Air',
    target: 'Senyawa Volatil Penyebab Bau & Kekeruhan Sisa',
    eff: 'Kejernihan air akhir mencapai 98% (Layak Buang)'
  }
};

function selectLayer(key) {
  const data = layerData[key];
  if (!data) return;

  document.getElementById('layer-badge').textContent = data.badge;
  document.getElementById('layer-title').textContent = data.title;
  document.getElementById('layer-desc').textContent = data.desc;
  document.getElementById('layer-role').textContent = data.role;
  document.getElementById('layer-target').textContent = data.target;
  document.getElementById('layer-eff').textContent = data.eff;

  document.querySelectorAll('.filter-layer').forEach(el => {
    el.classList.toggle('active-layer', el.dataset.layer === key);
  });
  document.querySelectorAll('.chip-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.layer === key);
  });
}

document.querySelectorAll('.filter-layer, .chip-btn').forEach(el => {
  el.addEventListener('click', () => selectLayer(el.dataset.layer));
});

// Kontrol Aliran Air
const btnToggleFlow = document.getElementById('btn-toggle-flow');
const btnResetFlow = document.getElementById('btn-reset-flow');
const flows = document.querySelectorAll('.water-flow');
let isFlowing = false;

btnToggleFlow.addEventListener('click', () => {
  isFlowing = !isFlowing;
  flows.forEach(f => f.classList.toggle('flowing', isFlowing));
  btnToggleFlow.textContent = isFlowing ? '⏸ Hentikan Aliran' : '▶ Mulai Aliran Limbah';
});

btnResetFlow.addEventListener('click', () => {
  isFlowing = false;
  flows.forEach(f => f.classList.remove('flowing'));
  btnToggleFlow.textContent = '▶ Mulai Aliran Limbah';
  selectLayer('inlet');
});

// === TAB 2: LAB PEMBUATAN MEMBRAN ===
const labState = {
  shellLoaded: false,
  calcined: false,
  added: { cao: false, kitosan: false, asetat: false, gliserol: false },
  stirred: false,
  casted: false
};

const labLog = document.getElementById('lab-log');
const btnBurn = document.getElementById('btn-burn');
const btnStir = document.getElementById('btn-stir');
const btnCast = document.getElementById('btn-cast');
const beakerDropzone = document.getElementById('beaker-dropzone');

function updateBeakerVisual() {
  const count = Object.values(labState.added).filter(Boolean).length;
  const liquid = document.getElementById('beaker-liquid');
  liquid.style.height = `${count * 22}%`;
  document.getElementById('beaker-label').textContent =
    count === 0 ? 'Tarik & Tuang Bahan ke Sini' : `${count}/4 Bahan Masuk`;

  if (count === 4 && !labState.stirred) {
    btnStir.disabled = false;
    labLog.innerHTML = '<strong>Siap Diaduk:</strong> Keempat bahan sudah masuk ke beaker. Klik <em>Aduk Homogen</em>!';
  }
}

function handleIngredient(ing) {
  if (ing === 'cangkang') {
    if (!labState.shellLoaded) {
      labState.shellLoaded = true;
      document.getElementById('crucible-status').textContent = 'Serbuk CaCO₃ Siap';
      btnBurn.disabled = false;
      document.getElementById('ing-cangkang').classList.add('used');
      labLog.innerHTML = '<strong>Tahap Pembakaran:</strong> Serbuk cangkang masuk cawan. Klik <em>Nyalakan Api (400°C)</em> untuk mengubah CaCO₃ menjadi CaO!';
    } else if (labState.calcined && !labState.added.cao) {
      labState.added.cao = true;
      document.getElementById('chk-cao').classList.add('done');
      labLog.innerHTML = '<strong>CaO Ditambahkan:</strong> Serbuk CaO hasil kalsinasi masuk ke gelas beaker.';
      updateBeakerVisual();
    } else {
      labLog.innerHTML = '<strong>Perhatian:</strong> Bakar dulu serbuk cangkang di Tahap A sebelum dicampur ke larutan!';
    }
    return;
  }

  if (!labState.added[ing]) {
    labState.added[ing] = true;
    document.getElementById(`chk-${ing}`).classList.add('done');
    document.getElementById(`ing-${ing}`).classList.add('used');
    labLog.innerHTML = `<strong>Bahan Masuk:</strong> ${ing.toUpperCase()} berhasil dituangkan ke gelas beaker.`;
    updateBeakerVisual();
  }
}

// Drag & Drop + Tombol Tuang
document.querySelectorAll('.ingredient-item').forEach(item => {
  item.addEventListener('dragstart', e => {
    e.dataTransfer.setData('text/plain', item.dataset.ing);
  });
});

document.querySelectorAll('.btn-pour').forEach(btn => {
  btn.addEventListener('click', () => handleIngredient(btn.dataset.ing));
});

beakerDropzone.addEventListener('dragover', e => {
  e.preventDefault();
  beakerDropzone.classList.add('drag-over');
});

beakerDropzone.addEventListener('dragleave', () => {
  beakerDropzone.classList.remove('drag-over');
});

beakerDropzone.addEventListener('drop', e => {
  e.preventDefault();
  beakerDropzone.classList.remove('drag-over');
  const ing = e.dataTransfer.getData('text/plain');
  if (ing) handleIngredient(ing);
});

// Pembakaran Bunsen
btnBurn.addEventListener('click', () => {
  if (!labState.shellLoaded || labState.calcined) return;
  btnBurn.disabled = true;
  document.getElementById('bunsen-flame').classList.add('active');
  document.getElementById('temp-display').textContent = '400°C 🔥';
  labLog.innerHTML = '<strong>Proses Kalsinasi:</strong> Memanaskan CaCO₃ pada suhu 400°C melepaskan gas CO₂...';

  setTimeout(() => {
    labState.calcined = true;
    labState.added.cao = true;
    document.getElementById('bunsen-flame').classList.remove('active');
    document.getElementById('crucible').classList.add('calcined');
    document.getElementById('crucible-status').textContent = 'CaO Aktif ✓';
    document.getElementById('chk-cao').classList.add('done');
    labLog.innerHTML = '<strong>Kalsinasi Selesai!</strong> CaO aktif otomatis ditransfer ke beaker. Lanjutkan menuang Kitosan, Asam Asetat/PVA, dan Gliserol.';
    updateBeakerVisual();
  }, 1500);
});

// Pengadukan Homogen
btnStir.addEventListener('click', () => {
  btnStir.disabled = true;
  const stirrer = document.getElementById('stirrer-bar');
  stirrer.classList.add('spinning');
  labLog.innerHTML = '<strong>Pengadukan Magnetik:</strong> Menghomogenkan matriks biopolimer kitosan dan partikel nano-CaO...';

  setTimeout(() => {
    stirrer.classList.remove('spinning');
    labState.stirred = true;
    document.getElementById('beaker-liquid').classList.add('homogen');
    document.getElementById('beaker-label').textContent = 'Larutan Dope Homogen';
    btnCast.disabled = false;
    labLog.innerHTML = '<strong>Larutan Homogen!</strong> Klik <em>Cetak & Keringkan</em> di Tahap C untuk membentuk lembaran membran.';
  }, 1500);
});

// Cetak & Pengeringan Oven
btnCast.addEventListener('click', () => {
  btnCast.disabled = true;
  document.getElementById('oven-status').textContent = 'Mengeringkan di oven 60°C...';

  setTimeout(() => {
    labState.casted = true;
    document.getElementById('membrane-sheet').classList.add('ready');
    document.getElementById('oven-status').textContent = 'Membran Bio-ChitoShell Siap Pakai! ✓';
    labLog.innerHTML = '<strong>Sintesis Berhasil!</strong> Lembaran membran Bio-ChitoShell terbentuk elastis, berpori rapat, dan siap dipasang ke dalam tabung filter.';
  }, 1200);
});

// Reset Lab
document.getElementById('btn-reset-lab').addEventListener('click', () => {
  labState.shellLoaded = false;
  labState.calcined = false;
  labState.added = { cao: false, kitosan: false, asetat: false, gliserol: false };
  labState.stirred = false;
  labState.casted = false;

  document.querySelectorAll('.ingredient-item').forEach(el => el.classList.remove('used'));
  document.querySelectorAll('.pill').forEach(el => el.classList.remove('done'));
  document.getElementById('crucible').classList.remove('calcined');
  document.getElementById('crucible-status').textContent = 'Cangkang Mentah';
  document.getElementById('temp-display').textContent = '27°C';
  document.getElementById('bunsen-flame').classList.remove('active');
  document.getElementById('beaker-liquid').style.height = '0%';
  document.getElementById('beaker-liquid').classList.remove('homogen');
  document.getElementById('beaker-label').textContent = 'Tarik & Tuang Bahan ke Sini';
  document.getElementById('membrane-sheet').classList.remove('ready');
  document.getElementById('oven-status').textContent = 'Menunggu larutan homogen...';

  btnBurn.disabled = true;
  btnStir.disabled = true;
  btnCast.disabled = true;
  labLog.innerHTML = '<strong>Panduan Lab:</strong> Mulai dengan menuangkan <em>Serbuk Cangkang</em> lalu nyalakan pembakaran untuk mengubah CaCO₃ menjadi CaO aktif!';
});
