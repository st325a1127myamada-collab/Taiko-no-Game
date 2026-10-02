/**
 * スタンドアローン版 (HTML, CSS, JS の3ファイル) のソースコード定義
 * 白基調デザイン・画面揺れなし・大音符F/J入力対応・高難易度譜面対応
 */

export const STANDALONE_HTML = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>太鼓リズムゲーム</title>
  <!-- スタイルシートの読み込み -->
  <link rel="stylesheet" href="style.css">
  <!-- Google Fontsの読み込み（和風アーケード調フォント） -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Dela+Gothic+One&family=M+PLUS+Rounded+1c:wght@700;800;900&display=swap" rel="stylesheet">
</head>
<body>

  <!-- ゲーム全体コンテナ -->
  <div id="game-container">

    <!-- 画面上部：ヘッダー（タイトル、スコア、コンボ、クリアゲージ） -->
    <header id="game-header">
      <div class="header-top">
        <div class="game-badge">太鼓リズムゲーム</div>
        <div class="song-info" id="song-title-display">夏祭りラプソディ (超達人・BPM 144)</div>
        
        <div class="score-display">
          <div class="score-box">
            <span class="label">スコア</span>
            <span class="value" id="score-text">0000000</span>
          </div>
          <div class="combo-box">
            <span class="label">コンボ</span>
            <span class="value" id="combo-text">0</span>
          </div>
        </div>
      </div>

      <!-- 画面上部：クリアゲージ（70%でノルマ達成クリア） -->
      <div class="gauge-container">
        <span class="gauge-label">魂ゲージ</span>
        <div class="gauge-track">
          <!-- 70% ノルマ達成境界線 -->
          <div class="clear-line" style="left: 70%;"></div>
          <!-- ゲージバー本体 -->
          <div class="gauge-bar" id="gauge-bar" style="width: 0%;"></div>
        </div>
        <span class="gauge-percent" id="gauge-percent">0%</span>
      </div>

      <!-- 楽曲進行プログレスバー -->
      <div class="progress-track">
        <div class="progress-bar" id="progress-bar" style="width: 0%;"></div>
      </div>
    </header>

    <!-- 画面中央：音符が右から左へ流れる太鼓レーン (Canvas描画 & 3秒待機カウントダウン) -->
    <main id="lane-section">
      <canvas id="lane-canvas" width="1000" height="170"></canvas>
      <!-- 3秒カウントダウンオーバーレイ -->
      <div id="countdown-overlay" class="countdown-overlay">
        <div class="countdown-badge" id="countdown-badge">まもなく演奏開始！</div>
        <div class="countdown-number" id="countdown-number">3</div>
        <div class="countdown-sub" id="countdown-sub">Fキー(ドン)・Jキー(カッ)の準備！</div>
      </div>
    </main>

    <!-- 画面下部：太鼓ビジュアライザー & 操作キーガイド -->
    <footer id="control-section">
      <!-- バーチャル太鼓（クリック・タップでも叩けます） -->
      <div id="drum-visualizer">
        <!-- 太鼓のフチ（青色・カッ） -->
        <div class="drum-rim" id="drum-rim" title="太鼓のフチ（J または K）">
          <!-- 太鼓の面（赤色・ドン） -->
          <div class="drum-face" id="drum-face" title="太鼓の面（F または D）">
            <div class="drum-logo">太鼓</div>
          </div>
        </div>
      </div>

      <!-- 操作方法ガイド & 操作ボタン群 (大音符F/J対応) -->
      <div class="keys-container">
        <div class="key-button don-big" id="btn-don-big">
          <kbd>D</kbd>
          <div class="btn-text">ドン（大）</div>
          <div class="btn-sub">大赤音符 (Fでも可)</div>
        </div>

        <div class="key-button don-normal" id="btn-don">
          <kbd>F</kbd>
          <div class="btn-text">ドン</div>
          <div class="btn-sub">赤音符 (大音符もOK)</div>
        </div>

        <div class="key-button ka-normal" id="btn-ka">
          <kbd>J</kbd>
          <div class="btn-text">カッ</div>
          <div class="btn-sub">青音符 (大音符もOK)</div>
        </div>

        <div class="key-button ka-big" id="btn-ka-big">
          <kbd>K</kbd>
          <div class="btn-text">カッ（大）</div>
          <div class="btn-sub">大青音符 (Jでも可)</div>
        </div>
      </div>
    </footer>

    <!-- タイトル画面オーバーレイ (アイコンなし・白基調) -->
    <div id="title-modal" class="modal-overlay active">
      <div class="modal-card">
        <h1 class="title-logo">太鼓リズムゲーム</h1>
        <p class="title-sub">ブラウザで太鼓を叩いてリズムに乗ろう！</p>

        <!-- 操作方法の明記 -->
        <div class="operation-guide">
          <h2>【 操作方法 】</h2>
          <div style="font-size: 11px; color: #b45309; font-weight: bold; margin-bottom: 8px; text-align: center;">
            ★ 大音符も F や J キーでそのまま叩けます！
          </div>
          <ul>
            <li><span class="key-tag key-don">F</span> ： ドン（赤音符 / 大音符もOK）</li>
            <li><span class="key-tag key-ka">J</span> ： カッ（青音符 / 大音符もOK）</li>
            <li><span class="key-tag key-don-big">D</span> ： ドン（大）（またはFキー）</li>
            <li><span class="key-tag key-ka-big">K</span> ： カッ（大）（またはJキー）</li>
          </ul>
        </div>

        <!-- 楽曲選択 -->
        <div class="song-select-box">
          <label for="song-select">演奏曲を選択：</label>
          <select id="song-select">
            <option value="matsuri">夏祭りラプソディ (超達人・超激辛鬼譜面・BPM 144)</option>
            <option value="beginner">初陣の調べ (超上級・激闘乱舞・BPM 138)</option>
            <option value="raijin">雷神乱舞 (極限・神速鬼滅級・BPM 172)</option>
          </select>
        </div>

        <!-- STARTボタン -->
        <button id="start-button" class="action-btn start-btn">
          START
        </button>
      </div>
    </div>

    <!-- 結果（リザルト）画面オーバーレイ -->
    <div id="result-modal" class="modal-overlay">
      <div class="modal-card">
        <!-- クリア / FAILED 判定 -->
        <h1 id="result-status" class="result-title clear">クリア！</h1>
        <p id="result-sub" class="result-subtitle">ノルマ達成おめでとう！</p>

        <!-- 成績表 -->
        <div class="result-stats">
          <div class="stat-row highlight">
            <span>スコア</span>
            <span id="res-score" class="num">0</span>
          </div>
          <div class="stat-row">
            <span>最大コンボ</span>
            <span id="res-max-combo" class="num">0</span>
          </div>
          <div class="stat-grid">
            <div class="stat-cell great">
              <span class="cell-label">良 (100/200点)</span>
              <span id="res-great" class="num">0</span>
            </div>
            <div class="stat-cell good">
              <span class="cell-label">可 (50/100点)</span>
              <span id="res-good" class="num">0</span>
            </div>
            <div class="stat-cell miss">
              <span class="cell-label">不可 (0点)</span>
              <span id="res-miss" class="num">0</span>
            </div>
          </div>
        </div>

        <!-- もう一度遊ぶボタン -->
        <button id="retry-button" class="action-btn retry-btn">
          もう一度遊ぶ
        </button>
      </div>
    </div>

  </div>

  <!-- ゲームロジック用スクリプト -->
  <script src="script.js"></script>
