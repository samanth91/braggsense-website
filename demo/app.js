/**
 * 4-Blade Windmill Optical Fibre Monitor
 * – Live View charts (strain / force / moment) like blade3
 * – 4 blades × 8 fibres = 32 sensors (data from bladedata.csv + phase offsets)
 * – Twist Tests tab across all blades
 */

const FBG_LABELS = ['FBG1 150 mm', 'FBG2 350 mm', 'FBG3 600 mm', 'FBG4 820 mm'];
const FBG_COLORS = ['#ff5252', '#ffab40', '#ffee58', '#69f0ae'];
const FIBRE_COLORS = {
  C1: '#e53935', C2: '#fb8c00', C3: '#43a047', C4: '#1e88e5',
  C5: '#00acc1', C6: '#5e35b1', C7: '#d81b60', C8: '#8e24aa',
};
const BLADE_COLORS = ['#42a5f5', '#66bb6a', '#ffa726', '#ab47bc'];
const BLADE_GAINS = [1.0, 0.97, 1.06, 0.93]; // slight blade-to-blade variation
const WINDOW_POINTS = 200;
const DESIGN_LIFE_CYCLES = 150;
const NUM_BLADES = 4;
const FIBRES = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8'];

const state = {
  meta: null,
  data: [],
  samplesPerCycle: 100,
  activeBlade: 1,       // 1..4
  activeSensor: null,   // 'C1'..'C8'
  index: 0,
  playing: false,
  speed: 5,
  raf: null,
  lastTs: 0,
  acc: 0,
  strainMin: Infinity,
  strainMax: -Infinity,
  loadMin: Infinity,
  loadMax: -Infinity,
  momentMin: Infinity,
  momentMax: -Infinity,
  twistMin: Infinity,
  twistMax: -Infinity,
  predictPoints: [],
  lastPredictCycle: -1,
  forceSum: 0,
  forceCount: 0,
  momentSum: 0,
  // last twist per blade for rate
  lastTwist: [0, 0, 0, 0],
  lastTwistT: null,
  twistStation: 2,
};

// Charts
let strainChart, forceChart, momentChart, allFibreChart, predictChart;
let fingerprintChart, twistTimeChart, twistSpanChart, twistBarChart, twistRateChart;

// ─── Helpers ───────────────────────────────────────────────────────────────

function sensorMeta(id) {
  return state.meta.sensors.find((s) => s.id === id);
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function formatNum(v, digits = 1) {
  if (v == null || !Number.isFinite(v)) return '—';
  return Number(v).toFixed(digits);
}

/** Phase-offset + gain-scaled row for a given blade (1..4) at global index */
function rowForBlade(globalIndex, bladeNum) {
  const bi = bladeNum - 1;
  const offset = Math.round((bi * state.samplesPerCycle) / NUM_BLADES);
  const src = state.data[(globalIndex + offset) % state.data.length];
  const g = BLADE_GAINS[bi];
  const out = {
    t: src.t,
    cyc: src.cyc,
    ph: src.ph,
    cmd: src.cmd * g,
    load: src.load * g,
    moment: src.moment * g,
  };
  FIBRES.forEach((f) => {
    out[f] = src[f].map((v) => v * g);
  });
  return out;
}

/**
 * Twist estimate (degrees) from fibre differentials at one FBG station.
 * Uses LE/TE suction–pressure couple + shear-web differential.
 */
function twistAtStation(row, fbgIdx) {
  const c3 = row.C3[fbgIdx];
  const c4 = row.C4[fbgIdx];
  const c5 = row.C5[fbgIdx];
  const c6 = row.C6[fbgIdx];
  const c7 = row.C7[fbgIdx];
  const c8 = row.C8[fbgIdx];
  // Torsion proxy from diagonal edge strains + web shear
  const edgeCouple = ((c3 - c5) - (c4 - c6)) / 4;
  const webShear = (c7 - c8) / 2;
  // Demo calibration → degrees (order ~ ±0.5° under full load)
  return edgeCouple * 0.0022 + webShear * 0.0035;
}

function twistProfile(row) {
  return [0, 1, 2, 3].map((i) => twistAtStation(row, i));
}

function damageFromStrains(strains, loadAbs, cycle) {
  const peak = Math.max(...strains.map(Math.abs));
  return Math.max(0.05, peak / 400 * 1.2 + loadAbs / 50 * 0.4 + cycle / DESIGN_LIFE_CYCLES * 1.5);
}

function channelKey(blade, fibre) {
  return `B${blade}-${fibre}`;
}

// ─── Gauge ─────────────────────────────────────────────────────────────────

function drawCyclesGauge(left, total) {
  const canvas = document.getElementById('cyclesGauge');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  const cx = w / 2;
  const cy = h - 8;
  const r = 68;
  const frac = Math.max(0, Math.min(1, left / total));
  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI, 0);
  ctx.strokeStyle = '#e8ecf2';
  ctx.lineWidth = 12;
  ctx.lineCap = 'round';
  ctx.stroke();
  if (frac > 0) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI, Math.PI + Math.PI * frac);
    const grad = ctx.createLinearGradient(cx - r, cy, cx + r, cy);
    grad.addColorStop(0, '#e53935');
    grad.addColorStop(1, '#f5a623');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.stroke();
  }
}

// ─── Dark monitor chart factory (blade3 style) ─────────────────────────────

const DARK = {
  tick: '#8b9bb4',
  grid: 'rgba(255,255,255,0.06)',
  title: '#9fb0c9',
};

function darkLineChart(canvas, yLabel, legend = false) {
  return new Chart(canvas, {
    type: 'line',
    data: { labels: [], datasets: [] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          display: legend,
          labels: { color: DARK.tick, boxWidth: 10, font: { size: 10 } },
        },
        tooltip: {
          backgroundColor: 'rgba(10,16,28,0.95)',
          titleFont: { size: 11 },
          bodyFont: { size: 11 },
        },
      },
      scales: {
        x: {
          ticks: { maxTicksLimit: 10, color: DARK.tick, font: { size: 10 } },
          grid: { color: DARK.grid },
        },
        y: {
          ticks: { color: DARK.tick, font: { size: 10 } },
          grid: { color: DARK.grid },
          title: { display: true, text: yLabel, color: DARK.title, font: { size: 10 } },
        },
      },
    },
  });
}

function initCharts() {
  // Strain – 4 FBGs
  strainChart = darkLineChart(document.getElementById('strainChart'), 'Strain (με)');
  strainChart.data.datasets = FBG_LABELS.map((lab, i) => ({
    label: lab,
    data: [],
    borderColor: FBG_COLORS[i],
    borderWidth: 2,
    pointRadius: 0,
    tension: 0.15,
  }));

  forceChart = darkLineChart(document.getElementById('forceChart'), 'Force (N)');
  forceChart.data.datasets = [{
    label: 'Flapwise Force',
    data: [],
    borderColor: '#69f0ae',
    backgroundColor: 'rgba(105,240,174,0.08)',
    fill: true,
    borderWidth: 2,
    pointRadius: 0,
    tension: 0.2,
  }];

  momentChart = darkLineChart(document.getElementById('momentChart'), 'Moment (N·m)');
  momentChart.data.datasets = [{
    label: 'Root Bending Moment',
    data: [],
    borderColor: '#ffee58',
    backgroundColor: 'rgba(255,238,88,0.06)',
    fill: true,
    borderWidth: 2,
    pointRadius: 0,
    tension: 0.2,
  }];

  allFibreChart = new Chart(document.getElementById('allFibreChart'), {
    type: 'bar',
    data: {
      labels: FIBRES.slice(),
      datasets: [{
        label: 'Peak |strain|',
        data: FIBRES.map(() => 0),
        backgroundColor: FIBRES.map((f) => FIBRE_COLORS[f]),
        borderRadius: 4,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: {
          ticks: { color: DARK.tick, font: { size: 10 } },
          grid: { display: false },
        },
        y: {
          ticks: { color: DARK.tick, font: { size: 10 } },
          grid: { color: DARK.grid },
          title: { display: true, text: 'Peak |με|', color: DARK.title, font: { size: 10 } },
        },
      },
    },
  });

  predictChart = new Chart(document.getElementById('predictChart'), {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: 'Damage',
          data: [],
          backgroundColor: 'rgba(105,240,174,0.55)',
          pointRadius: 3,
        },
        {
          label: 'Trend',
          type: 'line',
          data: [],
          borderColor: '#69f0ae',
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.25,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          title: { display: true, text: 'Cycle', color: DARK.title, font: { size: 10 } },
          ticks: { color: DARK.tick, font: { size: 10 } },
          grid: { color: DARK.grid },
        },
        y: {
          title: { display: true, text: 'Damage Index', color: DARK.title, font: { size: 10 } },
          ticks: { color: DARK.tick, font: { size: 10 } },
          grid: { color: DARK.grid },
          min: 0,
        },
      },
    },
  });

  fingerprintChart = new Chart(document.getElementById('fingerprintChart'), {
    type: 'line',
    data: {
      labels: FBG_LABELS,
      datasets: [
        {
          label: 'Instant',
          data: [null, null, null, null],
          borderColor: '#2f6fed',
          backgroundColor: 'rgba(47,111,237,0.12)',
          fill: true,
          tension: 0.35,
          borderWidth: 2.5,
          pointRadius: 5,
          pointBackgroundColor: FBG_COLORS,
        },
        {
          label: 'Env max',
          data: [null, null, null, null],
          borderColor: 'rgba(229,57,53,0.5)',
          borderDash: [5, 4],
          borderWidth: 1.5,
          pointRadius: 0,
        },
        {
          label: 'Env min',
          data: [null, null, null, null],
          borderColor: 'rgba(67,160,71,0.5)',
          borderDash: [5, 4],
          borderWidth: 1.5,
          pointRadius: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      plugins: {
        legend: { labels: { color: '#6b7a90', boxWidth: 12, font: { size: 11 } } },
      },
      scales: {
        x: {
          title: { display: true, text: 'FBG position from root', color: '#8a97ab' },
          ticks: { color: '#8a97ab' },
          grid: { color: 'rgba(0,0,0,0.04)' },
        },
        y: {
          title: { display: true, text: 'Strain (με)', color: '#8a97ab' },
          ticks: { color: '#8a97ab' },
          grid: { color: 'rgba(0,0,0,0.06)' },
        },
      },
    },
  });

  // Twist charts
  twistTimeChart = darkLineChart(document.getElementById('twistTimeChart'), 'Twist (°)', true);
  twistTimeChart.data.datasets = BLADE_COLORS.map((c, i) => ({
    label: `Blade ${i + 1}`,
    data: [],
    borderColor: c,
    borderWidth: 2,
    pointRadius: 0,
    tension: 0.2,
  }));

  twistSpanChart = darkLineChart(document.getElementById('twistSpanChart'), 'Twist (°)', true);
  twistSpanChart.data.labels = ['150 mm', '350 mm', '600 mm', '820 mm'];
  twistSpanChart.data.datasets = BLADE_COLORS.map((c, i) => ({
    label: `Blade ${i + 1}`,
    data: [0, 0, 0, 0],
    borderColor: c,
    backgroundColor: c + '33',
    borderWidth: 2,
    pointRadius: 4,
    tension: 0.3,
  }));

  twistBarChart = new Chart(document.getElementById('twistBarChart'), {
    type: 'bar',
    data: {
      labels: ['Blade 1', 'Blade 2', 'Blade 3', 'Blade 4'],
      datasets: [{
        label: 'Twist (°)',
        data: [0, 0, 0, 0],
        backgroundColor: BLADE_COLORS,
        borderRadius: 6,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: DARK.tick }, grid: { display: false } },
        y: {
          title: { display: true, text: 'Twist (°)', color: DARK.title },
          ticks: { color: DARK.tick },
          grid: { color: DARK.grid },
        },
      },
    },
  });

  twistRateChart = darkLineChart(document.getElementById('twistRateChart'), 'dθ/dt (°/s)', true);
  twistRateChart.data.datasets = BLADE_COLORS.map((c, i) => ({
    label: `Blade ${i + 1}`,
    data: [],
    borderColor: c,
    borderWidth: 1.8,
    pointRadius: 0,
    tension: 0.15,
  }));

  // legend for FBGs
  const leg = document.getElementById('fbgLegend');
  if (leg) {
    leg.innerHTML = FBG_LABELS.map(
      (lab, i) =>
        `<span><i class="legend-dot" style="background:${FBG_COLORS[i]}"></i>${lab}</span>`
    ).join('');
  }
}

