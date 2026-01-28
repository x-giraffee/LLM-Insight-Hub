import React, { useState, useMemo } from 'react';
import { Maximize2, AlertTriangle, Layers, Info } from 'lucide-react';

const ContextWindowSim: React.FC = () => {
  const [windowSize, setWindowSize] = useState(8192); // 8k default
  const [inputText, setInputText] = useState("你好！上下文窗口（Context Window）是大模型一次推理能“看见”的最大 Token 数量。超过这个长度，模型就会遗忘之前的信息。");
  
  // A more realistic pseudo-tokenizer for visualization and counting
  // This handles CJK characters and Latin words separately
  const tokenSegments = useMemo<string[]>(() => {
    if (!inputText) return [];
    
    // Regex explanation:
    // [\u4e00-\u9fa5] : Match individual CJK characters
    // [a-zA-Z0-9]+ : Match Latin word/number chunks
    // \s+ : Match whitespace (as separate tokens often)
    // [^\w\s\u4e00-\u9fa5] : Match punctuation
    const regex = /[\u4e00-\u9fa5]|[a-zA-Z0-9]+|\s+|[^\w\s\u4e00-\u9fa5]/g;
    return inputText.match(regex) || [];
  }, [inputText]);

  // Estimation: 
  // - Latin chunks are roughly 1.3 tokens per word
  // - CJK characters are roughly 1.5 - 2 tokens per character in modern tokenizers
  const estimatedTokenCount = useMemo(() => {
    return tokenSegments.reduce((acc, segment) => {
      if (/[\u4e00-\u9fa5]/.test(segment)) return acc + 2; // CJK estimate
      if (/\s+/.test(segment)) return acc + 0.5; // Spaces usually merge or take less
      return acc + 1.2; // Latin/Other estimate
    }, 0);
  }, [tokenSegments]);

  const tokenCount = Math.ceil(estimatedTokenCount);
  const usagePercent = (tokenCount / windowSize) * 100;

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-purple-400">上下文窗口 (Context Window)</h3>
          <p className="text-slate-400 leading-relaxed">
            上下文窗口是模型一次推理能“看见”的最大 Token 数量。由于模型是基于 Token 而非字符处理的，<b>中文字符通常比英文字符占用更多 Token。</b>
          </p>
          
          <div className="p-4 bg-slate-900/50 rounded-xl border border-white/5 space-y-4">
            <div className="flex justify-between items-center text-sm font-bold">
              <span>选择窗口规格</span>
              <span className="text-purple-400 font-mono">{(windowSize/1024).toFixed(0)}K Tokens</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[4096, 8192, 32768, 128000].map(size => (
                <button 
                  key={size}
                  onClick={() => setWindowSize(size)}
                  className={`py-2 text-[10px] font-bold rounded-lg border transition-all
                    ${windowSize === size 
                      ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20' 
                      : 'bg-white/5 border-white/10 text-slate-500 hover:text-slate-300'}`}
                >
                  {(size/1024).toFixed(0)}K
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end mb-2">
            <div className="flex items-center gap-2">
              <Maximize2 className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-bold">显存/记忆消耗</span>
            </div>
            <div className="text-right">
              <div className={`text-lg font-mono font-bold ${usagePercent > 90 ? 'text-red-500' : 'text-slate-100'}`}>
                {tokenCount} <span className="text-xs text-slate-500">/ {windowSize} Tokens</span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                约 {inputText.length} 字符
              </div>
            </div>
          </div>
          <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden flex border border-white/5 shadow-inner">
            <div 
              className={`h-full transition-all duration-500 ${usagePercent > 80 ? 'bg-red-500' : 'bg-purple-500'}`} 
              style={{ width: `${Math.min(100, usagePercent)}%` }} 
            />
          </div>
          <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-lg p-3 flex gap-3">
             <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
             <p className="text-[10px] text-slate-400 leading-normal italic">
                随着上下文增加，<b>KV Cache</b> 占用的显存呈线性或二次方增长。这就是为什么“长文本”模型（如 1M 窗口）需要极高的算力和特殊的架构优化。
             </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest text-slate-500">
            <Layers className="w-4 h-4" />
            模拟 Token 切分可视化
          </h4>
          {usagePercent > 100 && (
            <div className="flex items-center gap-2 text-red-500 animate-pulse">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-[10px] font-bold">溢出：模型将丢失最早的输入</span>
            </div>
          )}
        </div>
        <textarea 
          placeholder="在此输入一段文字，观察 Token 的消耗情况..."
          className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all font-sans"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        
        <div className="space-y-2">
          <div className="text-[10px] text-slate-500 font-bold uppercase mb-2">切分预览：</div>
          <div className="flex flex-wrap gap-1 p-4 bg-black/20 rounded-xl border border-white/5 max-h-48 overflow-y-auto custom-scrollbar">
            {tokenSegments.length === 0 ? (
              <span className="text-slate-600 text-xs italic">暂无内容</span>
            ) : (
              tokenSegments.map((t, i) => {
                const isWhitespace = /^\s+$/.test(t);
                const isCJK = /[\u4e00-\u9fa5]/.test(t);
                return (
                  <span 
                    key={i} 
                    className={`px-1 py-0.5 text-[11px] rounded font-mono transition-all hover:scale-105 cursor-default
                      ${isWhitespace ? 'opacity-30 border border-transparent' : 'border'}
                      ${isCJK 
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                        : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                      }`}
                  >
                    {isWhitespace ? '␣' : t}
                  </span>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContextWindowSim;