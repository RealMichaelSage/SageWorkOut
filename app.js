const PROGRAM = {
  months: {
    "Апрель": { pu: [10, 10, 10, 10, 10], sq: [10, 10, 10], pl: [30, 30, 30] },
    "Май": { pu: [10, 10, 10, 10, 10, 10], sq: [10, 10, 10, 10], pl: [40, 40, 40] },
    "Июнь": { pu: [15, 15, 15, 15, 15], sq: [15, 15, 15, 15, 15], pl: [50, 50, 50] },
    "Июль": { pu: [15, 15, 15, 15, 15, 15], sq: [20, 20, 20, 20, 20, 20], pl: [45, 45, 45, 45] },
    "Август": { pu: [20, 20, 20, 20, 20], sq: [30, 30, 30, 30, 30], pl: [60, 60, 60] },
    "Сентябрь": { pu: [25, 25, 25, 25], sq: [30, 30, 30, 30, 30, 30], pl: [60, 60, 60, 60] },
    "Октябрь": { pu: [35, 35, 35], sq: [40, 40, 40, 40, 40], pl: [90, 90, 90] },
    "Ноябрь": { pu: [50, 50], sq: [50, 50, 50, 50], pl: [100, 100, 100] },
    "Декабрь": { pu: [100], sq: [50, 50, 50, 50], pl: [120, 120, 120] }
  }
};

const MONTH_NAMES = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

let currentView = "today";
let calendarDate = new Date();

const EXERCISE_HELP = {
  "Круговые движения": {
    title: "Круговые движения",
    body: "Общая разминка суставов. Делайте плавно, без резких движений. Шея, плечи, махи руками, махи от локтей, кисти рук, бёдра, ноги, ступни."
  },
  "«Кошка-корова»": {
    title: "Кошка-Корова",
    body: "<ul><li><strong>Выполнение:</strong> 12 раз. Акцент на выгибание вверх. Прогиб вниз минимальный (защита L5-S1).</li></ul>"
  },
  "«Птица-собака» (Bird-Dog)": {
    title: "Птица-Собака (Bird-Dog)",
    body: "<ul><li><strong>Выполнение:</strong> 2х10 раз. Стабилизация поясницы. Не задирать ногу выше параллели с полом.</li></ul>"
  },
  "Велосипед лежа на спине": {
    title: "Велосипед лежа на спине",
    body: "<strong>ВАЖНО:</strong> Поясница строго прижата к полу! Если поясница отрывается — уменьши амплитуду."
  },
  "Отжимания": {
    title: "Отжимания (Техника «Замок»)",
    body: "<ul><li>Локти под 45° к телу. Напрячь ягодицы и пресс (фиксация поясницы).</li><li><strong>ВАЖНО:</strong> Если локоть покалывает — не разгибай до щелчка.</li></ul>"
  },
  "Приседания": {
    title: "Приседания (Техника «Стул»)",
    body: "<ul><li>Вес на пятках. Глубина — до параллели бедер с полом.</li><li><strong>ВАЖНО:</strong> Чувствуешь округление поясницы — приседай выше.</li></ul>"
  },
  "Планка": {
    title: "Планка",
    body: "Держи тело ровно. Пресс максимально напряжен. Поясница не должна провисать."
  },
  "Растяжка руки": {
    title: "Растяжка руки",
    body: "Декомпрессия локтевого нерва. Плавное натяжение без боли."
  },
  "Растяжка ноги": {
    title: "Растяжка ноги",
    body: "Снятие напряжения с тазобедренного сустава (ТБС)."
  },
  "Растяжка грудных": {
    title: "Растяжка грудных мышц",
    body: "В дверном проеме. Освобождение плечевого сплетения и декомпрессия нервов."
  },
  "Поза ребенка": {
    title: "Поза ребенка (2 минуты)",
    body: "Максимальное расслабление позвоночника. Опусти таз на пятки, руки вперед."
  }
};

