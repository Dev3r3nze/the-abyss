
/*NAVEGADOR*/
const navToggle = document.getElementById('nav-toggle');
const navMobile = document.getElementById('nav-mobile');
const iconMenu = document.getElementById('icon-menu');
const iconClose = document.getElementById('icon-close');
let menuOpen = false;

navToggle.addEventListener('click', () => {
  menuOpen = !menuOpen;
  navMobile.style.display = menuOpen ? 'block' : 'none';
  iconMenu.style.display = menuOpen ? 'none' : 'block';
  iconClose.style.display = menuOpen ? 'block' : 'none';
});
function closeMenu() {
  menuOpen = false;
  navMobile.style.display = 'none';
  iconMenu.style.display = 'block';
  iconClose.style.display = 'none';
}

/*SECCIÓN DE MAPA*/
function activateMap(idx) {
  document.querySelectorAll('.map-card').forEach((c, i) => {
    c.classList.toggle('active', i === idx);
  });
}

/*AUDIO*/
const audio = document.getElementById('audio-el');
const seekBar = document.getElementById('seek-bar');
const volBar = document.getElementById('vol-bar');
const timeEl = document.getElementById('audio-time');

function fmt(s) {
  const m = Math.floor((s || 0) / 60), sec = Math.floor((s || 0) % 60);
  return String(m).padStart(2, '0') + ':' + String(sec).padStart(2, '0');
}
function toggleAudio() {
  if (audio.paused) {
    audio.play().catch(() => { });
    document.getElementById('play-icon').style.display = 'none';
    document.getElementById('pause-icon').style.display = 'block';
  } else {
    audio.pause();
    document.getElementById('play-icon').style.display = 'block';
    document.getElementById('pause-icon').style.display = 'none';
  }
}
function seekAudio(val) {
  if (audio.duration) audio.currentTime = (val / 100) * audio.duration;
}
function setVolume(val) { audio.volume = val; }

audio.addEventListener('timeupdate', () => {
  const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
  seekBar.value = pct;
  seekBar.style.background = `linear-gradient(to right, hsl(43,65%,54%) ${pct}%, hsl(230,10%,20%) ${pct}%)`;
  timeEl.textContent = fmt(audio.currentTime) + ' / ' + fmt(audio.duration);
});
audio.addEventListener('ended', () => {
  document.getElementById('play-icon').style.display = 'block';
  document.getElementById('pause-icon').style.display = 'none';
});
volBar.addEventListener('input', (e) => {
  const v = e.target.value * 100;
  volBar.style.background = `linear-gradient(to right, hsl(43,65%,54%) ${v}%, hsl(230,10%,20%) ${v}%)`;
});
seekBar.style.background = `linear-gradient(to right, hsl(43,65%,54%) 0%, hsl(230,10%,20%) 0%)`;
volBar.style.background = `linear-gradient(to right, hsl(43,65%,54%) 100%, hsl(230,10%,20%) 100%)`;

const GOAL_MAX = 40000;
const RAISED = 847;
const milestones = [
  { amount: 5000, label: 'Meta minima', desc: 'Tasa Steam, localizacion ingles, QA/testing y trailer de lanzamiento.' },
  { amount: 10000, label: 'Doblaje', desc: 'Actores de voz para cutscenes y videos promocionales.' },
  { amount: 25000, label: 'Nintendo Switch', desc: 'Porteo a Nintendo Switch (cuenta dev + programacion).' },
  { amount: 40000, label: 'Capitulo extra', desc: '2.º final jugable, 30 min post-creditos y port a PlayStation.' },
];

let currentRaised = RAISED;

const barTrack = document.getElementById('bar-track');
const barFill = document.getElementById('bar-fill');
const barHandle = document.getElementById('bar-handle');
const labelsTop = document.getElementById('labels-top');
const labelsBot = document.getElementById('labels-bot');
const msGrid = document.getElementById('milestone-grid');

