/**
 * Web Audio API 音響エンジン
 * 外部音源・著作権素材を使用せず、純粋なブラウザWeb Audio APIで
 * 太鼓打撃音・カッ音・オリジナル和風祭囃子BGMをリアルタイム合成します。
 */

import { SongData } from '../types/game';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private seVolumeNode: GainNode | null = null;
  private bgmVolumeNode: GainNode | null = null;
  private isBgmPlaying = false;
  private bgmIntervalId: number | null = null;
  private bgmStartTime = 0;
  private seVol = 0.8;
  private bgmVol = 0.55;

  // 初期化（ユーザーの初回クリックやキー入力で起動）
  public init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // マスターSEボリューム
      this.seVolumeNode = this.ctx.createGain();
      this.seVolumeNode.gain.setValueAtTime(this.seVol, this.ctx.currentTime);
      this.seVolumeNode.connect(this.ctx.destination);

      // マスターBGMボリューム
      this.bgmVolumeNode = this.ctx.createGain();
      this.bgmVolumeNode.gain.setValueAtTime(this.bgmVol, this.ctx.currentTime);
      this.bgmVolumeNode.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolumes(se: number, bgm: number) {
    this.seVol = se;
    this.bgmVol = bgm;
    if (this.ctx && this.seVolumeNode && this.bgmVolumeNode) {
      this.seVolumeNode.gain.setValueAtTime(se, this.ctx.currentTime);
      this.bgmVolumeNode.gain.setValueAtTime(bgm, this.ctx.currentTime);
    }
  }

  public getAudioTime(): number {
    return this.ctx ? this.ctx.currentTime : performance.now() / 1000;
  }

  /**
   * ドン（太鼓の中央叩き）低音打撃音
   */
  public playDon(isBig = false) {
    this.init();
    if (!this.ctx || !this.seVolumeNode) return;

    const now = this.ctx.currentTime;
    const mult = isBig ? 1.4 : 1.0;

    // 1. 低音太鼓振動 (ピッチ急降下サイン波)
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();

    osc.type = 'sine';
    const startFreq = isBig ? 180 : 155;
    const endFreq = isBig ? 36 : 48;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + (isBig ? 0.28 : 0.18));

    oscGain.gain.setValueAtTime(0.001, now);
    oscGain.gain.linearRampToValueAtTime(0.9 * mult, now + 0.004);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + (isBig ? 0.35 : 0.22));

    // 2. 太鼓の皮のアタックノイズ（打撃の破裂音）
    const noiseBuffer = this.createNoiseBuffer(0.05);
    const noiseNode = this.ctx.createBufferSource();
    noiseNode.buffer = noiseBuffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(isBig ? 450 : 380, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.6 * mult, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    noiseNode.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.seVolumeNode);

    osc.connect(oscGain);
    oscGain.connect(this.seVolumeNode);

    osc.start(now);
    noiseNode.start(now);
    osc.stop(now + 0.4);
    noiseNode.stop(now + 0.05);
  }

  /**
   * カッ（太鼓のフチ叩き）高音・鋭い木製打撃音
   */
  public playKa(isBig = false) {
    this.init();
    if (!this.ctx || !this.seVolumeNode) return;

    const now = this.ctx.currentTime;
    const mult = isBig ? 1.35 : 1.0;

    // 1. フチの金属・硬質木材振動（トライアングル波）
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();

    osc.type = 'triangle';
    const startFreq = isBig ? 620 : 540;
    const endFreq = isBig ? 380 : 330;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.08);

    oscGain.gain.setValueAtTime(0.001, now);
    oscGain.gain.linearRampToValueAtTime(0.85 * mult, now + 0.002);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + (isBig ? 0.14 : 0.09));

    // 2. 高域クラックノイズ（パチッという響き）
    const noiseBuffer = this.createNoiseBuffer(0.06);
    const noiseNode = this.ctx.createBufferSource();
    noiseNode.buffer = noiseBuffer;

    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(isBig ? 2400 : 2800, now);
    bandpass.Q.setValueAtTime(3.0, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.7 * mult, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    noiseNode.connect(bandpass);
    bandpass.connect(noiseGain);
    noiseGain.connect(this.seVolumeNode);

    osc.connect(oscGain);
    oscGain.connect(this.seVolumeNode);

    osc.start(now);
    noiseNode.start(now);
    osc.stop(now + 0.15);
    noiseNode.stop(now + 0.06);
  }

  /**
   * 不可（ミス）時の鈍い効果音
   */
  public playMiss() {
    this.init();
    if (!this.ctx || !this.seVolumeNode) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.12);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, now);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.seVolumeNode);

    osc.start(now);
    osc.stop(now + 0.13);
  }

  /**
   * コンボ節目・クリアファンファーレ
   */
  public playFanfare(isMilestone = false) {
    this.init();
    if (!this.ctx || !this.seVolumeNode) return;

    const now = this.ctx.currentTime;
    // 雅な和風の調べ（レ・ソ・ラ・高レ）
    const freqs = isMilestone ? [587.33, 880.0, 1174.66] : [440, 587.33, 659.25, 880, 1174.66];
    freqs.forEach((freq, idx) => {
      if (!this.ctx || !this.seVolumeNode) return;
      const noteTime = now + idx * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.001, noteTime);
      gain.gain.linearRampToValueAtTime(0.3, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.5);

      osc.connect(gain);
      gain.connect(this.seVolumeNode);

      osc.start(noteTime);
      osc.stop(noteTime + 0.52);
    });
  }

  /**
   * 和風オリジナル祭囃子BGMシーケンサー
   * 和音階（陽旋法・陰旋法）を用いた篠笛・三味線・拍子木リズムのリアルタイム合成
   */
  public startBgm(song: SongData, onEnded?: () => void) {
    this.init();
    this.stopBgm();
    if (!this.ctx || !this.bgmVolumeNode) return;

    this.isBgmPlaying = true;
    this.bgmStartTime = this.ctx.currentTime;

    const bpm = song.bpm;
    const beatSec = 60 / bpm;
    const totalDurationSec = song.duration / 1000;

    // 和風スケール（D, F, G, A, C - Dマイナーペンタトニック/祭囃子調）
    const melodyScale = [293.66, 349.23, 392.00, 440.00, 523.25, 587.33, 698.46, 783.99];
    const bassScale = [146.83, 174.61, 196.00, 220.00];

    // 先読みスケジューリングループ (Lookahead scheduler)
    let currentBeat = 0;
    const scheduleAheadTime = 0.2; // 200ms先までスケジューリング
    let nextNoteTime = this.ctx.currentTime;

    const schedule = () => {
      if (!this.isBgmPlaying || !this.ctx) return;

      const elapsed = this.ctx.currentTime - this.bgmStartTime;
      if (elapsed >= totalDurationSec) {
        this.stopBgm();
        if (onEnded) onEnded();
        return;
      }

      while (nextNoteTime < this.ctx.currentTime + scheduleAheadTime) {
        // 1. 拍子木 / ウッドブロック（表拍・裏拍）
        this.synthWoodblock(nextNoteTime, currentBeat % 2 === 0 ? 980 : 820, currentBeat % 4 === 0 ? 0.35 : 0.2);

        // 2. 太鼓リズム伴奏（ドン・ドドン）
        const measureStep = currentBeat % 8;
        if (measureStep === 0 || measureStep === 2 || measureStep === 5 || measureStep === 6) {
          this.synthBgmDrum(nextNoteTime, measureStep === 0 ? 120 : 100, 0.4);
        }

        // 3. 和風ベース / 三味線ピッチ
        const bassFreq = bassScale[(currentBeat + Math.floor(currentBeat / 8)) % bassScale.length];
        this.synthShamisenBass(nextNoteTime, bassFreq, beatSec * 0.7);

        // 4. 篠笛（しのぶえ）風リードメロディ（8分音符単位でフレーズ展開）
        const phrasePattern = [0, 2, 4, 3, 5, 4, 2, 1, 0, 3, 5, 7, 5, 4, 2, 0];
        const melodyIdx = phrasePattern[currentBeat % phrasePattern.length];
        const melodyFreq = melodyScale[melodyIdx % melodyScale.length];
        this.synthFluteMelody(nextNoteTime, melodyFreq, beatSec * 0.85);

        // 次の拍
        nextNoteTime += beatSec * 0.5; // 8分音符で進む
        currentBeat++;
      }
    };

    this.bgmIntervalId = window.setInterval(schedule, 40);
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmIntervalId !== null) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
  }

  // 内部音響合成ヘルパー: 篠笛（しのぶえ）
  private synthFluteMelody(time: number, freq: number, duration: number) {
    if (!this.ctx || !this.bgmVolumeNode) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // 笛の息遣い用ローパス
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 3, time);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    // 笛のビブラート（自然な揺らぎ）
    const vibrato = this.ctx.createOscillator();
    const vibGain = this.ctx.createGain();
    vibrato.frequency.setValueAtTime(5.5, time); // 5.5Hz ビブラート
    vibGain.gain.setValueAtTime(freq * 0.02, time);
    vibrato.connect(osc.frequency);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(0.22, time + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.bgmVolumeNode);

    osc.start(time);
    vibrato.start(time);
    osc.stop(time + duration);
    vibrato.stop(time + duration);
  }

  // 内部音響合成ヘルパー: 三味線・琴調の撥弦音
  private synthShamisenBass(time: number, freq: number, duration: number) {
    if (!this.ctx || !this.bgmVolumeNode) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq * 1.8, time);
    filter.Q.setValueAtTime(2.5, time);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(0.28, time + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.bgmVolumeNode);

    osc.start(time);
    osc.stop(time + duration);
  }

  // 内部音響合成ヘルパー: 拍子木・ウッドブロック
  private synthWoodblock(time: number, freq: number, vol: number) {
    if (!this.ctx || !this.bgmVolumeNode) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.6, time + 0.04);

    gain.gain.setValueAtTime(vol * 0.5, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.045);

    osc.connect(gain);
    gain.connect(this.bgmVolumeNode);

    osc.start(time);
    osc.stop(time + 0.05);
  }

  // 内部音響合成ヘルパー: BGMリズム太鼓
  private synthBgmDrum(time: number, startFreq: number, vol: number) {
    if (!this.ctx || !this.bgmVolumeNode) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, time);
    osc.frequency.exponentialRampToValueAtTime(45, time + 0.15);

    gain.gain.setValueAtTime(vol * 0.6, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.16);

    osc.connect(gain);
    gain.connect(this.bgmVolumeNode);

    osc.start(time);
    osc.stop(time + 0.17);
  }

  // ホワイトノイズ生成バッファ
  private createNoiseBuffer(durationSec: number): AudioBuffer {
    if (!this.ctx) {
      throw new Error('AudioContext not ready');
    }
    const sampleRate = this.ctx.sampleRate;
    const bufferSize = Math.floor(sampleRate * durationSec);
    const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }
}

export const soundEngine = new SoundEngine();
