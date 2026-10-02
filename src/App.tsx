/**
 * 太鼓リズムゲーム メインアプリケーション
 * 白基調デザイン・画面揺れなし・大音符F/J入力対応・高難易度譜面対応
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, NoteItem, SongData, GameSettings, GameScoreState, NoteType, JudgmentType } from './types/game';
import { SONGS } from './utils/songData';
import { soundEngine } from './utils/soundEngine';
import { HeaderBar } from './components/HeaderBar';
import { TaikoLane } from './components/TaikoLane';
import { DrumController } from './components/DrumController';
import { TitleScreen } from './components/TitleScreen';
import { ResultScreen } from './components/ResultScreen';
import { CodeModal } from './components/CodeModal';
import { FileCode, RotateCcw, Home } from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('TITLE');
  const [selectedSong, setSelectedSong] = useState<SongData>(SONGS[0]);
  const [settings, setSettings] = useState<GameSettings>({
    scrollSpeed: 1.0,
    bgmVolume: 0.6,
    seVolume: 0.85,
    timingOffset: 0,
  });

  const [scoreState, setScoreState] = useState<GameScoreState>({
    score: 0,
    combo: 0,
    maxCombo: 0,
    greatCount: 0,
    goodCount: 0,
    missCount: 0,
    gauge: 0,
    isClear: false,
    milestoneCombo: null,
  });

  // 音符リスト (プレイ中に更新)
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [latestJudgment, setLatestJudgment] = useState<{ type: JudgmentType; timestamp: number } | null>(null);
  const [targetHitFlash, setTargetHitFlash] = useState<{ type: NoteType; timestamp: number } | null>(null);
  const [milestoneBanner, setMilestoneBanner] = useState<string | null>(null);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  // アクティブキー状態（太鼓アニメーション用）
  const [activeDon, setActiveDon] = useState(false);
  const [activeKa, setActiveKa] = useState(false);
  const [activeBigDon, setActiveBigDon] = useState(false);
  const [activeBigKa, setActiveBigKa] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const songStartTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout[]>([]);
  const notesRef = useRef<NoteItem[]>([]);
  const scoreStateRef = useRef<GameScoreState>(scoreState);
  notesRef.current = notes;
  scoreStateRef.current = scoreState;

  // 音量反映
  useEffect(() => {
    soundEngine.setVolumes(settings.seVolume, settings.bgmVolume);
  }, [settings.seVolume, settings.bgmVolume]);

  // ゲーム終了（曲完走・中断）
  const handleGameEnd = useCallback(() => {
    countdownTimerRef.current.forEach(clearTimeout);
    countdownTimerRef.current = [];
    setCountdown(null);
    soundEngine.stopBgm();
    setGameState('RESULT');
  }, []);

  // ゲーム開始 (3秒間のカウントダウン待機後に演奏・BGM開始)
  const handleStartGame = useCallback((song: SongData) => {
    soundEngine.init();
    setSelectedSong(song);

    // 既存タイマーをクリア
    countdownTimerRef.current.forEach(clearTimeout);
    countdownTimerRef.current = [];

    // 音符データの初期化
    const initialNotes: NoteItem[] = song.notes.map((n, idx) => ({
      id: idx,
      time: n.time,
      type: n.type,
      hit: false,
      processed: false,
    }));

    setNotes(initialNotes);
    notesRef.current = initialNotes;

    const initialScore: GameScoreState = {
      score: 0,
      combo: 0,
      maxCombo: 0,
      greatCount: 0,
      goodCount: 0,
      missCount: 0,
      gauge: 0,
      isClear: false,
      milestoneCombo: null,
    };
    setScoreState(initialScore);
    scoreStateRef.current = initialScore;

    setLatestJudgment(null);
    setMilestoneBanner(null);
    setCurrentTime(0);

    setGameState('PLAYING');

    // 3秒カウントダウン開始
    setCountdown(3);
    soundEngine.playKa(false);

    const t1 = setTimeout(() => {
      setCountdown(2);
      soundEngine.playKa(false);
    }, 1000);

    const t2 = setTimeout(() => {
      setCountdown(1);
      soundEngine.playKa(true);
    }, 2000);

    const t3 = setTimeout(() => {
      setCountdown(0); // スタート！表示
      soundEngine.playDon(true);
      songStartTimeRef.current = performance.now();

      // 3秒経過後に和風BGM開始
      soundEngine.startBgm(song, () => {
        handleGameEnd();
      });
    }, 3000);

    const t4 = setTimeout(() => {
      setCountdown(null);
    }, 3700);

    countdownTimerRef.current = [t1, t2, t3, t4];
  }, [handleGameEnd]);

  // 判定処理（キー入力時）
  // 大音符もFやJで叩けるように対応！
  const handleHit = useCallback(
    (type: NoteType) => {
      if (gameState !== 'PLAYING') return;

      const now = performance.now();
      const currentSongTime = now - songStartTimeRef.current + settings.timingOffset;
      const isDonInput = type === 'don' || type === 'don-big';
      const isKaInput = type === 'ka' || type === 'ka-big';
      const isBigInput = type === 'don-big' || type === 'ka-big';

      // 1. 打撃SE再生
      if (isDonInput) {
        soundEngine.playDon(isBigInput);
        if (isBigInput) {
          setActiveBigDon(true);
          setTimeout(() => setActiveBigDon(false), 90);
        } else {
          setActiveDon(true);
          setTimeout(() => setActiveDon(false), 90);
        }
      } else {
        soundEngine.playKa(isBigInput);
        if (isBigInput) {
          setActiveBigKa(true);
          setTimeout(() => setActiveBigKa(false), 90);
        } else {
          setActiveKa(true);
          setTimeout(() => setActiveKa(false), 90);
        }
      }

      setTargetHitFlash({ type, timestamp: now });

      // カウントダウン中（3秒待機中）は打撃SEと太鼓アニメーションのみ再生し、判定は行わない
      if (countdown !== null && countdown > 0) return;

      // 2. 最も判定ラインに近い未打撃音符を探索
      let targetIndex = -1;
      let minDiff = Infinity;

      for (let i = 0; i < notesRef.current.length; i++) {
        const note = notesRef.current[i];
        if (note.hit || note.processed) continue;

        const diff = Math.abs(note.time - currentSongTime);
        // 判定時間幅：±160ms以内
        if (diff <= 160 && diff < minDiff) {
          minDiff = diff;
          targetIndex = i;
        }
      }

      // 判定ゾーンに音符がない場合は空振り（何もしない）
      if (targetIndex === -1) return;

      const targetNote = notesRef.current[targetIndex];
      const isDonNote = targetNote.type === 'don' || targetNote.type === 'don-big';
      const isKaNote = targetNote.type === 'ka' || targetNote.type === 'ka-big';

      // ドン系入力ならドン音符(通常/大)にヒット、カッ系入力ならカッ音符(通常/大)にヒット
      const isTypeMatch = (isDonInput && isDonNote) || (isKaInput && isKaNote);

      if (!isTypeMatch) {
        processJudgment('miss', targetIndex);
        return;
      }

      // 音符自体が大音符であれば、FやJで叩いても大音符スコア(200点/100点)を付与！
      const isBigNote = targetNote.type === 'don-big' || targetNote.type === 'ka-big';

      // 判定基準:
      // 良: ±80ms以内
      // 可: ±160ms以内
      if (minDiff <= 80) {
        processJudgment('great', targetIndex, isBigNote);
      } else if (minDiff <= 160) {
        processJudgment('good', targetIndex, isBigNote);
      }
    },
    [gameState, settings.timingOffset, countdown]
  );

  // 判定スコア更新
  const processJudgment = (judgment: JudgmentType, noteIndex: number, isBig = false) => {
    const updatedNotes = [...notesRef.current];
    updatedNotes[noteIndex].hit = true;
    updatedNotes[noteIndex].processed = true;
    updatedNotes[noteIndex].judgment = judgment;
    setNotes(updatedNotes);
    notesRef.current = updatedNotes;

    const now = performance.now();
    setLatestJudgment({ type: judgment, timestamp: now });

    const currentScore = { ...scoreStateRef.current };

    if (judgment === 'great') {
      const pts = isBig ? 200 : 100;
      currentScore.score += pts;
      currentScore.combo += 1;
      currentScore.greatCount += 1;
      currentScore.gauge = Math.min(100, currentScore.gauge + 2.5); // 良はゲージ大きく増加
    } else if (judgment === 'good') {
      const pts = isBig ? 100 : 50;
      currentScore.score += pts;
      currentScore.combo += 1;
      currentScore.goodCount += 1;
      currentScore.gauge = Math.min(100, currentScore.gauge + 1.2); // 可は少し増加
    } else {
      currentScore.combo = 0; // 不可でコンボリセット
      currentScore.missCount += 1;
      currentScore.gauge = Math.max(0, currentScore.gauge - 3.0); // ゲージ減少
      soundEngine.playMiss();
    }

    if (currentScore.combo > currentScore.maxCombo) {
      currentScore.maxCombo = currentScore.combo;
    }

    // 節目コンボ演出 (50, 100, 150...)
    if (currentScore.combo > 0 && currentScore.combo % 50 === 0) {
      const bannerText = `${currentScore.combo} COMBO達成！`;
      setMilestoneBanner(bannerText);
      soundEngine.playFanfare(true);
      setTimeout(() => setMilestoneBanner(null), 1200);
    }

    currentScore.isClear = currentScore.gauge >= 70;
    setScoreState(currentScore);
    scoreStateRef.current = currentScore;
  };

  // メインゲームループ (requestAnimationFrame)
  useEffect(() => {
    if (gameState !== 'PLAYING') {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    const loop = () => {
      const now = performance.now();

      // カウントダウン中（3秒待機中）は時刻0を維持し、見逃し判定は行わない
      if (countdown !== null && countdown > 0) {
        setCurrentTime(0);
        animationFrameRef.current = requestAnimationFrame(loop);
        return;
      }

      const currentSongTime = now - songStartTimeRef.current;
      setCurrentTime(currentSongTime);

      // 見逃し判定：音符が判定ラインを160ms以上通り過ぎた場合は「不可」
      let hasMiss = false;
      const updatedNotes = [...notesRef.current];
      for (let i = 0; i < updatedNotes.length; i++) {
        const note = updatedNotes[i];
        if (!note.hit && !note.processed && currentSongTime - note.time > 160) {
          note.processed = true;
          note.judgment = 'miss';
          hasMiss = true;

          const currentScore = { ...scoreStateRef.current };
          currentScore.combo = 0;
          currentScore.missCount += 1;
          currentScore.gauge = Math.max(0, currentScore.gauge - 3.0);
          currentScore.isClear = currentScore.gauge >= 70;

          setScoreState(currentScore);
          scoreStateRef.current = currentScore;
        }
      }

      if (hasMiss) {
        setNotes(updatedNotes);
        notesRef.current = updatedNotes;
        setLatestJudgment({ type: 'miss', timestamp: now });
      }

      // 曲終了判定 (曲時間 + 1秒の余韻)
      if (currentSongTime >= selectedSong.duration + 1000) {
        handleGameEnd();
        return;
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [gameState, selectedSong, handleGameEnd, countdown]);

  // キーボードイベントハンドラ
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return; // キー押しっぱなし連打を防止

      const key = e.key.toUpperCase();
      if (key === 'F') {
        handleHit('don');
      } else if (key === 'J') {
        handleHit('ka');
      } else if (key === 'D') {
        handleHit('don-big');
      } else if (key === 'K') {
        handleHit('ka-big');
      } else if (key === ' ' || key === 'ENTER') {
        if (gameState === 'TITLE') {
          handleStartGame(selectedSong);
        } else if (gameState === 'RESULT') {
          handleStartGame(selectedSong);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleHit, gameState, selectedSong, handleStartGame]);

  const progressPercent = selectedSong.duration > 0 ? (currentTime / selectedSong.duration) * 100 : 0;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col justify-between selection:bg-amber-500 selection:text-white">
      {/* ナビゲーションバー (Top Bar Contract: 3-Zone) */}
      <header className="w-full bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between text-sm z-30 shadow-xs">
        {/* Zone 1: 単一テキストワードマーク */}
        <div className="flex items-center gap-2">
          <span className="font-arcade font-bold text-lg sm:text-xl tracking-wider text-red-600 drop-shadow-xs">
            太鼓の達人風 太鼓リズムゲーム
          </span>
        </div>

        {/* Zone 2: 操作キー案内 */}
        <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <span className="text-red-600">F: ドン (大音符もOK)</span>
          <span className="text-blue-600">J: カッ (大音符もOK)</span>
          <span className="text-amber-600">D: ドン(大)</span>
          <span className="text-cyan-600">K: カッ(大)</span>
        </div>

        {/* Zone 3: プライマリアクション */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCodeModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-medium transition-colors shadow-xs cursor-pointer"
          >
            <FileCode className="w-3.5 h-3.5 text-amber-600" />
            <span>3ファイル出力</span>
          </button>
        </div>
      </header>

      {/* メインゲーム領域 */}
      <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 w-full max-w-6xl mx-auto">
        {gameState === 'TITLE' && (
          <TitleScreen
            onStart={handleStartGame}
            selectedSong={selectedSong}
            onSelectSong={setSelectedSong}
            settings={settings}
            onUpdateSettings={(newSet) => setSettings((prev) => ({ ...prev, ...newSet }))}
            onOpenCodeModal={() => setIsCodeModalOpen(true)}
          />
        )}

        {gameState === 'PLAYING' && (
          <div className="w-full flex flex-col">
            {/* 上部ヘッダー（スコア、コンボ、クリアゲージ） */}
            <HeaderBar
              scoreState={scoreState}
              song={selectedSong}
              progressPercent={progressPercent}
            />

            {/* 音符レーン (Canvas描画 & 3秒カウントダウンオーバーレイ) */}
            <div className="relative w-full">
              <TaikoLane
                notes={notes}
                currentTime={currentTime}
                scrollSpeed={settings.scrollSpeed}
                latestJudgment={latestJudgment}
                targetHitFlash={targetHitFlash}
                milestoneBanner={milestoneBanner}
                isCountingDown={countdown !== null && countdown > 0}
              />

              {/* 3秒カウントダウン待機演出 */}
              {countdown !== null && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/75 backdrop-blur-[2px] z-20 pointer-events-none transition-all duration-300">
                  <div className="flex flex-col items-center justify-center p-3 animate-pulse">
                    <span className="text-xs sm:text-sm font-bold text-amber-800 tracking-widest bg-amber-100 border border-amber-300 px-3.5 py-0.5 rounded-full mb-1.5 shadow-xs">
                      {countdown > 0 ? 'まもなく演奏開始！' : 'いざ、勝負！'}
                    </span>
                    <div className="text-6xl sm:text-8xl font-arcade font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-amber-600 to-red-600 drop-shadow-md">
                      {countdown > 0 ? countdown : 'スタート！'}
                    </div>
                    <span className="text-xs text-slate-600 font-bold mt-1">
                      {countdown > 0 ? 'Fキー(ドン)・Jキー(カッ)に手を置こう！' : '曲スタート！ドン・カッ！'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* バーチャル太鼓コントローラー & 操作キー */}
            <DrumController
              onHit={handleHit}
              activeDon={activeDon}
              activeKa={activeKa}
              activeBigDon={activeBigDon}
              activeBigKa={activeBigKa}
            />

            {/* 途中中断・やり直しボタン */}
            <div className="flex items-center justify-center gap-4 text-xs text-slate-500 mt-2">
              <button
                onClick={() => handleStartGame(selectedSong)}
                className="flex items-center gap-1 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>最初からやり直す</span>
              </button>
              <span>·</span>
              <button
                onClick={() => {
                  countdownTimerRef.current.forEach(clearTimeout);
                  countdownTimerRef.current = [];
                  setCountdown(null);
                  soundEngine.stopBgm();
                  setGameState('TITLE');
                }}
                className="flex items-center gap-1 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>曲選択へ戻る</span>
              </button>
            </div>
          </div>
        )}

        {gameState === 'RESULT' && (
          <ResultScreen
            scoreState={scoreState}
            song={selectedSong}
            onRetry={() => handleStartGame(selectedSong)}
            onHome={() => setGameState('TITLE')}
          />
        )}
      </main>

      {/* フッター */}
      <footer className="w-full bg-white border-t border-slate-200 py-2 px-4 text-center text-xs text-slate-500">
        太鼓リズムゲーム · ブラウザで遊べる本格和太鼓Webアプリケーション (高難易度譜面 · 大音符F/J対応)
      </footer>

      {/* 3ファイルコード閲覧・ダウンロードモーダル */}
      <CodeModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />
    </div>
  );
}