function resetChartWindows() {
  const chartsWithLabels = [strainChart, forceChart, momentChart, twistTimeChart, twistRateChart];
  chartsWithLabels.forEach((ch) => {
    if (!ch) return;
    ch.data.labels = [];
    ch.data.datasets.forEach((ds) => { ds.data = []; });
    ch.update('none');
  });

  predictChart.data.datasets[0].data = [];
  predictChart.data.datasets[1].data = [];
  predictChart.update('none');

  fingerprintChart.data.datasets.forEach((ds) => {
    ds.data = [null, null, null, null];
  });
  fingerprintChart.update('none');

  allFibreChart.data.datasets[0].data = FIBRES.map(() => 0);
  allFibreChart.update('none');

  twistSpanChart.data.datasets.forEach((ds) => { ds.data = [0, 0, 0, 0]; });
  twistSpanChart.update('none');
  twistBarChart.data.datasets[0].data = [0, 0, 0, 0];
  twistBarChart.update('none');
}

// ─── UI: blades & sensors ──────────────────────────────────────────────────

function buildRotorMini() {
  const g = document.getElementById('rotorArms');
  if (!g) return;
  g.innerHTML = '';
  for (let i = 0; i < NUM_BLADES; i++) {
    const ang = (i * 90 - 90) * (Math.PI / 180);
    const x2 = 40 + Math.cos(ang) * 30;
    const y2 = 40 + Math.sin(ang) * 30;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', '40');
    line.setAttribute('y1', '40');
    line.setAttribute('x2', String(x2));
    line.setAttribute('y2', String(y2));
    line.setAttribute('stroke', BLADE_COLORS[i]);
    line.setAttribute('stroke-width', i + 1 === state.activeBlade ? '5' : '3');
    line.setAttribute('stroke-linecap', 'round');
    line.dataset.blade = String(i + 1);
    line.style.cursor = 'pointer';
    line.addEventListener('click', () => selectBlade(i + 1));
    g.appendChild(line);
  }
}