window.showInfo = (key) => {
  const help = EXERCISE_HELP[key];
  if (!help) return;
  const modal = document.createElement('div');
  modal.className = 'modal-overlay fade-in';
  modal.onclick = closeInfo;
  modal.innerHTML = `
    <div class="modal-content" onclick="event.stopPropagation()">
      <button class="modal-close" onclick="closeInfo()">×</button>
      <h3>${help.title}</h3>
      <div class="modal-body">${help.body}</div>
       <button class="primary-btn" style="margin-top:20px" onclick="closeInfo()">Понятно</button>
    </div>
  `;
  document.body.appendChild(modal);
};

window.closeInfo = () => {
  const modal = document.querySelector('.modal-overlay');
  if (modal) modal.remove();
};

function playTimerSound() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5);
  gain.gain.setValueAtTime(0.1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.5);
  if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
}

function getDateKey(date) {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `sage_workout_${y}-${m}-${d}`;
}

function getFirstLogDate() {
  let earliest = new Date();
  earliest.setHours(0,0,0,0);
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("sage_workout_")) {
      const dateStr = key.replace("sage_workout_", "");
      const d = new Date(dateStr);
      if (!isNaN(d.getTime()) && d < earliest) earliest = d;
    }
  }
  return earliest;
}

function getCurrentState(dateOverride) {
  const now = dateOverride || new Date();
  const day = now.getDay();
  const monthName = MONTH_NAMES[now.getMonth()];
  
  let type = "Выходной"; 
  if ([1, 3, 5].includes(day)) type = "Объемная";
  else if ([2, 4].includes(day)) type = "Восстановление";
  else if (day === 0) type = "Технический";
  else if (day === 6) type = "Выходной";

  const data = PROGRAM.months[monthName] || PROGRAM.months["Апрель"];
  let currentVolume = { ...data };

  if (type === "Технический") {
    currentVolume = {
      pu: data.pu.map(v => Math.ceil(v * 0.5)),
      sq: data.sq.map(v => Math.ceil(v * 0.5)),
      pl: data.pl
    };
  } else if (type === "Восстановление") {
    currentVolume = { pl: data.pl };
  } else if (type === "Выходной") {
    currentVolume = null;
  }

  const dateKey = getDateKey(now);
  const savedData = JSON.parse(localStorage.getItem(dateKey) || "{}");

  return { date: now, dateKey, type, monthName, goal: data, volume: currentVolume, saved: savedData };
}

function formatSeconds(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
}

function getMonthlyStats(monthOffset = 0) {
  const targetDate = new Date();
  targetDate.setMonth(targetDate.getMonth() - monthOffset);
  const month = targetDate.getMonth();
  const year = targetDate.getFullYear();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  today.setHours(0,0,0,0);
  
  const firstLogDate = getFirstLogDate();

  let pushups = 0, squats = 0, plankSeconds = 0;
  let completedCount = 0, missedCount = 0, restCount = 0;
  const notes = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const curDate = new Date(year, month, d);
    const type = getDayType(curDate);
    const dateKey = getDateKey(curDate);
    const saved = JSON.parse(localStorage.getItem(dateKey) || "{}");
    
    if (saved && saved.main) {
      const monthGoal = (PROGRAM.months[MONTH_NAMES[month]] || PROGRAM.months["Апрель"]);
      if (Array.isArray(saved.main.pu)) {
        saved.main.pu.forEach((val, i) => { 
          if (val === true) pushups += monthGoal.pu[i] || 0;
          else if (val) pushups += parseInt(val) || 0; 
        });
      }
      if (Array.isArray(saved.main.sq)) {
        saved.main.sq.forEach((val, i) => { 
          if (val === true) squats += monthGoal.sq[i] || 0;
          else if (val) squats += parseInt(val) || 0; 
        });
      }
    }
    if (saved && saved.core && Array.isArray(saved.core) && saved.core[0]) {
      const monthGoal = (PROGRAM.months[MONTH_NAMES[month]] || PROGRAM.months["Апрель"]);
      plankSeconds += (monthGoal.pl && monthGoal.pl[0]) ? monthGoal.pl[0] : 0;
    }

    if (type === "Выходной") {
      restCount++;
    } else {
      if (saved.done) {
        completedCount++;
      } else if (curDate < today && curDate >= firstLogDate) {
        missedCount++;
      }
    }

    if (saved.note) {
      notes.push({ date: curDate.toLocaleDateString("ru-RU"), text: saved.note });
    }
  }
  return { pushups, squats, plankSeconds, completedCount, missedCount, restCount, notes };
}

