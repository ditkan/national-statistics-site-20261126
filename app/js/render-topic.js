// NusaStat — perender halaman topik. Setiap halaman memuat <body
// data-topic="..."> dan kanvas/tabel yang sudah disiapkan di HTML-nya;
// file ini hanya mengisi grafik dan tabel dari data.js.
'use strict';

const Topic = {
  // Mengisi tabel provinsi di halaman Penduduk (bisa diurutkan dan dicari).
  fillProvinceTable() {
    const body = document.querySelector('#province-table tbody');
    if (!body) return;
    NUSASTAT.provinces.forEach((p, i) => {
      const row = document.createElement('tr');
      row.innerHTML = '<td>' + (i + 1) + '</td><td>' + p.name + '</td>' +
        '<td class="num" data-value="' + p.population + '">' + Site.num(p.population, 2) + '</td>' +
        '<td class="num">' + Site.num(p.share, 1) + '%</td>';
      body.appendChild(row);
    });
  },

  renderPopulation() {
    const years = NUSASTAT.years.map(String);
    const pop = NUSASTAT.years.map((y) => NUSASTAT.yearly[y].population);
    ChartKit.line(document.getElementById('chart-population'), years, pop, { decimals: 1, suffix: ' jt' });
    const ages = NUSASTAT.ageGroups;
    ChartKit.hbars(
      document.getElementById('chart-age'),
      ages.map((a) => a.group),
      ages.map((a) => a.percent),
      { decimals: 1, suffix: '%' }
    );
    this.fillProvinceTable();
  },

  renderEconomy() {
    const years = NUSASTAT.years.map(String);
    ChartKit.bars(
      document.getElementById('chart-gdp'),
      years,
      NUSASTAT.years.map((y) => NUSASTAT.yearly[y].gdpNominal),
      { decimals: 0 }
    );
    ChartKit.line(
      document.getElementById('chart-growth'),
      years,
      NUSASTAT.years.map((y) => NUSASTAT.yearly[y].gdpGrowth),
      { decimals: 2, suffix: '%' }
    );
    ChartKit.hbars(
      document.getElementById('chart-sectors'),
      NUSASTAT.gdpSectors.map((s) => s.sector),
      NUSASTAT.gdpSectors.map((s) => s.share),
      { decimals: 2, suffix: '%' }
    );
  },

  renderLabour() {
    const years = NUSASTAT.labour.years.map(String);
    ChartKit.line(document.getElementById('chart-tpt'), years, NUSASTAT.labour.tpt, { decimals: 2, suffix: '%' });
    ChartKit.bars(document.getElementById('chart-labour-force'), years, NUSASTAT.labour.labourForce, { decimals: 1, suffix: ' jt' });
    ChartKit.hbars(
      document.getElementById('chart-work-sectors'),
      NUSASTAT.workSectors.map((s) => s.sector),
      NUSASTAT.workSectors.map((s) => s.share),
      { decimals: 1, suffix: '%' }
    );
  },

  renderEducation() {
    const years = NUSASTAT.humanDevelopment.years.map(String);
    const hd = NUSASTAT.humanDevelopment;
    ChartKit.line(document.getElementById('chart-hdi'), years, hd.hdi, { decimals: 2 });
    ChartKit.line(document.getElementById('chart-schooling'), years, hd.schoolExpectancy, { decimals: 2, suffix: ' th' });
    ChartKit.bars(document.getElementById('chart-mean-schooling'), years, hd.meanSchooling, { decimals: 2, suffix: ' th' });
  },

  renderHealth() {
    const years = NUSASTAT.humanDevelopment.years.map(String);
    ChartKit.line(
      document.getElementById('chart-life'),
      years,
      NUSASTAT.humanDevelopment.lifeExpectancy,
      { decimals: 2, suffix: ' th' }
    );
    ChartKit.bars(
      document.getElementById('chart-stunting'),
      NUSASTAT.health.stuntingYears.map(String),
      NUSASTAT.health.stunting,
      { decimals: 1, suffix: '%' }
    );
    ChartKit.hbars(
      document.getElementById('chart-stunting-quintile'),
      NUSASTAT.health.stuntingByQuintile.map((q) => q.group),
      NUSASTAT.health.stuntingByQuintile.map((q) => q.value),
      { decimals: 1, suffix: '%' }
    );
  },

  renderPrices() {
    ChartKit.line(
      document.getElementById('chart-inflation-monthly'),
      NUSASTAT.inflation.months2024,
      NUSASTAT.inflation.yoy2024,
      { decimals: 2, suffix: '%' }
    );
    ChartKit.bars(
      document.getElementById('chart-inflation-annual'),
      NUSASTAT.inflation.annualDec.map((d) => String(d.year)),
      NUSASTAT.inflation.annualDec.map((d) => d.value),
      { decimals: 2, suffix: '%' }
    );
    const body = document.querySelector('#food-table tbody');
    if (body) {
      NUSASTAT.foodPrices.forEach((f) => {
        const row = document.createElement('tr');
        row.innerHTML = '<td>' + f.item + '</td><td class="num">Rp ' + Site.num(f.price) + '</td><td>per kg</td>';
        body.appendChild(row);
      });
    }
  },

  init() {
    const topic = document.body.dataset.topic;
    if (!topic) return;
    const renderers = {
      population: () => this.renderPopulation(),
      economy: () => this.renderEconomy(),
      labour: () => this.renderLabour(),
      education: () => this.renderEducation(),
      health: () => this.renderHealth(),
      prices: () => this.renderPrices()
    };
    const render = renderers[topic];
    if (render) render();
    Site.bindSearch(document.getElementById('search-box'), document.querySelector('table.sortable'));
    Site.bindProvinceFilter(document.getElementById('province-filter'), document.getElementById('province-table'));
    window.addEventListener('resize', () => { if (render) render(); });
  }
};

document.addEventListener('DOMContentLoaded', () => Topic.init());