function buildSensorList() {
  const list = document.getElementById('sensorList');
  list.innerHTML = '';
  state.meta.sensors.forEach((s) => {
    const btn = document.createElement('button');
    btn.className = 'sensor-card';
    btn.dataset.sensor = s.id;
    btn.innerHTML = `
      <span class="sensor-swatch" style="background:${s.color}"></span>
      <span>
        <div class="sensor-card-title">B${state.activeBlade}-${s.id}</div>
        <div class="sensor-card-sub">${s.name}</div>
      </span>
      <span>
        <span class="sensor-card-val" data-live="${s.id}">—</span>
        <span class="sensor-card-unit">με peak</span>
      </span>
    `;
    btn.addEventListener('click', () => selectSensor(s.id, true));
    list.appendChild(btn);
  });
  highlightSensor(state.activeSensor);
}

function selectBlade(bladeNum, rebuild = true) {
  state.activeBlade = bladeNum;
  document.querySelectorAll('.blade-pill').forEach((el) => {
    el.classList.toggle('active', Number(el.dataset.blade) === bladeNum);
  });
  setText('activeBladeLabel', `Blade ${bladeNum}`);
  setText('listBladeTitle', `Blade ${bladeNum}`);
  setText('monitorTitle', `WT-04 / BLADE ${bladeNum}`);
  buildRotorMini();
  if (rebuild) buildSensorList();
  if (window.bladeViewer?.setActiveBlade) {
    window.bladeViewer.setActiveBlade(bladeNum);
  }
  if (state.activeSensor) {
    setText('activeSensorName', `B${bladeNum}-${state.activeSensor} – ${sensorMeta(state.activeSensor)?.name || ''}`);
    setText('fpTitle', `B${bladeNum}-${state.activeSensor}`);
  }
}

function highlightSensor(id) {
  document.querySelectorAll('.sensor-card').forEach((el) => {
    el.classList.toggle('active', el.dataset.sensor === id);
  });
  if (window.bladeViewer?.setActive) {
    window.bladeViewer.setActive(id ? channelKey(state.activeBlade, id) : null);
  }
}

// ─── Simulation ────────────────────────────────────────────────────────────