function getDayType(date) {
  const day = date.getDay();
  if ([1, 3, 5].includes(day)) return "Объемная";
  if ([2, 4].includes(day)) return "Восстановление";
  if (day === 0) return "Технический";
  return "Выходной";
}

function getGrowthData() {
  const labels = [];
  const data = { pu: [], sq: [], pl: [] };
  for (let i = 2; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    labels.push(MONTH_NAMES[date.getMonth()].substring(0, 3));
    const stats = getMonthlyStats(i);
    data.pu.push(stats.pushups);
    data.sq.push(stats.squats);
    data.pl.push(stats.plankSeconds);
  }
  return { labels, data };
}

document.addEventListener("DOMContentLoaded", async () => {
  setupMainTabs();
  renderView();
  
  const state = getCurrentState();
  await requestNotificationPermission();
  checkAndSendReminder(state);
});

function setupMainTabs() {
  document.getElementById("tab-today").onclick = () => {
    currentView = "today";
    updateTabUI();
    renderView();
  };
  document.getElementById("tab-calendar").onclick = () => {
    currentView = "calendar";
    updateTabUI();
    renderView();
  };
}

function updateTabUI() {
  document.getElementById("tab-today").classList.toggle("active", currentView === "today");
  document.getElementById("tab-calendar").classList.toggle("active", currentView === "calendar");
}

function renderView() {
  const state = getCurrentState();
  const container = document.getElementById("app-container");
  container.innerHTML = "";
  
  if (currentView === "today") {
    renderToday(state, container);
  } else {
    renderHistoryView(container);
  }
}

function renderToday(state, container) {
  if (!state.saved.done && state.type !== "Выходной") {
    if (!document.getElementById("emergency-btn")) {
       const btn = document.createElement("button");
       btn.id = "emergency-btn";
       btn.className = "emergency-btn fade-in";
       btn.innerHTML = "<span>STOP / БОЛЬ</span>";
       btn.onclick = handleEmergency;
       document.body.appendChild(btn);
    }
  } else {
    const btn = document.getElementById("emergency-btn");
    if (btn) btn.remove();
  }

  if (state.saved.done) {
    container.innerHTML = `
      <div class="glass-card success-view">
        <div class="success-icon">🔥</div>
        <h1 class="success-msg">На сегодня всё:<br>ты охуенен!</h1>
        <p>Отличная работа. Увидимся на следующей тренировке.</p>
        <button class="reset-workout-btn" onclick="resetWorkout()">Смотреть тренировку снова</button>
      </div>
    `;
    return;
  }

  if (state.type === "Выходной") {
    container.innerHTML = `
      <div class="glass-card off-screen fade-in">
        <h2>Суббота — Выходной 🛋️</h2>
        <p>Время восстановления и роста.</p>
        <div class="quote-box">
          «Дисциплина — это умение делать то, что не хочется, чтобы достичь того, что очень хочется».
        </div>
        <div class="safety-rules">
          <h3>Правила безопасности Михаила:</h3>
          <ul>
            <li>Появилось онемение — СТОП.</li>
            <li>Прострел в пояснице — СТОП.</li>
            <li>Прыжки на пол — ЗАПРЕЩЕНО.</li>
          </ul>
        </div>
      </div>
    `;
    return;
  }

  let html = `
    <header class="glass-card">
      <h1>${state.monthName} 2026</h1>
      <p class="subtitle">Сегодня: ${state.date.toLocaleDateString("ru-RU")} — <strong>${state.type}</strong></p>
    </header>
    
    <div class="session-progress-container">
      <div class="session-progress-track">
        <div class="session-progress-fill" id="session-progress-fill"></div>
      </div>
      <div class="session-progress-text" id="session-progress-text">Прогресс: 0%</div>
    </div>
    
    <section class="workout-navigator">
      <button class="nav-btn active" data-step="warmup">Разминка</button>
  `;

  if (state.type === "Объемная" || state.type === "Технический") {
    html += `<button class="nav-btn" data-step="main">Сила</button>`;
  }
  
  html += `<button class="nav-btn" data-step="core">Core</button>`;
  html += `<button class="nav-btn" data-step="cooldown">Заминка</button>`;
  
  html += `</section><div id="workout-content"></div>`;
  
  container.innerHTML = html;
  setupNav();
  goToStep('warmup');
  updateSessionProgress();
}

