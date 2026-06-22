<!DOCTYPE html>
<html lang="ja" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  <title>らくらく歌詞</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@300;400;500;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="./style.css" />
</head>
<body>

  <!-- ─── HEADER ─── -->
  <header class="app-header">
    <div class="header-left">
      <div class="logo-mark">❤︎</div>
      <div class="header-titles">
        <h1 class="app-title">らくらく歌詞</h1>
        <p class="app-subtitle">歌詞の本</p>
      </div>
    </div>
    <nav class="header-controls">
      <button class="icon-btn theme-toggle" aria-label="テーマ切替">
        <svg class="ico ico-sun" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
          <circle cx="10" cy="10" r="3.5"/>
          <line x1="10" y1="1.5" x2="10" y2="3.5"/>
          <line x1="10" y1="16.5" x2="10" y2="18.5"/>
          <line x1="1.5" y1="10" x2="3.5" y2="10"/>
          <line x1="16.5" y1="10" x2="18.5" y2="10"/>
          <line x1="3.9" y1="3.9" x2="5.3" y2="5.3"/>
          <line x1="14.7" y1="14.7" x2="16.1" y2="16.1"/>
          <line x1="3.9" y1="16.1" x2="5.3" y2="14.7"/>
          <line x1="14.7" y1="5.3" x2="16.1" y2="3.9"/>
        </svg>
        <svg class="ico ico-moon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16.5 11.5A7 7 0 0 1 8.5 3.5a7 7 0 1 0 8 8z"/>
        </svg>
      </button>
    </nav>
  </header>

  <!-- ─── SONGS TAB VIEW ─── -->
  <div id="songsView">
    <div class="search-wrap">
      <div class="search-bar">
        <svg class="search-ico" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
          <circle cx="9" cy="9" r="5.5"/>
          <line x1="13.5" y1="13.5" x2="17" y2="17"/>
        </svg>
        <input type="search" id="searchInput" placeholder="曲名・歌詞を検索…" autocomplete="off" />
        <span class="entry-count" id="entryCount">0 曲</span>
      </div>
    </div>

    <main class="lyric-list" id="lyricGrid">
      <div class="empty-state" id="emptyState">
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" class="empty-svg">
          <rect x="8" y="6" width="32" height="36" rx="3"/>
          <line x1="14" y1="16" x2="34" y2="16"/>
          <line x1="14" y1="22" x2="34" y2="22"/>
          <line x1="14" y1="28" x2="26" y2="28"/>
        </svg>
        <p class="empty-title">まだ歌詞がありません</p>
        <p class="empty-sub">右下の ＋ から最初の一曲を追加しよう</p>
      </div>
    </main>
  </div>

  <!-- ─── DATA TAB VIEW ─── -->
  <div id="dataView" style="display:none">
    <div class="data-view">

      <!-- Stats -->
      <div class="data-section">
        <p class="data-section-title">概要</p>
        <div id="dataStats">
          <div class="stat-row">
            <span class="stat-label">保存曲数</span>
            <span class="stat-val">0 曲</span>
          </div>
        </div>
      </div>

      <!-- Export -->
      <div class="data-section">
        <p class="data-section-title">エクスポート</p>
        <div class="data-action-row">
          <span class="data-action-label">CSVファイルとして書き出す</span>
          <span class="data-action-desc">すべての歌詞データを .csv ファイルに書き出します。スプレッドシートアプリで開いたり、バックアップとして保存できます。</span>
          <button class="data-action-btn data-action-btn--export" id="exportCsvBtn">ダウンロード</button>
        </div>
      </div>

      <!-- Import -->
      <div class="data-section">
        <p class="data-section-title">インポート</p>
        <div class="data-action-row">
          <span class="data-action-label">CSVを追加読み込み</span>
          <span class="data-action-desc">既存データを残したまま、CSVのデータを追加します。同じ ID の行はスキップされます。</span>
          <button class="data-action-btn data-action-btn--import" id="importMergeBtn">CSVを選択</button>
          <input type="file" id="importMergeInput" accept=".csv,text/csv" style="display:none" />
        </div>
        <div class="data-action-row">
          <span class="data-action-label">CSVで全て置き換える</span>
          <span class="data-action-desc">現在のデータをすべて削除し、CSVの内容に置き換えます。元に戻せません。</span>
          <button class="data-action-btn data-action-btn--danger" id="importReplaceBtn">置き換えて読み込む</button>
          <input type="file" id="importReplaceInput" accept=".csv,text/csv" style="display:none" />
        </div>
      </div>

      <!-- CSV format reference -->
      <div class="data-section">
        <p class="data-section-title">CSVフォーマット</p>
        <div class="csv-note">
          <p class="csv-note-title">1行目はヘッダー行として認識されます</p>
          <pre class="csv-note-code">id, title, artist, date, lyrics, createdAt, updatedAt</pre>
          <p class="data-action-desc" style="margin-top:6px">
            必須列は <strong>title</strong> のみです。<br>
            歌詞など改行を含む列はダブルクォート（"）で囲んでください。<br>
            エクスポートしたCSVをそのまま読み込めます。
          </p>
        </div>
      </div>

    </div>
  </div>

  <!-- ─── FAB ─── -->
  <button class="fab" id="openAddModal" aria-label="追加">
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <line x1="10" y1="3" x2="10" y2="17"/>
      <line x1="3" y1="10" x2="17" y2="10"/>
    </svg>
  </button>

  <!-- ─── TAB BAR ─── -->
  <nav class="tab-bar">
    <button class="tab-item active" id="tabSongs" aria-label="曲一覧">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
        <rect x="4" y="3" width="16" height="18" rx="2"/>
        <line x1="8" y1="9" x2="16" y2="9"/>
        <line x1="8" y1="13" x2="16" y2="13"/>
        <line x1="8" y1="17" x2="12" y2="17"/>
      </svg>
      曲一覧
    </button>
    <button class="tab-item" id="tabData" aria-label="データ">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
        <ellipse cx="12" cy="6" rx="8" ry="3"/>
        <path d="M4 6v4c0 1.66 3.58 3 8 3s8-1.34 8-3V6"/>
        <path d="M4 10v4c0 1.66 3.58 3 8 3s8-1.34 8-3v-4"/>
      </svg>
      データ
    </button>
  </nav>

  <!-- ─── FORM SHEET ─── -->
  <div class="sheet-overlay" id="formModal" role="dialog" aria-modal="true">
    <div class="bottom-sheet" id="formSheet">
      <div class="sheet-handle"></div>
      <div class="sheet-header">
        <h2 class="sheet-title" id="modalTitle">歌詞を追加</h2>
        <button class="icon-btn sheet-close" id="closeFormModal" aria-label="閉じる">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
            <line x1="5" y1="5" x2="15" y2="15"/>
            <line x1="15" y1="5" x2="5" y2="15"/>
          </svg>
        </button>
      </div>
      <div class="sheet-body">
        <input type="hidden" id="entryId" />
        <div class="field-group">
          <label class="field-label" for="entryTitle">曲名 <span class="req">*</span></label>
          <input class="field-input" type="text" id="entryTitle" placeholder="例：さよなら" />
        </div>
        <div class="field-group">
          <label class="field-label" for="entryArtist">アーティスト</label>
          <input class="field-input" type="text" id="entryArtist" placeholder="例：椎名林檎" />
        </div>
        <div class="field-group">
          <label class="field-label" for="entryDate">日付</label>
          <input class="field-input" type="date" id="entryDate" />
        </div>
        <div class="field-group">
          <label class="field-label" for="entryLyrics">歌詞</label>
          <textarea class="field-textarea" id="entryLyrics" placeholder="ここに歌詞を貼り付けてください…"></textarea>
        </div>
      </div>
      <div class="sheet-footer">
        <button class="btn btn--ghost" id="cancelFormBtn">キャンセル</button>
        <button class="btn btn--primary" id="saveEntryBtn">保存する</button>
      </div>
    </div>
  </div>

  <!-- ─── VIEW SHEET ─── -->
  <div class="sheet-overlay" id="viewModal" role="dialog" aria-modal="true">
    <div class="bottom-sheet bottom-sheet--view" id="viewSheet">
      <div class="sheet-handle"></div>
      <div class="sheet-header">
        <div class="view-header-info">
          <h2 class="view-title" id="viewTitle"></h2>
          <p class="view-meta" id="viewMeta"></p>
        </div>
        <div class="view-hdr-actions">
          <button class="icon-btn" id="editFromView" aria-label="編集">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 3l3 3L7 16H4v-3L14 3z"/>
            </svg>
          </button>
          <button class="icon-btn icon-btn--danger" id="deleteFromView" aria-label="削除">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="5" x2="17" y2="5"/>
              <path d="M8 5V3h4v2"/>
              <path d="M5 5l1 12a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-12"/>
              <line x1="8" y1="9" x2="8" y2="14"/>
              <line x1="12" y1="9" x2="12" y2="14"/>
            </svg>
          </button>
          <button class="icon-btn sheet-close" id="closeViewModal" aria-label="閉じる">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
              <line x1="5" y1="5" x2="15" y2="15"/>
              <line x1="15" y1="5" x2="5" y2="15"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="sheet-body">
        <pre class="view-lyrics" id="viewLyrics"></pre>
      </div>
    </div>
  </div>

  <!-- ─── CONFIRM SHEET ─── -->
  <div class="sheet-overlay" id="confirmModal" role="dialog" aria-modal="true">
    <div class="bottom-sheet bottom-sheet--confirm">
      <div class="sheet-handle"></div>
      <div class="confirm-body">
        <p class="confirm-title">確認</p>
        <p class="confirm-sub" id="confirmSub"></p>
        <button class="btn btn--danger btn--full" id="confirmDeleteBtn">実行する</button>
        <button class="btn btn--ghost btn--full" id="cancelDeleteBtn">キャンセル</button>
      </div>
    </div>
  </div>

  <!-- ─── TOAST ─── -->
  <div class="toast" id="toast"></div>

  <script src="./app.js"></script>
</body>
</html>