function selectSensor(fibreId, autoPlay = false, bladeNum = null) {
  if (!state.data.length) return;

  if (bladeNum != null && bladeNum !== state.activeBlade) {
    selectBlade(bladeNum, true);
  }

  state.activeSensor = fibreId;
  highlightSensor(fibreId);

  const s = sensorMeta(fibreId);
  const label = `B${state.activeBlade}-${fibreId}`;
  setText('activeSensorName', `${label} – ${s?.name || fibreId}`);
  setText('fpTitle', label);
  setText('monitorTitle', `WT-04 / BLADE ${state.activeBlade} · ${fibreId}`);

  document.getElementById('btnPlay').disabled = false;
  document.getElementById('btnPause').disabled = false;
  document.getElementById('btnReset').disabled = false;

  if (autoPlay) startSimulation();
  else setText('simStatus', 'Ready – press Run Simulation');
}

function resetSimulation() {
  stopLoop();
  state.index = 0;
  state.playing = false;
  state.strainMin = Infinity;
  state.strainMax = -Infinity;
  state.loadMin = Infinity;
  state.loadMax = -Infinity;
  state.momentMin = Infinity;
  state.momentMax = -Infinity;
  state.twistMin = Infinity;
  state.twistMax = -Infinity;
  state.predictPoints = [];
  state.lastPredictCycle = -1;
  state.forceSum = 0;
  state.forceCount = 0;
  state.momentSum = 0;
  state.lastTwist = [0, 0, 0, 0];
  state.lastTwistT = null;

  resetChartWindows();
  updateLiveBadge('idle');
  setText('loggingState', 'OFF');
  ['cycleCount', 'cyclesLeft', 'peakStrain', 'appliedLoad', 'rootMoment', 'damageIndex',
    'strainMin', 'strainMax', 'loadMin', 'loadMax', 'momentMin', 'momentMax',
    'damageMin', 'damageMax', 'statForceMax', 'statForceMin', 'statForceMean',
    'statMomMax', 'statMomMin', 'statMomMean', 'liveStrainChip', 'liveForceChip',
    'liveMomentChip', 'twistMaxAbs', 'twistSpread', 'valB1', 'valB2', 'valB3', 'valB4',
  ].forEach((id) => setText(id, '—'));

  setText('simTime', '0.00 s');
  setText('monitorTime', 'Time: —');
  setText('healthScore', '—');
  setText('alarmLevel', 'GREEN');
  document.getElementById('alarmLevel').className = 'status-value green';
  drawCyclesGauge(DESIGN_LIFE_CYCLES, DESIGN_LIFE_CYCLES);
  ['barB1', 'barB2', 'barB3', 'barB4'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.style.width = '0%';
  });

  if (state.activeSensor) setText('simStatus', 'Reset – press Run Simulation');
}

function startSimulation() {
  if (!state.activeSensor || !state.data.length) return;
  if (state.index >= state.data.length - 1) {
    state.index = 0;
    state.predictPoints = [];
    state.lastPredictCycle = -1;
    resetChartWindows();
  }
  state.playing = true;
  state.lastTs = 0;
  state.acc = 0;
  updateLiveBadge('live');
  setText('loggingState', 'ON');
  setText(
    'simStatus',
    `Streaming mill-wide (32 sensors) · focus B${state.activeBlade}-${state.activeSensor}`
  );
  document.getElementById('monitorDot')?.classList.add('on');
  if (!state.raf) state.raf = requestAnimationFrame(tick);
}

function pauseSimulation() {
  state.playing = false;
  stopLoop();
  updateLiveBadge('paused');
  setText('loggingState', 'PAUSED');
  setText('simStatus', 'Paused');
  document.getElementById('monitorDot')?.classList.remove('on');
}

function stopLoop() {
  if (state.raf) {
    cancelAnimationFrame(state.raf);
    state.raf = null;
  }
}

function updateLiveBadge(mode) {
  const el = document.getElementById('liveBadge');
  el.className = 'live-badge ' + mode;
  el.textContent = mode === 'live' ? '● LIVE' : mode === 'paused' ? 'PAUSED' : 'IDLE';
}

function pushRolling(chart, label, values) {
  // values: array matching datasets length OR single number for 1 dataset
  chart.data.labels.push(label);
  if (Array.isArray(values) && values.length === chart.data.datasets.length) {
    chart.data.datasets.forEach((ds, i) => ds.data.push(values[i]));
  } else {
    chart.data.datasets[0].data.push(values);
  }
  while (chart.data.labels.length > WINDOW_POINTS) {
    chart.data.labels.shift();
    chart.data.datasets.forEach((ds) => ds.data.shift());
  }
}