</body>
</html>
`;

export const STANDALONE_CSS = `/* ==========================================================
   太鼓リズムゲーム スタイルシート (style.css)
   白を基調とした爽快な和風アーケードデザイン (画面揺れなし仕様)
   ========================================================== */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: #f1f5f9;
  color: #1e293b;
  font-family: 'M PLUS Rounded 1c', sans-serif;
  overflow-x: hidden;
  user-select: none;
  -webkit-user-select: none;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

#game-container {
  width: 100%;
  max-width: 1040px;
  margin: 0 auto;
  background: #ffffff;
  border: 3px solid #d97706;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08), 0 0 15px rgba(217, 119, 6, 0.2);
  display: flex;
  flex-direction: column;
  position: relative;
}

#game-header {
  background: #ffffff;
  border-bottom: 2px solid #fed7aa;
  padding: 12px 20px;
}

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
}

.game-badge {
  background: linear-gradient(135deg, #dc2626, #f59e0b);
  color: #fff;
  font-family: 'Dela Gothic One', cursive;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 14px;
  letter-spacing: 1px;
  box-shadow: 0 2px 5px rgba(220, 38, 38, 0.3);
}

.song-info {
  font-size: 14px;
  color: #9a3412;
  font-weight: 700;
}

.score-display {
  display: flex;
  align-items: center;
  gap: 24px;
}

.score-box, .combo-box {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.score-box .label, .combo-box .label {
  font-size: 11px;
  color: #64748b;
  font-weight: bold;
}

.score-box .value {
  font-family: 'Dela Gothic One', monospace;
  font-size: 24px;
  color: #dc2626;
  letter-spacing: 1px;
}

.combo-box .value {
  font-family: 'Dela Gothic One', monospace;
  font-size: 24px;
  color: #d97706;
  transition: transform 0.1s;
}

.gauge-container {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.gauge-label {
  font-family: 'Dela Gothic One', sans-serif;
  font-size: 12px;
  color: #9a3412;
  white-space: nowrap;
}

.gauge-track {
  position: relative;
  flex: 1;
  height: 20px;
  background-color: #f1f5f9;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.08);
}

.clear-line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 3px;
  background-color: #d97706;
  z-index: 5;
  box-shadow: 0 0 5px #d97706;
}

.gauge-bar {
  height: 100%;
  border-radius: 10px;
  background: linear-gradient(90deg, #f59e0b, #ef4444, #eab308);
  transition: width 0.12s linear;
}

.gauge-percent {
  font-family: monospace;
  font-weight: bold;
  font-size: 13px;
  color: #334155;
  width: 45px;
  text-align: right;
}

.progress-track {
  width: 100%;
  height: 5px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #f59e0b, #dc2626);
  box-shadow: 0 0 4px rgba(245, 158, 11, 0.6);
  transition: width 0.1s linear;
}

#lane-section {
  position: relative;
  width: 100%;
  background-color: #ffffff;
  border-top: 2px solid #fed7aa;
  border-bottom: 2px solid #fed7aa;
  overflow: hidden;
}

#lane-canvas {
  width: 100%;
  height: 170px;
  display: block;
}

/* 3秒カウントダウン待機演出 */
.countdown-overlay {
  position: absolute;
  inset: 0;
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(2px);
  z-index: 25;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.countdown-overlay.active {
  display: flex;
}

.countdown-badge {
  font-size: 12px;
  font-weight: bold;
  color: #b45309;
  background: #fef3c7;
  border: 1px solid #fcd34d;
  padding: 3px 14px;
  border-radius: 9999px;
  margin-bottom: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.countdown-number {
  font-family: 'Dela Gothic One', sans-serif;
  font-size: 72px;
  font-weight: 900;
  background: linear-gradient(135deg, #dc2626, #d97706, #dc2626);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.1;
  text-shadow: 0 4px 12px rgba(220, 38, 38, 0.2);
  animation: countPulse 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.countdown-sub {
  font-size: 12px;
  color: #475569;
  font-weight: bold;
  margin-top: 4px;
}

@keyframes countPulse {
  0% { transform: scale(0.5); opacity: 0; }
  60% { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(1.0); opacity: 1; }
}

#control-section {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  background: #ffffff;
}

#drum-visualizer {
  position: relative;
  width: 170px;
  height: 170px;
  background: radial-gradient(circle, #92400e, #451a03);
  border: 4px solid #292524;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.drum-rim {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 9px solid #1d4ed8;
  background-color: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.08s ease;
}

.drum-rim.active {
  border-color: #60a5fa;
  background-color: rgba(59, 130, 246, 0.25);
  transform: scale(0.96);
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
}

.drum-face {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: radial-gradient(circle at 40% 40%, #ef4444, #b91c1c);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.08s ease;
  box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.4);
}

.drum-face.active {
  background: radial-gradient(circle at 40% 40%, #f87171, #dc2626);
  transform: scale(0.92);
  box-shadow: 0 0 25px rgba(239, 68, 68, 0.9);
}

.drum-logo {
  font-family: 'Dela Gothic One', cursive;
  color: #ffffff;
  font-size: 17px;
  letter-spacing: 2px;
}

.keys-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  width: 100%;
  max-width: 800px;
}

.key-button {
  background: #ffffff;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.08s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.key-button kbd {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 2px 10px;
  font-family: monospace;
  font-size: 16px;
  font-weight: bold;
  color: #1e293b;
  margin-bottom: 4px;
}

.key-button .btn-text {
  font-family: 'Dela Gothic One', sans-serif;
  font-size: 15px;
}

.key-button .btn-sub {
  font-size: 11px;
  color: #64748b;
  margin-top: 2px;
}

.key-button.don-normal { border-color: #fca5a5; }
.key-button.don-normal .btn-text { color: #dc2626; }
.key-button.don-normal.active, .key-button.don-normal:active {
  background: #fee2e2;
  border-color: #ef4444;
  transform: scale(0.95);
}

.key-button.ka-normal { border-color: #93c5fd; }
.key-button.ka-normal .btn-text { color: #2563eb; }
.key-button.ka-normal.active, .key-button.ka-normal:active {
  background: #dbeafe;
  border-color: #3b82f6;
  transform: scale(0.95);
}

.key-button.don-big { border-color: #fcd34d; }
.key-button.don-big .btn-text { color: #d97706; }
.key-button.don-big.active, .key-button.don-big:active {
  background: #fef3c7;
  border-color: #f59e0b;
  transform: scale(0.95);
}

.key-button.ka-big { border-color: #67e8f9; }
.key-button.ka-big .btn-text { color: #0891b2; }
.key-button.ka-big.active, .key-button.ka-big:active {
  background: #cffafe;
  border-color: #06b6d4;
  transform: scale(0.95);
}

.modal-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease;
  padding: 20px;
}

.modal-overlay.active {
  opacity: 1;
  pointer-events: auto;
}

.modal-card {
  background: #ffffff;
  border: 3px solid #d97706;
  border-radius: 20px;
  padding: 30px 40px;
  width: 100%;
  max-width: 600px;
  text-align: center;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
}

.title-logo {
  font-family: 'Dela Gothic One', cursive;
  font-size: 38px;
  color: #dc2626;
  text-shadow: 0 2px 0 #fee2e2;
  margin-bottom: 6px;
}

.title-sub {
  color: #64748b;
  font-size: 14px;
  margin-bottom: 20px;
}

.operation-guide {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  text-align: left;
}

.operation-guide h2 {
  font-size: 13px;
  color: #b45309;
  margin-bottom: 10px;
  text-align: center;
}

.operation-guide ul {
  list-style: none;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  font-size: 13px;
  color: #334155;
}

.key-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-family: monospace;
  font-weight: bold;
  color: #fff;
  margin-right: 4px;
}
.key-don { background: #dc2626; }
.key-ka { background: #2563eb; }
.key-don-big { background: #d97706; }
.key-ka-big { background: #0891b2; }

.song-select-box {
  margin-bottom: 24px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #334155;
}

.song-select-box select {
  background: #ffffff;
  color: #1e293b;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 14px;
  outline: none;
}

.action-btn {
  font-family: 'Dela Gothic One', sans-serif;
  font-size: 22px;
  padding: 14px 45px;
  border-radius: 35px;
  border: 2px solid #fde047;
  cursor: pointer;
  transition: all 0.2s ease;
  letter-spacing: 2px;
}

.start-btn {
  background: linear-gradient(135deg, #dc2626, #f59e0b);
  color: #fff;
  box-shadow: 0 4px 15px rgba(220, 38, 38, 0.4);
}

.start-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.6);
}

.retry-btn {
  background: linear-gradient(135deg, #2563eb, #06b6d4);
  color: #fff;
  box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4);
}

.retry-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(6, 182, 212, 0.6);
}

.result-title {
  font-family: 'Dela Gothic One', cursive;
  font-size: 46px;
  margin-bottom: 4px;
}

.result-title.clear {
  color: #dc2626;
  text-shadow: 0 2px 0 #fef08a;
}

.result-title.failed {
  color: #64748b;
}

.result-subtitle {
  color: #64748b;
  font-size: 14px;
  margin-bottom: 20px;
}

.result-stats {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 18px;
  margin-bottom: 24px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e2e8f0;
  font-size: 15px;
  color: #334155;
}

.stat-row.highlight .num {
  font-size: 26px;
  color: #dc2626;
}

.stat-row .num {
  font-family: 'Dela Gothic One', monospace;
  font-size: 20px;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 14px;
}

.stat-cell {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-cell .cell-label {
  font-size: 11px;
  font-weight: bold;
}

.stat-cell.great .cell-label { color: #d97706; }
.stat-cell.good .cell-label { color: #2563eb; }
.stat-cell.miss .cell-label { color: #dc2626; }

.stat-cell .num {
  font-family: 'Dela Gothic One', monospace;
  font-size: 20px;
  margin-top: 2px;
}

@media (max-width: 640px) {
  .keys-container {
    grid-template-columns: repeat(2, 1fr);
  }
  .title-logo {
    font-size: 28px;
  }
  .modal-card {
    padding: 20px;
  }
  .operation-guide ul {
    grid-template-columns: 1fr;
  }
}
`;

export const STANDALONE_JS = `/**
 * ==========================================================
 * 太鼓リズムゲーム メインスクリプト (script.js)
 * 白を基調とした爽快デザイン & 画面揺れなし仕様
 * 高難易度譜面 & 大音符F/J入力両対応
 * ==========================================================
 */

const SONGS = {
  matsuri: {
    title: '夏祭りラプソディ (超達人・超激辛鬼譜面・BPM 144)',
    bpm: 144,
    duration: 30000,
    notes: [
      { time: 1800, type: 'don' },
      { time: 1950, type: 'don' },
      { time: 2100, type: 'don' },
      { time: 2350, type: 'ka' },
      { time: 2500, type: 'ka' },
      { time: 2650, type: 'ka' },
      { time: 2900, type: 'don' },
      { time: 3050, type: 'ka' },
      { time: 3200, type: 'don' },
      { time: 3450, type: 'don-big' },
      { time: 3900, type: 'don' },
      { time: 4040, type: 'don' },
      { time: 4180, type: 'ka' },
      { time: 4320, type: 'ka' },
      { time: 4460, type: 'don' },
      { time: 4750, type: 'ka-big' },
      { time: 5200, type: 'don' },
      { time: 5340, type: 'ka' },
      { time: 5480, type: 'don' },
      { time: 5620, type: 'ka' },
      { time: 5760, type: 'don' },
      { time: 5900, type: 'don' },
      { time: 6040, type: 'ka' },
      { time: 6200, type: 'don-big' },
      { time: 6600, type: 'ka' },
      { time: 6740, type: 'don' },
      { time: 6880, type: 'ka' },
      { time: 7020, type: 'don' },
      { time: 7160, type: 'ka' },
      { time: 7300, type: 'ka' },
      { time: 7440, type: 'don' },
      { time: 7650, type: 'ka-big' },
      { time: 8100, type: 'don' },
      { time: 8240, type: 'don' },
      { time: 8380, type: 'don' },
      { time: 8520, type: 'ka' },
      { time: 8660, type: 'ka' },
      { time: 8800, type: 'don' },
      { time: 9050, type: 'don-big' },
      { time: 9400, type: 'ka' },
      { time: 9540, type: 'ka' },
      { time: 9680, type: 'ka' },
      { time: 9820, type: 'don' },
      { time: 9960, type: 'don' },
      { time: 10100, type: 'ka' },
      { time: 10350, type: 'ka-big' },
      { time: 10800, type: 'don' },
      { time: 10940, type: 'don' },
      { time: 11150, type: 'ka' },
      { time: 11290, type: 'ka' },
      { time: 11500, type: 'don' },
      { time: 11640, type: 'ka' },
      { time: 11780, type: 'don' },
      { time: 11950, type: 'don-big' },
      { time: 12400, type: 'don' },
      { time: 12540, type: 'ka' },
      { time: 12680, type: 'don' },
      { time: 12820, type: 'ka' },
      { time: 12960, type: 'don' },
      { time: 13100, type: 'don' },
      { time: 13240, type: 'ka' },
      { time: 13380, type: 'ka' },
      { time: 13600, type: 'ka-big' },
      { time: 14100, type: 'don' },
      { time: 14240, type: 'don' },
      { time: 14380, type: 'don' },
      { time: 14520, type: 'don' },
      { time: 14660, type: 'ka' },
      { time: 14800, type: 'ka' },
      { time: 14940, type: 'ka' },
      { time: 15080, type: 'ka' },
      { time: 15220, type: 'don' },
      { time: 15360, type: 'ka' },
      { time: 15500, type: 'don-big' },
      { time: 15800, type: 'ka-big' },
      { time: 16400, type: 'don' },
      { time: 16540, type: 'don' },
      { time: 16680, type: 'ka' },
      { time: 16820, type: 'don' },
      { time: 16960, type: 'ka' },
      { time: 17100, type: 'don' },
      { time: 17240, type: 'don' },
      { time: 17380, type: 'ka' },
      { time: 17550, type: 'don-big' },
      { time: 18000, type: 'ka' },
      { time: 18140, type: 'ka' },
      { time: 18280, type: 'don' },
      { time: 18420, type: 'ka' },
      { time: 18560, type: 'don' },
      { time: 18700, type: 'ka' },
      { time: 18840, type: 'ka' },
      { time: 18980, type: 'don' },
      { time: 19150, type: 'ka-big' },
      { time: 19600, type: 'don' },
      { time: 19740, type: 'ka' },
      { time: 19880, type: 'don' },
      { time: 20020, type: 'ka' },
      { time: 20160, type: 'don' },
      { time: 20300, type: 'ka' },
      { time: 20440, type: 'don' },
      { time: 20580, type: 'don' },
      { time: 20750, type: 'don-big' },
      { time: 21200, type: 'ka' },
      { time: 21340, type: 'don' },
      { time: 21480, type: 'ka' },
      { time: 21620, type: 'don' },
      { time: 21760, type: 'ka' },
      { time: 21900, type: 'don' },
      { time: 22040, type: 'ka' },
      { time: 22180, type: 'ka' },
      { time: 22350, type: 'ka-big' },
      { time: 22800, type: 'don' },
      { time: 22940, type: 'don' },
      { time: 23080, type: 'don' },
      { time: 23220, type: 'don' },
      { time: 23360, type: 'ka' },
      { time: 23500, type: 'ka' },
      { time: 23640, type: 'ka' },
      { time: 23780, type: 'ka' },
      { time: 23920, type: 'don' },
      { time: 24060, type: 'ka' },
      { time: 24200, type: 'don' },
      { time: 24340, type: 'ka' },
      { time: 24550, type: 'don-big' },
      { time: 25100, type: 'don' },
      { time: 25240, type: 'don' },
      { time: 25380, type: 'ka' },
      { time: 25520, type: 'ka' },
      { time: 25660, type: 'don' },
      { time: 25800, type: 'ka' },
      { time: 25940, type: 'don' },
      { time: 26080, type: 'ka' },
      { time: 26300, type: 'don-big' },
      { time: 26650, type: 'ka-big' },
      { time: 27000, type: 'don-big' },
      { time: 27350, type: 'ka-big' },
      { time: 27700, type: 'don-big' },
      { time: 28100, type: 'don-big' }
    ]
  },
  beginner: {
    title: '初陣の調べ (超上級・激闘乱舞・BPM 138)',
    bpm: 138,
    duration: 19500,
    notes: [
      { time: 1700, type: 'don' },
      { time: 1850, type: 'don' },
      { time: 2000, type: 'don' },
      { time: 2250, type: 'ka' },
      { time: 2400, type: 'ka' },
      { time: 2550, type: 'ka' },
      { time: 2800, type: 'don' },
      { time: 2950, type: 'ka' },
      { time: 3100, type: 'don' },
      { time: 3350, type: 'don-big' },
      { time: 3800, type: 'don' },
      { time: 3950, type: 'don' },
      { time: 4150, type: 'ka' },
      { time: 4300, type: 'ka' },
      { time: 4500, type: 'don' },
      { time: 4650, type: 'don' },
      { time: 4800, type: 'ka' },
      { time: 5050, type: 'ka-big' },
      { time: 5500, type: 'don' },
      { time: 5640, type: 'don' },
      { time: 5780, type: 'ka' },
      { time: 5920, type: 'ka' },
      { time: 6060, type: 'don' },
      { time: 6300, type: 'don-big' },
      { time: 6700, type: 'ka' },
      { time: 6840, type: 'ka' },
      { time: 6980, type: 'don' },
      { time: 7120, type: 'don' },
      { time: 7260, type: 'ka' },
      { time: 7500, type: 'ka-big' },
      { time: 8000, type: 'don' },
      { time: 8140, type: 'ka' },
      { time: 8280, type: 'don' },
      { time: 8420, type: 'ka' },
      { time: 8560, type: 'don' },
      { time: 8700, type: 'don' },
      { time: 8840, type: 'ka' },
      { time: 9050, type: 'don-big' },
      { time: 9500, type: 'ka' },
      { time: 9640, type: 'don' },
      { time: 9780, type: 'ka' },
      { time: 9920, type: 'don' },
      { time: 10060, type: 'ka' },
      { time: 10200, type: 'ka' },
      { time: 10340, type: 'don' },
      { time: 10550, type: 'ka-big' },
      { time: 11000, type: 'don' },
      { time: 11140, type: 'don' },
      { time: 11280, type: 'don' },
      { time: 11420, type: 'don' },
      { time: 11560, type: 'ka' },
      { time: 11700, type: 'ka' },
      { time: 11840, type: 'ka' },
      { time: 11980, type: 'ka' },
      { time: 12250, type: 'don-big' },
      { time: 12700, type: 'don' },
      { time: 12840, type: 'ka' },
      { time: 12980, type: 'don' },
      { time: 13120, type: 'ka' },
      { time: 13260, type: 'don' },
      { time: 13400, type: 'ka' },
      { time: 13540, type: 'don-big' },
      { time: 14000, type: 'ka' },
      { time: 14140, type: 'don' },
      { time: 14280, type: 'ka' },
      { time: 14420, type: 'don' },
      { time: 14560, type: 'ka' },
      { time: 14700, type: 'don' },
      { time: 14840, type: 'ka-big' },
      { time: 15300, type: 'don' },
      { time: 15440, type: 'don' },
      { time: 15580, type: 'don' },
      { time: 15720, type: 'ka' },
      { time: 15860, type: 'ka' },
      { time: 15000, type: 'ka' },
      { time: 16140, type: 'don' },
      { time: 16280, type: 'ka' },
      { time: 16500, type: 'don-big' },
      { time: 16850, type: 'ka-big' },
      { time: 17200, type: 'don-big' },
      { time: 17550, type: 'ka-big' },
      { time: 18000, type: 'don-big' }
    ]
  },
  raijin: {
    title: '雷神乱舞 (極限・神速鬼滅級・BPM 172)',
    bpm: 172,
    duration: 17500,
    notes: [
      { time: 1700, type: 'don' },
      { time: 1830, type: 'don' },
      { time: 1960, type: 'don' },
      { time: 2090, type: 'don' },
      { time: 2300, type: 'ka' },
      { time: 2430, type: 'ka' },
      { time: 2560, type: 'ka' },
      { time: 2690, type: 'ka' },
      { time: 2900, type: 'don' },
      { time: 3030, type: 'ka' },
      { time: 3160, type: 'don' },
      { time: 3350, type: 'don-big' },
      { time: 3750, type: 'don' },
      { time: 3870, type: 'don' },
      { time: 3990, type: 'ka' },
      { time: 4110, type: 'ka' },
      { time: 4230, type: 'don' },
      { time: 4350, type: 'ka' },
      { time: 4470, type: 'don' },
      { time: 4590, type: 'ka' },
      { time: 4800, type: 'ka-big' },
      { time: 5200, type: 'ka' },
      { time: 5320, type: 'ka' },
      { time: 5440, type: 'don' },
      { time: 5560, type: 'don' },
      { time: 5680, type: 'ka' },
      { time: 5800, type: 'don' },
      { time: 5920, type: 'ka' },
      { time: 6040, type: 'don' },
      { time: 6250, type: 'don-big' },
      { time: 6650, type: 'don' },
      { time: 6770, type: 'don' },
      { time: 6890, type: 'don' },
      { time: 7010, type: 'don' },
      { time: 7130, type: 'ka' },
      { time: 7250, type: 'ka' },
      { time: 7370, type: 'ka' },
      { time: 7490, type: 'ka' },
      { time: 7610, type: 'don' },
      { time: 7730, type: 'ka' },
      { time: 7950, type: 'ka-big' },
      { time: 8200, type: 'don-big' },
      { time: 8700, type: 'don' },
      { time: 8820, type: 'ka' },
      { time: 8940, type: 'don' },
      { time: 9060, type: 'ka' },
      { time: 9180, type: 'don' },
      { time: 9300, type: 'don' },
      { time: 9420, type: 'ka' },
      { time: 9540, type: 'ka' },
      { time: 9660, type: 'don' },
      { time: 9780, type: 'ka' },
      { time: 10000, type: 'don-big' },
      { time: 10450, type: 'ka' },
      { time: 10570, type: 'don' },
      { time: 10690, type: 'ka' },
      { time: 10810, type: 'don' },
      { time: 10930, type: 'ka' },
      { time: 11050, type: 'don' },
      { time: 11170, type: 'ka' },
      { time: 11290, type: 'don' },
      { time: 11410, type: 'ka' },
      { time: 11530, type: 'ka' },
      { time: 11750, type: 'ka-big' },
      { time: 12200, type: 'don' },
      { time: 12310, type: 'don' },
      { time: 12420, type: 'don' },
      { time: 12530, type: 'don' },
      { time: 12640, type: 'ka' },
      { time: 12750, type: 'ka' },
      { time: 12860, type: 'ka' },
      { time: 12970, type: 'ka' },
      { time: 13080, type: 'don' },
      { time: 13190, type: 'ka' },
      { time: 13300, type: 'don' },
      { time: 13410, type: 'ka' },
      { time: 13650, type: 'don-big' },
      { time: 14100, type: 'don' },
      { time: 14220, type: 'don' },
      { time: 14340, type: 'ka' },
      { time: 14460, type: 'ka' },
      { time: 14680, type: 'don-big' },
      { time: 14980, type: 'ka-big' },
      { time: 15280, type: 'don-big' },
      { time: 15600, type: 'ka-big' },
      { time: 16000, type: 'don-big' }
    ]
  }
};

class AudioManager {
  constructor() {
    this.ctx = null;
    this.bgmTimer = null;
    this.isBgmPlaying = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playDon(isBig = false) {
    this.init();
    const now = this.ctx.currentTime;
    const mult = isBig ? 1.4 : 1.0;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(isBig ? 180 : 155, now);
    osc.frequency.exponentialRampToValueAtTime(isBig ? 36 : 48, now + (isBig ? 0.28 : 0.18));

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.9 * mult, now + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + (isBig ? 0.35 : 0.22));

    const noise = this.createNoiseBuffer(0.04);
    const noiseNode = this.ctx.createBufferSource();
    noiseNode.buffer = noise;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, now);
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.5 * mult, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    noiseNode.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    noiseNode.start(now);
    osc.stop(now + 0.4);
    noiseNode.stop(now + 0.05);
  }

  playKa(isBig = false) {
    this.init();
    const now = this.ctx.currentTime;
    const mult = isBig ? 1.35 : 1.0;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(isBig ? 620 : 540, now);
    osc.frequency.exponentialRampToValueAtTime(isBig ? 380 : 330, now + 0.08);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.85 * mult, now + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + (isBig ? 0.14 : 0.09));

    const noise = this.createNoiseBuffer(0.05);
    const noiseNode = this.ctx.createBufferSource();
    noiseNode.buffer = noise;
    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(2600, now);
    bandpass.Q.setValueAtTime(3.0, now);
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.6 * mult, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    noiseNode.connect(bandpass);
    bandpass.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    noiseNode.start(now);
    osc.stop(now + 0.15);
    noiseNode.stop(now + 0.06);
  }

  playMiss() {
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.12);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.13);
  }

  startBgm(bpm, durationMs) {
    this.init();
    this.stopBgm();
    this.isBgmPlaying = true;

    const beatSec = 60 / bpm;
    const startTime = this.ctx.currentTime;
    const durationSec = durationMs / 1000;
    const scale = [293.66, 349.23, 392.00, 440.00, 523.25, 587.33];
    let beat = 0;
    let nextTime = this.ctx.currentTime;

    const scheduler = () => {
      if (!this.isBgmPlaying) return;
      const elapsed = this.ctx.currentTime - startTime;
      if (elapsed >= durationSec) {
        this.stopBgm();
        return;
      }

      while (nextTime < this.ctx.currentTime + 0.2) {
        this.synthTone(nextTime, beat % 2 === 0 ? 980 : 820, 0.04, 'sine', 0.15);
        if (beat % 2 === 0) {
          this.synthTone(nextTime, 146.83, beatSec * 0.6, 'sawtooth', 0.12, 400);
        }
        const melodyFreq = scale[(beat + Math.floor(beat / 4)) % scale.length];
        this.synthTone(nextTime, melodyFreq, beatSec * 0.7, 'sine', 0.14);

        nextTime += beatSec * 0.5;
        beat++;
      }
    };

    this.bgmTimer = setInterval(scheduler, 40);
  }

  stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  synthTone(time, freq, dur, type, vol, filterFreq = null) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(vol, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

    if (filterFreq) {
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(filterFreq, time);
      osc.connect(filter);
      filter.connect(gain);
    } else {
      osc.connect(gain);
    }

    gain.connect(this.ctx.destination);
    osc.start(time);
    osc.stop(time + dur);
  }

  createNoiseBuffer(durationSec) {
    const bufferSize = Math.floor(this.ctx.sampleRate * durationSec);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }
}

const audio = new AudioManager();

let gameState = 'TITLE';
let activeSong = SONGS.matsuri;
let songStartTime = 0;
let notes = [];
let score = 0;
let combo = 0;
let maxCombo = 0;
let greatCount = 0;
let goodCount = 0;
let missCount = 0;
let gauge = 0;

let latestJudgment = null;
let particles = [];
let targetFlash = 0;

const scoreText = document.getElementById('score-text');
const comboText = document.getElementById('combo-text');
const gaugeBar = document.getElementById('gauge-bar');
const gaugePercent = document.getElementById('gauge-percent');
const progressBar = document.getElementById('progress-bar');
const songTitleDisplay = document.getElementById('song-title-display');

const laneCanvas = document.getElementById('lane-canvas');
const ctx = laneCanvas.getContext('2d');

const drumFace = document.getElementById('drum-face');
const drumRim = document.getElementById('drum-rim');

const titleModal = document.getElementById('title-modal');
const resultModal = document.getElementById('result-modal');
const startButton = document.getElementById('start-button');
const retryButton = document.getElementById('retry-button');
const songSelect = document.getElementById('song-select');

const resStatus = document.getElementById('result-status');
const resSub = document.getElementById('result-sub');
const resScore = document.getElementById('res-score');
const resMaxCombo = document.getElementById('res-max-combo');
const resGreat = document.getElementById('res-great');
const resGood = document.getElementById('res-good');
const resMiss = document.getElementById('res-miss');

const btnDon = document.getElementById('btn-don');
const btnKa = document.getElementById('btn-ka');
const btnDonBig = document.getElementById('btn-don-big');
const btnKaBig = document.getElementById('btn-ka-big');

const countdownOverlay = document.getElementById('countdown-overlay');
const countdownBadge = document.getElementById('countdown-badge');
const countdownNumber = document.getElementById('countdown-number');
const countdownSub = document.getElementById('countdown-sub');

let isCountingDown = false;
let countdownTimers = [];

function startGame() {
  audio.init();

  countdownTimers.forEach(clearTimeout);
  countdownTimers = [];

  const selectedKey = songSelect.value;
  activeSong = SONGS[selectedKey] || SONGS.matsuri;
  songTitleDisplay.textContent = activeSong.title;

  score = 0;
  combo = 0;
  maxCombo = 0;
  greatCount = 0;
  goodCount = 0;
  missCount = 0;
  gauge = 0;
  particles = [];
  latestJudgment = null;

  notes = activeSong.notes.map((n, idx) => ({
    id: idx,
    time: n.time,
    type: n.type,
    hit: false,
    missed: false
  }));

  updateScoreUI();

  titleModal.classList.remove('active');
  resultModal.classList.remove('active');
  gameState = 'PLAYING';

  isCountingDown = true;
  countdownOverlay.classList.add('active');
  countdownBadge.textContent = 'まもなく演奏開始！';
  countdownNumber.textContent = '3';
  countdownSub.textContent = 'Fキー(ドン)・Jキー(カッ)の準備！';
  audio.playKa(false);

  const t1 = setTimeout(() => {
    countdownNumber.textContent = '2';
    audio.playKa(false);
  }, 1000);

  const t2 = setTimeout(() => {
    countdownNumber.textContent = '1';
    audio.playKa(true);
  }, 2000);

  const t3 = setTimeout(() => {
    countdownBadge.textContent = 'いざ、勝負！';
    countdownNumber.textContent = 'スタート！';
    countdownSub.textContent = '曲スタート！ドン・カッ！';
    audio.playDon(true);

    isCountingDown = false;
    songStartTime = performance.now();
    audio.startBgm(activeSong.bpm, activeSong.duration);
  }, 3000);

  const t4 = setTimeout(() => {
    countdownOverlay.classList.remove('active');
  }, 3700);

  countdownTimers = [t1, t2, t3, t4];
}

function handleInput(type) {
  if (gameState !== 'PLAYING') return;

  const isDon = type === 'don' || type === 'don-big';
  const isBig = type === 'don-big' || type === 'ka-big';

  if (isDon) {
    audio.playDon(isBig);
    drumFace.classList.add('active');
    setTimeout(() => drumFace.classList.remove('active'), 100);
  } else {
    audio.playKa(isBig);
    drumRim.classList.add('active');
    setTimeout(() => drumRim.classList.remove('active'), 100);
  }

  targetFlash = performance.now();

  if (isCountingDown) return;

  judgeHit(type);
}

window.addEventListener('keydown', (e) => {
  if (e.repeat) return;

  const key = e.key.toUpperCase();
  if (key === 'F') {
    highlightBtn(btnDon);
    handleInput('don');
  } else if (key === 'J') {
    highlightBtn(btnKa);
    handleInput('ka');
  } else if (key === 'D') {
    highlightBtn(btnDonBig);
    handleInput('don-big');
  } else if (key === 'K') {
    highlightBtn(btnKaBig);
    handleInput('ka-big');
  } else if (key === ' ' || key === 'ENTER') {
    if (gameState === 'TITLE') startGame();
    else if (gameState === 'RESULT') startGame();
  }
});

function highlightBtn(elem) {
  if (!elem) return;
  elem.classList.add('active');
  setTimeout(() => elem.classList.remove('active'), 100);
}

btnDon.addEventListener('pointerdown', () => handleInput('don'));
btnKa.addEventListener('pointerdown', () => handleInput('ka'));
btnDonBig.addEventListener('pointerdown', () => handleInput('don-big'));
btnKaBig.addEventListener('pointerdown', () => handleInput('ka-big'));

drumFace.addEventListener('pointerdown', (e) => {
  e.stopPropagation();
  handleInput('don');
});
drumRim.addEventListener('pointerdown', () => handleInput('ka'));

startButton.addEventListener('click', startGame);
retryButton.addEventListener('click', startGame);

function judgeHit(inputType) {
  const currentTime = performance.now() - songStartTime;

  let targetNote = null;
  let minDiff = Infinity;

  for (let note of notes) {
    if (note.hit || note.missed) continue;
    const diff = Math.abs(note.time - currentTime);

    if (diff <= 160 && diff < minDiff) {
      minDiff = diff;
      targetNote = note;
    }
  }

  if (!targetNote) return;

  const isDonInput = inputType === 'don' || inputType === 'don-big';
  const isKaInput = inputType === 'ka' || inputType === 'ka-big';
  const isDonNote = targetNote.type === 'don' || targetNote.type === 'don-big';
  const isKaNote = targetNote.type === 'ka' || targetNote.type === 'ka-big';

  const isTypeMatch = (isDonInput && isDonNote) || (isKaInput && isKaNote);

  if (!isTypeMatch) {
    applyJudgment('miss', targetNote);
    return;
  }

  const isBig = targetNote.type === 'don-big' || targetNote.type === 'ka-big';

  if (minDiff <= 80) {
    applyJudgment('great', targetNote, isBig);
  } else if (minDiff <= 160) {
    applyJudgment('good', targetNote, isBig);
  }
}

function applyJudgment(judgment, note, isBig = false) {
  note.hit = true;
  const now = performance.now();

  if (judgment === 'great') {
    score += isBig ? 200 : 100;
    combo++;
    greatCount++;
    gauge = Math.min(100, gauge + 2.5);
    latestJudgment = { text: '良', color: '#d97706', stroke: '#ffffff', time: now };
    spawnParticles(20, ['#f59e0b', '#d97706', '#ef4444', '#ffffff']);
  } else if (judgment === 'good') {
    score += isBig ? 100 : 50;
    combo++;
    goodCount++;
    gauge = Math.min(100, gauge + 1.2);
    latestJudgment = { text: '可', color: '#0284c7', stroke: '#ffffff', time: now };
    spawnParticles(10, ['#0284c7', '#38bdf8', '#ffffff']);
  } else {
    combo = 0;
    missCount++;
    gauge = Math.max(0, gauge - 3.0);
    audio.playMiss();
    latestJudgment = { text: '不可', color: '#dc2626', stroke: '#ffffff', time: now };
  }

  if (combo > maxCombo) {
    maxCombo = combo;
  }

  updateScoreUI();
}

function updateScoreUI() {
  scoreText.textContent = score.toString().padStart(7, '0');
  comboText.textContent = combo.toString();

  if (combo > 0) {
    comboText.style.transform = 'scale(1.2)';
    setTimeout(() => { comboText.style.transform = 'scale(1.0)'; }, 100);
  }

  gaugeBar.style.width = Math.min(100, Math.max(0, gauge)) + '%';
  gaugePercent.textContent = Math.floor(gauge) + '%';
}

function spawnParticles(count, colors) {
  const targetX = 140;
  const centerY = 85;
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 2;
    particles.push({
      x: targetX,
      y: centerY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      life: 0,
      maxLife: Math.random() * 15 + 15
    });
  }
}

function gameLoop() {
  requestAnimationFrame(gameLoop);

  const width = laneCanvas.width;
  const height = laneCanvas.height;
  const centerY = height / 2;
  const targetX = 140;

  ctx.clearRect(0, 0, width, height);

  const bgGrad = ctx.createLinearGradient(0, 0, width, 0);
  bgGrad.addColorStop(0, '#f8fafc');
  bgGrad.addColorStop(0.18, '#ffffff');
  bgGrad.addColorStop(0.6, '#f1f5f9');
  bgGrad.addColorStop(1, '#e2e8f0');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#d97706';
  ctx.fillRect(0, 0, width, 3);
  ctx.fillRect(0, height - 3, width, 3);

  ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.moveTo(targetX, centerY);
  ctx.lineTo(width, centerY);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.save();
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 3.5;
  ctx.shadowColor = 'rgba(217, 119, 6, 0.4)';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(targetX, centerY, 32, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(targetX, centerY, 24, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  const now = performance.now();
  if (now - targetFlash < 120) {
    ctx.save();
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(targetX, centerY, 42, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  if (gameState === 'PLAYING') {
    const currentTime = isCountingDown ? 0 : now - songStartTime;

    const progress = isCountingDown ? 0 : Math.min(100, (currentTime / activeSong.duration) * 100);
    progressBar.style.width = progress + '%';

    if (!isCountingDown && currentTime >= activeSong.duration + 1000) {
      endGame();
      return;
    }

    const travelTime = 1400;
    const travelDist = width - targetX;

    // 3秒カウントダウン中は音符を一切描画・流さない
    if (!isCountingDown) {
      notes.forEach((note) => {
        if (!note.hit && !note.missed && currentTime - note.time > 160) {
          note.missed = true;
          applyJudgment('miss', note);
        }

        if (note.hit) return;

        const timeDiff = note.time - currentTime;
        if (timeDiff > travelTime * 1.1 || timeDiff < -200) return;

        const x = targetX + (timeDiff / travelTime) * travelDist;
        const isDon = note.type === 'don' || note.type === 'don-big';
        const isBig = note.type === 'don-big' || note.type === 'ka-big';
        const radius = isBig ? 32 : 22;

        ctx.save();
        ctx.translate(x, centerY);

        if (isBig) {
          ctx.beginPath();
          ctx.arc(0, 0, radius + 6, 0, Math.PI * 2);
          ctx.fillStyle = isDon ? 'rgba(239, 68, 68, 0.35)' : 'rgba(37, 99, 235, 0.35)';
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fillStyle = isDon ? '#dc2626' : '#2563eb';
        ctx.fill();

        ctx.lineWidth = isBig ? 3.5 : 2.5;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.65, 0, Math.PI * 2);
        ctx.fillStyle = isDon ? '#fee2e2' : '#dbeafe';
        ctx.fill();

        ctx.fillStyle = isDon ? '#991b1b' : '#1e40af';
        ctx.font = 'bold ' + (isBig ? 15 : 12) + 'px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(isDon ? 'ドン' : 'カッ', 0, 0);

        ctx.restore();
      });
    }
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life++;
    p.alpha = 1 - p.life / p.maxLife;

    if (p.life >= p.maxLife) {
      particles.splice(i, 1);
      continue;
    }

    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  if (latestJudgment) {
    const elapsed = now - latestJudgment.time;
    if (elapsed < 500) {
      const progress = elapsed / 500;
      const alpha = progress < 0.6 ? 1 : 1 - (progress - 0.6) / 0.4;
      const textY = centerY - 55 - progress * 15;

      ctx.save();
      ctx.translate(targetX, textY);
      ctx.globalAlpha = alpha;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.font = "900 28px 'Dela Gothic One', sans-serif";
      ctx.lineWidth = 6;
      ctx.strokeStyle = latestJudgment.stroke;
      ctx.strokeText(latestJudgment.text, 0, 0);

      ctx.fillStyle = latestJudgment.color;
      ctx.fillText(latestJudgment.text, 0, 0);
      ctx.restore();
    }
  }
}

function endGame() {
  gameState = 'RESULT';
  audio.stopBgm();

  const isClear = gauge >= 70;

  if (isClear) {
    resStatus.textContent = 'クリア！';
    resStatus.className = 'result-title clear';
    resSub.textContent = 'ノルマ達成おめでとう！見事な太鼓さばきでした！';
  } else {
    resStatus.textContent = 'FAILED';
    resStatus.className = 'result-title failed';
    resSub.textContent = 'ノルマ達成ならず… 練習して再挑戦しよう！';
  }

  resScore.textContent = score.toLocaleString();
  resMaxCombo.textContent = maxCombo.toString();
  resGreat.textContent = greatCount.toString();
  resGood.textContent = goodCount.toString();
  resMiss.textContent = missCount.toString();

  resultModal.classList.add('active');
}

requestAnimationFrame(gameLoop);
`;
