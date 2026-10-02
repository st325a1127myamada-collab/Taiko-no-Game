/**
 * 収録楽曲＆音符データ (超高難易度・極鬼譜面アレンジ)
 * 曲開始3秒待機後に右端から滑らかに音符が流入してくるよう配置
 */

import { SongData } from '../types/game';

// 楽曲1: 夏祭りラプソディ (超達人・超激辛鬼譜面) - BPM 144
// 祭り囃子の狂乱のクライマックス！高速16分乱打、交互打ち、怒涛の大音符ラッシュ
const song1Notes: { time: number; type: 'don' | 'ka' | 'don-big' | 'ka-big' }[] = [
  // 導入（疾走イントロ＆3連打: 3秒待機後に画面右端から流入）
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

  // 高速5連打ラッシュ
  { time: 3900, type: 'don' },
  { time: 4040, type: 'don' },
  { time: 4180, type: 'ka' },
  { time: 4320, type: 'ka' },
  { time: 4460, type: 'don' },
  { time: 4750, type: 'ka-big' },

  // Aメロ: ドン・カッ高速交互乱打
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

  // 16分音符 怒涛の6連打 × 2セット
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

  // Bメロ: 変則シンコペーション＆超速トリプレット
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

  // サビ前ビルドアップ: 息もつかせぬ16分ノンストップ10連打
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

  // サビ: 狂乱の祭り囃子 乱打地獄
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

  // サビ後半: 超高速16分交互乱舞
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

  // フィナーレ前超絶ドラムロール
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

  // クライマックス・怒涛の連続大音符＆フィニッシュ
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
  { time: 28100, type: 'don-big' },
];

// 楽曲2: 初陣の調べ (超上級・激闘乱舞) - BPM 138
// 軍勢の進撃を告げる高速騎馬疾走！ドドコドドコと16分交互打ちが襲いかかる激辛譜面
const song2Notes: { time: number; type: 'don' | 'ka' | 'don-big' | 'ka-big' }[] = [
  // 開幕突撃 (高速3連打: 3秒待機後に画面右端から流入)
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

  // 進撃の蹄音 (ドドン・カッカ)
  { time: 3800, type: 'don' },
  { time: 3950, type: 'don' },
  { time: 4150, type: 'ka' },
  { time: 4300, type: 'ka' },
  { time: 4500, type: 'don' },
  { time: 4650, type: 'don' },
  { time: 4800, type: 'ka' },
  { time: 5050, type: 'ka-big' },

  // 16分音符 5連打 × 2
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

  // 中盤乱戦: ドン・カッ高速シャッフル
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

  // 後半突撃: 16分超連打コンボ (8連打)
  { time: 11000, type: 'don' },
  { time: 11140, type: 'don' },
  { time: 11280, type: 'don' },
  { time: 11420, type: 'don' },
  { time: 11560, type: 'ka' },
  { time: 11700, type: 'ka' },
  { time: 11840, type: 'ka' },
  { time: 11980, type: 'ka' },
  { time: 12250, type: 'don-big' },

  // 複合スウィッチ
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

  // 決戦フィナーレ: 連続大音符と超速フィニッシュ
  { time: 15300, type: 'don' },
  { time: 15440, type: 'don' },
  { time: 15580, type: 'don' },
  { time: 15720, type: 'ka' },
  { time: 15860, type: 'ka' },
  { time: 16000, type: 'ka' },
  { time: 16140, type: 'don' },
  { time: 16280, type: 'ka' },
  { time: 16500, type: 'don-big' },
  { time: 16850, type: 'ka-big' },
  { time: 17200, type: 'don-big' },
  { time: 17550, type: 'ka-big' },
  { time: 18000, type: 'don-big' },
];

// 楽曲3: 雷神乱舞 (極限・神速鬼滅級) - BPM 172
// 超高速BPMで息つく暇もない怒涛のドラムロールと電光石火の乱打地獄
const song3Notes: { time: number; type: 'don' | 'ka' | 'don-big' | 'ka-big' }[] = [
  // 開幕から超速4連打 (3秒待機後に画面右端から流入)
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

  // 電撃ロール 1 (16分高速交互)
  { time: 3750, type: 'don' },
  { time: 3870, type: 'don' },
  { time: 3990, type: 'ka' },
  { time: 4110, type: 'ka' },
  { time: 4230, type: 'don' },
  { time: 4350, type: 'ka' },
  { time: 4470, type: 'don' },
  { time: 4590, type: 'ka' },
  { time: 4800, type: 'ka-big' },

  // 電撃ロール 2 (逆パターン)
  { time: 5200, type: 'ka' },
  { time: 5320, type: 'ka' },
  { time: 5440, type: 'don' },
  { time: 5560, type: 'don' },
  { time: 5680, type: 'ka' },
  { time: 5800, type: 'don' },
  { time: 5920, type: 'ka' },
  { time: 6040, type: 'don' },
  { time: 6250, type: 'don-big' },

  // 16分ノンストップ 10連打 (怒涛の電光石火)
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

  // 雷光複合スウィッチ
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

  // 稲妻乱舞 (超高速交互)
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

  // クライマックス疾風怒濤 12連打
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

  // 最期の電撃クアドラプル大音符フィニッシュ
  { time: 14100, type: 'don' },
  { time: 14220, type: 'don' },
  { time: 14340, type: 'ka' },
  { time: 14460, type: 'ka' },
  { time: 14680, type: 'don-big' },
  { time: 14980, type: 'ka-big' },
  { time: 15280, type: 'don-big' },
  { time: 15600, type: 'ka-big' },
  { time: 16000, type: 'don-big' },
];

export const SONGS: SongData[] = [
  {
    id: 'matsuri-rhapsody',
    title: '夏祭りラプソディ',
    subtitle: '超達人・超激辛鬼譜面 (BPM 144)',
    bpm: 144,
    duration: 30000, // 30秒
    difficulty: '上級',
    notes: song1Notes,
  },
  {
    id: 'beginner-march',
    title: '初陣の調べ',
    subtitle: '超上級・激闘乱舞 (BPM 138)',
    bpm: 138,
    duration: 19500, // 19.5秒
    difficulty: '上級',
    notes: song2Notes,
  },
  {
    id: 'raijin-dance',
    title: '雷神乱舞',
    subtitle: '極限・神速鬼滅級 (BPM 172)',
    bpm: 172,
    duration: 17500, // 17.5秒
    difficulty: '上級',
    notes: song3Notes,
  },
];