function advance(steps = 1) {
  const fibre = state.activeSensor;
  if (!fibre) return;

  for (let s = 0; s < steps; s++) {
    if (state.index >= state.data.length) break;

    const activeRow = rowForBlade(state.index, state.activeBlade);
    const strains = activeRow[fibre];
    const load = activeRow.load;
    const moment = activeRow.moment;
    const cycle = activeRow.cyc;
    const t = activeRow.t;
    const twist = twistAtStation(activeRow, state.twistStation);
    const damage = damageFromStrains(strains, Math.abs(load), cycle);
    const peak = Math.max(...strains.map(Math.abs));
    const signedPeak = strains.reduce((a, b) => (Math.abs(a) > Math.abs(b) ? a : b));

    state.strainMin = Math.min(state.strainMin, ...strains);
    state.strainMax = Math.max(state.strainMax, ...strains);
    state.loadMin = Math.min(state.loadMin, load);
    state.loadMax = Math.max(state.loadMax, load);
    state.momentMin = Math.min(state.momentMin, moment);
    state.momentMax = Math.max(state.momentMax, moment);
    state.twistMin = Math.min(state.twistMin, twist);
    state.twistMax = Math.max(state.twistMax, twist);
    state.forceSum += load;
    state.momentSum += moment;
    state.forceCount += 1;

    const label = t.toFixed(1) + 's';
    pushRolling(strainChart, label, strains);
    pushRolling(forceChart, label, load);
    pushRolling(momentChart, label, moment);

    // Twist for all 4 blades
    const twists = [];
    const rates = [];
    const peaks = [];
    for (let b = 1; b <= NUM_BLADES; b++) {
      const row = rowForBlade(state.index, b);
      const tw = twistAtStation(row, state.twistStation);
      twists.push(tw);
      // peak across all 8 fibres
      let p = 0;
      FIBRES.forEach((f) => {
        p = Math.max(p, ...row[f].map(Math.abs));
      });
      peaks.push(p);

      let rate = 0;
      if (state.lastTwistT != null && t > state.lastTwistT) {
        rate = (tw - state.lastTwist[b - 1]) / (t - state.lastTwistT);
      }
      rates.push(rate);
      state.lastTwist[b - 1] = tw;
    }
    state.lastTwistT = t;

    pushRolling(twistTimeChart, label, twists);
    pushRolling(twistRateChart, label, rates);

    // span profiles
    for (let b = 1; b <= NUM_BLADES; b++) {
      const prof = twistProfile(rowForBlade(state.index, b));
      twistSpanChart.data.datasets[b - 1].data = prof;
    }
    twistBarChart.data.datasets[0].data = twists.slice();

    // all fibres bar on active blade
    allFibreChart.data.datasets[0].data = FIBRES.map((f) =>
      Math.max(...activeRow[f].map(Math.abs))
    );

    // predictive
    if (cycle !== state.lastPredictCycle) {
      state.lastPredictCycle = cycle;
      state.predictPoints.push({ x: cycle, y: Number(damage.toFixed(3)) });
      if (state.predictPoints.length > 80) state.predictPoints.shift();
    } else if (state.predictPoints.length) {
      const last = state.predictPoints[state.predictPoints.length - 1];
      if (damage > last.y) last.y = Number(damage.toFixed(3));
    }

    // fingerprint
    const envMax = fingerprintChart.data.datasets[1].data;
    const envMin = fingerprintChart.data.datasets[2].data;
    for (let i = 0; i < 4; i++) {
      envMax[i] = envMax[i] == null ? strains[i] : Math.max(envMax[i], strains[i]);
      envMin[i] = envMin[i] == null ? strains[i] : Math.min(envMin[i], strains[i]);
    }
    fingerprintChart.data.datasets[0].data = [...strains];

    // UI once per batch step end
    if (s === steps - 1 || state.index === state.data.length - 1) {
      const cyclesLeft = Math.max(0, DESIGN_LIFE_CYCLES - cycle);
      setText('cycleCount', String(cycle));
      setText('totalCycles', String(state.meta.n_cycles));
      setText('cyclesLeft', String(cyclesLeft));
      drawCyclesGauge(cyclesLeft, DESIGN_LIFE_CYCLES);

      setText('peakStrain', formatNum(signedPeak, 1));
      setText('appliedLoad', formatNum(load, 1));
      setText('rootMoment', formatNum(moment, 2));
      setText('damageIndex', formatNum(twist, 3)); // blade twist KPI
      setText('strainMin', formatNum(state.strainMin, 1));
      setText('strainMax', formatNum(state.strainMax, 1));
      setText('loadMin', formatNum(state.loadMin, 1));
      setText('loadMax', formatNum(state.loadMax, 1));
      setText('momentMin', formatNum(state.momentMin, 2));
      setText('momentMax', formatNum(state.momentMax, 2));
      setText('damageMin', formatNum(state.twistMin, 3));
      setText('damageMax', formatNum(state.twistMax, 3));
      setText('simTime', t.toFixed(2) + ' s');
      setText('monitorTime', `Time: ${t.toFixed(2)} s`);

      setText('liveStrainChip', `${formatNum(signedPeak, 1)} με`);
      setText('liveForceChip', `${formatNum(load, 1)} N`);
      setText('liveMomentChip', `${formatNum(moment, 2)} N·m`);

      setText('statForceMax', formatNum(state.loadMax, 1) + ' N');
      setText('statForceMin', formatNum(state.loadMin, 1) + ' N');
      setText('statForceMean', formatNum(state.forceSum / state.forceCount, 1) + ' N');
      setText('statMomMax', formatNum(state.momentMax, 2) + ' N·m');
      setText('statMomMin', formatNum(state.momentMin, 2) + ' N·m');
      setText('statMomMean', formatNum(state.momentSum / state.forceCount, 2) + ' N·m');

      const absTw = twists.map(Math.abs);
      setText('twistMaxAbs', formatNum(Math.max(...absTw), 3) + '°');
      setText('twistSpread', formatNum(Math.max(...twists) - Math.min(...twists), 3) + '°');

      // mill bars
      const maxP = Math.max(...peaks, 1);
      peaks.forEach((p, i) => {
        setText(`valB${i + 1}`, formatNum(p, 0));
        const bar = document.getElementById(`barB${i + 1}`);
        if (bar) bar.style.width = `${(p / maxP) * 100}%`;
      });

      const health = Math.max(5, Math.min(99, Math.round(100 - damage * 18)));
      setText('healthScore', health + '%');
      const alarmEl = document.getElementById('alarmLevel');
      if (damage > 3.5 || peak > 350) {
        setText('alarmLevel', 'RED');
        alarmEl.style.color = 'var(--red)';
      } else if (damage > 2.2 || peak > 250) {
        setText('alarmLevel', 'AMBER');
        alarmEl.style.color = 'var(--amber)';
      } else {
        setText('alarmLevel', 'GREEN');
        alarmEl.style.color = '';
        alarmEl.className = 'status-value green';
      }

      document.querySelectorAll('[data-live]').forEach((el) => {
        if (el.dataset.live === fibre) el.textContent = formatNum(signedPeak, 1);
      });
    }

    state.index += 1;
  }

  // batch chart updates
  strainChart.update('none');
  forceChart.update('none');
  momentChart.update('none');
  allFibreChart.update('none');
  twistTimeChart.update('none');
  twistSpanChart.update('none');
  twistBarChart.update('none');
  twistRateChart.update('none');
  fingerprintChart.update('none');

  predictChart.data.datasets[0].data = state.predictPoints.slice();
  const trend = [];
  const pts = state.predictPoints;
  for (let i = 0; i < pts.length; i++) {
    const slice = pts.slice(Math.max(0, i - 4), i + 1);
    trend.push({ x: pts[i].x, y: slice.reduce((a, p) => a + p.y, 0) / slice.length });
  }
  predictChart.data.datasets[1].data = trend;
  predictChart.update('none');

  if (state.index >= state.data.length) {
    state.playing = false;
    stopLoop();
    updateLiveBadge('idle');
    setText('loggingState', 'DONE');
    setText('simStatus', 'Simulation complete – full dataset played');
    document.getElementById('monitorDot')?.classList.remove('on');
  }
}