function handleEmergency() {
  if (confirm("ПРЕРВАТЬ ТРЕНИРОВКУ?\n\nПри неврологической боли (прострел, онемение) — немедленный отдых. Запиши, на каком движении это случилось.")) {
    const state = getCurrentState();
    state.saved.done = true;
    state.saved.interrupted = true;
    state.saved.note = (state.saved.note || "") + "\n[ТРЕНИРОВКА ПРЕРВАНА ИЗ-ЗА БОЛИ]";
    localStorage.setItem(state.dateKey, JSON.stringify(state.saved));
    location.reload();
  }
}

function updateSessionProgress() {
  const state = getCurrentState();
  if (!state.volume || state.type === "Выходной") return;
  let total = 0, completed = 0;
  total += 4;
  if (state.saved.warmup) state.saved.warmup.forEach(v => { if (v) completed++; });
  if (state.volume.pu) {
    total += state.volume.pu.length;
    if (state.saved.main && state.saved.main.pu) state.saved.main.pu.forEach(v => { if (v) completed++; });
  }
  if (state.volume.sq) {
    total += state.volume.sq.length;
    if (state.saved.main && state.saved.main.sq) state.saved.main.sq.forEach(v => { if (v) completed++; });
  }
  if (state.volume.pl) {
    total += 1;
    if (state.saved.core && state.saved.core[0]) completed++;
  }
  total += 4;
  if (state.saved.cooldown) state.saved.cooldown.forEach(v => { if (v) completed++; });

  const percent = Math.min(Math.round((completed / total) * 100), 100);
  const fill = document.getElementById("session-progress-fill");
  const text = document.getElementById("session-progress-text");
  if (fill) fill.style.width = `${percent}%`;
  if (text) text.innerText = `Прогресс: ${percent}%`;
}

