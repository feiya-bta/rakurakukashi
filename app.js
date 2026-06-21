/* =============================================
   詩集 · app.js
   ============================================= */
'use strict';

const STORAGE_KEY = 'shishu_lyricbook_v1';
const THEME_KEY   = 'shishu_theme';
const LANG_KEY    = 'shishu_lang';

/* ─── STORAGE ─── */
const loadEntries = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; } };
const saveEntries = (e) => localStorage.setItem(STORAGE_KEY, JSON.stringify(e));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

/* ─── STATE ─── */
let entries       = loadEntries();
let editingId     = null;
let viewingId     = null;
let pendingDelId  = null;

/* ─── REFS ─── */
const $ = (id) => document.getElementById(id);
const html         = document.documentElement;
const lyricGrid    = $('lyricGrid');
const emptyState   = $('emptyState');
const entryCountEl = $('entryCount');
const searchInput  = $('searchInput');

const formModal    = $('formModal');
const viewModal    = $('viewModal');
const confirmModal = $('confirmModal');

/* ─── THEME ─── */
const applyTheme = (t) => { html.setAttribute('data-theme', t); localStorage.setItem(THEME_KEY, t); };
applyTheme(localStorage.getItem(THEME_KEY) || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
document.querySelector('.theme-toggle').addEventListener('click', () =>
  applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));

/* ─── LANGUAGE ─── */
const applyLang = (l) => {
  html.setAttribute('data-lang', l);
  localStorage.setItem(LANG_KEY, l);
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === l));
};
applyLang(localStorage.getItem(LANG_KEY) || 'ja');
document.querySelectorAll('.lang-btn').forEach(b => b.addEventListener('click', () => applyLang(b.dataset.lang)));

/* ─── TOAST ─── */
const toast = $('toast');
let toastT;
const showToast = (msg) => {
  toast.textContent = msg;
  toast.classList.add('visible');
  clearTimeout(toastT);
  toastT = setTimeout(() => toast.classList.remove('visible'), 2200);
};

/* ─── DATE ─── */
const todayISO  = () => new Date().toISOString().slice(0, 10);
const fmtDate   = (iso) => iso ? new Date(iso + 'T00:00:00').toLocaleDateString('ja-JP', { year:'numeric', month:'long', day:'numeric' }) : '';

/* ─── ESCAPE ─── */
const esc = (s) => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

/* ─── RENDER ─── */
function renderGrid(list) {
  lyricGrid.querySelectorAll('.lyric-card').forEach(el => el.remove());
  const show = list ?? entries;
  entryCountEl.textContent = `${entries.length} 曲`;
  emptyState.style.display = show.length === 0 ? 'flex' : 'none';

  [...show].sort((a, b) => b.createdAt - a.createdAt).forEach((entry, i) => {
    const card = document.createElement('article');
    card.className = 'lyric-card';
    card.dataset.id = entry.id;
    card.style.animationDelay = `${i * 35}ms`;

    const preview = (entry.lyrics || '').trim().slice(0, 120);

    card.innerHTML = `
      <div class="card-spine"></div>
      <div class="card-ruled"></div>
      <div class="card-inner">
        <p class="card-title">${esc(entry.title)}</p>
        ${entry.artist ? `<p class="card-artist">${esc(entry.artist)}</p>` : ''}
        ${preview ? `<p class="card-preview">${esc(preview)}</p>` : ''}
        ${entry.date ? `<p class="card-date">${fmtDate(entry.date)}</p>` : ''}
      </div>
      <div class="card-actions">
        <button class="card-act" data-action="edit" aria-label="編集">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 3l3 3L7 16H4v-3L14 3z"/>
          </svg>
        </button>
        <button class="card-act danger" data-action="delete" aria-label="削除">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="5" x2="17" y2="5"/>
            <path d="M8 5V3h4v2"/>
            <path d="M5 5l1 12a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-12"/>
          </svg>
        </button>
      </div>`;

    card.addEventListener('click', (e) => {
      if (e.target.closest('.card-act')) return;
      openViewSheet(entry.id);
    });
    card.querySelector('[data-action="edit"]').addEventListener('click', (e) => { e.stopPropagation(); openFormSheet('edit', entry.id); });
    card.querySelector('[data-action="delete"]').addEventListener('click', (e) => { e.stopPropagation(); openConfirm(entry.id, entry.title); });

    lyricGrid.appendChild(card);
  });
}

/* ─── SEARCH ─── */
searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) { renderGrid(); return; }
  renderGrid(entries.filter(e =>
    e.title.toLowerCase().includes(q) ||
    (e.artist && e.artist.toLowerCase().includes(q)) ||
    (e.lyrics && e.lyrics.toLowerCase().includes(q))
  ));
});

/* ─── SHEET HELPERS ─── */
const openSheet  = (el) => { el.classList.add('open'); document.body.style.overflow = 'hidden'; };
const closeSheet = (el) => { el.classList.remove('open'); document.body.style.overflow = ''; };

// Close sheet when tapping the dark backdrop (but not the sheet itself)
[formModal, viewModal, confirmModal].forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeSheet(overlay);
  });
});

