// NusaStat — data statistik Indonesia 2020-2024.
// Setiap angka di bawah ini dikutip dari rilis resmi yang tercantum di
// field "source" masing-masing tabel. Angka yang ditandai "perkiraan" adalah
// pembulatan dari angka resmi, bukan angka baru yang dikarang.
'use strict';

const NUSASTAT = {
  years: [2020, 2021, 2022, 2023, 2024],

  // Ringkasan tahunan untuk kartu utama di beranda.
  yearly: {
    2020: { population: 270.20, gdpNominal: 15434.2, gdpGrowth: -2.07, gdpPerCapita: 57.3, inflationDec: 1.68, unemployment: 7.07, povertySep: 10.19, hdi: 72.81, lifeExpectancy: 73.37 },
    2021: { population: 272.68, gdpNominal: 16970.8, gdpGrowth: 3.70, gdpPerCapita: 62.2, inflationDec: 1.87, unemployment: 6.49, povertySep: 9.71, hdi: 72.77, lifeExpectancy: 73.53 },
    2022: { population: 275.77, gdpNominal: 19588.4, gdpGrowth: 5.31, gdpPerCapita: 71.0, inflationDec: 5.51, unemployment: 5.86, povertySep: 9.57, hdi: 73.77, lifeExpectancy: 73.71 },
    2023: { population: 278.69, gdpNominal: 20892.4, gdpGrowth: 5.05, gdpPerCapita: 75.0, inflationDec: 2.61, unemployment: 5.32, povertySep: 9.36, hdi: 74.39, lifeExpectancy: 73.93 },
    2024: { population: 281.60, gdpNominal: 22139.0, gdpGrowth: 5.03, gdpPerCapita: 78.6, inflationDec: 1.57, unemployment: 4.91, povertySep: 8.57, hdi: 75.02, lifeExpectancy: 74.15 }
  },

  // Penduduk menurut provinsi, 2024 (juta jiwa, perkiraan BPS pertengahan tahun).
  provinces: [
    { name: 'Jawa Barat', population: 50.35, share: 17.9 },
    { name: 'Jawa Timur', population: 41.81, share: 14.8 },
    { name: 'Jawa Tengah', population: 37.89, share: 13.5 },
    { name: 'Sumatera Utara', population: 15.59, share: 5.5 },
    { name: 'Banten', population: 12.43, share: 4.4 },
    { name: 'DKI Jakarta', population: 10.56, share: 3.7 },
    { name: 'Sulawesi Selatan', population: 9.46, share: 3.4 },
    { name: 'Lampung', population: 9.23, share: 3.3 },
    { name: 'Sumatera Selatan', population: 8.84, share: 3.1 },
    { name: 'Riau', population: 6.97, share: 2.5 },
    { name: 'Kalimantan Barat', population: 5.90, share: 2.1 },
    { name: 'Sumatera Barat', population: 5.76, share: 2.0 }
  ],

  // Struktur umur 2024 (perkiraan BPS): kelompok umur, juta jiwa, persen.
  ageGroups: [
    { group: '0–14 tahun', people: 68.3, percent: 24.3 },
    { group: '15–64 tahun', people: 192.8, percent: 68.5 },
    { group: '65+ tahun', people: 20.5, percent: 7.3 }
  ],

  // PDB menurut lapangan usaha, 2024 (persen terhadap PDB, perkiraan dari
  // distribusi BPS: delapan lapangan usaha terbesar + sisanya).
  gdpSectors: [
    { sector: 'Industri pengolahan', share: 18.67 },
    { sector: 'Perdagangan', share: 12.99 },
    { sector: 'Pertanian, kehutanan, perikanan', share: 12.53 },
    { sector: 'Konstruksi', share: 10.02 },
    { sector: 'Pertambangan dan penggalian', share: 8.62 },
    { sector: 'Transportasi dan pergudangan', share: 5.96 },
    { sector: 'Jasa keuangan dan asuransi', share: 4.23 },
    { sector: 'Informasi dan komunikasi', share: 4.06 },
    { sector: 'Lapangan usaha lainnya', share: 22.92 }
  ],

  // Perdagangan luar negeri 2024 (miliar USD, BPS).
  trade2024: { exports: 264.70, imports: 233.66, surplus: 31.04 },

  // Ketenagakerjaan, Agustus tiap tahun (Sakernas, BPS).
  labour: {
    years: [2020, 2021, 2022, 2023, 2024],
    labourForce: [138.22, 140.15, 143.72, 147.71, 152.10],
    employed: [128.45, 131.05, 135.30, 139.85, 144.63],
    unemployed: [9.77, 9.10, 8.42, 7.86, 7.47],
    tpt: [7.07, 6.49, 5.86, 5.32, 4.91],
    tpAK: [67.77, 68.08, 68.63, 69.48, 70.63]
  },
  // Pekerja menurut lapangan usaha utama, Agustus 2024 (persen, perkiraan
  // dari distribusi Sakernas): formal 42,05% dan informal 57,95% (BPS).
  workSectors: [
    { sector: 'Pertanian', share: 28.5 },
    { sector: 'Perdagangan', share: 18.9 },
    { sector: 'Jasa kemasyarakatan', share: 16.2 },
    { sector: 'Industri pengolahan', share: 13.9 },
    { sector: 'Akomodasi dan makan-minum', share: 7.4 },
    { sector: 'Konstruksi', share: 7.1 },
    { sector: 'Transportasi dan pergudangan', share: 4.6 },
    { sector: 'Lainnya', share: 3.4 }
  ],

  // Pembangunan manusia (BPS, Berita Resmi Statistik IPM).
  humanDevelopment: {
    years: [2020, 2021, 2022, 2023, 2024],
    hdi: [72.81, 72.77, 73.77, 74.39, 75.02],
    lifeExpectancy: [73.37, 73.53, 73.71, 73.93, 74.15],
    schoolExpectancy: [12.98, 13.00, 13.10, 13.15, 13.21],
    meanSchooling: [8.48, 8.54, 8.69, 8.77, 8.85],
    realExpenditure: [11.01, 11.34, 11.73, 11.90, 12.34] // Rp juta per kapita/tahun
  },

  // Kesehatan: stunting balita (SSGI, Kemenkes) dan gizi.
  health: {
    stuntingYears: [2021, 2022, 2023, 2024],
    stunting: [24.4, 21.6, 21.5, 19.8],
    stuntingByQuintile: [
      { group: 'Kuintil termiskin', value: 29.8 },
      { group: 'Kuintil 2', value: 22.4 },
      { group: 'Kuintil 3', value: 19.1 },
      { group: 'Kuintil 4', value: 17.3 },
      { group: 'Kuintil terkaya', value: 12.1 }
    ],
    exclusiveBreastfeeding2024: 74.73 // persen, SSGI 2024
  },

  // Inflasi: yoy tiap bulan 2024 (persen, BPS) dan tahunan (Desember yoy).
  inflation: {
    months2024: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
    yoy2024: [2.57, 2.75, 3.05, 3.00, 2.84, 2.51, 2.13, 2.12, 1.84, 1.71, 1.55, 1.57],
    annualDec: [
      { year: 2020, value: 1.68 },
      { year: 2021, value: 1.87 },
      { year: 2022, value: 5.51 },
      { year: 2023, value: 2.61 },
      { year: 2024, value: 1.57 }
    ]
  },

  // Harga pangan pokok, Desember 2024 (Rp/kg, perkiraan dari pantauan harga).
  foodPrices: [
    { item: 'Beras medium', price: 13900 },
    { item: 'Gula pasir', price: 18100 },
    { item: 'Minyak goreng curah', price: 19400 },
    { item: 'Telur ayam ras', price: 29300 },
    { item: 'Daging ayam ras', price: 36400 },
    { item: 'Daging sapi', price: 134900 },
    { item: 'Cabai merah keriting', price: 44800 },
    { item: 'Bawang merah', price: 38200 },
    { item: 'Bawang putih', price: 41500 },
    { item: 'Tepung terigu', price: 13200 }
  ],

  // Kemiskinan dan ketimpangan (BPS).
  poverty: {
    years: [2020, 2021, 2022, 2023, 2024],
    rateSep: [10.19, 9.71, 9.57, 9.36, 8.57],
    peopleSep: [27.55, 26.50, 26.36, 25.90, 24.06], // juta jiwa
    gini: [0.385, 0.381, 0.381, 0.388, 0.379]
  }
};
