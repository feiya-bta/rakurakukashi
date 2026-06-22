/* =============================================
   詩集 · app.js
   ============================================= */
'use strict';

const STORAGE_KEY = 'shishu_lyricbook_v1';
const THEME_KEY   = 'shishu_theme';

/* ─── STORAGE ─── */
const loadEntries = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; } };
const saveEntries = (e) => localStorage.setItem(STORAGE_KEY, JSON.stringify(e));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

/* ─── STATE ─── */
let entries       = loadEntries();
let editingId     = null;
let viewingId     = null;
let pendingDelId  = null;
let activeTab     = 'songs'; // 'songs' | 'data'

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

/* ─── FONT DETECTION ─── */
const hasVietnamese = (s) => /[\u00C0-\u02AF\u1E00-\u1EFF]/.test(s || '');
const fontClass = (s) => hasVietnamese(s) ? ' font-mono' : '';

/* ─── TAB SWITCHING ─── */
function setTab(tab) {
  activeTab = tab;
  const songsView = $('songsView');
  const dataView  = $('dataView');
  const tabSongs  = $('tabSongs');
  const tabData   = $('tabData');
  const fab       = $('openAddModal');

  if (tab === 'songs') {
    songsView.style.display = '';
    dataView.style.display  = 'none';
    tabSongs.classList.add('active');
    tabData.classList.remove('active');
    fab.style.display = '';
  } else {
    songsView.style.display = 'none';
    dataView.style.display  = '';
    tabSongs.classList.remove('active');
    tabData.classList.add('active');
    fab.style.display = 'none';
    renderDataStats();
  }
}

$('tabSongs').addEventListener('click', () => setTab('songs'));
$('tabData').addEventListener('click',  () => setTab('data'));

/* ─── RENDER GRID ─── */
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
        <p class="card-title${fontClass(entry.title)}">${esc(entry.title)}</p>
        ${entry.artist ? `<p class="card-artist${fontClass(entry.artist)}">${esc(entry.artist)}</p>` : ''}
        ${preview ? `<p class="card-preview${fontClass(preview)}">${esc(preview)}</p>` : ''}
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

  const titleEl = $('viewTitle');
  titleEl.textContent = e.title;
  titleEl.classList.toggle('font-mono', hasVietnamese(e.title));

  const metaEl = $('viewMeta');
  metaEl.innerHTML = '';
  if (e.artist) {
    const artistSpan = document.createElement('span');
    artistSpan.textContent = e.artist;
    artistSpan.classList.toggle('font-mono', hasVietnamese(e.artist));
    metaEl.appendChild(artistSpan);
  }
  if (e.date) {
    if (e.artist) metaEl.appendChild(document.createTextNode(' · '));
    metaEl.appendChild(document.createTextNode(fmtDate(e.date)));
  }

  const lyricsEl = $('viewLyrics');
  lyricsEl.textContent = e.lyrics || '';
  lyricsEl.classList.toggle('font-mono', hasVietnamese(e.lyrics || ''));
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

/* ─── CSV HELPERS ─── */

/**
 * Escape a single CSV cell value.
 * Wraps in double-quotes if the value contains commas, quotes, or newlines.
 */
function csvEscape(val) {
  const s = String(val ?? '');
  if (s.includes('"') || s.includes(',') || s.includes('\n') || s.includes('\r')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

/**
 * Parse a CSV string into an array of row arrays.
 * Handles quoted fields containing commas and newlines.
 */
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  let i = 0;

  // Normalise line endings
  const src = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  while (i < src.length) {
    const ch = src[i];

    if (inQuotes) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          // Escaped quote inside quoted field
          field += '"';
          i += 2;
          continue;
        } else {
          inQuotes = false;
          i++;
          continue;
        }
      }
      field += ch;
      i++;
    } else {
      if (ch === '"') {
        inQuotes = true;
        i++;
      } else if (ch === ',') {
        row.push(field);
        field = '';
        i++;
      } else if (ch === '\n') {
        row.push(field);
        field = '';
        rows.push(row);
        row = [];
        i++;
      } else {
        field += ch;
        i++;
      }
    }
  }

  // Flush last field / row
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

