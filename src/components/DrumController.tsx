/**
 * バーチャル和太鼓コントローラー (白を基調としたクリーンデザイン)
 * 大音符のF/J打鍵対応のガイド表示付き
 */

import React from 'react';
import { NoteType } from '../types/game';

interface DrumControllerProps {
  onHit: (type: NoteType) => void;
  activeDon: boolean;
  activeKa: boolean;
  activeBigDon: boolean;
  activeBigKa: boolean;
}

export const DrumController: React.FC<DrumControllerProps> = ({
  onHit,
  activeDon,
  activeKa,
  activeBigDon,
  activeBigKa,
}) => {
  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center gap-4 py-4 px-4 bg-white/95 rounded-b-2xl border-x-2 border-b-2 border-amber-300/80 shadow-md">
      {/* 太鼓ビジュアライザー本体 */}
      <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center select-none my-1">
        {/* 太鼓の木製胴体 */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-amber-800 via-amber-900 to-amber-950 border-4 border-amber-950 shadow-xl" />

        {/* 太鼓のフチ（カッ判定ゾーン / 青） */}
        <div
          onClick={() => onHit('ka')}
          className={`absolute inset-2 sm:inset-3 rounded-full border-8 sm:border-[10px] transition-all duration-75 cursor-pointer flex items-center justify-center ${
            activeKa || activeBigKa
              ? 'border-blue-400 bg-blue-500/25 scale-95 shadow-[0_0_20px_rgba(59,130,246,0.8)]'
              : 'border-blue-600 bg-slate-100 hover:border-blue-500'
          }`}
        >
          {/* 太鼓の面（ドン判定ゾーン / 赤） */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              onHit('don');
            }}
            className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full transition-all duration-75 cursor-pointer flex flex-col items-center justify-center shadow-inner relative overflow-hidden ${
              activeDon || activeBigDon
                ? 'bg-gradient-to-b from-red-500 to-red-700 scale-90 shadow-[0_0_25px_rgba(239,68,68,0.9)]'
                : 'bg-gradient-to-b from-red-600 to-red-700 hover:from-red-500 hover:to-red-600'
            }`}
          >
            {/* 太鼓ロゴ */}
            <div className="text-white font-arcade text-lg sm:text-xl tracking-widest drop-shadow-md">
              太鼓
            </div>
            <div className="text-[11px] text-red-100 font-bold">
              面 (ドン)
            </div>
          </div>
        </div>

        {/* フチラベル */}
        <div className="absolute top-1 text-[10px] sm:text-xs font-bold text-white pointer-events-none drop-shadow">
          縁 (カッ)
        </div>
      </div>

      {/* キーボード操作ボタン群 (クリックでもプレイ可能) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 w-full max-w-4xl px-2">
        {/* Dキー: ドン（大） */}
        <button
          onClick={() => onHit('don-big')}
          className={`flex flex-col items-center justify-center py-2.5 sm:py-3.5 px-3 rounded-xl border-2 transition-all active:scale-95 shadow-sm cursor-pointer ${
            activeBigDon
              ? 'bg-amber-100 border-amber-600 ring-4 ring-amber-400/40 scale-95'
              : 'bg-white border-amber-300 hover:border-amber-500 hover:bg-amber-50/50'
          }`}
        >
          <div className="text-xl sm:text-2xl font-arcade font-bold text-amber-600 flex items-center gap-1.5">
            <kbd className="px-2 py-0.5 bg-amber-600 text-white rounded border border-amber-700 text-sm sm:text-base font-mono">D</kbd>
            <span>ドン(大)</span>
          </div>
          <div className="text-xs text-amber-800 font-medium mt-1">大きな赤い音符 (Fでも可)</div>
        </button>

        {/* Fキー: ドン (通常) */}
        <button
          onClick={() => onHit('don')}
          className={`flex flex-col items-center justify-center py-2.5 sm:py-3.5 px-3 rounded-xl border-2 transition-all active:scale-95 shadow-sm cursor-pointer ${
            activeDon
              ? 'bg-red-100 border-red-600 ring-4 ring-red-400/40 scale-95'
              : 'bg-white border-red-300 hover:border-red-500 hover:bg-red-50/50'
          }`}
        >
          <div className="text-xl sm:text-2xl font-arcade font-bold text-red-600 flex items-center gap-1.5">
            <kbd className="px-2 py-0.5 bg-red-600 text-white rounded border border-red-700 text-sm sm:text-base font-mono">F</kbd>
            <span>ドン</span>
          </div>
          <div className="text-xs text-red-800 font-medium mt-1">赤音符 (大音符も叩けます)</div>
        </button>

        {/* Jキー: カッ (通常) */}
        <button
          onClick={() => onHit('ka')}
          className={`flex flex-col items-center justify-center py-2.5 sm:py-3.5 px-3 rounded-xl border-2 transition-all active:scale-95 shadow-sm cursor-pointer ${
            activeKa
              ? 'bg-blue-100 border-blue-600 ring-4 ring-blue-400/40 scale-95'
              : 'bg-white border-blue-300 hover:border-blue-500 hover:bg-blue-50/50'
          }`}
        >
          <div className="text-xl sm:text-2xl font-arcade font-bold text-blue-600 flex items-center gap-1.5">
            <kbd className="px-2 py-0.5 bg-blue-600 text-white rounded border border-blue-700 text-sm sm:text-base font-mono">J</kbd>
            <span>カッ</span>
          </div>
          <div className="text-xs text-blue-800 font-medium mt-1">青音符 (大音符も叩けます)</div>
        </button>

        {/* Kキー: カッ（大） */}
        <button
          onClick={() => onHit('ka-big')}
          className={`flex flex-col items-center justify-center py-2.5 sm:py-3.5 px-3 rounded-xl border-2 transition-all active:scale-95 shadow-sm cursor-pointer ${
            activeBigKa
              ? 'bg-cyan-100 border-cyan-600 ring-4 ring-cyan-400/40 scale-95'
              : 'bg-white border-cyan-300 hover:border-cyan-500 hover:bg-cyan-50/50'
          }`}
        >
          <div className="text-xl sm:text-2xl font-arcade font-bold text-cyan-600 flex items-center gap-1.5">
            <kbd className="px-2 py-0.5 bg-cyan-600 text-white rounded border border-cyan-700 text-sm sm:text-base font-mono">K</kbd>
            <span>カッ(大)</span>
          </div>
          <div className="text-xs text-cyan-800 font-medium mt-1">大きな青い音符 (Jでも可)</div>
        </button>
      </div>
    </div>
  );
};
