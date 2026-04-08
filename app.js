const PROGRAM = {
  months: {
    "Апрель": { pushups: "5 сетов по 10", squats: "3 сета по 10", pullups: "5 сетов по 1", plank: "3 по 30 сек", volume: { pu: [10, 10, 10, 10, 10], sq: [10, 10, 10], plups: [1, 1, 1, 1, 1], pl: [30, 30, 30] } },
    "Май": { pushups: "6 сетов по 10", squats: "4 сета по 10", pullups: "6 сетов по 2", plank: "3 по 40 сек", volume: { pu: [10, 10, 10, 10, 10, 10], sq: [10, 10, 10, 10], plups: [2, 2, 2, 2, 2, 2], pl: [40, 40, 40] } },
    "Июнь": { pushups: "5 сетов по 15", squats: "5 сетов по 15", pullups: "8 сетов по 3", plank: "3 по 50 сек", volume: { pu: [15, 15, 15, 15, 15], sq: [15, 15, 15, 15, 15], plups: [3, 3, 3, 3, 3, 3, 3, 3], pl: [50, 50, 50] } },
    "Июль": { pushups: "6 сетов по 15", squats: "6 сетов по 20", pullups: "10 сетов по 4", plank: "4 по 45 сек", volume: { pu: [15, 15, 15, 15, 15, 15], sq: [20, 20, 20, 20, 20, 20], plups: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4], pl: [45, 45, 45, 45] } },
    "Август": { pushups: "5 сетов по 20", squats: "5 сетов по 30", pullups: "10 сетов по 5", plank: "3 по 60 сек", volume: { pu: [20, 20, 20, 20, 20], sq: [30, 30, 30, 30, 30], plups: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5], pl: [60, 60, 60] } },
    "Сентябрь": { pushups: "4 сета по 25", squats: "6 сетов по 30", pullups: "8 сетов по 8", plank: "4 по 60 сек", volume: { pu: [25, 25, 25, 25], sq: [30, 30, 30, 30, 30, 30], plups: [8, 8, 8, 8, 8, 8, 8, 8], pl: [60, 60, 60, 60] } },
    "Октябрь": { pushups: "3 сета по 35", squats: "5 сетов по 40", pullups: "10 сетов по 10", plank: "3 по 90 сек", volume: { pu: [35, 35, 35], sq: [40, 40, 40, 40, 40], plups: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10], pl: [90, 90, 90] } },
    "Ноябрь": { pushups: "2 сета по 50", squats: "4 сета по 50", pullups: "5 сетов по 15 + добор", plank: "3 по 100 сек", volume: { pu: [50, 50], sq: [50, 50, 50, 50], plups: [15, 15, 15, 15, 15, 25], pl: [100, 100, 100] } },
    "Декабрь": { pushups: "1 сет по 100", squats: "4 сета по 50", pullups: "10 сетов по 10", plank: "3 по 120 сек", volume: { pu: [100], sq: [50, 50, 50, 50], plups: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10], pl: [120, 120, 120] } }
  }
};

const MONTH_NAMES = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

function getTechnicalVolume(volume) {
  const techVol = {};
  for (const key in volume) {
    techVol[key] = volume[key].map(v => Math.ceil(v / 2));
    if (techVol[key].length > 1) {
       techVol[key] = techVol[key].slice(0, Math.ceil(techVol[key].length / 2));
    }
  }
  return techVol;
}

let currentView = "today";
let calendarDate = new Date();

// PWA & Effects Setup
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js');
}

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

