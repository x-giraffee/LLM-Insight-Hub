
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Database, Cpu, Zap, HardDrive, AlertTriangle, 
  Layers, RefreshCw, Box, CheckCircle2, ChevronRight,
  TrendingUp, Maximize, MousePointerClick, Activity,
  FileCode, Infinity, Timer, Play
} from 'lucide-react';

const KVCacheSim: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'computation' | 'memory' | 'paging'>('computation');
  const [isKVCacheOn, setIsKVCacheOn] = useState(true);
  const [genStep, setGenStep] = useState(0);
  const [batchSize, setBatchSize] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  const words = ["I", "love", "learning", "about", "large", "language", "models"];
  
  // Simulation for Computation Comparison
  useEffect(() => {
    let interval: number;
    if (isGenerating) {
      interval = window.setInterval(() => {
        setGenStep(prev => {
          if (prev >= words.length - 1) {
            setIsGenerating(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const toggleGen = () => {
    if (genStep >= words.length - 1) setGenStep(0);
    setIsGenerating(!isGenerating);
  };

  // Memory Usage Calculation
  // 1B params model, FP16, 1 token roughly 1MB of KV Cache (simple estimation)
  const memoryStats = useMemo(() => {
    const used = (genStep + 1) * 12.5 * batchSize; // Simulated MB
    const total = 512; // Simulated GPU VRAM Window
    return { used, percent: (used / total) * 100 };
  }, [genStep, batchSize]);

  // PagedAttention Block Simulation
  const blocks = Array.from({ length: 48 }).map((_, i) => {
    const isTraditionalReserved = i < (batchSize * 16);
    const isTraditionalActive = i < (batchSize * (genStep + 1));
    const isPagedActive = i < (batchSize * (genStep + 1));
    
    return { id: i, isTraditionalReserved, isTraditionalActive, isPagedActive };
  });

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="border-b border-white/5 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-full text-[9px] font-bold border border-indigo-500/20 tracking-widest uppercase">Memory Optimization</span>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
          KV Cache: 空间与时间的终极博弈
        </h2>
        <p className="text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
          标准的 KV Cache 本质上是<b>“用空间换时间”</b>。它通过占用巨大的显存，省去了每一轮生成时的重复计算。而 PagedAttention 则是为了解决这块“巨型资产”被浪费的问题。
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-900 p-1 rounded-2xl border border-white/5 w-fit">
        {[
          { id: 'computation', label: '算力节省演示', icon: <Cpu className="w-3 h-3" /> },
          { id: 'memory', label: '显存开销真相', icon: <HardDrive className="w-3 h-3" /> },
          { id: 'paging', label: '分页优化 (vLLM)', icon: <Layers className="w-3 h-3" /> }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveMode(t.id as any)}
            className={`px-4 py-2 rounded-xl text-[11px] font-bold transition-all flex items-center gap-2 ${activeMode === t.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Interactive Stage */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Computation View */}
          {activeMode === 'computation' && (
            <div className="p-8 bg-slate-950 rounded-3xl border border-white/10 min-h-[450px] flex flex-col relative overflow-hidden">
               <div className="flex justify-between items-center mb-10">
                 <div className="space-y-1">
                    <h3 className="font-bold text-slate-200">生成过程流转</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Autoregressive Decoding</p>
                 </div>
                 <div className="flex items-center gap-4 bg-slate-900 p-1 rounded-xl border border-white/5">
                    <button 
                      onClick={() => setIsKVCacheOn(true)}
                      className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${isKVCacheOn ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500'}`}
                    >开启缓存</button>
                    <button 
                      onClick={() => setIsKVCacheOn(false)}
                      className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${!isKVCacheOn ? 'bg-rose-600 text-white shadow-md' : 'text-slate-500'}`}
                    >关闭缓存</button>
                 </div>
               </div>

               {/* Tokens Animation */}
               <div className="flex-1 flex flex-col items-center justify-center space-y-12">
                  <div className="flex gap-2 flex-wrap justify-center">
                    {words.map((w, i) => (
                      <div key={i} className={`px-4 py-2 rounded-xl border font-mono text-sm transition-all duration-500 
                        ${i <= genStep ? 'bg-indigo-500/20 border-indigo-500 text-white scale-100 opacity-100' : 'bg-slate-900 border-white/5 text-slate-700 opacity-20 scale-90'}`}>
                        {w}
                        {i === genStep && <div className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-400 rounded-full animate-ping" />}
                      </div>
                    ))}
                  </div>

                  {/* Flow Visualization */}
                  <div className="w-full max-w-lg p-6 bg-slate-900/50 rounded-2xl border border-white/5 relative">
                     <div className="flex justify-between items-center px-4">
                        <div className="flex flex-col items-center gap-2">
                           <div className={`p-3 rounded-full border transition-all ${isGenerating ? 'bg-indigo-500/20 border-indigo-400 animate-pulse' : 'bg-slate-800 border-slate-700'}`}>
                              <Cpu className="w-5 h-5 text-indigo-400" />
                           </div>
                           <span className="text-[10px] text-slate-500 font-bold uppercase">算子计算</span>
                        </div>

                        <div className="flex-1 px-4 relative h-1 bg-slate-800 rounded-full overflow-hidden">
                           {isGenerating && (
                             <div className="h-full bg-indigo-500 animate-[shimmer_2s_infinite]" />
                           )}
                           {/* Re-computation arrows if cache off */}
                           {!isKVCacheOn && isGenerating && (
                             <div className="absolute inset-0 flex justify-between px-2">
                               {Array.from({length: 4}).map((_, i) => (
                                 <RefreshCw key={i} className="w-2 h-2 text-rose-500/50 animate-spin" />
                               ))}
                             </div>
                           )}
                        </div>

                        <div className="flex flex-col items-center gap-2">
                           <div className={`p-3 rounded-full border transition-all ${isKVCacheOn ? 'bg-emerald-500/20 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-slate-800 border-slate-700 opacity-30'}`}>
                              <Database className="w-5 h-5 text-emerald-400" />
                           </div>
                           <span className="text-[10px] text-slate-500 font-bold uppercase">KV 缓存库</span>
                        </div>
                     </div>

                     <div className="mt-6 p-4 bg-black/40 rounded-xl border border-white/5 text-center">
                        <p className="text-[11px] text-slate-400">
                          {isKVCacheOn 
                            ? `⚡ 当前仅计算新的 Token "${words[genStep]}"，旧的 K, V 已从缓存库秒级提取。`
                            : `❌ 警告：正在重新计算从 "${words[0]}" 到 "${words[genStep]}" 所有的权重矩阵。`
                          }
                        </p>
                        <div className="mt-2 flex justify-center gap-4 text-[10px] font-mono">
                           <span className={isKVCacheOn ? 'text-emerald-400' : 'text-rose-400 font-bold'}>计算复杂度: {isKVCacheOn ? 'O(1)' : `O(${genStep+1})`}</span>
                           <span className="text-slate-600">总复杂度: {isKVCacheOn ? `O(N)` : 'O(N²)'}</span>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="mt-8 flex justify-center">
                  <button 
                    onClick={toggleGen}
                    className={`px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-xl
                      ${isGenerating ? 'bg-rose-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
                  >
                    {isGenerating ? <Activity className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                    {isGenerating ? '正在逐词推理...' : (genStep === words.length-1 ? '重置演示' : '开始自回归生成')}
                  </button>
               </div>
            </div>
          )}

          {/* Memory View */}
          {activeMode === 'memory' && (
            <div className="p-8 bg-slate-950 rounded-3xl border border-white/10 min-h-[450px] space-y-8 animate-in fade-in">
               <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-1 space-y-6">
                    <h3 className="text-xl font-bold text-slate-200">显存是被什么吃掉的？</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      KV Cache 存的不是文本，而是<b>投影后的高维张量</b>。每多一个 Token，就会在显存中增加两个对应层数和头数的向量。
                    </p>
                    
                    <div className="p-6 bg-slate-900 rounded-2xl border border-white/5 space-y-4">
                       <div className="flex justify-between items-end mb-2">
                          <span className="text-xs font-bold text-slate-500 uppercase">动态显存占用量 (Estimated)</span>
                          <span className="text-xl font-mono text-indigo-400 font-bold">{memoryStats.used.toFixed(1)} MB</span>
                       </div>
                       <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden border border-white/5 shadow-inner">
                          <div 
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
                            style={{ width: `${memoryStats.percent}%` }}
                          />
                       </div>
                       <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                          <span>0 MB</span>
                          <span>Context Limit: 512 MB</span>
                       </div>
                    </div>
                  </div>

                  <div className="w-64 p-6 bg-slate-900 border border-white/10 rounded-2xl space-y-4">
                     <div className="text-center pb-4 border-b border-white/5">
                        <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">公式速查</div>
                        <div className="text-xs font-mono text-indigo-300">2 × Layers × Heads × Dim</div>
                     </div>
                     <div className="space-y-3">
                        <div className="flex justify-between items-center text-[10px]">
                           <span className="text-slate-500">并发 Batch</span>
                           <input type="number" value={batchSize} onChange={e => setBatchSize(Number(e.target.value))} className="w-10 bg-black rounded text-center border border-white/10" />
                        </div>
                        <p className="text-[10px] text-slate-500 leading-relaxed italic">
                           当 Batch Size 增加，显存占用呈线性爆炸。这就是为什么“长文本 + 高并发”是推理的噩梦。
                        </p>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex gap-4">
                     <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400"><Infinity className="w-5 h-5" /></div>
                     <div>
                        <h4 className="text-sm font-bold">空间换时间</h4>
                        <p className="text-[11px] text-slate-400">开启后：计算量 $O(N)$，显存 $O(N)$。本质是利用昂贵的 VRAM 存储换取昂贵的 GPU 算力节省。</p>
                     </div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex gap-4">
                     <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400"><Timer className="w-5 h-5" /></div>
                     <div>
                        <h4 className="text-sm font-bold">带宽瓶颈</h4>
                        <p className="text-[11px] text-slate-400">生成时大部分时间花在“搬运”KV Cache 上，而非计算。这就是为什么显存带宽（HBM）越快，生成速度越快。</p>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {/* Paging View */}
          {activeMode === 'paging' && (
            <div className="p-8 bg-slate-950 rounded-3xl border border-white/10 min-h-[450px] animate-in fade-in flex flex-col lg:flex-row gap-8">
               <div className="flex-1">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-slate-200">物理显存池 (GPU VRAM Pool)</h3>
                    <div className="flex gap-2 text-[9px] font-bold uppercase">
                       <div className="flex items-center gap-1"><div className="w-2 h-2 bg-indigo-500 rounded" /> Active</div>
                       <div className="flex items-center gap-1"><div className="w-2 h-2 bg-slate-700 rounded" /> Waste (Fragment)</div>
                       <div className="flex items-center gap-1"><div className="w-2 h-2 bg-slate-900 rounded" /> Free</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-8 md:grid-cols-12 gap-1.5 p-4 bg-slate-900 rounded-2xl border border-white/10">
                     {blocks.map(b => (
                        <div 
                           key={b.id} 
                           className={`aspect-square rounded-sm border transition-all duration-500
                              ${activeMode === 'paging' ? (
                                b.isPagedActive ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.3)] scale-105' : 'bg-slate-900 border-white/5'
                              ) : (
                                b.isTraditionalActive ? 'bg-indigo-500 border-indigo-400' : 
                                b.isTraditionalReserved ? 'bg-slate-700 border-slate-600' : 'bg-slate-900 border-white/5'
                              )}
                           `}
                        />
                     ))}
                  </div>

                  <div className="mt-8 p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                     <div className="flex items-center gap-3 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <h4 className="font-bold text-emerald-300">PagedAttention 核心原理</h4>
                     </div>
                     <p className="text-xs text-slate-400 leading-relaxed">
                        不再为每个请求预留一块连续的大内存。而是将其切碎为 <b>Page (页)</b>。
                        当生成新的 Token 时，动态申请物理空间。即使物理上不连续，逻辑上通过 <b>Block Table</b> 映射回连续的 KV 序列。
                     </p>
                  </div>
               </div>

               <div className="w-full lg:w-64 flex flex-col gap-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                     <div className="text-center font-bold text-[10px] text-slate-500 uppercase tracking-widest">利用率对比</div>
                     <div className="space-y-4">
                        <div className="space-y-1">
                           <div className="flex justify-between text-[10px]">
                              <span className="text-slate-400">传统预分配</span>
                              <span className="text-rose-400 font-bold">~40%</span>
                           </div>
                           <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-rose-500 w-[40%]" />
                           </div>
                        </div>
                        <div className="space-y-1">
                           <div className="flex justify-between text-[10px]">
                              <span className="text-slate-400">PagedAttention</span>
                              <span className="text-emerald-400 font-bold">~96%</span>
                           </div>
                           <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 w-[96%]" />
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 flex-1">
                     <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                        <Maximize className="w-8 h-8 text-indigo-400 opacity-20" />
                        <h5 className="text-xs font-bold text-indigo-300">更大的吞吐量</h5>
                        <p className="text-[10px] text-slate-500 leading-relaxed">
                           由于利用率提高，相同的显存可以跑更大的 <b>Batch Size</b>。吞吐量（TPS）提升通常能达到数倍。
                        </p>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* Right Info Panel */}
        <div className="lg:col-span-4 space-y-6">
           <div className="p-6 bg-slate-900 border border-white/10 rounded-3xl shadow-2xl h-full flex flex-col">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6">
                 {activeMode === 'computation' ? <Zap className="w-6 h-6 text-indigo-400" /> : <HardDrive className="w-6 h-6 text-emerald-400" />}
              </div>
              
              <h3 className="text-xl font-bold mb-4 text-slate-100">核心洞察</h3>
              
              <div className="flex-1 space-y-6 overflow-y-auto custom-scrollbar pr-2">
                 <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2">
                    <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-2">
                       <TrendingUp className="w-3 h-3" /> 推理速度瓶颈
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                       在大模型推理的 Decoding 阶段，模型是 <b>Memory-Bound (受限于显存带宽)</b> 的。
                       每次计算新词前，都要把之前所有 Token 的巨大的 KV Cache 读一遍。
                    </p>
                 </div>

                 <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2">
                    <h4 className="text-xs font-bold text-amber-400 flex items-center gap-2">
                       <AlertTriangle className="w-3 h-3" /> 预分配的噩梦
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                       传统方式必须提前挖好大坑（预留 Max Context 显存）。
                       如果你只问了一句“你好”，剩下 99% 的空间就被白白浪费了，这就是<b>内部碎片</b>。
                    </p>
                 </div>

                 <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/20 space-y-2">
                    <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                       <Box className="w-3 h-3" /> PagedAttention 总结
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                       它不是减少了单个请求所需的 KV Cache，而是<b>消除了那些空置着、没在使用的“占位显存”</b>。
                    </p>
                 </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5">
                 <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <MousePointerClick className="w-3 h-3" />
                    <span>点击左侧模式切换探索深层原理</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default KVCacheSim;