function renderHistoryView(container) {
  const stats = getMonthlyStats();
  const state = getCurrentState();
  const growth = getGrowthData();
  
  let html = `
    <div class="history-today-badge fade-in">
      <h3>Статус на сегодня</h3>
      <div class="status-text">${state.date.toLocaleDateString("ru-RU", {weekday:'short'})}: ${state.type}</div>
    </div>
    <div class="stats-grid fade-in">
      <div class="stat-card"><div class="stat-icon">✅</div><div class="stat-value">${stats.completedCount}</div><div class="stat-label">Сделано</div></div>
      <div class="stat-card"><div class="stat-icon">❌</div><div class="stat-value">${stats.missedCount}</div><div class="stat-label">Пропущено</div></div>
      <div class="stat-card"><div class="stat-icon">🛋️</div><div class="stat-value">${stats.restCount}</div><div class="stat-label">Отдых</div></div>
      <div class="stat-card"><div class="stat-icon">⏱️</div><div class="stat-value">${stats.completedCount + stats.missedCount}</div><div class="stat-label">Всего</div></div>
      <div class="stat-card wide"><div class="stat-icon">🧘 Планка (всего за месяц)</div><div class="stat-value stat-value-large">${formatSeconds(stats.plankSeconds)}</div><div class="stat-label">Общее время</div></div>
    </div>
    <section class="glass-card fade-in">
      <h2 class="section-title">📊 Месячный объем</h2>
      ${renderProgressBar("Отжимания", stats.pushups, 1000)}
      ${renderProgressBar("Приседания", stats.squats, 2000)}
    </section>
    <section class="glass-card fade-in">
      <h2 class="section-title">📈 Рост повторений</h2>
      <div class="chart-container">${renderSVGChart(growth.data.pu, growth.data.sq, growth.data.pl)}</div>
      <div class="chart-labels">${growth.labels.map(l => `<span>${l}</span>`).join('')}</div>
    </section>
    <div class="glass-card fade-in">
      <div class="calendar-header">
        <button class="cal-nav-btn" onclick="changeCalMonth(-1)">←</button>
        <h2>${MONTH_NAMES[calendarDate.getMonth()]} ${calendarDate.getFullYear()}</h2>
        <button class="cal-nav-btn" onclick="changeCalMonth(1)">→</button>
      </div>
      <div class="calendar-grid">
        <div class="weekday">ПН</div><div class="weekday">ВТ</div><div class="weekday">СР</div><div class="weekday">ЧТ</div><div class="weekday">ПТ</div><div class="weekday">СБ</div><div class="weekday">ВС</div>
        ${renderCalendarGrid()}
      </div>
    </div>
  `;
  if (stats.notes.length > 0) {
    html += `<section class="glass-card fade-in"><h2 class="section-title">📝 Архив заметок</h2><div class="notes-archive-list">${stats.notes.map(n => `<div class="note-card"><div class="note-date">${n.date}</div><div class="note-text">${n.text}</div></div>`).join('')}</div></section>`;
  }
  container.innerHTML = html;
}

function renderProgressBar(label, current, goal) {
  const percent = Math.min(Math.round((current / goal) * 100), 100);
  return `<div class="progress-goal-item"><div class="goal-info"><span>${label}</span><span><strong>${current}</strong> / ${goal}</span></div><div class="progress-track"><div class="progress-fill" style="width: ${percent}%"></div></div></div>`;
}

function renderSVGChart(pu = [], sq = [], pl = []) {
  const puArr = Array.isArray(pu) ? pu : [];
  const sqArr = Array.isArray(sq) ? sq : [];
  const plArr = Array.isArray(pl) ? pl : [];
  const max = Math.max(...puArr, ...sqArr, ...plArr, 100) * 1.2;
  const points = (arr) => arr.length > 1 ? arr.map((v, i) => `${(i / (arr.length - 1)) * 100},${100 - (v / max) * 100}`).join(' ') : (arr.length === 1 ? `0,${100 - (arr[0] / max) * 100} 100,${100 - (arr[0] / max) * 100}` : '0,100 100,100');
  return `<svg viewBox="0 0 100 100" class="chart-svg" preserveAspectRatio="none"><polyline points="${points(puArr)}" class="chart-line" /><polyline points="${points(sqArr)}" class="chart-line" style="stroke: var(--accent-success)" /><polyline points="${points(plArr)}" class="chart-line" style="stroke: var(--accent-secondary)" />${puArr.map((v, i) => `<circle cx="${(i / (Math.max(puArr.length - 1, 1))) * 100}" cy="${100 - (v / max) * 100}" r="2" class="chart-point" />`).join('')}</svg>`;
}