function tick(ts) {
  if (!state.playing) {
    state.raf = null;
    return;
  }
  if (!state.lastTs) state.lastTs = ts;
  const dt = ts - state.lastTs;
  state.lastTs = ts;
  const pps = 1 / (state.meta.sample_interval_s || 0.05);
  state.acc += (dt * pps * state.speed) / 1000;
  const steps = Math.floor(state.acc);
  if (steps > 0) {
    state.acc -= steps;
    advance(Math.min(steps, 40));
  }
  if (state.playing) state.raf = requestAnimationFrame(tick);
  else state.raf = null;
}

// ─── Export ────────────────────────────────────────────────────────────────

function exportWindowCSV() {
  if (!state.activeSensor || !strainChart) return;
  const sid = `B${state.activeBlade}-${state.activeSensor}`;
  const labels = strainChart.data.labels;
  const lines = [
    'time,FBG1_150,FBG2_350,FBG3_600,FBG4_820,force_N,moment_Nm',
  ];
  for (let i = 0; i < labels.length; i++) {
    const f = strainChart.data.datasets.map((d) => d.data[i]);
    lines.push([
      labels[i],
      ...f,
      forceChart.data.datasets[0].data[i],
      momentChart.data.datasets[0].data[i],
    ].join(','));
  }
  const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${sid}_live_window.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

// ─── Tabs ──────────────────────────────────────────────────────────────────

function initTabs() {
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const name = tab.dataset.tab;
      document.getElementById('tab-live').classList.toggle('hidden', name !== 'live');
      document.getElementById('tab-fingerprint').classList.toggle('hidden', name !== 'fingerprint');
      document.getElementById('tab-twist').classList.toggle('hidden', name !== 'twist');
    });
  });
}

