
import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, Clock, ArrowRight, Layers, Cpu, 
  Database, Play, RotateCcw, BarChart3,
  AlignLeft, Type, FastForward
} from 'lucide-react';

type Phase = 'idle' | 'prefill' | 'decode' | 'finished';

const PrefillDecodeSim: React.FC = () => {
  const [phase, setPhase] = useState<Phase>('idle');
  const [inputLength, setInputLength] = useState(20); // Number of prompt tokens
  const [outputTokens, setOutputTokens] = useState<string[]>([]);
  const [kvCache, setKvCache] = useState(0);
  const [metrics, setMetrics] = useState({ gpuUtil: 0, memoryBandwidth: 0, throughput: 0 });
  
  const decodeTarget = ["To", "be", ",", "or", "not", "to", "be", ",", "that", "is", "the", "question", "."];
  const inputTokensVisual = Array.from({ length: inputLength }).map((_, i) => i < 5 ? "Context" : "...");

  const runSimulation = () => {
    setPhase('prefill');
    setOutputTokens([]);
    setKvCache(0);
    setMetrics({ gpuUtil: 0, memoryBandwidth: 0, throughput: 0 });
  };

  useEffect(() => {
    let timer: number;

    if (phase === 'prefill') {
      // PREFILL PHASE: High Compute, Fast Processing
      // Simulating a short burst of high activity
      setMetrics({ gpuUtil: 95, memoryBandwidth: 40, throughput: 4000 });
      
      timer = window.setTimeout(() => {
        setKvCache(inputLength);
        setPhase('decode');
      }, 1500); // Prefill duration simulation
    } 
    else if (phase === 'decode') {
      // DECODE PHASE: Low Compute, High Memory Bandwidth (Relative to compute), Slow sequential generation
      setMetrics({ gpuUtil: 15, memoryBandwidth: 90, throughput: 50 });

      if (outputTokens.length < decodeTarget.length) {
        timer = window.setTimeout(() => {
          setOutputTokens(prev => [...prev, decodeTarget[prev.length]]);
          setKvCache(prev => prev + 1);
        }, 600); // Decode latency per token (slow)
      } else {
        setPhase('finished');
        setMetrics({ gpuUtil: 0, memoryBandwidth: 0, throughput: 0 });
      }
    }

    return () => clearTimeout(timer);
  }, [phase, outputTokens, inputLength]);

  const reset = () => {
    setPhase('idle');
    setOutputTokens([]);
    setKvCache(0);
    setMetrics({ gpuUtil: 0, memoryBandwidth: 0, throughput: 0 });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-pink-500/10 text-pink-400 rounded-full text-[9px] font-bold border border-pink-500/20 tracking-widest uppercase">
              Inference Pipeline
            </span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent">
            Prefill (预填充) vs Decode (解码)
          </h2>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={runSimulation}
             disabled={phase !== 'idle' && phase !== 'finished'}
             className="px-6 py-3 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs transition-all shadow-lg flex items-center gap-2"
           >
             {phase === 'idle' || phase === 'finished' ? <Play className="w-4 h-4 fill-current" /> : <RotateCcw className="w-4 h-4 animate-spin" />}
             {phase === 'idle' || phase === 'finished' ? '开始推理过程' : '推理进行中...'}
           </button>
           <button onClick={reset} className="p-3 bg-slate-800 rounded-xl text-slate-400 hover:bg-slate-700 transition-colors">
             <RotateCcw className="w-4 h-4" />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Visualization Stage */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Timeline / Pipeline View */}
          <div className="p-8 bg-slate-950 rounded-3xl border border-white/10 min-h-[400px] flex flex-col relative overflow-hidden">
             
             {/* Phase Indicator */}
             <div className="flex justify-center mb-12">
                <div className="flex bg-slate-900/80 p-1 rounded-full border border-white/10 backdrop-blur-md">
                   <div className={`px-6 py-2 rounded-full text-xs font-bold transition-all duration-500 flex items-center gap-2
                     ${phase === 'prefill' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500'}`}>
                      <FastForward className="w-4 h-4" /> 1. Prefill (并行处理)
                   </div>
                   <div className={`px-6 py-2 rounded-full text-xs font-bold transition-all duration-500 flex items-center gap-2
                     ${phase === 'decode' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-500'}`}>
                      <Type className="w-4 h-4" /> 2. Decode (逐词生成)
                   </div>
                </div>
             </div>

             {/* The "Processor" Animation */}
             <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                
                {/* Input Prompt Block */}
                <div className={`transition-all duration-700 flex flex-wrap justify-center gap-1 max-w-2xl
                  ${phase === 'idle' ? 'opacity-100 scale-100' : 
                    phase === 'prefill' ? 'opacity-100 scale-105' : 'opacity-40 scale-95'}`}>
                   {inputTokensVisual.map((t, i) => (
                      <div key={i} className={`w-8 h-8 rounded bg-slate-800 border border-white/5 flex items-center justify-center text-[10px] text-slate-500 transition-colors duration-300
                        ${phase === 'prefill' ? 'bg-blue-500/20 border-blue-500 text-blue-300 animate-pulse' : ''}`}>
                        In
                      </div>
                   ))}
                </div>

                <div className="flex items-center gap-4 w-full justify-center">
                   {/* Arrow */}
                   <div className={`transition-all duration-300 ${phase !== 'idle' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                      <ArrowRight className="w-6 h-6 text-slate-600 rotate-90" />
                   </div>
                </div>

                {/* KV Cache & Model State */}
                <div className="w-full max-w-lg p-6 bg-slate-900/50 rounded-2xl border border-white/5 flex items-center gap-6">
                   <div className="flex flex-col items-center gap-2">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-300
                        ${phase === 'prefill' ? 'bg-blue-600 border-blue-400 shadow-[0_0_30px_rgba(37,99,235,0.4)]' : 
                          phase === 'decode' ? 'bg-emerald-600 border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.4)]' : 'bg-slate-800 border-slate-700'}`}>
                         <Cpu className={`w-8 h-8 text-white ${phase !== 'idle' && phase !== 'finished' ? 'animate-pulse' : ''}`} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">GPU Core</span>
                   </div>

                   <div className="flex-1 space-y-2">
                      <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                         <span>KV Cache (显存占用)</span>
                         <span>{kvCache} Tokens</span>
                      </div>
                      <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                         <div 
                           className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-300"
                           style={{ width: `${(kvCache / (inputLength + decodeTarget.length)) * 100}%` }}
                         />
                      </div>
                      <div className="flex gap-2 text-[9px]">
                         {phase === 'prefill' && <span className="text-blue-400 animate-pulse">⚡ 正在并行计算输入 Prompt 的 KV...</span>}
                         {phase === 'decode' && <span className="text-emerald-400 animate-pulse">🐢 每次生成需读取全部历史 KV...</span>}
                      </div>
                   </div>
                </div>

                {/* Output Stream */}
                <div className="min-h-[60px] flex flex-wrap justify-center gap-2">
                   {outputTokens.map((token, i) => (
                      <span key={i} className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300 text-sm font-mono animate-in fade-in zoom-in slide-in-from-top-2">
                        {token}
                      </span>
                   ))}
                   {phase === 'decode' && (
                      <div className="w-2 h-6 bg-emerald-500 animate-pulse" />
                   )}
                </div>

             </div>
          </div>
        </div>

        {/* Right: Metrics & Comparison */}
        <div className="lg:col-span-4 space-y-6">
           
           {/* Real-time Metrics */}
           <div className="p-6 bg-slate-900 rounded-3xl border border-white/10 space-y-6">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                 <BarChart3 className="w-4 h-4 text-pink-400" /> 实时负载监控
              </h4>

              <div className="space-y-4">
                 {/* GPU Compute */}
                 <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold uppercase">
                       <span className="text-slate-400">GPU 算力利用率 (Compute)</span>
                       <span className={`transition-colors ${phase === 'prefill' ? 'text-blue-400' : 'text-slate-200'}`}>{metrics.gpuUtil}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                       <div className={`h-full transition-all duration-300 ${phase === 'prefill' ? 'bg-blue-500' : 'bg-slate-600'}`} style={{ width: `${metrics.gpuUtil}%` }} />
                    </div>
                 </div>

                 {/* Memory Bandwidth */}
                 <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold uppercase">
                       <span className="text-slate-400">显存带宽占用 (Memory Bandwidth)</span>
                       <span className={`transition-colors ${phase === 'decode' ? 'text-emerald-400' : 'text-slate-200'}`}>{metrics.memoryBandwidth}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                       <div className={`h-full transition-all duration-300 ${phase === 'decode' ? 'bg-emerald-500' : 'bg-slate-600'}`} style={{ width: `${metrics.memoryBandwidth}%` }} />
                    </div>
                 </div>

                 {/* Throughput */}
                 <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-center mt-4">
                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">当前处理速度</div>
                    <div className="text-2xl font-mono text-white transition-all">
                       {metrics.throughput} <span className="text-xs text-slate-500">tokens/s</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Comparison Cards */}
           <div className="grid grid-cols-1 gap-4">
              <div className={`p-5 rounded-2xl border transition-all duration-500 ${phase === 'prefill' ? 'bg-blue-500/10 border-blue-500/30 opacity-100' : 'bg-slate-900 border-white/5 opacity-60'}`}>
                 <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><Layers className="w-4 h-4" /></div>
                    <h5 className="font-bold text-sm text-blue-100">Prefill (首字延迟 TTFT)</h5>
                 </div>
                 <p className="text-[11px] text-slate-400 leading-relaxed">
                    <b>计算密集型 (Compute Bound)</b>。模型并行处理所有输入 Token，计算矩阵乘法。主要看 GPU 算力 (TFLOPS)。
                 </p>
              </div>

              <div className="flex justify-center">
                 <div className="h-8 w-px bg-white/10" />
              </div>

              <div className={`p-5 rounded-2xl border transition-all duration-500 ${phase === 'decode' ? 'bg-emerald-500/10 border-emerald-500/30 opacity-100' : 'bg-slate-900 border-white/5 opacity-60'}`}>
                 <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400"><Type className="w-4 h-4" /></div>
                    <h5 className="font-bold text-sm text-emerald-100">Decode (生成速度 TBT)</h5>
                 </div>
                 <p className="text-[11px] text-slate-400 leading-relaxed">
                    <b>访存密集型 (Memory Bound)</b>。每生成一个词，都要把巨大的 KV Cache 从显存搬到计算核心。主要看显存带宽 (GB/s)。
                 </p>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default PrefillDecodeSim;