/* ─── EXPORT CSV ─── */
function exportCSV() {
  if (entries.length === 0) {
    showToast('エクスポートするデータがありません');
    return;
  }

  const headers = ['id', 'title', 'artist', 'date', 'lyrics', 'createdAt', 'updatedAt'];
  const lines = [
    headers.join(','),
    ...entries.map(e =>
      headers.map(h => csvEscape(e[h] ?? '')).join(',')
    )
  ];

  const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  const date = new Date().toISOString().slice(0, 10);
  a.href     = url;
  a.download = `shishu_${date}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast(`${entries.length} 曲をエクスポートしました`);
}

/* ─── IMPORT CSV ─── */
function importCSV(file, mode) {
  // mode: 'merge' = add new, skip duplicates by id | 'replace' = overwrite all
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const rows = parseCSV(ev.target.result);
      if (rows.length < 2) { showToast('⚠ データが見つかりません'); return; }

      const headers = rows[0].map(h => h.trim().toLowerCase());
      const idxOf   = (key) => headers.indexOf(key);

      const iId        = idxOf('id');
      const iTitle     = idxOf('title');
      const iArtist    = idxOf('artist');
      const iDate      = idxOf('date');
      const iLyrics    = idxOf('lyrics');
      const iCreated   = idxOf('createdat');
      const iUpdated   = idxOf('updatedat');

      if (iTitle === -1) { showToast('⚠ "title" 列が見つかりません'); return; }

      const imported = rows.slice(1)
        .filter(r => r.some(cell => cell.trim()))   // skip blank rows
        .map(r => ({
          id:        (iId !== -1 && r[iId]?.trim()) ? r[iId].trim() : uid(),
          title:     r[iTitle]?.trim()   || '（無題）',
          artist:    iArtist  !== -1 ? r[iArtist]?.trim()  || '' : '',
          date:      iDate    !== -1 ? r[iDate]?.trim()    || '' : '',
          lyrics:    iLyrics  !== -1 ? r[iLyrics]          || '' : '',
          createdAt: iCreated !== -1 ? Number(r[iCreated]) || Date.now() : Date.now(),
          updatedAt: iUpdated !== -1 ? Number(r[iUpdated]) || Date.now() : Date.now(),
        }));

      if (imported.length === 0) { showToast('⚠ 有効な行がありません'); return; }

      if (mode === 'replace') {
        entries = imported;
        saveEntries(entries);
        renderGrid();
        renderDataStats();
        showToast(`${imported.length} 曲をインポートしました（置き換え）`);
      } else {
        // merge: skip ids that already exist
        const existingIds = new Set(entries.map(e => e.id));
        const newOnes = imported.filter(e => !existingIds.has(e.id));
        entries = [...newOnes, ...entries];
        saveEntries(entries);
        renderGrid();
        renderDataStats();
        showToast(`${newOnes.length} 曲を追加しました（${imported.length - newOnes.length} 曲はスキップ）`);
      }
    } catch (err) {
      console.error(err);
      showToast('⚠ CSVの読み込みに失敗しました');
    }
  };
  reader.readAsText(file, 'UTF-8');
}

/* ─── DATA TAB ─── */
function renderDataStats() {
  const statsEl = $('dataStats');
  const artists = new Set(entries.map(e => e.artist).filter(Boolean));
  statsEl.innerHTML = `
    <div class="stat-row">
      <span class="stat-label">保存曲数</span>
      <span class="stat-val">${entries.length} 曲</span>
    </div>
    <div class="stat-row">
      <span class="stat-label">アーティスト数</span>
      <span class="stat-val">${artists.size}</span>
    </div>
    <div class="stat-row">
      <span class="stat-label">最終更新</span>
      <span class="stat-val">${entries.length ? fmtDate(new Date(Math.max(...entries.map(e => e.updatedAt))).toISOString().slice(0,10)) : '—'}</span>
    </div>
  `;
}

/* Export button */
$('exportCsvBtn').addEventListener('click', exportCSV);

/* Import — merge */
$('importMergeBtn').addEventListener('click', () => $('importMergeInput').click());
$('importMergeInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) { importCSV(file, 'merge'); e.target.value = ''; }
});

/* Import — replace */
$('importReplaceBtn').addEventListener('click', () => {
  if (entries.length > 0) {
    pendingImportReplace = true;
    $('confirmSub').textContent = '現在のすべてのデータが削除され、CSVの内容に置き換えられます。この操作は元に戻せません。';
    openSheet(confirmModal);
  } else {
    $('importReplaceInput').click();
  }
});

let pendingImportReplace = false;

$('importReplaceInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) { importCSV(file, 'replace'); e.target.value = ''; }
});

/* Override confirm delete to handle import-replace too */
const origConfirmDelete = $('confirmDeleteBtn').onclick;
$('confirmDeleteBtn').addEventListener('click', () => {
  if (pendingImportReplace) {
    pendingImportReplace = false;
    closeSheet(confirmModal);
    $('importReplaceInput').click();
    return;
  }
  if (!pendingDelId) return;
  entries = entries.filter(e => e.id !== pendingDelId);
  saveEntries(entries);
  closeSheet(confirmModal);
  pendingDelId = null;
  renderGrid();
  showToast('削除しました');
});

$('cancelDeleteBtn').addEventListener('click', () => {
  closeSheet(confirmModal);
  pendingDelId = null;
  pendingImportReplace = false;
});

/* ─── KEYBOARD ─── */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (confirmModal.classList.contains('open')) { closeSheet(confirmModal); pendingDelId = null; pendingImportReplace = false; }
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
