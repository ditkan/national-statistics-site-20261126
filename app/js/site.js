// NusaStat — perilaku bersama semua halaman: navigasi aktif, pemilih tahun,
// pengurutan tabel, dan kotak pencarian. File ini tidak menggambar grafik
// dan tidak memegang data; itu tugas charts.js dan data.js.
'use strict';

const Site = {
  // Menandai tautan navigasi halaman yang sedang dibuka.
  markActiveNav() {
    const here = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach((a) => {
      const target = a.getAttribute('href').split('/').pop();
      if (target === here) a.setAttribute('aria-current', 'page');
    });
  },

  // Mengisi <select class="year-select"> dengan tahun 2020-2024 dan
  // memanggil onChange(tahun) setiap kali pengguna mengganti tahun.
  bindYearSelect(select, onChange) {
    if (!select) return;
    NUSASTAT.years.forEach((year) => {
      const opt = document.createElement('option');
      opt.value = year;
      opt.textContent = year;
      select.appendChild(opt);
    });
    select.value = '2024';
    select.addEventListener('change', () => onChange(Number(select.value)));
  },

  // Membuat setiap kolom <th data-sort> pada tabel bisa di-klik untuk
  // mengurutkan baris, naik lalu turun. Kolom angka diurutkan sebagai angka.
  makeSortable(table) {
    if (!table) return;
    const head = table.querySelector('thead tr');
    const body = table.querySelector('tbody');
    if (!head || !body) return;
    head.querySelectorAll('th').forEach((th, col) => {
      th.setAttribute('tabindex', '0');
      th.setAttribute('title', 'Klik untuk mengurutkan');
      const sort = () => {
        const rows = Array.from(body.querySelectorAll('tr'));
        const asc = th.dataset.dir !== 'asc';
        const numeric = th.dataset.numeric === 'true';
        rows.sort((a, b) => {
          const av = a.cells[col].textContent.trim();
          const bv = b.cells[col].textContent.trim();
          let cmp;
          if (numeric) {
            const na = parseFloat(av.replace(/\./g, '').replace(',', '.')) || 0;
            const nb = parseFloat(bv.replace(/\./g, '').replace(',', '.')) || 0;
            cmp = na - nb;
          } else {
            cmp = av.localeCompare(bv, 'id');
          }
          return asc ? cmp : -cmp;
        });
        rows.forEach((row) => body.appendChild(row));
        head.querySelectorAll('th').forEach((h) => delete h.dataset.dir);
        th.dataset.dir = asc ? 'asc' : 'desc';
        th.textContent = th.textContent.replace(/ [▲▼]$/, '') + (asc ? ' ▲' : ' ▼');
      };
      th.addEventListener('click', sort);
      th.addEventListener('keydown', (e) => { if (e.key === 'Enter') sort(); });
    });
  },

  // Menghubungkan kotak pencarian ke sebuah tabel: mengetik menyembunyikan
  // baris yang tidak mengandung kata kunci, dan menampilkan pesan kosong.
  bindSearch(input, table) {
    if (!input || !table) return;
    const empty = table.parentElement.querySelector('.empty-note');
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      let visible = 0;
      table.querySelectorAll('tbody tr').forEach((row) => {
        const hit = row.textContent.toLowerCase().includes(q);
        row.style.display = hit ? '' : 'none';
        if (hit) visible++;
      });
      if (empty) empty.style.display = visible === 0 ? '' : 'none';
      const count = table.parentElement.querySelector('.row-count');
      if (count) count.textContent = visible + ' baris ditampilkan';
    });
  },

  // Menyaring tabel provinsi berdasarkan pilihan <select> provinsi.
  bindProvinceFilter(select, table) {
    if (!select || !table) return;
    NUSASTAT.provinces.forEach((p) => {
      const opt = document.createElement('option');
      opt.value = p.name;
      opt.textContent = p.name;
      select.appendChild(opt);
    });
    select.addEventListener('change', () => {
      const want = select.value;
      let visible = 0;
      table.querySelectorAll('tbody tr').forEach((row) => {
        const hit = want === '' || row.cells[1].textContent.trim() === want;
        row.style.display = hit ? '' : 'none';
        if (hit) visible++;
      });
      const count = table.parentElement.querySelector('.row-count');
      if (count) count.textContent = visible + ' baris ditampilkan';
    });
  },

  // Format angka Indonesia: 281,60 memakai koma sebagai pemisah desimal.
  num(value, decimals) {
    return value.toLocaleString('id-ID', {
      minimumFractionDigits: decimals == null ? 0 : decimals,
      maximumFractionDigits: decimals == null ? 2 : decimals
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Site.markActiveNav();
  document.querySelectorAll('table.sortable').forEach((t) => Site.makeSortable(t));
});
