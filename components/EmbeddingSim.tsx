import React, { useState, useMemo } from 'react';
import { Hash, ArrowRight, Table, Layers, Network, Info, Crosshair, ZoomIn } from 'lucide-react';

interface TokenData {
  text: string;
  id: number;
  vector: string[];
  x: number; // Simulated 2D projection
  y: number; // Simulated 2D projection
}

const EmbeddingSim: React.FC = () => {
  const [text, setText] = useState("苹果 手机 电脑 香蕉 橘子 跑步 运动");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Simulated Semantic Categories for 2D placement
  // X: Concrete <-> Abstract | Y: Organic <-> Tech
  const getSimulatedCoords = (word: string): { x: number, y: number } => {
    const techWords = ['手机', '电脑', 'AI', '模型', '代码', '程序', '芯片'];
    const fruitWords = ['苹果', '香蕉', '橘子', '西瓜', '葡萄', '草莓'];
    const actionWords = ['跑步', '运动', '游泳', '跳舞', '工作', '学习'];
    
    let x = 0.5, y = 0.5;
    
    if (techWords.some(w => word.includes(w))) { x = 0.8; y = 0.8; }
    else if (fruitWords.some(w => word.includes(w))) { x = 0.2; y = 0.2; }
    else if (actionWords.some(w => word.includes(w))) { x = 0.5; y = 0.2; }
    else {
      // Random but deterministic for other words
      x = (word.charCodeAt(0) % 100) / 100;
      y = (word.charCodeAt(word.length - 1) % 100) / 100;
    }
    
    // Add small noise
    x += (Math.random() - 0.5) * 0.1;
    y += (Math.random() - 0.5) * 0.1;
    
    return { x: Math.max(0.1, Math.min(0.9, x)), y: Math.max(0.1, Math.min(0.9, y)) };
  };

  const tokens: TokenData[] = useMemo(() => {
    if (!text) return [];
    const regex = /[\u4e00-\u9fa5]+|[a-zA-Z0-9]+|\s+|[^\w\s\u4e00-\u9fa5]/g;
    const matches: string[] = text.match(regex) || [];
    
    return matches
      .filter(t => t.trim().length > 0)
      .map((t, i) => {
        const coords = getSimulatedCoords(t);
        return {
          text: t,
          id: Math.floor(Math.abs(Math.sin(t.charCodeAt(0) * (i + 1)) * 100000)),
          vector: Array.from({ length: 12 }).map(() => (Math.random() * 2 - 1).toFixed(2)),
          ...coords
        };
      });
  }, [text]);

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-blue-400">从文本到数字：词向量 (Embeddings)</h3>
        <p className="text-slate-400 leading-relaxed max-w-3xl">
          计算机不认识汉字，它只认识数字。大模型处理文本的第一步是将其切分为 <b>Token</b>，并根据预设的字典转换成 <b>ID</b>，再将 ID 映射到高维空间中的一个 <b>向量 (Embedding)</b>。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Input and Vectors */}
        <div className="space-y-8">
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-white">1</span>
              输入并切分 (Tokenization)
            </label>
            <input 
              type="text" 
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="输入多个相关的词，例如：苹果 手机 运动..."
            />
            <div className="flex flex-wrap gap-2 min-h-[60px]">
              {tokens.map((t, i) => (
                <div 
                  key={i}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-help
                    ${hoveredIdx === i ? 'bg-blue-600 border-blue-400 text-white' : 'bg-white/5 border-white/10 text-slate-400'}`}
                >
                  {t.text} <span className="opacity-50 font-mono text-[9px] ml-1">#{t.id % 1000}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-white">2</span>
              高维向量片段 (Vector Fragment)
            </label>
            <div className="p-4 bg-slate-900/50 rounded-2xl border border-white/5 min-h-[140px] flex flex-col justify-center">
              {hoveredIdx !== null && tokens[hoveredIdx] ? (
                <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-blue-400">"{tokens[hoveredIdx].text}" 向量</span>
                    <span className="text-[10px] text-slate-500">维度索引: 0 - 11</span>
                  </div>
                  <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
                    {tokens[hoveredIdx].vector.map((val, vIdx) => (
                      <div key={vIdx} className="flex flex-col gap-1">
                        <div className="h-16 w-full rounded bg-blue-500/10 relative overflow-hidden flex items-end">
                          <div 
                            className="w-full bg-blue-500 transition-all duration-700 ease-out" 
                            style={{ height: `${(parseFloat(val) + 1) * 50}%` }}
                          />
                        </div>
                        <span className="text-[8px] font-mono text-center text-slate-500">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 flex flex-col items-center gap-2">
                  <Layers className="w-6 h-6 text-slate-700" />
                  <span className="text-slate-600 italic text-sm">将鼠标悬停在 Token 或空间点上</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: 2D Spatial Visualization */}
        <div className="space-y-4">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-white">3</span>
              语义空间投影 (Simulated PCA/t-SNE)
            </div>
            <div className="flex items-center gap-1 text-[10px] text-blue-500/60 lowercase italic">
              <Crosshair className="w-3 h-3" />
              Relational Mapping
            </div>
          </label>
          
          <div className="relative aspect-square bg-slate-900/80 rounded-2xl border border-white/10 overflow-hidden group shadow-2xl shadow-blue-500/5">
            {/* Grid Lines */}
            <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none opacity-[0.03]">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="border border-white" />
              ))}
            </div>

            {/* Axes Labels */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-between px-6 text-[9px] text-slate-600 font-bold uppercase tracking-tighter">
              <span>← 具体事物</span>
              <span>抽象概念 →</span>
            </div>
            <div className="absolute top-0 bottom-0 right-4 flex flex-col justify-between py-6 text-[9px] text-slate-600 font-bold uppercase tracking-tighter [writing-mode:vertical-lr]">
              <span>生活/自然 ↑</span>
              <span>技术/逻辑 ↓</span>
            </div>

            {/* Connecting lines for related clusters (simple heuristic) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
              {tokens.length > 1 && tokens.map((t1, i) => 
                tokens.slice(i + 1).map((t2, j) => {
                  const dist = Math.sqrt(Math.pow(t1.x - t2.x, 2) + Math.pow(t1.y - t2.y, 2));
                  if (dist < 0.25) {
                    return (
                      <line 
                        key={`${i}-${j}`}
                        x1={`${t1.x * 100}%`} y1={`${(1 - t1.y) * 100}%`}
                        x2={`${t2.x * 100}%`} y2={`${(1 - t2.y) * 100}%`}
                        stroke="currentColor"
                        strokeWidth="0.5"
                        className="text-blue-500"
                      />
                    );
                  }
                  return null;
                })
              )}
            </svg>

            {/* Data Points */}
            {tokens.map((t, i) => (
              <div 
                key={i}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500 cursor-pointer"
                style={{ left: `${t.x * 100}%`, top: `${(1 - t.y) * 100}%` }}
              >
                <div className={`relative group/point`}>
                  <div className={`w-3 h-3 rounded-full border-2 transition-all duration-300
                    ${hoveredIdx === i 
                      ? 'bg-blue-400 border-white scale-150 shadow-[0_0_15px_rgba(59,130,246,0.8)]' 
                      : 'bg-slate-800 border-blue-500/50 hover:border-blue-400'}`} 
                  />
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap px-2 py-1 rounded bg-black/80 backdrop-blur-sm border border-white/10 text-[10px] font-bold transition-all duration-300
                    ${hoveredIdx === i ? 'opacity-100 translate-x-0 scale-100' : 'opacity-40 translate-x-2 scale-90'}`}>
                    {t.text}
                  </div>
                </div>
              </div>
            ))}

            {tokens.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-slate-600 text-xs italic">
                等待输入...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Educational Footer */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900/40 p-5 rounded-2xl border border-white/5 space-y-3">
          <h4 className="flex items-center gap-2 font-bold text-slate-200 text-sm">
            <Network className="w-4 h-4 text-emerald-400" />
            余弦相似度 (Cosine Similarity)
          </h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            大模型通过计算两个向量之间的<b>角度</b>来判断意义是否接近。角度越小，相似度越高。这就是为什么它能理解“手机”和“电脑”属于同一类。
          </p>
        </div>
        
        <div className="bg-blue-500/5 p-5 rounded-2xl border border-blue-500/20 space-y-3">
          <h4 className="flex items-center gap-2 font-bold text-blue-300 text-sm">
            <ZoomIn className="w-4 h-4 text-blue-400" />
            降维投影 (Visualization)
          </h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            真实的向量有 4096 个维度。我们看到的 2D 图是经过降维算法（如 t-SNE）处理后的结果，它尽可能保留了高维空间中的相对距离关系。
          </p>
        </div>

        <div className="bg-purple-500/5 p-5 rounded-2xl border border-purple-500/20 space-y-3">
          <h4 className="flex items-center gap-2 font-bold text-purple-300 text-sm">
            <Table className="w-4 h-4 text-purple-400" />
            Embedding Table
          </h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            模型内部其实是一个巨大的<b>查找表</b>。每个 Token ID 对应表中的一行向量。学习过程本质上就是在调整这些向量在空间中的位置。
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmbeddingSim;