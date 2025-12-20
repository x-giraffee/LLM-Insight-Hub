import React, { useState, useMemo } from 'react';
import { Hash, Code, Info, ChevronRight, Zap, Terminal, Copy, List } from 'lucide-react';

interface TokenPiece {
  text: string;
  id: number;
  type: 'cjk' | 'latin' | 'special' | 'space';
  bytes: string[];
}

const TokenizationLab: React.FC = () => {
  const [inputText, setInputText] = useState("<｜User｜>你好 DeepSeek，帮我写一段 Python 代码。");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Simulated DeepSeek Tokenizer (Heuristic BPE)
  const tokens: TokenPiece[] = useMemo(() => {
    if (!inputText) return [];
    
    // DeepSeek typical special tokens
    const specialTokens = ["<｜User｜>", "<｜Assistant｜>", "<｜begin of sentence｜>", "<｜end of sentence｜>"];
    
    // 1. First, separate special tokens
    let parts: string[] = [inputText];
    specialTokens.forEach(st => {
      let newParts: string[] = [];
      parts.forEach(p => {
        if (specialTokens.includes(p)) {
          newParts.push(p);
        } else {
          const split = p.split(st);
          split.forEach((s, i) => {
            if (s) newParts.push(s);
            if (i < split.length - 1) newParts.push(st);
          });
        }
      });
      parts = newParts;
    });

    // 2. Further split remaining parts using BPE heuristic
    const finalTokens: TokenPiece[] = [];
    parts.forEach(part => {
      if (specialTokens.includes(part)) {
        finalTokens.push({
          text: part,
          id: 100000 + specialTokens.indexOf(part),
          type: 'special',
          bytes: ['[Special]']
        });
        return;
      }

      // Match logic for CJK, Latin words, and spaces
      const regex = /[\u4e00-\u9fa5]{1,2}|[a-zA-Z]+|\s+|[^\w\s\u4e00-\u9fa5]/g;
      const matches = part.match(regex) || [];
      
      matches.forEach(m => {
        const text = m;
        let type: 'cjk' | 'latin' | 'special' | 'space' = 'latin';
        if (/[\u4e00-\u9fa5]/.test(text)) type = 'cjk';
        else if (/^\s+$/.test(text)) type = 'space';
        else if (/[^a-zA-Z0-9]/.test(text)) type = 'special';

        // Deterministic pseudo-ID (similar to actual vocab mapping)
        const id = Math.abs(text.split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)) % 100000;
        
        // Convert to UTF-8 Bytes
        const bytes = Array.from(new TextEncoder().encode(text)).map(b => b.toString(16).toUpperCase().padStart(2, '0'));

        finalTokens.push({ text, id, type, bytes });
      });
    });

    return finalTokens;
  }, [inputText]);

  const typeColors = {
    cjk: 'border-blue-500/30 bg-blue-500/5 text-blue-400',
    latin: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400',
    special: 'border-purple-500/50 bg-purple-500/20 text-purple-300 font-bold',
    space: 'border-slate-700 bg-slate-800/30 text-slate-500'
  };

  const copyToClipboard = () => {
    const ids = tokens.map(t => t.id).join(', ');
    navigator.clipboard.writeText(`[${ids}]`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Explanation */}
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
            <Zap className="w-3 h-3" />
            DeepSeek V3 Tokenization Logic
          </div>
          <h3 className="text-2xl font-bold">Token 是如何诞生的？</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            大模型并不直接读文字，而是读取 <b>Token ID</b>。DeepSeek 使用了一种叫 <b>BPE (Byte Pair Encoding)</b> 的算法。它会尝试将常用的字符组合合并成一个 Token，以提高压缩率。
          </p>
          
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">测试分词器 (Live Input)</label>
            <textarea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full h-24 bg-slate-900 border border-white/10 rounded-xl p-4 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
              placeholder="输入内容..."
            />
          </div>

          {/* New Summary View: Token ID Sequence */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <List className="w-3 h-3 text-blue-400" />
                Token ID 序列汇总 (Full Sequence)
              </label>
              <button 
                onClick={copyToClipboard}
                className="text-[10px] flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
              >
                <Copy className="w-3 h-3" />
                复制 ID 序列
              </button>
            </div>
            <div className="p-4 bg-black/40 rounded-xl border border-white/10 font-mono text-[11px] leading-relaxed text-blue-300/80 min-h-[60px] break-all">
              {tokens.length > 0 ? (
                <div className="flex flex-wrap gap-x-2 gap-y-1">
                  <span className="text-slate-600">[</span>
                  {tokens.map((t, i) => (
                    <span 
                      key={i} 
                      onMouseEnter={() => setHoveredIdx(i)}
                      onMouseLeave={() => setHoveredIdx(null)}
                      className={`transition-colors cursor-help ${hoveredIdx === i ? 'text-white font-bold underline decoration-blue-500 underline-offset-4' : ''}`}
                    >
                      {t.id}{i < tokens.length - 1 ? <span className="text-slate-700 font-normal">,</span> : ''}
                    </span>
                  ))}
                  <span className="text-slate-600">]</span>
                </div>
              ) : (
                <span className="text-slate-700 italic">等待输入生成 ID...</span>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 p-4 bg-white/5 rounded-xl border border-white/5">
              <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Token 数量</div>
              <div className="text-xl font-mono text-white">{tokens.length}</div>
            </div>
            <div className="flex-1 p-4 bg-white/5 rounded-xl border border-white/5">
              <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">平均压缩比</div>
              <div className="text-xl font-mono text-white">{(inputText.length / tokens.length).toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Right: Visualization */}
        <div className="w-full lg:w-[450px] space-y-4">
          <div className="bg-slate-900 rounded-2xl border border-white/10 overflow-hidden flex flex-col h-[500px]">
            <div className="p-4 bg-slate-800/50 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-slate-300">Tokenizer Output</span>
              </div>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500/50" />
                <div className="w-2 h-2 rounded-full bg-amber-500/50" />
                <div className="w-2 h-2 rounded-full bg-green-500/50" />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-2">
              <div className="flex flex-wrap gap-1.5 mb-6">
                {tokens.map((t, i) => (
                  <button
                    key={i}
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    className={`px-2 py-1 rounded text-xs border transition-all 
                      ${typeColors[t.type]} 
                      ${hoveredIdx === i ? 'scale-110 ring-2 ring-white/20 z-10 shadow-lg shadow-black' : ''}`}
                  >
                    {t.text === ' ' ? '␣' : t.text.replace(/\n/g, '↵')}
                  </button>
                ))}
              </div>

              {hoveredIdx !== null && tokens[hoveredIdx] ? (
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Token 详情</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${typeColors[tokens[hoveredIdx].type]}`}>
                      {tokens[hoveredIdx].type}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">原始文本</span>
                      <span className="text-sm font-bold text-white">"{tokens[hoveredIdx].text}"</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">词表 ID</span>
                      <span className="text-sm font-mono text-blue-400 font-bold">{tokens[hoveredIdx].id}</span>
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-xs text-slate-400">UTF-8 字节流</span>
                      <div className="flex flex-wrap gap-1">
                        {tokens[hoveredIdx].bytes.map((b, bi) => (
                          <span key={bi} className="px-1.5 py-0.5 bg-black/40 rounded text-[10px] font-mono text-slate-300 border border-white/5">
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-40 flex flex-col items-center justify-center text-slate-600 gap-2 border-2 border-dashed border-white/5 rounded-xl">
                  <Info className="w-5 h-5 opacity-20" />
                  <span className="text-xs italic text-center px-6">悬停 ID 汇总区或 Token 块查看详细映射关系</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Concept Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-blue-500/5 rounded-2xl border border-blue-500/20">
          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
            <Code className="w-4 h-4 text-blue-400" />
          </div>
          <h4 className="font-bold mb-2 text-sm">什么是 BPE？</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Byte Pair Encoding (字节对编码)。它从最基本的字节开始，重复合并最常出现的序列，直到达到词表大小限制。
          </p>
        </div>
        <div className="p-5 bg-purple-500/5 rounded-2xl border border-purple-500/20">
          <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
            <Hash className="w-4 h-4 text-purple-400" />
          </div>
          <h4 className="font-bold mb-2 text-sm">DeepSeek 的高效词表</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            DeepSeek 拥有 10 万+ 的词表。它对中文和代码进行了优化，使得中文字符在 Token 消耗上比 GPT 更低。
          </p>
        </div>
        <div className="p-5 bg-emerald-500/5 rounded-2xl border border-emerald-500/20">
          <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4">
            <ChevronRight className="w-4 h-4 text-emerald-400" />
          </div>
          <h4 className="font-bold mb-2 text-sm">为什么 1 字符 ≠ 1 Token？</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            常见词汇（如 "the", "你好"）可能占 1 Token，而罕见字眼或符号可能被拆成多个 Token 甚至退化为原始字节。
          </p>
        </div>
      </div>
    </div>
  );
};

export default TokenizationLab;