function renderCalendarGrid() {
  const month = calendarDate.getMonth(), year = calendarDate.getFullYear();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDaysInMonth = new Date(year, month, 0).getDate();
  const startOffset = (firstDay === 0 ? 7 : firstDay) - 1;
  let html = '';
  for (let i = 0; i < 42; i++) {
    const dayIndex = i - startOffset + 1;
    let d, isOtherMonth = false;
    if (dayIndex <= 0) { d = new Date(year, month - 1, prevDaysInMonth + dayIndex); isOtherMonth = true; }
    else if (dayIndex > daysInMonth) { d = new Date(year, month + 1, dayIndex - daysInMonth); isOtherMonth = true; }
    else { d = new Date(year, month, dayIndex); }
    const dateKey = getDateKey(d), saved = JSON.parse(localStorage.getItem(dateKey) || "{}"), type = getDayType(d);
    let dots = [], extraClass = '';
    if (!isOtherMonth) {
      if (type === "Объемная") dots.push("dot-volume"); else if (type === "Технический") dots.push("dot-tech");
      if (saved.done) dots.push("dot-completed"); else if (d < new Date().setHours(0,0,0,0) && type !== "Выходной") extraClass = 'missed';
      if (saved.note) dots.push("dot-note");
    }
    html += `<div class="day-cell ${isOtherMonth ? 'other-month' : ''} ${d.toISOString().split('T')[0] === new Date().toISOString().split('T')[0] ? 'today' : ''} ${extraClass}">${d.getDate()}<div class="status-dots">${dots.map(dot => `<div class="status-dot ${dot}"></div>`).join('')}</div></div>`;
  }
  return html;
}

window.changeCalMonth = (dir) => { calendarDate.setMonth(calendarDate.getMonth() + dir); renderView(); };

function renderWarmup(state) {
  const s = state.saved.warmup || [false, false, false, false], allChecked = s.filter(v => v).length === 4;
  return `<div class="glass-card fade-in"><h2>1. Разминка</h2><div class="checklist-container">${renderChecklistItem('warmup', 0, 'Суставная разминка', s[0], 'Круговые движения')}${renderChecklistItem('warmup', 1, '«Кошка-корова» (12 раз)', s[1], '«Кошка-корова»')}${renderChecklistItem('warmup', 2, '«Птица-собака» (2х10)', s[2], '«Птица-собака» (Bird-Dog)')}${renderChecklistItem('warmup', 3, 'Велосипед лежа на спине', s[3], 'Велосипед лежа на спине')}</div><button class="primary-btn ${allChecked ? '' : 'locked'}" onclick="goToNextStep('warmup')">Далее</button></div>`;
}

function renderMain(state) {
  const vol = state.volume, s = state.saved.main || {};
  
  const renderSets = (exId, repsArr) => `
    <div class="set-tiles">
      ${repsArr.map((reps, i) => {
        const done = s[exId] && s[exId][i];
        return `
          <div class="set-tile ${done ? 'completed' : ''}" 
               onclick="toggleSet('${exId}', ${i}, this, ${reps})">
            <span class="reps">${reps}</span>
            <span class="label">Сет ${i+1}</span>
          </div>
        `;
      }).join('')}
    </div>
  `;

  return `
    <div class="glass-card fade-in">
      <h2>2. Сила</h2>
      <p class="warning-banner">⚠️ <strong>Техника превыше всего!</strong> Если локоть покалывает — не разгибай до щелчка.</p>
      
      <div class="exercise-block">
        <div class="exercise-header-row">
          <h3>Отжимания («Замок»)</h3>
          <button class="info-btn" onclick="showInfo('Отжимания')">i</button>
        </div>
        ${renderSets('pu', vol.pu)}
      </div>

      <div class="exercise-block" style="margin-top:30px">
        <div class="exercise-header-row">
          <h3>Приседания («Стул»)</h3>
          <button class="info-btn" onclick="showInfo('Приседания')">i</button>
        </div>
        ${renderSets('sq', vol.sq)}
      </div>

      <button class="primary-btn" style="margin-top:30px" onclick="goToNextStep('main')">К блоку Core</button>
    </div>
  `;
}

