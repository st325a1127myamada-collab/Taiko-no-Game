/**
 * ゲーム画面上部ヘッダー (白を基調とした爽快な和風アーケードデザイン)
 * タイトル、スコア、コンボ数、クリアゲージ、進捗バーを表示
 */

import React from 'react';
import { GameScoreState, SongData } from '../types/game';

interface HeaderBarProps {
  scoreState: GameScoreState;
  song: SongData;
  progressPercent: number;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  scoreState,
  song,
  progressPercent,
}) => {
  const isGaugeCleared = scoreState.gauge >= 70;
  const isGaugeMax = scoreState.gauge >= 98;

  return (
    <div className="w-full bg-white/95 border-b-2 border-amber-300/80 backdrop-blur-md px-4 py-2 sm:py-3 shadow-md rounded-t-2xl">
      <div className="max-w-6xl mx-auto flex flex-col gap-2">
        {/* 上段: タイトル・楽曲情報 & スコア・コンボ */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* 左: ゲーム名 & 楽曲 */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-red-600 via-red-500 to-amber-500 px-3.5 py-1 rounded-lg text-white font-arcade text-sm sm:text-base tracking-wider shadow-sm">
              太鼓リズム
            </div>
            <div>
              <div className="text-slate-900 font-bold text-sm sm:text-base flex items-center gap-2">
                <span>{song.title}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-medium">
                  {song.difficulty} (BPM {song.bpm})
                </span>
              </div>
            </div>
          </div>

          {/* 右: スコア & コンボ表示 */}
          <div className="flex items-center gap-6">
            {/* スコア */}
            <div className="text-right">
              <div className="text-xs text-slate-500 font-bold">スコア</div>
              <div className="text-xl sm:text-2xl font-arcade font-bold text-red-600 tabular-nums tracking-wide">
                {scoreState.score.toLocaleString().padStart(7, '0')}
              </div>
            </div>

            {/* コンボ */}
            <div className="text-right min-w-[70px]">
              <div className="text-xs text-slate-500 font-bold">コンボ</div>
              <div
                className={`text-xl sm:text-2xl font-arcade font-bold tabular-nums transition-all ${
                  scoreState.combo > 0
                    ? scoreState.combo >= 50
                      ? 'text-amber-500 scale-110 drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]'
                      : 'text-amber-600'
                    : 'text-slate-400'
                }`}
              >
                {scoreState.combo}
              </div>
            </div>
          </div>
        </div>

        {/* 下段: クリアゲージ (魂ゲージ風) */}
        <div className="w-full flex items-center gap-3">
          <div className="text-xs font-arcade font-bold text-amber-800 whitespace-nowrap flex items-center gap-1.5">
            <span>魂ゲージ</span>
            {isGaugeCleared && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-600 text-white font-bold animate-pulse shadow-sm">
                ノルマ達成！
              </span>
            )}
          </div>

          {/* ゲージバー本体 */}
          <div className="relative flex-1 h-5 sm:h-6 bg-slate-100 rounded-full p-0.5 border border-slate-300 overflow-hidden shadow-inner">
            {/* ノルマ達成境界線 (70%) */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-amber-500 z-20 shadow-[0_0_4px_#f59e0b]"
              style={{ left: '70%' }}
            >
              <div className="absolute -top-1 -left-1.5 w-3.5 h-1.5 bg-amber-600 rounded-sm" />
              <div className="absolute -bottom-1 -left-1.5 w-3.5 h-1.5 bg-amber-600 rounded-sm" />
            </div>

            {/* ゲージ充填 */}
            <div
              className={`h-full rounded-full transition-all duration-150 relative ${
                isGaugeMax
                  ? 'bg-gradient-to-r from-amber-400 via-red-500 to-yellow-400 animate-flame shadow-[0_0_12px_rgba(239,68,68,0.7)]'
                  : isGaugeCleared
                  ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-emerald-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]'
                  : 'bg-gradient-to-r from-slate-300 via-amber-400 to-amber-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, scoreState.gauge))}%` }}
            >
              {/* 光沢ハイライト */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/30 rounded-t-full" />
            </div>
          </div>

          {/* ゲージ数値 */}
          <div className="text-xs font-mono font-bold text-slate-700 tabular-nums w-12 text-right">
            {Math.floor(scoreState.gauge)}%
          </div>
        </div>

        {/* 楽曲進行バー */}
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-500 to-red-500 h-full transition-all duration-100 ease-linear shadow-[0_0_3px_#f59e0b]"
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          />
        </div>
      </div>
    </div>
  );
};
