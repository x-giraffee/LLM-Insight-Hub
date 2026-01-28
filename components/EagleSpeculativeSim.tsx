
import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, Layers, GitBranch, ArrowRight, CheckCircle2, 
  XCircle, Brain, Gauge, Network, ChevronDown, 
  ChevronUp, ScanLine, Combine
} from 'lucide-react';

type Mode = 'standard' | 'eagle1' | 'eagle3';

interface StepLog {
  phase: 'draft' | 'verify';
  content: string;
  accepted?: number;
}

const EagleSpeculativeSim: React.FC = () => {
  const [mode, setMode] = useState<Mode>('standard');
  const [isRunning, setIsRunning] = useState(false);
  const [generatedText, setGeneratedText] = useState<string[]>([]);
  const [draftTree, setDraftTree] = useState<string[]>([]); // Visual placeholder for drafted tokens
  const [logs, setLogs] = useState<StepLog[]>([]);
  const [speedup, setSpeedup] = useState(1.0);
  
  // Simulation Data
  const TARGET_SENTENCE = "人工智能正在重塑金融行业的风险控制模型。".split("");
  
  const reset = () => {
    setIsRunning(false);
    setGeneratedText([]);
    setDraftTree([]);
    setLogs([]);
    setSpeedup(1.0);
  };

  const runSimulation = () => {
    reset();
    setIsRunning(true);
  };

  // Simulation Logic Loop
  useEffect(() => {
    if (!isRunning) return;

    let currentIndex = 0;
    const intervalTime = mode === 'standard' ? 800 : mode === 'eagle1' ? 1200 : 1000; 
    // Speculative steps take longer per step but yield more tokens

    const timer = setInterval(() => {
      if (currentIndex >= TARGET_SENTENCE.length) {
        setIsRunning(false);
        clearInterval(timer);
        return;
      }

      if (mode === 'standard') {
        // Standard: 1 token per step
        setGeneratedText(prev => [...prev, TARGET_SENTENCE[currentIndex]]);
        setLogs(prev => [...prev, { phase: 'verify', content: `生成: "${TARGET_SENTENCE[currentIndex]}"`, accepted: 1 }]);
        currentIndex++;
      } else {
        // Speculative: Draft -> Verify
        // 1. Draft Phase
        const draftCount = mode === 'eagle1' ? 3 : 5; // EAGLE-3 drafts deeper/better
        const draftTokens = TARGET_SENTENCE.slice(currentIndex, currentIndex + draftCount);
        
        // Simulating Draft Accuracy
        // EAGLE-1 has decent accuracy, EAGLE-3 has high accuracy
        let acceptedCount = 0;
        const accuracyChance = mode === 'eagle1' ? 0.7 : 0.95;
        
        const verifiedTokens: string[] = [];
        let hitError = false;

        draftTokens.forEach(t => {
          if (!hitError && Math.random() < accuracyChance) {
            verifiedTokens.push(t);
            acceptedCount++;
          } else {
            hitError = true; // Once error, subsequent drafts are discarded
          }
        });

        // Ensure at least 1 token (the base model's own step) is always generated if drafts fail
        if (acceptedCount === 0 && currentIndex < TARGET_SENTENCE.length) {
           verifiedTokens.push(TARGET_SENTENCE[currentIndex]);
           acceptedCount = 1;
        }

        setDraftTree(draftTokens); // Show what was guessed
        
        // 2. Verify Phase (Delayed slightly for visual effect)
        setTimeout(() => {
          setGeneratedText(prev => [...prev, ...verifiedTokens]);
          setDraftTree([]); // Clear draft
          setLogs(prev => [...prev, { 
            phase: 'verify', 
            content: `验证通过: ${verifiedTokens.join('')}`, 
            accepted: acceptedCount 
          }]);
          
          // Update Speedup Metric
          setSpeedup(prev => (prev * 0.9 + (acceptedCount) * 0.1));
        }, 400);

        currentIndex += acceptedCount;
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isRunning, mode]);

  const ModeCard = ({ id, title, subtitle, color, speed, features }: any) => (
    <button 
      onClick={() => { setMode(id); reset(); }}
      className={`relative p-4 rounded-2xl border text-left transition-all overflow-hidden group
        ${mode === id ? `bg-${color}-500/10 border-${color}-500 ring-1 ring-${color}-500/50` : 'bg-slate-900 border-white/10 hover:bg-slate-800'}`}
    >
      <div className="flex justify-between items-start mb-2 relative z-10">
        <div>
          <div className="font-bold text-sm text-slate-200">{title}</div>
          <div className={`text-[10px] uppercase font-bold text-${color}-400`}>{subtitle}</div>
        </div>
        <div className={`text-xl font-black text-${color}-500/20 group-hover:text-${color}-500/40 transition-colors`}>
          {speed}
        </div>
      </div>
      <div className="space-y-1 relative z-10">
        {features.map((f: string, i: number) => (
          <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <div className={`w-1 h-1 rounded-full bg-${color}-400`} />
            {f}
          </div>
        ))}
      </div>
      {mode === id && <div className={`absolute bottom-0 left-0 w-full h-1 bg-${color}-500`} />}
    </button>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-sky-500/10 text-sky-400 rounded-full text-[9px] font-bold border border-sky-500/20 tracking-widest uppercase">Speculative Decoding</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">
            EAGLE & EAGLE-3 加速原理
          </h2>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Current Speedup</div>
              <div className={`text-2xl font-mono font-bold ${speedup > 1.5 ? 'text-emerald-400' : 'text-slate-400'}`}>
                {mode === 'standard' ? '1.0x' : speedup.toFixed(1) + 'x'}
              </div>
           </div>
           <button 
             onClick={runSimulation}
             disabled={isRunning}
             className="px-6 py-3 bg-sky-600 hover:bg-sky-700 disabled:opacity-30 rounded-xl font-bold text-xs text-white transition-all shadow-lg flex items-center gap-2"
           >
             <Zap className="w-4 h-4 fill-current" /> 开始推理
           </button>
        </div>
      </div>

      {/* Mode Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ModeCard 
          id="standard" 
          title="Standard Decoding" 
          subtitle="Baseline" 
          color="slate" 
          speed="1x"
          features={['Autoregressive (逐词)', '无额外开销', '高延迟']} 
        />
        <ModeCard 
          id="eagle1" 
          title="EAGLE (v1)" 
          subtitle="Feature Extrapolation" 
          color="blue" 
          speed="3x"
          features={['顶层特征外推', '树状注意力', '回归预测任务']} 
        />
        <ModeCard 
          id="eagle3" 
          title="EAGLE-3 (2025)" 
          subtitle="Multi-Layer Fusion" 
          color="emerald" 
          speed="5x+"
          features={['多层特征融合', '直接 Token 预测', 'Training-Time Test']} 
        />
      </div>

      {/* Visualization Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Architecture Diagram */}
        <div className="lg:col-span-5 space-y-6">
           <div className="p-6 bg-slate-900 border border-white/10 rounded-3xl relative overflow-hidden h-[400px] flex flex-col">
              <div className="absolute top-4 left-4 text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
                <Network className="w-4 h-4" /> 架构透视 (Architecture View)
              </div>

              <div className="flex-1 flex flex-row items-center justify-center gap-16 relative">
                  {/* LLM Stack */}
                  <div className="relative w-48 flex flex-col gap-1">
                     <div className="text-center text-[9px] text-slate-500 mb-1">Base LLM (e.g. Llama-3-70B)</div>
                     {/* Deep Layers */}
                     <div className={`h-12 bg-slate-800 rounded border border-white/5 flex items-center justify-center text-[10px] text-slate-400 transition-all ${mode === 'eagle3' ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : ''}`}>
                        Deep Layer (32)
                     </div>
                     {/* Connection Lines for EAGLE-3 */}
                     {mode === 'eagle3' && <div className="absolute -right-4 top-6 w-8 h-px bg-emerald-500/50" />}
                     
                     {/* Mid Layers */}
                     <div className={`h-12 bg-slate-800 rounded border border-white/5 flex items-center justify-center text-[10px] text-slate-400 transition-all ${mode === 'eagle3' ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : ''}`}>
                        Mid Layer (16)
                     </div>
                     {mode === 'eagle3' && <div className="absolute -right-4 top-[4.5rem] w-8 h-px bg-emerald-500/50" />}

                     {/* Shallow Layers */}
                     <div className={`h-12 bg-slate-800 rounded border border-white/5 flex items-center justify-center text-[10px] text-slate-400 transition-all ${mode === 'eagle3' ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : ''}`}>
                        Shallow Layer (4)
                     </div>
                     {mode === 'eagle3' && <div className="absolute -right-4 top-[7.5rem] w-8 h-px bg-emerald-500/50" />}
                     
                     {/* Embedding */}
                     <div className="h-8 bg-slate-900 rounded border border-dashed border-slate-700 flex items-center justify-center text-[9px] text-slate-600">
                        Input Embeddings
                     </div>
                  </div>

                  {/* The EAGLE Head */}
                  {mode !== 'standard' && (
                    <div className="relative flex flex-col items-center animate-in slide-in-from-left-4 fade-in duration-700">
                       <div className="h-32 w-1 bg-gradient-to-b from-transparent via-slate-600 to-transparent absolute -left-8" />
                       
                       {mode === 'eagle1' && (
                         <>
                            <div className="w-32 p-3 bg-blue-900/30 border border-blue-500/50 rounded-xl text-center backdrop-blur-md">
                               <div className="text-[10px] font-bold text-blue-300">EAGLE Head (v1)</div>
                               <div className="text-[9px] text-blue-400/60 mt-1">Input: Top Layer Only</div>
                               <div className="mt-2 text-[8px] bg-black/40 rounded p-1 text-slate-300">Pred: Feature Vector</div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-blue-500 rotate-90 mt-2" />
                         </>
                       )}

                       {mode === 'eagle3' && (
                         <>
                            <div className="absolute -left-12 h-40 w-8 border-r border-emerald-500/30 rounded-r-3xl" />
                            <div className="w-36 p-3 bg-emerald-900/30 border border-emerald-500/50 rounded-xl text-center backdrop-blur-md z-10 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                               <div className="text-[10px] font-bold text-emerald-300 flex items-center justify-center gap-1">
                                 <Combine className="w-3 h-3" /> EAGLE-3 Head
                               </div>
                               <div className="text-[9px] text-emerald-400/60 mt-1">Input: Multi-Layer Fusion</div>
                               <div className="mt-2 text-[8px] bg-black/40 rounded p-1 text-slate-300">Pred: Token ID (Softmax)</div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-emerald-500 rotate-90 mt-2" />
                         </>
                       )}
                       
                       <div className="mt-2 p-2 bg-slate-800 rounded-lg border border-white/5 text-center w-24">
                          <div className="text-[8px] text-slate-500 uppercase">Draft Output</div>
                          <div className="flex justify-center gap-1 mt-1">
                             <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                             <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse delay-75" />
                             <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse delay-150" />
                          </div>
                       </div>
                    </div>
                  )}
              </div>
           </div>
           
           <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <h4 className="text-xs font-bold text-slate-300 uppercase mb-2 flex items-center gap-2">
                <Brain className="w-4 h-4 text-slate-400" />
                {mode === 'standard' ? '标准模式痛点' : mode === 'eagle1' ? 'EAGLE v1 核心' : 'EAGLE-3 进化'}
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {mode === 'standard' 
                  ? '每次前向传播（Forward Pass）只生成 1 个 Token。对于 70B 模型，这就像开着法拉利在胡同里堵车，显存带宽利用率极低。'
                  : mode === 'eagle1'
                  ? '在 LLM 顶层附加轻量级 Head。独特之处在于预测的是“特征向量”而非 Token，并构建树状结构让大模型一次性验证。'
                  : '放弃特征回归，改回 Token 预测（分类任务更简单）。关键突破是“多层特征融合”，利用浅层词法和深层语义信息，预测极准。'}
              </p>
           </div>
        </div>

        {/* Right: Runtime Generation Visual */}
        <div className="lg:col-span-7 space-y-6">
           <div className="bg-slate-950 rounded-3xl border border-white/10 p-6 h-[400px] flex flex-col">
              <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                 <div className="flex items-center gap-2">
                    <ScanLine className="w-4 h-4 text-sky-400" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">推理输出流 (Inference Stream)</span>
                 </div>
                 {draftTree.length > 0 && (
                   <span className="text-[10px] font-bold text-amber-400 animate-pulse">Drafting...</span>
                 )}
              </div>

              <div className="flex-1 overflow-y-auto font-mono text-sm leading-relaxed p-4 bg-black/20 rounded-xl border border-white/5">
                 {generatedText.map((t, i) => (
                   <span key={i} className="inline-block animate-in fade-in zoom-in duration-300 mr-0.5 text-slate-200">
                     {t}
                   </span>
                 ))}
                 {/* Visualizing Drafts (Ghost Text) */}
                 {draftTree.map((t, i) => (
                   <span key={`draft-${i}`} className="inline-block text-slate-600 border border-dashed border-slate-700 rounded px-1 mx-0.5 animate-pulse">
                     {t}
                   </span>
                 ))}
                 <span className="inline-block w-2 h-4 bg-sky-500 ml-1 animate-pulse" />
              </div>

              {/* Log Timeline */}
              <div className="h-32 mt-4 space-y-2 overflow-y-auto custom-scrollbar pr-2">
                 {logs.map((log, i) => (
                   <div key={i} className="flex items-center gap-3 text-[10px] animate-in slide-in-from-bottom-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${log.phase === 'draft' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                      <span className="font-mono text-slate-500 w-12 uppercase">{log.phase}</span>
                      <span className="text-slate-300 flex-1 truncate">{log.content}</span>
                      {log.accepted && log.accepted > 1 && (
                        <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded font-bold">+{log.accepted}</span>
                      )}
                   </div>
                 ))}
              </div>
           </div>

           {/* Comparison Table */}
           <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                 <div className="text-[10px] font-bold text-blue-400 uppercase mb-2">EAGLE (v1)</div>
                 <ul className="space-y-1.5 text-[10px] text-slate-400">
                    <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3 h-3 text-blue-500 shrink-0 mt-0.5"/> 预测 Feature Vectors</li>
                    <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3 h-3 text-blue-500 shrink-0 mt-0.5"/> 仅 Top-Layer 输入</li>
                    <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3 h-3 text-blue-500 shrink-0 mt-0.5"/> 2x-3x 加速比</li>
                 </ul>
              </div>
              <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                 <div className="text-[10px] font-bold text-emerald-400 uppercase mb-2">EAGLE-3 (New)</div>
                 <ul className="space-y-1.5 text-[10px] text-slate-400">
                    <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5"/> 预测 Token ID (更准)</li>
                    <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5"/> 多层特征融合 (视野广)</li>
                    <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5"/> 4x-6x 加速比 (SOTA)</li>
                 </ul>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default EagleSpeculativeSim;