function renderCore(state) {
  const target = state.volume.pl[0], isDone = state.saved.core && state.saved.core[0];
  return `<div class="glass-card core-timer-view fade-in"><h2>3. Core</h2><div class="timer-circle ${isDone ? 'active' : ''}" id="plank-timer-circle"><span class="timer-value" id="plank-timer-value">${target}</span></div>${isDone ? '<p>✅ Готово!</p>' : `<button class="primary-btn" id="plank-start-btn" onclick="startPlankTimer(${target})">СТАРТ</button>`}<button class="primary-btn" onclick="goToNextStep('core')">Далее</button></div>`;
}

function renderCooldown(state) {
  const s = state.saved.cooldown || [false, false, false, false];
  return `<div class="glass-card fade-in"><h2>4. Заминка</h2><div class="checklist-container">${renderChecklistItem('cooldown', 0, 'Руки', s[0], 'Растяжка руки')}${renderChecklistItem('cooldown', 1, 'Ноги', s[1], 'Растяжка ноги')}${renderChecklistItem('cooldown', 2, 'Грудь', s[2], 'Растяжка грудных')}${renderChecklistItem('cooldown', 3, 'Поза ребенка', s[3], 'Поза ребенка')}</div><textarea class="wellness-textarea" oninput="saveNote(this.value)" placeholder="Заметки...">${state.saved.note || ''}</textarea><button class="primary-btn success" onclick="finishWorkout()">Завершить</button></div>`;
}

function renderChecklistItem(sec, idx, label, checked, infoKey) {
  return `<label class="checklist-item"><input type="checkbox" onchange="saveCheck('${sec}', ${idx}, this)" ${checked ? 'checked' : ''}><span>${label}</span><button class="info-btn" onclick="showInfo('${infoKey}')">i</button></label>`;
}

window.saveStrength = (ex, idx, val) => {
  const state = getCurrentState(); if (!state.saved.main) state.saved.main = {}; if (!state.saved.main[ex]) state.saved.main[ex] = [];
  state.saved.main[ex][idx] = parseInt(val); localStorage.setItem(state.dateKey, JSON.stringify(state.saved));
  updateGlobalMax(ex, parseInt(val)); updateSessionProgress();
};

window.startPlankTimer = (seconds) => {
  const display = document.getElementById("plank-timer-value"); document.getElementById("plank-start-btn").style.display = "none";
  let timeLeft = seconds; const timer = setInterval(() => { timeLeft--; display.innerText = timeLeft; if (timeLeft <= 0) { clearInterval(timer); playTimerSound(); saveCheck('core', 0, { checked: true }); goToStep('core'); } }, 1000);
};

function updateGlobalMax(ex, reps) { const key = `sage_max_${ex}`, cur = parseInt(localStorage.getItem(key) || 0); if (reps > cur) localStorage.setItem(key, reps); }

window.goToNextStep = (current) => {
  const steps = { 'warmup': 'main', 'main': 'core', 'core': 'cooldown' };
  const state = getCurrentState(); let next = steps[current]; if (next === 'main' && state.type === 'Восстановление') next = 'core';
  goToStep(next);
};

window.saveNote = (text) => { const state = getCurrentState(); state.saved.note = text; localStorage.setItem(state.dateKey, JSON.stringify(state.saved)); };

window.saveCheck = (sec, idx, el) => {
  const state = getCurrentState(); if (!state.saved[sec]) state.saved[sec] = []; state.saved[sec][idx] = el.checked;
  localStorage.setItem(state.dateKey, JSON.stringify(state.saved)); updateSessionProgress();
};