/* ─── FORM SHEET ─── */
const fTitle  = $('entryTitle');
const fArtist = $('entryArtist');
const fDate   = $('entryDate');
const fLyrics = $('entryLyrics');

function openFormSheet(mode = 'add', id = null) {
  editingId = id;
  $('modalTitle').textContent = mode === 'edit' ? '歌詞を編集' : '歌詞を追加';

  if (mode === 'edit' && id) {
    const e = entries.find(x => x.id === id);
    if (!e) return;
    $('entryId').value = e.id;
    fTitle.value  = e.title;
    fArtist.value = e.artist  || '';
    fDate.value   = e.date    || '';
    fLyrics.value = e.lyrics  || '';
  } else {
    $('entryId').value = '';
    fTitle.value  = '';
    fArtist.value = '';
    fDate.value   = todayISO();
    fLyrics.value = '';
  }
  openSheet(formModal);
  setTimeout(() => fTitle.focus(), 380);
}

const closeFormSheet = () => { closeSheet(formModal); editingId = null; };

$('openAddModal').addEventListener('click',   () => openFormSheet('add'));
$('closeFormModal').addEventListener('click', closeFormSheet);
$('cancelFormBtn').addEventListener('click',  closeFormSheet);

$('saveEntryBtn').addEventListener('click', () => {
  const title  = fTitle.value.trim();
  const artist = fArtist.value.trim();
  const date   = fDate.value;
  const lyrics = fLyrics.value;

  if (!title) {
    fTitle.focus();
    fTitle.style.borderColor = 'var(--accent)';
    setTimeout(() => fTitle.style.borderColor = '', 1200);
    showToast('⚠ 曲名を入力してください');
    return;
  }

  if (editingId) {
    const idx = entries.findIndex(e => e.id === editingId);
    if (idx !== -1) { entries[idx] = { ...entries[idx], title, artist, date, lyrics, updatedAt: Date.now() }; }
    showToast('更新しました');
  } else {
    entries.unshift({ id: uid(), title, artist, date, lyrics, createdAt: Date.now(), updatedAt: Date.now() });
    showToast('追加しました');
  }

  saveEntries(entries);
  closeFormSheet();
  const q = searchInput.value.trim().toLowerCase();
  renderGrid(q ? entries.filter(e =>
    e.title.toLowerCase().includes(q) ||
    (e.artist && e.artist.toLowerCase().includes(q)) ||
    (e.lyrics && e.lyrics.toLowerCase().includes(q))
  ) : undefined);
});

/* Tab key inside textarea */
fLyrics.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    e.preventDefault();
    const s = fLyrics.selectionStart;
    fLyrics.value = fLyrics.value.slice(0, s) + '  ' + fLyrics.value.slice(fLyrics.selectionEnd);
    fLyrics.selectionStart = fLyrics.selectionEnd = s + 2;
  }
});

/* ─── VIEW SHEET ─── */
function openViewSheet(id) {
  const e = entries.find(x => x.id === id);
  if (!e) return;
  viewingId = id;
  $('viewTitle').textContent = e.title;
  const parts = [];
  if (e.artist) parts.push(e.artist);
  if (e.date)   parts.push(fmtDate(e.date));
  $('viewMeta').textContent = parts.join(' · ');
  $('viewLyrics').textContent = e.lyrics || '';
  openSheet(viewModal);
}

const closeViewSheet = () => { closeSheet(viewModal); viewingId = null; };

$('closeViewModal').addEventListener('click', closeViewSheet);
$('editFromView').addEventListener('click', () => {
  const id = viewingId;
  closeViewSheet();
  openFormSheet('edit', id);
});
$('deleteFromView').addEventListener('click', () => {
  const e = entries.find(x => x.id === viewingId);
  closeViewSheet();
  if (e) openConfirm(e.id, e.title);
});

/* ─── CONFIRM SHEET ─── */
function openConfirm(id, title) {
  pendingDelId = id;
  $('confirmSub').textContent = `「${title}」を削除します。この操作は元に戻せません。`;
  openSheet(confirmModal);
}

$('cancelDeleteBtn').addEventListener('click',  () => { closeSheet(confirmModal); pendingDelId = null; });
$('confirmDeleteBtn').addEventListener('click', () => {
  if (!pendingDelId) return;
  entries = entries.filter(e => e.id !== pendingDelId);
  saveEntries(entries);
  closeSheet(confirmModal);
  pendingDelId = null;
  renderGrid();
  showToast('削除しました');
});

/* ─── KEYBOARD ─── */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (confirmModal.classList.contains('open')) { closeSheet(confirmModal); pendingDelId = null; }
    else if (formModal.classList.contains('open')) closeFormSheet();
    else if (viewModal.classList.contains('open')) closeViewSheet();
  }
  if ((e.metaKey || e.ctrlKey) && e.key === 'n') { e.preventDefault(); openFormSheet('add'); }
  if ((e.metaKey || e.ctrlKey) && e.key === 's' && formModal.classList.contains('open')) {
    e.preventDefault(); $('saveEntryBtn').click();
  }
});

/* ─── INIT ─── */
renderGrid();