const EXERCISE_HELP = {
  "Круговые движения": {
    title: "Круговые движения",
    body: "Общая разминка суставов. Делайте плавно, без резких движений."
  },
  "«Кошка-корова»": {
    title: "Кошка-Корова",
    body: "<ul><li><strong>ИП:</strong> На четвереньках, кисти под плечами, колени под бедрами.</li><li><strong>Выполнение:</strong> На выдохе плавно округляй спину вверх, подбородок к груди. На вдохе — мягко прогибайся вниз.</li><li><strong>Важно:</strong> Прогиб вниз делай МИНИМАЛЬНЫМ, чтобы не «закусывать» зону операции L5-S1. Основной акцент — на выгибание вверх.</li></ul>"
  },
  "«Птица-собака» (Bird-Dog)": {
    title: "Птица-Собака (Bird-Dog)",
    body: "<ul><li><strong>ИП:</strong> На четвереньках.</li><li><strong>Выполнение:</strong> Одновременно вытяни правую руку вперед и левую ногу назад до параллели с полом. Замри на 2–3 сек.</li><li><strong>Важно:</strong> Представь, что на пояснице стоит стакан с водой — он не должен шелохнуться. Не задирай ногу слишком высоко.</li></ul>"
  },
  "Медленные наклоны": {
    title: "Нервное скольжение (для локтя)",
    body: "<ul><li><strong>Выполнение:</strong> Вытяни руку в сторону, согни кисть на себя. Плавным движением подноси ладонь к уху, сгибая локоть, и отводи обратно.</li><li><strong>Важно:</strong> Чувствуй легкое натяжение, но НЕ БОЛЬ. Это «прочищает» путь для локтевого нерва.</li></ul>"
  },
  "Отжимания": {
    title: "Отжимания (Техника «Замок»)",
    body: "<ul><li><strong>ИП:</strong> Упор лежа, тело — прямая линия.</li><li><strong>Выполнение:</strong> Локти направлены назад под углом 45° к телу.</li><li><strong>Для спины:</strong> Напрягай ягодицы и пресс, чтобы поясница не «провисала».</li><li><strong>Для локтя:</strong> Не разгибай локти до «щелчка» в верхней точке, оставляй их чуть согнутыми.</li></ul>"
  },
  "Приседания": {
    title: "Приседания (Техника «Стул»)",
    body: "<ul><li><strong>ИП:</strong> Ноги на ширине плеч, носки чуть в стороны.</li><li><strong>Выполнение:</strong> Начни с отведения таза назад, будто садишься на стул.</li><li><strong>Безопасность:</strong> Спина прямая. Если таз «подворачивается» — присел слишком глубоко. Твой предел — параллель бедер с полом.</li></ul>"
  },
  "Подтягивания": {
    title: "Подтягивания (Нейтральный хват)",
    body: "<ul><li><strong>Выполнение:</strong> Сначала потяни лопатки вниз, затем тяни себя грудью к перекладине.</li><li><strong>Важно:</strong> Никаких рывков! Спуск медленнее подъема.</li><li><strong>Главное:</strong> Сходить с турника только на подставку! Прыжки на пол запрещены навсегда (удар по L5-S1).</li></ul>"
  },
  "Планка": {
    title: "Планка",
    body: "<ul><li><strong>Выполнение:</strong> Держи тело ровно. Пресс максимально напряжен.</li><li><strong>Важно:</strong> Лучше делать на прямых руках, чтобы не давать давления на зону шва на локте.</li><li><strong>Спина:</strong> Если поясница начинает ныть — сразу прекращай.</li></ul>"
  },
  "Пассивный вис": {
    title: "Пассивный вис",
    body: "Просто виси на турнике, расслабив всё тело ниже плеч. Чувствуй, как растягивается поясница. Время: 30–60 сек."
  },
  "Поза ребенка": {
    title: "Поза ребенка",
    body: "Сядь на колени, опусти таз на пятки и потянись руками вперед. Максимальное расслабление мышц позвоночника."
  },
  "Растяжка грудных": {
    title: "Растяжка грудных мышц",
    body: "Упрись предплечьями в косяки двери и плавно подайся корпусом вперед. Это освобождает плечевое сплетение и дает свободу локтевому нерву."
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

function getCurrentState(dateOverride) {
  const now = dateOverride || new Date();
  const day = now.getDay();
  const monthName = MONTH_NAMES[now.getMonth()];
  let type = "Отдых";
  if ([1, 3, 5].includes(day)) type = "Объем";
  else if ([2, 4].includes(day)) type = "Восстановление";
  else if (day === 6) type = "Техника";

  const data = PROGRAM.months[monthName] || PROGRAM.months["Апрель"];
  let currentVolume = data.volume;
  if (type === "Техника") currentVolume = getTechnicalVolume(data.volume);
  else if (type === "Восстановление") currentVolume = { pl: data.volume.pl };
  else if (type === "Отдых") currentVolume = null;

  const dateKey = `sage_workout_${now.toISOString().split('T')[0]}`;
  const savedData = JSON.parse(localStorage.getItem(dateKey) || "{}");

  return { date: now, dateKey, type, monthName, goal: data, volume: currentVolume, saved: savedData };
}

document.addEventListener("DOMContentLoaded", () => {
  setupMainTabs();
  renderView();
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
    renderCalendarView(container);
  }
}

function renderToday(state, container) {
  let html = `
    <header class="glass-card">
      <h1>${state.monthName} 2026</h1>
      <p class="subtitle">Сегодня: ${state.date.toLocaleDateString("ru-RU")} — <strong>${state.type}</strong></p>
    </header>
  `;

  if (state.type === "Отдых") {
    html += `<section class="glass-card center"><h2>Время заслуженного отдыха! 🛋️</h2><p>Расслабьтесь и восстановитесь.</p></section>`;
  } else {
    html += `
      <section class="workout-navigator">
        <button class="nav-btn active" data-step="warmup">Разминка</button>
        <button class="nav-btn" data-step="main">Основной блок</button>
        <button class="nav-btn" data-step="cooldown">Заминка</button>
      </section>
      <div id="workout-content">${renderWarmup(state)}</div>
    `;
  }
  container.innerHTML = html;
  setupNav();
}

function renderCalendarView(container) {
  const month = calendarDate.getMonth();
  const year = calendarDate.getFullYear();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDaysInMonth = new Date(year, month, 0).getDate();
  
  const startOffset = (firstDay === 0 ? 7 : firstDay) - 1;
  const totalCells = 42;
  
  let html = `
    <div class="glass-card fade-in">
      <div class="calendar-header">
        <button class="cal-nav-btn" onclick="changeCalMonth(-1)">←</button>
        <h2>${MONTH_NAMES[month]} ${year}</h2>
        <button class="cal-nav-btn" onclick="changeCalMonth(1)">→</button>
      </div>
      <div class="calendar-grid">
        <div class="weekday">ПН</div><div class="weekday">ВТ</div><div class="weekday">СР</div>
        <div class="weekday">ЧТ</div><div class="weekday">ПТ</div><div class="weekday">СБ</div><div class="weekday">ВС</div>
  `;

  for (let i = 0; i < totalCells; i++) {
    const dayIndex = i - startOffset + 1;
    let currentDay, isOtherMonth = false;
    let d;
    
    if (dayIndex <= 0) {
      currentDay = prevDaysInMonth + dayIndex;
      isOtherMonth = true;
      d = new Date(year, month - 1, currentDay);
    } else if (dayIndex > daysInMonth) {
      currentDay = dayIndex - daysInMonth;
      isOtherMonth = true;
      d = new Date(year, month + 1, currentDay);
    } else {
      currentDay = dayIndex;
      d = new Date(year, month, currentDay);
    }

    const dateKey = `sage_workout_${d.toISOString().split('T')[0]}`;
    const saved = JSON.parse(localStorage.getItem(dateKey) || "{}");
    const todayStr = new Date().toISOString().split('T')[0];
    const isToday = d.toISOString().split('T')[0] === todayStr;
    const type = getDayType(d);
    
    let dots = [];
    if (!isOtherMonth) {
      if (type === "Объем") dots.push("dot-volume");
      else if (type === "Техника") dots.push("dot-tech");
      
      if (saved.main && Object.keys(saved.main).length > 0) {
         dots.push("dot-completed");
      }
    }

    html += `
      <div class="day-cell ${isOtherMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}">
        ${currentDay}
        <div class="status-dots">
          ${dots.map(dot => `<div class="status-dot ${dot}"></div>`).join('')}
        </div>
      </div>
    `;
  }

  html += `</div></div>`;
  container.innerHTML = html;
}

function getDayType(date) {
  const day = date.getDay();
  if ([1, 3, 5].includes(day)) return "Объем";
  if (day === 6) return "Техника";
  return "Отдых";
}

window.changeCalMonth = (dir) => {
  calendarDate.setMonth(calendarDate.getMonth() + dir);
  renderView();
};

function renderWarmup(state) {
  const s = state.saved.warmup || [];
  return `
    <div class="glass-card fade-in">
      <h2>1. Разминка</h2>
      <ul class="exercise-list">
        <li>
          <label class="exercise-row">
            <input type="checkbox" onchange="saveCheck('warmup', 0, this)" ${s[0]?'checked':''}>
            <span>Круговые движения</span>
            <button class="info-btn" onclick="showInfo('Круговые движения')">i</button>
          </label>
        </li>
        <li>
          <label class="exercise-row">
            <input type="checkbox" onchange="saveCheck('warmup', 1, this)" ${s[1]?'checked':''}>
            <span>«Кошка-корова»</span>
            <button class="info-btn" onclick="showInfo('«Кошка-корова»')">i</button>
          </label>
        </li>
        <li class="tip-box">
          <label class="exercise-row">
            <input type="checkbox" onchange="saveCheck('warmup', 2, this)" ${s[2]?'checked':''}>
            <strong>«Птица-собака» (Bird-Dog)</strong>
            <button class="info-btn" onclick="showInfo('«Птица-собака» (Bird-Dog)')">i</button>
          </label>
          <p class="tip">Стабилизация L5-S1. Спина ровная!</p>
        </li>
        <li>
          <label class="exercise-row">
            <input type="checkbox" onchange="saveCheck('warmup', 3, this)" ${s[3]?'checked':''}>
            <span>Медленные наклоны</span>
            <button class="info-btn" onclick="showInfo('Медленные наклоны')">i</button>
          </label>
        </li>
      </ul>
      <button class="primary-btn" onclick="goToStep('main')">Перейти к основе</button>
    </div>
  `;
}

function renderMain(state) {
  const vol = state.volume;
  const s = state.saved.main || {};
  let html = `<div class="glass-card fade-in"><h2>2. Основной блок</h2><p class="warning-banner">⚠️ <strong>Михаил, внимание!</strong> Онемение мизинца = СТОП.</p>`;
  if (vol.pu) html += renderExercise("pushups", "Отжимания", vol.pu, s.pushups || []);
  if (vol.sq) html += renderExercise("squats", "Приседания", vol.sq, s.squats || []);
  if (vol.plups) html += renderExercise("pullups", "Подтягивания", vol.plups, s.pullups || []);
  if (vol.pl) html += renderExercise("plank", "Планка", vol.pl, s.plank || []);
  html += `<button class="primary-btn" onclick="goToStep('cooldown')">К заминке</button></div>`;
  return html;
}

function renderExercise(id, name, sets, saved) {
  return `
    <div class="exercise-block">
      <div class="exercise-header-row">
        <h3>${name}</h3>
        <button class="info-btn" onclick="showInfo('${name}')">i</button>
      </div>
      <div class="sets-grid">
        ${sets.map((reps, i) => `<div class="set-item ${saved[i]?'completed':''}" onclick="toggleSet('${id}', ${i}, this)">${reps}</div>`).join('')}
      </div>
    </div>
  `;
}

function renderCooldown(state) {
  const s = state.saved.cooldown || [];
  return `
    <div class="glass-card fade-in">
      <h2>3. Заминка</h2>
      <ul class="exercise-list">
        <li>
          <label class="exercise-row">
            <input type="checkbox" onchange="saveCheck('cooldown', 0, this)" ${s[0]?'checked':''}>
            <span>Пассивный вис</span>
            <button class="info-btn" onclick="showInfo('Пассивный вис')">i</button>
          </label>
        </li>
        <li>
          <label class="exercise-row">
            <input type="checkbox" onchange="saveCheck('cooldown', 1, this)" ${s[1]?'checked':''}>
            <span>Поза ребенка</span>
            <button class="info-btn" onclick="showInfo('Поза ребенка')">i</button>
          </label>
        </li>
        <li>
          <label class="exercise-row">
            <input type="checkbox" onchange="saveCheck('cooldown', 2, this)" ${s[2]?'checked':''}>
            <span>Растяжка грудных</span>
            <button class="info-btn" onclick="showInfo('Растяжка грудных')">i</button>
          </label>
        </li>
      </ul>
      <button class="primary-btn" onclick="goToStep('warmup')">Завершить</button>
    </div>
  `;
}

window.saveCheck = (sec, idx, el) => {
  const state = getCurrentState();
  if (!state.saved[sec]) state.saved[sec] = [];
  state.saved[sec][idx] = el.checked;
  localStorage.setItem(state.dateKey, JSON.stringify(state.saved));
};

window.toggleSet = (exId, idx, el) => {
  const state = getCurrentState();
  if (!state.saved.main) state.saved.main = {};
  if (!state.saved.main[exId]) state.saved.main[exId] = [];
  
  el.classList.toggle("completed");
  state.saved.main[exId][idx] = el.classList.contains("completed");
  localStorage.setItem(state.dateKey, JSON.stringify(state.saved));
  
  if (el.classList.contains("completed")) startTimer(60);
};

window.goToStep = (step) => {
  const content = document.getElementById("workout-content");
  const state = getCurrentState();
  if (step === 'warmup') content.innerHTML = renderWarmup(state);
  else if (step === 'main') content.innerHTML = renderMain(state);
  else if (step === 'cooldown') content.innerHTML = renderCooldown(state);
  document.querySelectorAll(".nav-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.step === step));
};

let timerInterval;
function startTimer(seconds) {
  let timeLeft = seconds;
  const overlay = document.createElement("div");
  overlay.className = "timer-overlay";
  document.body.appendChild(overlay);
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    overlay.innerHTML = `<div class="timer-box">Отдых: ${timeLeft}с <button onclick="closeTimer()">Пропустить</button></div>`;
    if (timeLeft-- <= 0) {
      playTimerSound();
      closeTimer();
    }
  }, 1000);
}

window.closeTimer = () => {
  clearInterval(timerInterval);
  const overlay = document.querySelector(".timer-overlay");
  if (overlay) overlay.remove();
};

window.finishWorkout = () => {
  alert("Тренировка сохранена! Вы молодец!");
  location.reload();
};

function setupNav() {
  document.querySelectorAll(".nav-btn").forEach(btn => btn.onclick = () => goToStep(btn.dataset.step));
}
