
import React, { useState, useMemo } from 'react';
import { 
  Calculator, X, ArrowRight, Activity, 
  Layers, Zap, AlertTriangle, Maximize,
  Sigma, MousePointerClick, Info, Grid3X3
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ReferenceLine, AreaChart, Area
} from 'recharts';

const AttentionComplexitySim: React.FC = () => {
  const [n, setN] = useState(6); // Sequence Length
  const d = 4; // Hidden Dimension (kept small/fixed for visual clarity)
  const [hoveredCell, setHoveredCell] = useState<{r: number, c: number} | null>(null);

  // Stats
  const qSize = n * d;
  const attnSize = n * n;
  
  // Chart Data: N from 1 to 50 (scaled down logic for visuals)
  const chartData = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => {
      const val = (i + 1) * 100; // Simulated real token count
      return {
        tokens: val,
        linear: val, // Represents Embedding storage
        quadratic: (val * val) / 1000, // Scaled down for visualization overlap
        realQuadratic: val * val
      };
    });
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
       {/* Header and Intro */}
       <div className="border-b border-white/5 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 rounded-full text-[9px] font-bold border border-rose-500/20 tracking-widest uppercase">Algorithm Complexity</span>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-400 to-orange-500 bg-clip-text text-transparent">
          Attention 复杂度 ($O(N^2)$) 可视化
        </h2>
        <p className="text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
          为什么 Token 变长一点点，显存和计算量却爆炸式增长？核心在于 <b>Scaled Dot-Product Attention</b> 机制中的矩阵乘法。
        </p>
      </div>

      {/* Main Interactive Lab */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Controls & Matrix Visualization */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 bg-slate-900 border border-white/10 rounded-3xl space-y-6">
             <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-300 flex items-center gap-2">
                  <Grid3X3 className="w-5 h-5 text-indigo-400" /> 矩阵运算视图
                </h3>
                <div className="bg-white/5 px-3 py-1 rounded-lg border border-white/5 text-xs font-mono text-slate-400">
                   d_model = {d} (Fixed)
                </div>
             </div>

             {/* Slider */}
             <div className="space-y-3 p-4 bg-black/20 rounded-xl border border-white/5">
                <div className="flex justify-between items-end">
                   <label className="text-xs font-bold text-slate-500 uppercase">输入长度 (Sequence Length N)</label>
                   <span className="text-2xl font-bold text-emerald-400 font-mono">N = {n}</span>
                </div>
                <input 
                  type="range" min="1" max="12" step="1" 
                  value={n} onChange={(e) => setN(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-slate-600">
                   <span>1</span>
                   <span>6</span>
                   <span>12 (Demo Max)</span>
                </div>
             </div>

             {/* Matrix Visuals */}
             <div className="flex flex-col gap-6 items-center justify-center pt-4 overflow-x-auto">
                
                {/* Top Row: Q and K^T */}
                <div className="flex items-center gap-4">
                   {/* Matrix Q */}
                   <div className="flex flex-col items-center gap-2">
                      <div className="text-[10px] font-bold text-slate-500">Query (Q): {n}×{d}</div>
                      <div 
                        className="grid gap-px bg-slate-800 border border-slate-700 p-1"
                        style={{ gridTemplateColumns: `repeat(${d}, minmax(10px, 1fr))` }}
                      >
                         {Array.from({ length: n * d }).map((_, i) => {
                            const r = Math.floor(i / d);
                            const isActive = hoveredCell?.r === r;
                            return (
                              <div 
                                key={i} 
                                className={`w-4 h-4 sm:w-5 sm:h-5 rounded-sm transition-all duration-200 ${isActive ? 'bg-indigo-500 scale-110' : 'bg-indigo-500/20'}`} 
                              />
                            );
                         })}
                      </div>
                   </div>

                   <div className="text-xl font-bold text-slate-600">×</div>

                   {/* Matrix K^T */}
                   <div className="flex flex-col items-center gap-2">
                      <div className="text-[10px] font-bold text-slate-500">Key Transposed (Kᵀ): {d}×{n}</div>
                      <div 
                        className="grid gap-px bg-slate-800 border border-slate-700 p-1"
                        style={{ gridTemplateColumns: `repeat(${n}, minmax(10px, 1fr))` }}
                      >
                         {Array.from({ length: d * n }).map((_, i) => {
                            const c = i % n;
                            const isActive = hoveredCell?.c === c;
                            return (
                              <div 
                                key={i} 
                                className={`w-4 h-4 sm:w-5 sm:h-5 rounded-sm transition-all duration-200 ${isActive ? 'bg-blue-500 scale-110' : 'bg-blue-500/20'}`} 
                              />
                            );
                         })}
                      </div>
                   </div>
                </div>

                <div className="rotate-90 md:rotate-0"><ArrowRight className="w-6 h-6 text-slate-600" /></div>

                {/* Result: Attention Score Matrix */}
                <div className="flex flex-col items-center gap-2">
                   <div className="text-[10px] font-bold text-slate-500">Attention Scores (QKᵀ): <span className="text-rose-400">{n}×{n}</span></div>
                   <div 
                      className="grid gap-px bg-slate-800 border border-slate-700 p-1 relative"
                      style={{ gridTemplateColumns: `repeat(${n}, minmax(10px, 1fr))` }}
                      onMouseLeave={() => setHoveredCell(null)}
                   >
                      {Array.from({ length: n * n }).map((_, i) => {
                         const r = Math.floor(i / n);
                         const c = i % n;
                         const isHovered = hoveredCell?.r === r && hoveredCell?.c === c;
                         return (
                           <div 
                             key={i} 
                             onMouseEnter={() => setHoveredCell({r, c})}
                             className={`w-4 h-4 sm:w-5 sm:h-5 rounded-sm cursor-crosshair transition-all duration-200 border border-transparent
                               ${isHovered ? 'bg-rose-500 scale-125 border-white shadow-lg z-10' : 'bg-rose-500/20 hover:bg-rose-500/40'}`} 
                           />
                         );
                      })}
                   </div>
                   <div className="text-[9px] text-slate-500 italic mt-2">
                      Hover grid to see dependencies
                   </div>
                </div>

             </div>
          </div>

          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
             <h4 className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-2">
               <Info className="w-4 h-4" /> 计算过程解析
             </h4>
             <p className="text-[11px] text-slate-400 leading-relaxed">
               为了计算 Attention 矩阵中的每一个点（共 <span className="text-rose-400 font-bold">{n*n}</span> 个），
               我们需要取 Q 的一行（维度 d）与 K 的一列（维度 d）进行点积。
               <br/>
               当 N 翻倍时，矩阵的面积变为原来的 4 倍。这就是所谓的 <b>Quadratic Complexity (二次方复杂度)</b>。
             </p>
          </div>
        </div>

        {/* Right: Charts & Theory */}
        <div className="lg:col-span-5 space-y-6">
           {/* Chart */}
           <div className="p-6 bg-slate-900 border border-white/10 rounded-3xl h-80 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    计算量增长曲线
                 </h3>
                 <div className="flex gap-3">
                    <div className="flex items-center gap-1.5">
                       <div className="w-2 h-2 rounded-full bg-emerald-500" />
                       <span className="text-[9px] text-slate-400">线性 (Linear)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                       <div className="w-2 h-2 rounded-full bg-rose-500" />
                       <span className="text-[9px] text-slate-400">二次方 (Quadratic)</span>
                    </div>
                 </div>
              </div>
              <div className="flex-1 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                       <defs>
                          <linearGradient id="colorQuad" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                       <XAxis dataKey="tokens" hide />
                       <YAxis hide />
                       <Tooltip 
                         contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b', fontSize: '10px'}}
                         formatter={(val: number, name: string) => [val.toFixed(0), name === 'quadratic' ? 'Memory/Compute' : 'Ideal Linear']}
                       />
                       <Area type="monotone" dataKey="quadratic" stroke="#f43f5e" strokeWidth={2} fill="url(#colorQuad)" />
                       <Line type="monotone" dataKey="linear" stroke="#10b981" strokeWidth={2} dot={false} strokeDasharray="4 4" />
                       <ReferenceLine x={2000} stroke="white" label="Context Window" />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
              <div className="mt-2 text-center text-[10px] text-slate-600 font-mono">
                 Sequence Length (N) →
              </div>
           </div>

           {/* Stats Cards */}
           <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                 <div className="text-[10px] font-bold text-emerald-500 uppercase mb-1">Q/K Matrix Size</div>
                 <div className="text-2xl font-mono text-white">{qSize} <span className="text-xs text-slate-500 opacity-50">floats</span></div>
                 <div className="text-[9px] text-emerald-500/60 mt-1">Growth: Linear ($O(N)$)</div>
              </div>
              <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl">
                 <div className="text-[10px] font-bold text-rose-500 uppercase mb-1">Attn Matrix Size</div>
                 <div className="text-2xl font-mono text-white">{attnSize} <span className="text-xs text-slate-500 opacity-50">floats</span></div>
                 <div className="text-[9px] text-rose-500/60 mt-1">Growth: Quadratic ($O(N^2)$)</div>
              </div>
           </div>

           {/* Solutions */}
           <div className="p-6 bg-slate-900 border border-white/10 rounded-3xl space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                 <Zap className="w-4 h-4 text-amber-400" /> 破局方案 (Solutions)
              </h4>
              <div className="space-y-3">
                 <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <div className="text-[10px] font-bold text-slate-200 mb-1">FlashAttention</div>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                       通过分块计算（Tiling）和算子融合，避免生成完整的 $N \times N$ 矩阵，大幅减少显存读写。
                    </p>
                 </div>
                 <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <div className="text-[10px] font-bold text-slate-200 mb-1">Linear Attention / RNNs</div>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                       如 Mamba (SSM) 架构，将复杂度降低到 $O(N)$，但可能牺牲部分“大海捞针”的能力。
                    </p>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default AttentionComplexitySim;
