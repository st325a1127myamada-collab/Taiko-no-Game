/**
 * 太鼓リズムゲーム 型定義
 */

export type NoteType = 'don' | 'ka' | 'don-big' | 'ka-big';

export type JudgmentType = 'great' | 'good' | 'miss'; // 良 | 可 | 不可

export interface NoteItem {
  id: number;
  time: number;          // 判定ライン到達時刻 (ミリ秒)
  type: NoteType;        // 音符の種類
  hit?: boolean;         // すでに叩かれたか
  judgment?: JudgmentType; // 判定結果
  processed?: boolean;   // ミス処理済みか
}

export interface SongData {
  id: string;
  title: string;
  subtitle: string;
  bpm: number;
  duration: number;      // 曲の長さ (ミリ秒)
  difficulty: '初級' | '中級' | '上級';
  notes: { time: number; type: NoteType }[];
}

export type GameState = 'TITLE' | 'PLAYING' | 'RESULT';

export interface GameSettings {
  scrollSpeed: number;   // 1.0, 1.2, 1.5 など
  bgmVolume: number;     // 0.0 ~ 1.0
  seVolume: number;      // 0.0 ~ 1.0
  timingOffset: number;  // 判定タイミング補正 (ms)
}

export interface GameScoreState {
  score: number;
  combo: number;
  maxCombo: number;
  greatCount: number;    // 良
  goodCount: number;     // 可
  missCount: number;     // 不可
  gauge: number;         // 0 ~ 100%
  isClear: boolean;      // クリア判定 (70%以上)
  milestoneCombo: number | null; // 50, 100 などの演出用
}
