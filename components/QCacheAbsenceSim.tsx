
import React, { useState, useEffect } from 'react';
import { 
  Search, Database, ArrowRight, Trash2, 
  Layers, Zap, HelpCircle, History, 
  Library, FileText, Info, RotateCcw, 
  Calculator, MousePointerClick, TrendingDown
} from 'lucide-react';

const QCacheAbsenceSim: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'math' | 'analogy' | 'deep'>('math');
  const [step, setStep] = useState(3); // Current token step
  const [isAnimating, setIsAnimating] = useState(false);

  const tokens = ["I", "love", "learning", "AI", "models"];
  
  const handleStep = () => {
    if (step < tokens.length - 1) setStep(s => s + 1);
    else setStep(1);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="border-b border-white/5 pb-6">
        <div className="flex items-center gap-2 mb-2">
           <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded-full text-[9px] font-bold border border-amber-500/20 tracking-widest uppercase">
             Architecture Deep Dive
           </span>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-rose-500 bg-clip-text text-transparent">
          消失的 Q：为什么只存 KV 缓存？
        </h2>
        <p className="text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
          既然 KV Cache 很占显存，为什么不顺便把 Q 也存了？简单来说：<b>存了也没人用</b>。过去的任务已经完成，Q 作为“查询请求”在这一步毫无价值。
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-900 p-1 rounded-2xl border border-white/5 w-fit">
        {[
          { id: 'math', label: '数学逻辑', icon: <Calculator className="w-3 h-3" /> },
          { id: 'analogy', label: '生活类比', icon: <Search className="w-3 h-3" /> },
          { id: 'deep', label: '信息去向', icon: <Layers className="w-3 h-3" /> }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2 rounded-xl text-[11px] font-bold transition-all flex items-center gap-2 ${activeTab === t.id ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Stage */}
        <div className="lg:col-span-8 space-y-6">
           
           {/* 1. Math View */}
           {activeTab === 'math' && (
             <div className="p-8 bg-slate-950 rounded-3xl border border-white/10 min-h-[450px] flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-4 left-4 flex items-center gap-2">
                   <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Decoding Step: {step}</span>
                </div>

                <div className="w-full flex flex-col md:flex-row items-center justify-center gap-12 pt-8">
                   {/* Current Q */}
                   <div className="flex flex-col items-center gap-4">
                      <div className="text-[10px] font-bold text-amber-400 uppercase">当前查询 (q_{step})</div>
                      <div className="w-16 h-48 bg-amber-500/20 border-2 border-amber-500 rounded-xl flex flex-col justify-between p-2 shadow-[0_0_20px_rgba(245,158,11,0.2)] animate-in slide-in-from-left-4">
                         {Array.from({length: 8}).map((_, i) => (
                           <div key={i} className="h-2 w-full bg-amber-400/40 rounded-full" />
                         ))}
                      </div>
                      <span className="text-xs font-mono font-bold text-white">"{tokens[step]}"</span>
                   </div>

                   <div className="text-3xl font-bold text-slate-700">×</div>

                   {/* Cached K Matrix */}
                   <div className="flex flex-col items-center gap-4">
                      <div className="text-[10px] font-bold text-emerald-400 uppercase">KV 缓存库 (k_{`0..${step}`})</div>
                      <div className="flex gap-1.5 p-2 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl relative">
                         {/* Past Keys */}
                         {Array.from({length: step + 1}).map((_, i) => (
                            <div key={i} className={`w-10 h-48 rounded-lg flex flex-col justify-between p-1.5 transition-all duration-700 ${i === step ? 'bg-emerald-500 border-emerald-400 shadow-lg' : 'bg-emerald-900/40 border border-emerald-500/20 opacity-40'}`}>
                               {Array.from({length: 8}).map((_, j) => (
                                 <div key={j} className="h-2 w-full bg-white/20 rounded-full" />
                               ))}
                               <div className="mt-2 text-[8px] text-center text-white/50 font-mono">k_{i}</div>
                            </div>
                         ))}
                         {/* Visual Scanning Effect */}
                         <div className="absolute inset-y-0 -left-4 w-1 bg-amber-400/50 blur-sm animate-[scan_2s_infinite]" />
                      </div>
                   </div>

                   <div className="hidden md:block"><ArrowRight className="w-6 h-6 text-slate-700" /></div>

                   {/* Output Score */}
                   <div className="flex flex-col items-center gap-4">
                      <div className="text-[10px] font-bold text-rose-400 uppercase">注意力分数</div>
                      <div className="w-48 h-48 bg-slate-900 border border-white/5 rounded-2xl p-4 flex flex-col gap-2 justify-center">
                         {Array.from({length: step + 1}).map((_, i) => (
                            <div key={i} className="flex items-center gap-3">
                               <div className="text-[9px] font-mono text-slate-500 w-4">s_{i}</div>
                               <div className="h-2 flex-1 bg-slate-800 rounded-full overflow-hidden">
                                  <div className="h-full bg-rose-500" style={{ width: `${Math.random() * 80 + 20}%` }} />
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>

                {/* The "Missing Q" Graveyard */}
                <div className="mt-12 w-full max-w-lg p-4 bg-slate-900/50 border border-dashed border-white/10 rounded-2xl flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-800 rounded-lg text-slate-500"><History className="w-5 h-5" /></div>
                      <div>
                         <h4 className="text-xs font-bold text-slate-400">历史 Query (q_0...q_{step-1})</h4>
                         <p className="text-[10px] text-slate-600">已过期且无计算通路，直接丢弃</p>
                      </div>
                   </div>
                   <div className="flex gap-2 opacity-20 grayscale">
                      {Array.from({length: 3}).map((_, i) => (
                        <div key={i} className="w-4 h-12 bg-amber-500/20 border border-amber-500/30 rounded" />
                      ))}
                      <Trash2 className="w-5 h-5 text-rose-500/50 mt-4" />
                   </div>
                </div>

                <div className="mt-8">
                   <button onClick={handleStep} className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl font-bold text-xs transition-all shadow-xl flex items-center gap-2">
                     <RotateCcw className="w-3 h-3" /> 生成下一个 Token
                   </button>
                </div>
             </div>
           )}

           {/* 2. Analogy View */}
           {activeTab === 'analogy' && (
             <div className="p-8 bg-slate-950 rounded-3xl border border-white/10 min-h-[450px] space-y-10 animate-in fade-in">
                <div className="flex flex-col md:flex-row gap-8">
                   {/* Search Engine Analogy */}
                   <div className="flex-1 space-y-6">
                      <div className="p-6 bg-slate-900 rounded-3xl border border-white/10 space-y-4">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400"><Search className="w-6 h-6" /></div>
                            <h4 className="font-bold text-slate-200 uppercase tracking-widest text-sm">搜索引擎类比</h4>
                         </div>
                         
                         <div className="space-y-3">
                            <div className="p-3 bg-black/40 border border-white/5 rounded-xl opacity-30">
                               <div className="text-[9px] text-slate-600 font-bold uppercase mb-1 flex justify-between">昨日搜索 (Old Q) <Trash2 className="w-3 h-3" /></div>
                               <div className="text-xs text-slate-500 italic">“如何制作番茄炒蛋？”</div>
                            </div>
                            <div className="p-4 bg-blue-600/10 border-2 border-blue-500/30 rounded-xl ring-2 ring-blue-500/10">
                               <div className="text-[9px] text-blue-400 font-bold uppercase mb-2">今日搜索 (Active Q)</div>
                               <div className="text-sm text-blue-100 font-medium">“大模型显存优化原理”</div>
                            </div>
                         </div>
                         <p className="text-[11px] text-slate-400 leading-relaxed italic">
                           为了查“显存原理”，服务器需要知道你昨天查过“番茄炒蛋”吗？显然不需要。<b>旧的 Q 在完成使命后就成了垃圾信息。</b>
                         </p>
                      </div>
                   </div>

                   {/* Library Analogy */}
                   <div className="flex-1 space-y-6">
                      <div className="p-6 bg-slate-900 rounded-3xl border border-white/10 space-y-4">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400"><Library className="w-6 h-6" /></div>
                            <h4 className="font-bold text-slate-200 uppercase tracking-widest text-sm">图书馆类比</h4>
                         </div>
                         
                         <div className="space-y-4">
                            <div className="flex items-center gap-4">
                               <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/30"><Database className="w-8 h-8 text-emerald-400" /></div>
                               <div>
                                  <div className="text-xs font-bold text-emerald-400">KV Cache = 书架</div>
                                  <div className="text-[10px] text-slate-500">知识仓库，必须留着备查</div>
                               </div>
                            </div>
                            <div className="flex items-center gap-4">
                               <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/30"><FileText className="w-8 h-8 text-amber-400" /></div>
                               <div>
                                  <div className="text-xs font-bold text-emerald-400">Query = 借书单</div>
                                  <div className="text-[10px] text-slate-500">查完书、借走了，单子就撕了</div>
                               </div>
                            </div>
                         </div>
                         <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                            <p className="text-[10px] text-slate-500 leading-relaxed">
                               结论：你不会在图书馆里存一亿张已经还完书的旧借书单。
                            </p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
           )}

           {/* 3. Deep Path View */}
           {activeTab === 'deep' && (
             <div className="p-8 bg-slate-950 rounded-3xl border border-white/10 min-h-[450px] flex flex-col items-center justify-center animate-in fade-in">
                <h3 className="text-xl font-bold text-slate-100 mb-8">Q 的“灵魂”去哪了？</h3>
                
                <div className="relative flex items-center gap-4 w-full max-w-2xl">
                   {/* Step T-1 */}
                   <div className="flex-1 p-6 bg-slate-900 border border-white/10 rounded-3xl relative">
                      <div className="text-[10px] font-bold text-slate-500 uppercase mb-4">Step T-1</div>
                      <div className="space-y-3">
                         <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-amber-500" />
                            <span className="text-[10px] text-slate-400">Q_{step-1} (意图)</span>
                         </div>
                         <div className="flex items-center gap-2">
                            <ArrowRight className="w-3 h-3 text-slate-700" />
                            <div className="px-2 py-1 bg-rose-500/20 text-rose-400 rounded text-[9px] font-bold border border-rose-500/20">Attention 计算</div>
                         </div>
                         <div className="flex items-center gap-2 animate-pulse">
                            <div className="w-3 h-3 rounded bg-white" />
                            <span className="text-[10px] text-white font-bold">输出词: "Apple"</span>
                         </div>
                      </div>
                   </div>

                   <div className="flex-none flex flex-col items-center">
                      <div className="h-px w-12 bg-gradient-to-r from-white/20 to-indigo-500" />
                      <span className="text-[8px] text-indigo-400 font-bold uppercase py-2">反馈回路</span>
                   </div>

                   {/* Step T */}
                   <div className="flex-1 p-6 bg-indigo-500/10 border border-indigo-500/30 rounded-3xl shadow-[0_0_30px_rgba(99,102,241,0.1)]">
                      <div className="text-[10px] font-bold text-indigo-400 uppercase mb-4">Step T (当前)</div>
                      <div className="space-y-3">
                         <div className="p-2 bg-black/40 rounded-lg border border-white/5">
                            <span className="text-[10px] text-slate-300">输入: "Apple"</span>
                         </div>
                         <div className="flex items-center gap-2">
                            <ArrowRight className="w-3 h-3 text-slate-700" />
                            <span className="text-[10px] text-emerald-400 font-bold">生成新的 K_t, V_t</span>
                         </div>
                         <p className="text-[9px] text-slate-500 leading-relaxed italic">
                           旧 Q 的信息已经通过它选中的“值 (Value)”注入了生成的 Token 中。所以，它已经<b>间接存在</b>于现在的输入里了。
                         </p>
                      </div>
                   </div>
                </div>

                <div className="mt-12 p-6 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 max-w-xl text-center">
                   <p className="text-xs text-slate-400 leading-relaxed">
                      这就是深度学习的魅力：<b>信息不是消失了，而是被转化了。</b><br/>
                      Q_{step-1} 决定了输出什么词，而这个词又是 Q_{step} 的来源。我们不需要存原始的 Q 向量，因为它的“精神”已经融入了新的 Token 中。
                   </p>
                </div>
             </div>
           )}
        </div>

        {/* Right Info Panel */}
        <div className="lg:col-span-4 space-y-6">
           <div className="p-6 bg-slate-900 border border-white/10 rounded-3xl shadow-2xl h-full flex flex-col">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6">
                 <HelpCircle className="w-6 h-6 text-amber-400" />
              </div>
              
              <h3 className="text-xl font-bold mb-4 text-slate-100">核心洞察</h3>
              
              <div className="flex-1 space-y-6 overflow-y-auto custom-scrollbar pr-2">
                 <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2">
                    <h4 className="text-xs font-bold text-amber-300 flex items-center gap-2">
                       <Calculator className="w-3 h-3" /> 数学解释 (一句话)
                    </h4>
                    {/* Fix: Escaped the math expression to prevent JSX interpretation of curly braces as variables */}
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                       {'注意力计算是 $Score = q_{curr} \times K_{past}^T$。这个公式里只有当前的 $q$。'}
                    </p>
                 </div>

                 <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2">
                    <h4 className="text-xs font-bold text-rose-400 flex items-center gap-2">
                       <TrendingDown className="w-3 h-3" /> 为什么不存？
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-bold">
                       存了就是 100% 的显存浪费。
                    </p>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                       在生成第 1000 个词时，你绝不需要第 1 个词的 Query。
                    </p>
                 </div>

                 <div className="p-4 bg-amber-500/5 rounded-xl border border-amber-500/20 space-y-2">
                    <h4 className="text-xs font-bold text-amber-400 flex items-center gap-2">
                       <Zap className="w-3 h-3" /> 显存收益
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                       如果不存 Q，我们立刻节省了 <b>1/3</b> 的潜在缓存显存占用（Q, K, V 各占 1/3）。这对于运行大参数模型至关重要。
                    </p>
                 </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5">
                 <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <MousePointerClick className="w-3 h-3" />
                    <span>点击左侧模式探索 Q 消失的真相</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default QCacheAbsenceSim;
