/**
 * 3ファイル（index.html, style.css, script.js）コード閲覧・ワンクリックダウンロードモーダル
 * 初心者でもVS Codeでそのまま動かせる完全なコードを提供します。
 */

import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode, CheckCircle2 } from 'lucide-react';
import { STANDALONE_HTML, STANDALONE_CSS, STANDALONE_JS } from '../utils/standaloneCode';

interface CodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeModal: React.FC<CodeModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const [copied, setCopied] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentCode =
    activeTab === 'html'
      ? STANDALONE_HTML
      : activeTab === 'css'
      ? STANDALONE_CSS
      : STANDALONE_JS;

  const currentFilename =
    activeTab === 'html' ? 'index.html' : activeTab === 'css' ? 'style.css' : 'script.js';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(currentFilename);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownloadSingle = (filename: string, content: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    handleDownloadSingle('index.html', STANDALONE_HTML, 'text/html');
    setTimeout(() => {
      handleDownloadSingle('style.css', STANDALONE_CSS, 'text/css');
    }, 200);
    setTimeout(() => {
      handleDownloadSingle('script.js', STANDALONE_JS, 'text/javascript');
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-4xl bg-white border-2 border-amber-300 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* モーダルヘッダー */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-amber-600" />
            <h2 className="text-base sm:text-lg font-arcade text-slate-900">
              スタンドアローン 3ファイル出力 (HTML / CSS / JS)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 説明バナー */}
        <div className="px-5 py-3 bg-amber-50 border-b border-amber-200 text-xs text-amber-900 flex flex-wrap items-center justify-between gap-2">
          <span>
            💡 以下の3ファイルを同一フォルダに保存し、VS Codeやブラウザで開くだけでオフライン動作します。
          </span>
          <button
            onClick={handleDownloadAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>3ファイルを一括ダウンロード</span>
          </button>
        </div>

        {/* タブ切り替えバー */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-slate-100 border-b border-slate-200">
          <div className="flex items-center gap-2">
            {(['html', 'css', 'js'] as const).map((tab) => {
              const name = tab === 'html' ? 'index.html' : tab === 'css' ? 'style.css' : 'script.js';
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-white text-amber-700 border border-slate-300 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {name}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            {/* コピーボタン */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-300 transition-colors shadow-xs cursor-pointer"
            >
              {copied === currentFilename ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">コピー完了！</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>このファイルをコピー</span>
                </>
              )}
            </button>

            {/* 単体ダウンロード */}
            <button
              onClick={() =>
                handleDownloadSingle(
                  currentFilename,
                  currentCode,
                  activeTab === 'html' ? 'text/html' : activeTab === 'css' ? 'text/css' : 'text/javascript'
                )
              }
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-300 transition-colors shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>保存</span>
            </button>
          </div>
        </div>

        {/* コードビューワー */}
        <div className="flex-1 overflow-auto p-4 bg-slate-900 font-mono text-xs text-slate-200 leading-relaxed select-text">
          <pre className="whitespace-pre">
            <code>{currentCode}</code>
          </pre>
        </div>

        {/* フッター */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-600">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>外部通信なし・Web Audio API音源・完全自己完結コード</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors cursor-pointer"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