milestones.forEach(m => {
  const pos = (m.amount / GOAL_MAX) * 100;

  const top = document.createElement('span');
  top.textContent = m.amount >= 1000 ? `${m.amount / 1000}K€` : `${m.amount}€`;
  top.style.left = pos + '%';
  top.id = `label-top-${m.amount}`;
  labelsTop.appendChild(top);

  const bot = document.createElement('span');
  bot.textContent = m.label;
  bot.style.left = pos + '%';
  bot.id = `label-bot-${m.amount}`;
  labelsBot.appendChild(bot);

  const tick = document.createElement('div');
  tick.className = 'bar-tick';
  tick.style.left = pos + '%';
  tick.id = `tick-${m.amount}`;
  barTrack.appendChild(tick);

  const card = document.createElement('div');
  card.className = 'milestone-card';
  card.id = `mcard-${m.amount}`;
  card.innerHTML = `
      <div class="milestone-card-top">
        <span class="amount">${m.amount.toLocaleString('es-ES')}€</span>
        <svg class="lock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        <svg class="unlock-icon" style="display:none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>
      </div>
      <h3>${m.label}</h3>
      <p>${m.desc}</p>`;
  msGrid.appendChild(card);
});

function updateBar(raised) {
  const pct = Math.min((raised / GOAL_MAX) * 100, 100);
  barFill.style.width = pct + '%';
  barHandle.style.left = pct + '%';

  // actualiza el contador de euros recaudados en tiempo real
  document.getElementById('badge-raised').textContent =
    Math.round(raised).toLocaleString('es-ES') + '€';

  milestones.forEach(m => {
    const unlocked = raised >= m.amount;
    const gold = 'hsl(43,65%,54%)';
    const dim = 'rgba(125,134,168,0.5)';

    document.getElementById(`label-top-${m.amount}`).style.color = unlocked ? gold : dim;
    document.getElementById(`label-bot-${m.amount}`).style.color = unlocked ? 'rgba(237,232,214,0.6)' : 'rgba(125,134,168,0.35)';
    document.getElementById(`tick-${m.amount}`).style.background = unlocked ? gold : 'var(--border)';

    const card = document.getElementById(`mcard-${m.amount}`);
    card.classList.toggle('unlocked', unlocked);
    card.querySelector('.lock-icon').style.display = unlocked ? 'none' : 'block';
    card.querySelector('.unlock-icon').style.display = unlocked ? 'block' : 'none';
  });
}

function getValueFromX(clientX) {
  const rect = barTrack.getBoundingClientRect();
  const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  return Math.round(ratio * GOAL_MAX);
}

barTrack.addEventListener('mousedown', (e) => {
  e.preventDefault();
  currentRaised = getValueFromX(e.clientX);
  updateBar(currentRaised);
  const onMove = (ev) => { currentRaised = getValueFromX(ev.clientX); updateBar(currentRaised); };
  const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);
});
barTrack.addEventListener('touchstart', (e) => {
  currentRaised = getValueFromX(e.touches[0].clientX);
  updateBar(currentRaised);
  const onMove = (ev) => { currentRaised = getValueFromX(ev.touches[0].clientX); updateBar(currentRaised); };
  const onEnd = () => { window.removeEventListener('touchmove', onMove); window.removeEventListener('touchend', onEnd); };
  window.addEventListener('touchmove', onMove);
  window.addEventListener('touchend', onEnd);
});

updateBar(RAISED);

/*FAQ*/
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

/*COMENTARIOS*/
function submitComment() {
  const nombre = document.getElementById('c-nombre').value.trim();
  const msg = document.getElementById('c-mensaje').value.trim();
  const pts = parseInt(document.getElementById('c-puntos').value);
  if (!nombre || !msg) return;

  const stars = '★'.repeat(pts) + '☆'.repeat(5 - pts);
  const card = document.createElement('div');
  card.className = 'comment-card';
  card.innerHTML = `
      <div class="comment-card-top">
        <span class="name">${escHtml(nombre)}</span>
        <span class="stars">${stars}</span>
      </div>
      <blockquote>"${escHtml(msg)}"</blockquote>`;
  document.getElementById('comments-list').prepend(card);

  document.getElementById('c-nombre').value = '';
  document.getElementById('c-mensaje').value = '';
  document.getElementById('c-puntos').value = '5';
}
function escHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/*SCROLL QUE REBELA*/
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
