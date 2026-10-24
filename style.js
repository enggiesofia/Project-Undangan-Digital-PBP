const CONFIG = {
    names: 'Rasya & Sofia',
    date: '2027-01-24T08:00:00+07:00',
    hours: 6,
    place: 'Hotel The Langham, District 8, SCBD, Jakarta Selatan',
};

document.documentElement.classList.add('js');
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

const when = new Date(CONFIG.date);
const longDate = when.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
});
$$('[data-names]').forEach(e => e.textContent = CONFIG.names);
$$('[data-date-long]').forEach(e => e.textContent = longDate);
document.title = 'Undangan Pernikahan ' + CONFIG.names;

const guest = new URLSearchParams(location.search).get('to');
if (guest) {
    $('#guestName').textContent = guest;
    $('#nama').value = guest;
}

const bgm = $('#bgm'), musicBtn = $('#musicBtn');

$('#openBtn').addEventListener('click', () => {
    $('#cover').classList.add('hide');
    document.body.classList.remove('locked');
    $('#main').classList.remove('d-none');
    $('#bottomNav').classList.add('show');
    musicBtn.classList.add('show');
    window.scrollTo(0, 0);
    bgm.play().then(() => musicBtn.classList.add('playing')).catch(() => {});
    initReveal();
});

musicBtn.addEventListener('click', () => {
    if (bgm.paused) {
    bgm.play().catch(() => {});
    musicBtn.classList.add('playing');
} else {
    bgm.pause();
    musicBtn.classList.remove('playing');
}
});

function initReveal() {
    if (!('IntersectionObserver' in window)) {
    $$('.reveal').forEach(e => e.classList.add('visible'));
    return;
}

const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) {
    e.target.classList.add('visible');
    io.unobserve(e.target);
    }
}), { threshold: 0.12 });

$$('.reveal').forEach(e => io.observe(e));
}


function tick() {
const diff = when - new Date();

if (diff <= 0) {
    $('#countdown').innerHTML = '<p class="fs-5 mb-0">Hari bahagia telah tiba</p>';
    return;
}

const t = Math.floor(diff / 1000);
$('#d').textContent = Math.floor(t / 86400);
$('#h').textContent = Math.floor(t % 86400 / 3600);
$('#m').textContent = Math.floor(t % 3600 / 60);
$('#s').textContent = t % 60;
}

tick();
setInterval(tick, 1000);

(function () {
const f = d => d.toISOString().replace(/[-:]|\.\d{3}/g, '');
  const end = new Date(when.getTime() + CONFIG.hours * 36e5);

$('#calBtn').href = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
    + '&text=' + encodeURIComponent('Pernikahan ' + CONFIG.names)
    + '&dates=' + f(when) + '/' + f(end)
    + '&location=' + encodeURIComponent(CONFIG.place);
})();

$$('[data-copy]').forEach(b => b.addEventListener('click', async () => {
const text = $('#' + b.dataset.copy).textContent.trim();

try {
    await navigator.clipboard.writeText(text);
} catch {
    const t = document.createElement('textarea');
    t.value = text;
    document.body.appendChild(t);
    t.select();
    document.execCommand('copy');
    t.remove();
}

const old = b.innerHTML;
b.innerHTML = '<i class="bi bi-check2 me-1"></i>Tersalin';
setTimeout(() => b.innerHTML = old, 1500);
}));


const KEY = 'wishes_rasya_sofia';

const esc = s => s.replace(/[&<>"']/g, c => ({
'&': '&amp;',
'<': '&lt;',
'>': '&gt;',
'"': '&quot;',
"'": '&#39;',
}[c]));

const load = () => {
try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
} catch {
    return [];
}
};

function render() {
const list = load();

$('#wishes').innerHTML = list.length
    ? list.slice().reverse().map(w => `
        <div class="wish">
        <div class="d-flex justify-content-between">
        <strong>${esc(w.nama)}</strong>
        <span class="badge ${w.hadir === 'Hadir' ? 'bg-success' : w.hadir === 'Tidak Hadir' ? 'bg-secondary' : 'bg-warning text-dark'}">${esc(w.hadir)}</span>
        </div>
        <p class="small mb-1">${esc(w.pesan)}</p>
        <small class="text-muted">${esc(w.waktu)}</small>
        </div>`).join('')
    : '<p class="text-center text-muted small">Belum ada ucapan. Jadilah yang pertama.</p>';
}

$('#rsvp').addEventListener('submit', e => {
e.preventDefault();

const nama = $('#nama').value.trim(),
        hadir = $('#hadir').value,
        pesan = $('#pesan').value.trim();

if (!nama || !hadir || !pesan) {
    alert('Mohon lengkapi nama, kehadiran, dan ucapan.');
    return;
}

const list = load();
list.push({
    nama,
    hadir,
    pesan,
    waktu: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
});

try {
    localStorage.setItem(KEY, JSON.stringify(list));
} catch {}

$('#pesan').value = '';
render();
});

render();

$$('#gallery img').forEach(img => img.addEventListener('click', () => {
const o = document.createElement('div');
o.style.cssText = 'position:fixed;inset:0;background:rgba(10,15,30,.92);z-index:3000;display:flex;align-items:center;justify-content:center;padding:16px;cursor:zoom-out';

const b = document.createElement('img');
b.src = img.src.replace('/500/625', '/1000/1250');
b.style.cssText = 'max-width:100%;max-height:100%;border-radius:10px';

o.appendChild(b);
o.onclick = () => o.remove();
document.body.appendChild(o);
}));