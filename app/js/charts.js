// NusaStat — penggambar grafik kanvas (tanpa pustaka luar).
// Satu-satunya yang dilakukan file ini: mengubah angka menjadi grafik garis,
// batang, dan batang horizontal yang tajam di layar retina.
'use strict';

const ChartKit = {
  teal: '#0b6b5a',
  tealLight: '#3aa08c',
  amber: '#e8a317',
  ink: '#12211e',
  muted: '#5c6f6a',
  grid: '#dfe7e4',
  red: '#c0392b',

  // Menyiapkan kanvas agar tajam di layar retina, lalu mengembalikan konteks
  // dan ukuran gambar dalam piksel CSS.
  setup(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(280, Math.round(rect.width));
    const height = Math.round(canvas.getAttribute('height') || 300);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.font = '12px system-ui, -apple-system, "Segoe UI", sans-serif';
    return { ctx, width, height };
  },

  // Format angka Indonesia: koma desimal, titik ribuan.
  fmt(value, decimals) {
    return value.toLocaleString('id-ID', {
      minimumFractionDigits: decimals == null ? 0 : decimals,
      maximumFractionDigits: decimals == null ? 2 : decimals
    });
  },

  axes(ctx, box, yMin, yMax, steps) {
    ctx.strokeStyle = this.grid;
    ctx.fillStyle = this.muted;
    ctx.lineWidth = 1;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let i = 0; i <= steps; i++) {
      const v = yMin + (yMax - yMin) * i / steps;
      const y = box.bottom - (box.height * i / steps);
      ctx.beginPath();
      ctx.moveTo(box.left, y);
      ctx.lineTo(box.right, y);
      ctx.stroke();
      ctx.fillText(this.fmt(v, v < 10 ? 1 : 0), box.left - 8, y);
    }
  },

  // Grafik garis dengan titik dan label nilai.
  line(canvas, labels, values, options) {
    const o = options || {};
    const { ctx, width, height } = this.setup(canvas);
    const box = { left: 52, right: width - 14, top: 18, bottom: height - 26 };
    box.width = box.right - box.left;
    box.height = box.bottom - box.top;
    let yMin = Math.min.apply(null, values);
    let yMax = Math.max.apply(null, values);
    const pad = (yMax - yMin) * 0.15 || 1;
    // Sumbu mulai dari nol hanya bila semua nilai tidak negatif; bila ada
    // nilai negatif (mis. pertumbuhan ekonomi 2020: -2,07%), sumbu harus
    // turun di bawah nol agar titiknya tidak terpotong.
    yMin = yMin >= 0 ? Math.max(0, yMin - pad) : yMin - pad;
    yMax += pad;
    this.axes(ctx, box, yMin, yMax, 4);
    const px = (i) => box.left + box.width * (values.length === 1 ? 0.5 : i / (values.length - 1));
    const py = (v) => box.bottom - box.height * (v - yMin) / (yMax - yMin);
    ctx.strokeStyle = o.color || this.teal;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    values.forEach((v, i) => { if (i === 0) ctx.moveTo(px(i), py(v)); else ctx.lineTo(px(i), py(v)); });
    ctx.stroke();
    ctx.fillStyle = o.color || this.teal;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    values.forEach((v, i) => {
      ctx.beginPath();
      ctx.arc(px(i), py(v), 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = this.ink;
      ctx.fillText(this.fmt(v, o.decimals == null ? 1 : o.decimals) + (o.suffix || ''), px(i), py(v) - 8);
      ctx.fillStyle = o.color || this.teal;
    });
    ctx.fillStyle = this.muted;
    ctx.textBaseline = 'top';
    labels.forEach((label, i) => ctx.fillText(String(label), px(i), box.bottom + 8));
  },

  // Grafik batang vertikal dengan label nilai di atas batang.
  bars(canvas, labels, values, options) {
    const o = options || {};
    const { ctx, width, height } = this.setup(canvas);
    const box = { left: 52, right: width - 14, top: 18, bottom: height - 26 };
    box.width = box.right - box.left;
    box.height = box.bottom - box.top;
    const yMax = Math.max.apply(null, values) * 1.12;
    this.axes(ctx, box, 0, yMax, 4);
    const slot = box.width / values.length;
    const barW = Math.min(56, slot * 0.62);
    ctx.textAlign = 'center';
    values.forEach((v, i) => {
      const x = box.left + slot * i + (slot - barW) / 2;
      const h = box.height * v / yMax;
      const y = box.bottom - h;
      ctx.fillStyle = (o.colors && o.colors[i]) || (i === values.length - 1 ? this.amber : this.teal);
      ctx.fillRect(x, y, barW, h);
      ctx.fillStyle = this.ink;
      ctx.textBaseline = 'bottom';
      ctx.fillText(this.fmt(v, o.decimals == null ? 1 : o.decimals) + (o.suffix || ''), x + barW / 2, y - 5);
      ctx.fillStyle = this.muted;
      ctx.textBaseline = 'top';
      ctx.fillText(String(labels[i]), box.left + slot * i + slot / 2, box.bottom + 8);
    });
  },

  // Grafik batang horizontal: cocok untuk peringkat provinsi dan sektor.
  hbars(canvas, labels, values, options) {
    const o = options || {};
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(280, Math.round(rect.width));
    const rowH = 26;
    const height = Math.max(120, labels.length * rowH + 34);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.font = '12px system-ui, -apple-system, "Segoe UI", sans-serif';
    const box = { left: 168, right: width - 56, top: 8, bottom: height - 8 };
    box.width = box.right - box.left;
    const max = Math.max.apply(null, values) * 1.08;
    ctx.textBaseline = 'middle';
    values.forEach((v, i) => {
      const y = box.top + i * rowH;
      const w = box.width * v / max;
      ctx.fillStyle = this.ink;
      ctx.textAlign = 'right';
      ctx.fillText(String(labels[i]), box.left - 8, y + 9);
      ctx.fillStyle = i === 0 ? this.amber : this.teal;
      ctx.fillRect(box.left, y, w, 18);
      ctx.fillStyle = this.ink;
      ctx.textAlign = 'left';
      ctx.fillText(this.fmt(v, o.decimals == null ? 1 : o.decimals) + (o.suffix || ''), box.left + w + 6, y + 9);
    });
  }
};
