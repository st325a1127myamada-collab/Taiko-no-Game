/**
 * タイトル画面コンポーネント (白を基調とした爽快な和風アーケードデザイン)
 * キャラクターアイコン非表示、操作説明（大音符もF/Jで打鍵可能）明記
 */

import React from 'react';
import { SongData, GameSettings } from '../types/game';
import { SONGS } from '../utils/songData';
import { Play, Volume2, FastForward, FileCode, CheckCircle2, Flame } from 'lucide-react';

interface TitleScreenProps {
  onStart: (song: SongData) => void;
  selectedSong: SongData;
  onSelectSong: (song: SongData) => void;
  settings: GameSettings;
  onUpdateSettings: (settings: Partial<GameSettings>) => void;
  onOpenCodeModal: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStart,
  selectedSong,
  onSelectSong,
  settings,
  onUpdateSettings,
  onOpenCodeModal,
}) => {
  return (
    <div className="relative min-h-[640px] w-full max-w-5xl mx-auto rounded-3xl overflow-hidden border-2 border-amber-300 shadow-xl bg-white flex flex-col justify-between p-4 sm:p-8">
      {/* 祭りの背景バナー (淡い透過で明るい白背景に調和) */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/matsuri_bg_banner_1790914698854.jpg"
          alt="祭り背景"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-10 filter brightness-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/90 to-white" />
      </div>

      {/* メインコンテンツ */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto w-full pt-4">
        {/* ゲームタイトル */}
        <h1 className="text-4xl sm:text-6xl font-arcade font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-amber-600 to-red-600 drop-shadow-xs mb-3">
          太鼓リズムゲーム
        </h1>
        <p className="text-sm sm:text-base text-slate-600 font-medium mb-6">
          ブラウザで魂を揺さぶる超高難易度和太鼓セッション！ドンとカッでリズムを刻もう
        </p>

        {/* 楽曲選択カード */}
        <div className="w-full mb-6">
          <div className="text-xs text-amber-800 font-bold mb-2 flex items-center justify-center gap-1.5">
            <Flame className="w-4 h-4 text-red-500" />
            <span>演奏曲を選択 (高難易度アレンジ版)</span>
            <Flame className="w-4 h-4 text-red-500" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SONGS.map((song) => {
              const isSelected = song.id === selectedSong.id;
              return (
                <button
                  key={song.id}
                  onClick={() => onSelectSong(song)}
                  className={`p-3.5 rounded-xl border-2 transition-all flex flex-col items-start text-left cursor-pointer ${
                    isSelected
                      ? 'bg-amber-50/90 border-amber-500 ring-2 ring-amber-400/40 shadow-md scale-102'
                      : 'bg-white border-slate-200 hover:border-slate-400 hover:bg-slate-50 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        song.difficulty === '初級'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : song.difficulty === '中級'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-red-100 text-red-800 border border-red-300'
                      }`}
                    >
                      {song.difficulty}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">BPM {song.bpm}</span>
                  </div>
                  <div className="text-base font-bold text-slate-900 flex items-center gap-1">
                    {song.title}
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-600 ml-auto" />}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{song.subtitle}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* STARTボタン */}
        <button
          onClick={() => onStart(selectedSong)}
          className="group relative px-12 sm:px-16 py-4 sm:py-5 rounded-full bg-gradient-to-r from-red-600 via-amber-500 to-red-600 bg-[length:200%_auto] hover:bg-right transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg border-2 border-yellow-300 mb-6 cursor-pointer"
        >
          <div className="flex items-center gap-3 text-2xl sm:text-3xl font-arcade font-bold text-white tracking-widest drop-shadow">
            <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white" />
            <span>START</span>
          </div>
        </button>

        {/* 操作方法ガイド (仕様要件 & 大音符F/J対応の明記) */}
        <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm mb-4 text-left">
          <div className="text-xs font-arcade font-bold text-amber-800 mb-2 border-b border-slate-200 pb-1 flex items-center justify-between">
            <span>操作方法</span>
            <span className="text-[11px] text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded-full">
              ★ 大音符も F や J キーでそのまま叩けます！
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs sm:text-sm font-medium">
            <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-red-200 shadow-xs">
              <kbd className="px-2.5 py-1 bg-red-600 text-white font-bold rounded shadow text-xs">F</kbd>
              <div>
                <div className="font-bold text-red-600">ドン</div>
                <div className="text-[10px] text-slate-500">赤音符 / 大音符もOK</div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-blue-200 shadow-xs">
              <kbd className="px-2.5 py-1 bg-blue-600 text-white font-bold rounded shadow text-xs">J</kbd>
              <div>
                <div className="font-bold text-blue-600">カッ</div>
                <div className="text-[10px] text-slate-500">青音符 / 大音符もOK</div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-amber-200 shadow-xs">
              <kbd className="px-2.5 py-1 bg-amber-600 text-white font-bold rounded shadow text-xs">D</kbd>
              <div>
                <div className="font-bold text-amber-600">ドン(大)</div>
                <div className="text-[10px] text-slate-500">大赤音符 (Fでも可)</div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-cyan-200 shadow-xs">
              <kbd className="px-2.5 py-1 bg-cyan-600 text-white font-bold rounded shadow text-xs">K</kbd>
              <div>
                <div className="font-bold text-cyan-600">カッ(大)</div>
                <div className="text-[10px] text-slate-500">大青音符 (Jでも可)</div>
              </div>
            </div>
          </div>
        </div>

        {/* クイック設定 & 3ファイル書き出しボタン */}
        <div className="w-full flex flex-wrap items-center justify-between gap-3 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-xs">
          {/* 流速設定 */}
          <div className="flex items-center gap-2">
            <FastForward className="w-4 h-4 text-amber-600" />
            <span className="font-medium">譜面速度:</span>
            {[1.0, 1.2, 1.5].map((speed) => (
              <button
                key={speed}
                onClick={() => onUpdateSettings({ scrollSpeed: speed })}
                className={`px-2 py-0.5 rounded font-mono cursor-pointer ${
                  settings.scrollSpeed === speed
                    ? 'bg-amber-500 text-white font-bold shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                {speed.toFixed(1)}x
              </button>
            ))}
          </div>

          {/* 音量調整 */}
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-amber-600" />
            <span>SE:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.seVolume}
              onChange={(e) => onUpdateSettings({ seVolume: parseFloat(e.target.value) })}
              className="w-16 accent-amber-600"
            />
            <span className="ml-1">BGM:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.bgmVolume}
              onChange={(e) => onUpdateSettings({ bgmVolume: parseFloat(e.target.value) })}
              className="w-16 accent-amber-600"
            />
          </div>

          {/* 3ファイル書き出しモーダル呼び出しボタン */}
          <button
            onClick={onOpenCodeModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-amber-800 border border-amber-300 transition-colors ml-auto font-medium shadow-xs cursor-pointer"
          >
            <FileCode className="w-4 h-4 text-amber-600" />
            <span>3ファイル出力 (HTML/CSS/JS)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