window.toggleSet = (exId, idx, el, reps) => {
  const state = getCurrentState();
  if (!state.saved.main) state.saved.main = {};
  if (!state.saved.main[exId]) state.saved.main[exId] = [];
  
  if (el.classList.contains("completed")) {
    el.classList.remove("completed");
    state.saved.main[exId][idx] = false;
    localStorage.setItem(state.dateKey, JSON.stringify(state.saved));
    updateSessionProgress();
  } else {
    // Show execution overlay
    const overlay = document.createElement("div");
    overlay.className = "execution-overlay fade-in";
    overlay.innerHTML = `
      <div class="execution-box">
        <h2>Выполняю</h2>
        <div class="execution-reps">${reps}</div>
        <button class="finish-set-btn" onclick="finishExecution('${exId}', ${idx}, ${reps})">ЗАВЕРШИТЬ</button>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.targetEl = el;
  }
};

window.finishExecution = (exId, idx, reps) => {
  const overlay = document.querySelector(".execution-overlay");
  const el = overlay.targetEl;
  const state = getCurrentState();
  
  if (!state.saved.main) state.saved.main = {};
  if (!state.saved.main[exId]) state.saved.main[exId] = [];

  el.classList.add("completed");
  state.saved.main[exId][idx] = true;
  localStorage.setItem(state.dateKey, JSON.stringify(state.saved));
  
  overlay.remove();
  updateSessionProgress();
  updateGlobalMax(exId, reps);
  startTimer(60); // 60s rest
};

let restTimer;
function startTimer(seconds) {
  let timeLeft = seconds;
  const overlay = document.createElement("div");
  overlay.className = "timer-overlay";
  document.body.appendChild(overlay);
  
  clearInterval(restTimer);
  restTimer = setInterval(() => {
    overlay.innerHTML = `
      <div class="timer-box">
        <h2>Отдых</h2>
        <div class="timer-val">${timeLeft}</div>
        <button class="skip-timer-btn" onclick="closeTimer()">ПРОПУСТИТЬ</button>
      </div>
    `;
    if (timeLeft-- <= 0) {
      playTimerSound();
      closeTimer();
    }
  }, 1000);
}

window.closeTimer = () => {
  clearInterval(restTimer);
  const overlay = document.querySelector(".timer-overlay");
  if (overlay) overlay.remove();
};

window.goToStep = (step) => {
  const content = document.getElementById("workout-content"), state = getCurrentState();
  if (step === 'warmup') content.innerHTML = renderWarmup(state);
  else if (step === 'main') content.innerHTML = renderMain(state);
  else if (step === 'core') content.innerHTML = renderCore(state);
  else if (step === 'cooldown') content.innerHTML = renderCooldown(state);
  document.querySelectorAll(".nav-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.step === step));
  updateSessionProgress();
};

function setupNav() { document.querySelectorAll(".nav-btn").forEach(btn => btn.onclick = () => goToStep(btn.dataset.step)); }

async function requestNotificationPermission() { if (!("Notification" in window)) return; if (Notification.permission === "default") await Notification.requestPermission(); }

function checkAndSendReminder(state) {
  if (state.type === "Выходной" || state.saved.done) return;
  if (new Date().getHours() >= 8) {
    const last = localStorage.getItem("sage_last_notified"), today = new Date().toISOString().split('T')[0];
    if (last !== today && Notification.permission === "granted") {
      new Notification("SAGEWorkOut", { body: `Пора тренироваться! Состояние: ${state.type}`, icon: "./assets/icon-192.png" });
      localStorage.setItem("sage_last_notified", today);
    }
  }
}

window.finishWorkout = () => { const state = getCurrentState(); state.saved.done = true; localStorage.setItem(state.dateKey, JSON.stringify(state.saved)); location.reload(); };
window.resetWorkout = () => { const state = getCurrentState(); state.saved.done = false; localStorage.setItem(state.dateKey, JSON.stringify(state.saved)); renderView(); };

if ('serviceWorker' in navigator) { window.addEventListener('load', () => { navigator.serviceWorker.register('./sw.js'); }); }
