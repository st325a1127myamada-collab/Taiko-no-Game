/**
 * 太鼓リズムゲーム メインレーンコンポーネント (白を基調とした高視認性Canvas描画)
 * 白・アイボリーの明るいレーン上を右から左へ鮮やかな赤と青の音符が滑らかに流れます
 */

import React, { useEffect, useRef } from 'react';
import { NoteItem, JudgmentType } from '../types/game';

interface TaikoLaneProps {
  notes: NoteItem[];
  currentTime: number;       // 現在の再生時間 (ms)
  scrollSpeed: number;       // スクロール速度倍率 (1.0 = 標準)
  latestJudgment: { type: JudgmentType; timestamp: number } | null;
  targetHitFlash: { type: 'don' | 'ka' | 'don-big' | 'ka-big'; timestamp: number } | null;
  milestoneBanner: string | null;
  isCountingDown?: boolean;  // 3秒カウントダウン待機中フラグ（音符を非表示）
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export const TaikoLane: React.FC<TaikoLaneProps> = ({
  notes,
  currentTime,
  scrollSpeed,
  latestJudgment,
  targetHitFlash,
  milestoneBanner,
  isCountingDown = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const lastTimeRef = useRef<number>(performance.now());

  // 判定エフェクト発生時のパーティクル生成
  useEffect(() => {
    if (!latestJudgment) return;
    const now = performance.now();
    if (now - latestJudgment.timestamp > 150) return;

    const count = latestJudgment.type === 'great' ? 24 : latestJudgment.type === 'good' ? 12 : 6;
    const colors =
      latestJudgment.type === 'great'
        ? ['#f59e0b', '#d97706', '#ef4444', '#facc15', '#ffffff']
        : latestJudgment.type === 'good'
        ? ['#0284c7', '#38bdf8', '#60a5fa', '#ffffff']
        : ['#94a3b8', '#dc2626', '#64748b'];

    const targetX = 140;
    const centerY = 85;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      particlesRef.current.push({
        x: targetX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 4 + 2,
        alpha: 1,
        life: 0,
        maxLife: Math.random() * 20 + 20,
      });
    }
  }, [latestJudgment]);

  // Canvasレンダリングループ
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const now = performance.now();
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;
      const targetX = 140; // 判定ラインX座標

      // 1. 白を基調とした爽やかなレーン背景
      ctx.clearRect(0, 0, width, height);

      // レーンのベースグラデーション（柔らかな白〜薄い和紙風の淡いシルバー）
      const bgGrad = ctx.createLinearGradient(0, 0, width, 0);
      bgGrad.addColorStop(0, '#f8fafc');
      bgGrad.addColorStop(0.18, '#ffffff');
      bgGrad.addColorStop(0.6, '#f1f5f9');
      bgGrad.addColorStop(1, '#e2e8f0');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // レーン上下の漆・金箔アクセント境界線
      ctx.fillStyle = '#d97706';
      ctx.fillRect(0, 0, width, 3);
      ctx.fillRect(0, height - 3, width, 3);

      // レーン中央ガイドライン
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(targetX, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();
      ctx.setLineDash([]);

      // 判定ゾーンの背景ハイライト (温かみのある琥珀色の光)
      const targetBgGrad = ctx.createRadialGradient(targetX, centerY, 5, targetX, centerY, 55);
      targetBgGrad.addColorStop(0, 'rgba(245, 158, 11, 0.22)');
      targetBgGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = targetBgGrad;
      ctx.beginPath();
      ctx.arc(targetX, centerY, 55, 0, Math.PI * 2);
      ctx.fill();

      // 2. 判定ライン枠（円形ターゲット）
      ctx.save();
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 3.5;
      ctx.shadowColor = 'rgba(217, 119, 6, 0.5)';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(targetX, centerY, 32, 0, Math.PI * 2);
      ctx.stroke();

      // 内側の同心円
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(targetX, centerY, 24, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // 打撃時のターゲット発光フラッシュ
      if (targetHitFlash && now - targetHitFlash.timestamp < 120) {
        const isDon = targetHitFlash.type.includes('don');
        const isBig = targetHitFlash.type.includes('big');
        const flashRadius = isBig ? 48 : 38;
        ctx.save();
        ctx.strokeStyle = isDon ? '#dc2626' : '#2563eb';
        ctx.lineWidth = 4;
        ctx.shadowColor = isDon ? 'rgba(239, 68, 68, 0.6)' : 'rgba(59, 130, 246, 0.6)';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(targetX, centerY, flashRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 3. 音符の描画 (3秒カウントダウン中は音符を一切描画・流さない)
      if (!isCountingDown) {
        const travelDuration = 1400 / scrollSpeed;
        const travelDistance = width - targetX;

        notes.forEach((note) => {
          if (note.hit) return; // すでに叩かれた音符は非表示

          const timeDiff = note.time - currentTime;
          if (timeDiff > travelDuration * 1.05 || timeDiff < -220) return;

          const x = targetX + (timeDiff / travelDuration) * travelDistance;
          const isDon = note.type === 'don' || note.type === 'don-big';
          const isBig = note.type === 'don-big' || note.type === 'ka-big';
          const radius = isBig ? 32 : 22;

          ctx.save();
          ctx.translate(x, centerY);

          // 大音符の光彩オーラ
          if (isBig) {
            ctx.beginPath();
            ctx.arc(0, 0, radius + 6, 0, Math.PI * 2);
            ctx.fillStyle = isDon ? 'rgba(239, 68, 68, 0.35)' : 'rgba(37, 99, 235, 0.35)';
            ctx.fill();
          }

          // 音符の外枠・本体
          ctx.beginPath();
          ctx.arc(0, 0, radius, 0, Math.PI * 2);
          ctx.fillStyle = isDon ? '#dc2626' : '#2563eb';
          ctx.fill();

          // 音符の縁取り
          ctx.lineWidth = isBig ? 3.5 : 2.5;
          ctx.strokeStyle = '#ffffff';
          ctx.stroke();

          // 音符内部の装飾 (太鼓の和風フェイス)
          ctx.beginPath();
          ctx.arc(0, 0, radius * 0.65, 0, Math.PI * 2);
          ctx.fillStyle = isDon ? '#fee2e2' : '#dbeafe';
          ctx.fill();

          // 音符の文字表示 (ドン / カッ)
          ctx.fillStyle = isDon ? '#991b1b' : '#1e40af';
          ctx.font = `bold ${isBig ? 14 : 11}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(isDon ? 'ドン' : 'カッ', 0, 0);

          ctx.restore();
        });
      }

      // 4. パーティクルの更新と描画
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        p.alpha = 1 - p.life / p.maxLife;

        if (p.life >= p.maxLife) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 5. 判定文字のポップアップ描画 (良 / 可 / 不可)
      if (latestJudgment) {
        const elapsed = now - latestJudgment.timestamp;
        if (elapsed < 500) {
          const progress = elapsed / 500;
          const scale = progress < 0.25 ? 0.6 + progress * 2.5 : 1.2 - (progress - 0.25) * 0.3;
          const alpha = progress < 0.6 ? 1 : 1 - (progress - 0.6) / 0.4;
          const textY = centerY - 55 - progress * 15;

          ctx.save();
          ctx.translate(targetX, textY);
          ctx.scale(scale, scale);
          ctx.globalAlpha = Math.max(0, alpha);
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          let text = '良';
          let textColor = '#d97706';
          let textStroke = '#ffffff';

          if (latestJudgment.type === 'good') {
            text = '可';
            textColor = '#0284c7';
            textStroke = '#ffffff';
          } else if (latestJudgment.type === 'miss') {
            text = '不可';
            textColor = '#dc2626';
            textStroke = '#ffffff';
          }

          ctx.font = "900 28px 'Dela Gothic One', 'Noto Sans JP', sans-serif";
          ctx.lineWidth = 6;
          ctx.strokeStyle = textStroke;
          ctx.strokeText(text, 0, 0);

          ctx.fillStyle = textColor;
          ctx.fillText(text, 0, 0);
          ctx.restore();
        }
      }

      // 6. 節目コンボバナー (50コンボ、100コンボ等)
      if (milestoneBanner) {
        ctx.save();
        ctx.font = "900 32px 'Dela Gothic One', sans-serif";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#d97706';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 6;
        ctx.shadowColor = 'rgba(217, 119, 6, 0.4)';
        ctx.shadowBlur = 10;
        ctx.strokeText(milestoneBanner, width / 2, centerY - 15);
        ctx.fillText(milestoneBanner, width / 2, centerY - 15);
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [notes, currentTime, scrollSpeed, latestJudgment, targetHitFlash, milestoneBanner]);

  return (
    <div className="relative w-full max-w-6xl mx-auto overflow-hidden shadow-md border-x-2 border-b-2 border-amber-300/80 bg-white">
      <canvas
        ref={canvasRef}
        width={1000}
        height={170}
        className="w-full h-[140px] sm:h-[170px] block"
      />
    </div>
  );
};
