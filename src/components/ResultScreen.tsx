/**
 * リザルト（結果）画面コンポーネント (白を基調とした爽快な和風デザイン)
 * スコア、最大コンボ、良・可・不可の内訳、クリア/FAILED判定、再挑戦ボタンを表示
 */

import React, { useEffect } from 'react';
import { GameScoreState, SongData } from '../types/game';
import { RotateCcw, Home, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface ResultScreenProps {
  scoreState: GameScoreState;
  song: SongData;
  onRetry: () => void;
  onHome: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  scoreState,
  song,
  onRetry,
  onHome,
}) => {
  const isClear = scoreState.gauge >= 70;
  const totalNotes = song.notes.length;
  const accuracy =
    totalNotes > 0
      ? Math.round(((scoreState.greatCount * 1.0 + scoreState.goodCount * 0.5) / totalNotes) * 100)
      : 0;

  // 評価ランク判定
  let rank = '初段';
  let rankColor = 'text-slate-700';
  if (accuracy >= 98 && scoreState.missCount === 0) {
    rank = '達人 (ALL PERFECT)';
    rankColor = 'text-amber-600 font-extrabold';
  } else if (accuracy >= 90) {
    rank = '名人 (GREAT)';
    rankColor = 'text-amber-600 font-bold';
  } else if (accuracy >= 75) {
    rank = '玄人 (GOOD)';
    rankColor = 'text-blue-600 font-bold';
  } else if (isClear) {
    rank = '一人前 (CLEAR)';
    rankColor = 'text-emerald-600 font-bold';
  } else {
    rank = '見習い (PRACTICE)';
    rankColor = 'text-slate-500 font-bold';
  }

  useEffect(() => {
    if (isClear) {
      soundEngine.playFanfare(false);
    }
  }, [isClear]);

  return (
    <div className="relative min-h-[620px] w-full max-w-4xl mx-auto rounded-3xl overflow-hidden border-2 border-amber-300 shadow-xl bg-white flex flex-col items-center justify-between p-6 sm:p-10">
      {/* 背景装飾 */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <img
          src="/src/assets/images/matsuri_bg_banner_1790914698854.jpg"
          alt="リザルト背景"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover filter blur-xs"
        />
      </div>

      {/* ヘッダー演出: クリア or FAILED */}
      <div className="relative z-10 w-full text-center mt-2">
        <div className="text-xs sm:text-sm text-slate-500 font-bold mb-1">
          演奏結果 - {song.title} ({song.difficulty})
        </div>

        {isClear ? (
          <div className="relative inline-block animate-bounce duration-1000">
            <h1 className="text-4xl sm:text-6xl font-arcade font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-amber-500 to-red-600 drop-shadow-sm">
              クリア！
            </h1>
            <div className="text-amber-700 text-sm font-bold flex items-center justify-center gap-1.5 mt-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>ノルマ達成おめでとうございます！</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-4xl sm:text-6xl font-arcade font-extrabold text-slate-400 drop-shadow-xs">
              FAILED
            </h1>
            <div className="text-slate-500 text-sm font-medium mt-1">
              ノルマ達成ならず… もう一度挑戦しよう！
            </div>
          </div>
        )}
      </div>

      {/* スコア・ランク表示 */}
      <div className="relative z-10 w-full max-w-2xl bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm my-4">
        {/* スコア & ランク */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-200 pb-4 mb-4 gap-4">
          <div>
            <div className="text-xs text-slate-500 font-bold">獲得スコア</div>
            <div className="text-3xl sm:text-4xl font-arcade font-bold text-red-600 tabular-nums">
              {scoreState.score.toLocaleString()}
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-500 font-bold">認定段位・称号</div>
            <div className={`text-xl sm:text-2xl font-arcade ${rankColor}`}>
              {rank}
            </div>
          </div>
        </div>

        {/* 判定内訳グリッド (良・可・不可・最大コンボ) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* 良 (Great) */}
          <div className="bg-white p-3 rounded-xl border border-amber-300 text-center shadow-xs">
            <div className="text-xs font-bold text-amber-600">良 (100/200点)</div>
            <div className="text-2xl font-arcade font-bold text-amber-600 tabular-nums mt-1">
              {scoreState.greatCount}
            </div>
          </div>

          {/* 可 (Good) */}
          <div className="bg-white p-3 rounded-xl border border-blue-300 text-center shadow-xs">
            <div className="text-xs font-bold text-blue-600">可 (50/100点)</div>
            <div className="text-2xl font-arcade font-bold text-blue-600 tabular-nums mt-1">
              {scoreState.goodCount}
            </div>
          </div>

          {/* 不可 (Miss) */}
          <div className="bg-white p-3 rounded-xl border border-red-300 text-center shadow-xs">
            <div className="text-xs font-bold text-red-600">不可 (0点)</div>
            <div className="text-2xl font-arcade font-bold text-red-600 tabular-nums mt-1">
              {scoreState.missCount}
            </div>
          </div>

          {/* 最大コンボ */}
          <div className="bg-white p-3 rounded-xl border border-amber-300 text-center shadow-xs">
            <div className="text-xs font-bold text-amber-700">最大コンボ</div>
            <div className="text-2xl font-arcade font-bold text-amber-600 tabular-nums mt-1">
              {scoreState.maxCombo}
            </div>
          </div>
        </div>

        {/* ゲージ & 精度情報 */}
        <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between text-xs sm:text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <span>最終ゲージ:</span>
            <span className="font-mono font-bold text-red-600">{Math.floor(scoreState.gauge)}%</span>
            <span className="text-slate-400">(ノルマ: 70%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span>精度スコア:</span>
            <span className="font-mono font-bold text-slate-800">{accuracy}%</span>
          </div>
        </div>
      </div>

      {/* 操作ボタン */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 w-full">
        {/* もう一度遊ぶボタン */}
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-arcade font-bold text-lg shadow-md border border-yellow-200 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
          <span>もう一度遊ぶ</span>
        </button>

        {/* 楽曲選択に戻るボタン */}
        <button
          onClick={onHome}
          className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 font-bold text-base shadow-sm border border-slate-300 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Home className="w-5 h-5 text-slate-500" />
          <span>曲選択へ戻る</span>
        </button>
      </div>
    </div>
  );
};
