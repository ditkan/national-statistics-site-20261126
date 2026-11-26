// NusaStat — perender beranda: kartu indikator utama menurut tahun yang
// dipilih, grafik penduduk dan PDB, serta lima provinsi terpadat.
'use strict';

const Home = {
  // Satu kartu indikator: label, angka besar, satuan, dan sumbernya.
  kpiCards: [
    { key: 'population', label: 'Jumlah penduduk', unit: 'juta jiwa', decimals: 2, source: 'BPS, proyeksi penduduk' },
    { key: 'gdpNominal', label: 'PDB harga berlaku', unit: 'Rp triliun', decimals: 1, source: 'BPS, Berita Resmi Statistik' },
    { key: 'gdpGrowth', label: 'Pertumbuhan ekonomi', unit: '% (y-on-y)', decimals: 2, source: 'BPS, Berita Resmi Statistik' },
    { key: 'gdpPerCapita', label: 'PDB per kapita', unit: 'Rp juta', decimals: 1, source: 'BPS' },
    { key: 'inflationDec', label: 'Inflasi Desember (y-on-y)', unit: '%', decimals: 2, source: 'BPS, IHK' },
    { key: 'unemployment', label: 'Pengangguran terbuka', unit: '% (Agustus)', decimals: 2, source: 'BPS, Sakernas' },
    { key: 'povertySep', label: 'Penduduk miskin', unit: '% (September)', decimals: 2, source: 'BPS, Susenas' },
    { key: 'hdi', label: 'Indeks Pembangunan Manusia', unit: 'skala 0–100', decimals: 2, source: 'BPS, IPM' }
  ],

  renderKpis(year) {
    const data = NUSASTAT.yearly[year];
    const grid = document.getElementById('kpi-grid');
    grid.innerHTML = '';
    this.kpiCards.forEach((card) => {
      const el = document.createElement('article');
      el.className = 'kpi';
      const value = data[card.key];
      const prev = NUSASTAT.yearly[year - 1] ? NUSASTAT.yearly[year - 1][card.key] : null;
      const delta = prev == null ? '' : (value - prev >= 0 ? '+' : '') + Site.num(value - prev, card.decimals) + ' dari ' + (year - 1);
      el.innerHTML =
        '<h3>' + card.label + '</h3>' +
        '<p class="kpi-value">' + Site.num(value, card.decimals) + ' <span>' + card.unit + '</span></p>' +
        '<p class="kpi-delta">' + delta + '</p>' +
        '<p class="source">Sumber: ' + card.source + ', ' + year + '</p>';
      grid.appendChild(el);
    });
    document.getElementById('kpi-year').textContent = year;
  },

  renderCharts() {
    const years = NUSASTAT.years.map(String);
    const pop = NUSASTAT.years.map((y) => NUSASTAT.yearly[y].population);
    ChartKit.line(document.getElementById('chart-population'), years, pop, { decimals: 1, suffix: ' jt' });
    const gdp = NUSASTAT.years.map((y) => NUSASTAT.yearly[y].gdpNominal);
    ChartKit.bars(document.getElementById('chart-gdp'), years, gdp, { decimals: 0, suffix: '' });
    const growth = NUSASTAT.years.map((y) => NUSASTAT.yearly[y].gdpGrowth);
    ChartKit.line(document.getElementById('chart-growth'), years, growth, { decimals: 2, suffix: '%' });
  },

  renderTopProvinces() {
    const body = document.querySelector('#top-provinces tbody');
    NUSASTAT.provinces.slice(0, 5).forEach((p, i) => {
      const row = document.createElement('tr');
      row.innerHTML = '<td>' + (i + 1) + '</td><td>' + p.name + '</td><td class="num">' +
        Site.num(p.population, 2) + '</td><td class="num">' + Site.num(p.share, 1) + '%</td>';
      body.appendChild(row);
    });
  },

  init() {
    this.renderKpis(2024);
    this.renderCharts();
    this.renderTopProvinces();
    Site.bindYearSelect(document.getElementById('year-select'), (year) => this.renderKpis(year));
    window.addEventListener('resize', () => this.renderCharts());
  }
};

document.addEventListener('DOMContentLoaded', () => Home.init());