function startClock() {
  const el = document.getElementById('clock');
  const tickClock = () => { el.textContent = new Date().toLocaleTimeString(); };
  tickClock();
  setInterval(tickClock, 1000);
}

function estimateSamplesPerCycle(data) {
  if (!data.length) return 100;
  const c0 = data[0].cyc;
  let n = 0;
  for (const r of data) {
    if (r.cyc !== c0) break;
    n++;
  }
  return n || 100;
}

// ─── Boot ──────────────────────────────────────────────────────────────────

async function boot() {
  startClock();
  initTabs();
  initCharts();
  drawCyclesGauge(DESIGN_LIFE_CYCLES, DESIGN_LIFE_CYCLES);
  buildRotorMini();

  document.getElementById('btnPlay').addEventListener('click', startSimulation);
  document.getElementById('btnPause').addEventListener('click', pauseSimulation);
  document.getElementById('btnReset').addEventListener('click', resetSimulation);
  document.getElementById('btnExport').addEventListener('click', exportWindowCSV);
  document.getElementById('speedSelect').addEventListener('change', (e) => {
    state.speed = Number(e.target.value) || 1;
  });
  state.speed = Number(document.getElementById('speedSelect').value) || 5;

  document.querySelectorAll('.blade-pill').forEach((btn) => {
    btn.addEventListener('click', () => selectBlade(Number(btn.dataset.blade)));
  });

  document.getElementById('twistStation').addEventListener('change', (e) => {
    state.twistStation = Number(e.target.value);
  });

  // From 3D viewer: id like "B2-C1" or legacy "C1"
  window.onSensorPicked = (id) => {
    if (!id) return;
    if (id.includes('-')) {
      const [b, c] = id.split('-');
      const blade = Number(b.replace('B', ''));
      selectSensor(c, true, blade);
    } else {
      selectSensor(id, true);
    }
  };

  window.onBladePicked = (bladeNum) => selectBlade(bladeNum);

  try {
    const res = await fetch('blade-data.json');
    if (!res.ok) throw new Error('Failed to load blade-data.json');
    const json = await res.json();
    state.meta = json.meta;
    state.data = json.data;
    state.samplesPerCycle = estimateSamplesPerCycle(state.data);
    setText('totalCycles', String(state.meta.n_cycles));
    selectBlade(1, true);
    document.getElementById('loading').classList.add('hide');
    setTimeout(() => document.getElementById('loading')?.remove(), 400);
  } catch (err) {
    console.error(err);
    document.querySelector('.loading-card').innerHTML = `
      <p style="color:var(--red)">Could not load data</p>
      <small>${err.message}<br/>Serve this folder over HTTP</small>
    `;
  }
}

boot();
