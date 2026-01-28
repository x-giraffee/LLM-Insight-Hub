
import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart, Activity, Zap, Layers, Settings, 
  ArrowRight, Clock, AlignLeft, Scissors, 
  MousePointerClick, Play, RotateCcw, Combine
} from 'lucide-react';

type Mode = 'naive' | 'adaptive';

interface TimeBlock {
  id: number;
  type: 'decode' | 'prefill' | 'overhead';
  width: number; // Duration
  label: string;
  color: string;
}

const ChunkSchedulingSim: React.FC = () => {
  const [mode, setMode] = useState<Mode>('naive');
  const [isRunning, setIsRunning] = useState(false);
  const [timeline, setTimeline] = useState<TimeBlock[]>([]);
  const [metrics, setMetrics] = useState({ totalTime: 0, overhead: 0, throughput: 0 });
  const scrollRef = useRef<HTMLDivElement>(null);

  // Simulation Constants
  const LONG_PREFILL_TOTAL = 400; // Total computational units
  const DECODE_TASK_SIZE = 30; // Size of other users' decode tasks
  
  // Naive: Fixed small chunks (e.g., 50 units), High overhead per chunk
  const NAIVE_CHUNK_SIZE = 50;
  const NAIVE_OVERHEAD = 20; // High overhead due to fragmentation

  // Adaptive: Dynamic large chunks (e.g., 100-200 units), Low overhead
  const ADAPTIVE_CHUNK_SIZES = [150, 150, 100]; 
  const ADAPTIVE_OVERHEAD = 10; // Optimized overhead

  const runSimulation = () => {
    setIsRunning(true);
    setTimeline([]);
    setMetrics({ totalTime: 0, overhead: 0, throughput: 0 });

    let pendingPrefill = LONG_PREFILL_TOTAL;
    let currentAdaptiveIdx = 0;
    let time = 0;
    let totalOverhead = 0;
    
    const interval = setInterval(() => {
      if (pendingPrefill <= 0) {
        setIsRunning(false);
        clearInterval(interval);
        return;
      }

      setTimeline(prev => {
        const newBlocks = [...prev];
        
        // 1. Always schedule a Decode task first (simulating multi-user interleaving)
        // This represents "protecting ITL" (Inter-Token Latency)
        newBlocks.push({
          id: Date.now() + Math.random(),
          type: 'decode',
          width: DECODE_TASK_SIZE,
          label: 'Decode',
          color: 'bg-emerald-500'
        });
        time += DECODE_TASK_SIZE;

        // 2. Schedule Prefill Chunk based on strategy
        let chunkSize = 0;
        let overhead = 0;

        if (mode === 'naive') {
          // Naive: Rigid slicing
          chunkSize = Math.min(pendingPrefill, NAIVE_CHUNK_SIZE);
          overhead = NAIVE_OVERHEAD;
        } else {
          // Adaptive: Smart merging
          chunkSize = Math.min(pendingPrefill, ADAPTIVE_CHUNK_SIZES[currentAdaptiveIdx] || 100);
          overhead = ADAPTIVE_OVERHEAD;
          currentAdaptiveIdx++;
        }

        // Add Overhead Block (Context Switch / Kernel Launch)
        if (overhead > 0) {
          newBlocks.push({
            id: Date.now() + Math.random() + 1,
            type: 'overhead',
            width: overhead,
            label: 'Delay',
            color: 'bg-rose-500/50'
          });
          time += overhead;
          totalOverhead += overhead;
        }

        // Add Prefill Computation Block
        newBlocks.push({
          id: Date.now() + Math.random() + 2,
          type: 'prefill',
          width: chunkSize,
          label: `Prefill (${chunkSize})`,
          color: 'bg-blue-500'
        });
        time += chunkSize;
        pendingPrefill -= chunkSize;

        // Update metrics
        setMetrics({
          totalTime: time,
          overhead: totalOverhead,
          throughput: (LONG_PREFILL_TOTAL / time) * 100
        });

        return newBlocks;
      });

      // Auto scroll
      if (scrollRef.current) {
        scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
      }

    }, 600);
  };

  const reset = () => {
    setIsRunning(false);
    setTimeline([]);
    setMetrics({ totalTime: 0, overhead: 0, throughput: 0 });
  };

  useEffect(() => {
    reset();
  }, [mode]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 rounded-full text-[9px] font-bold border border-cyan-500/20 tracking-widest uppercase">
              Scheduler Optimization
            </span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            分块调度优化 (Chunked Prefill)
          </h2>
        </div>
        <div className="flex items-center gap-4">
           <div className="bg-slate-900 p-1 rounded-xl border border-white/5 flex">
              <button 
                onClick={() => setMode('naive')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${mode === 'naive' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Scissors className="w-3 h-3" /> 机械切分 (Naive)
              </button>
              <button 
                onClick={() => setMode('adaptive')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${mode === 'adaptive' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Combine className="w-3 h-3" /> 自适应融合 (Adaptive)
              </button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Simulation Canvas */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-8 bg-slate-950 rounded-3xl border border-white/10 min-h-[400px] flex flex-col justify-between">
             
             {/* Header Info */}
             <div className="flex justify-between items-center mb-8">
                <div>
                   <h3 className="text-slate-200 font-bold flex items-center gap-2">
                     <Activity className="w-5 h-5 text-cyan-400" /> GPU 流水线 (Time Stream)
                   </h3>
                   <p className="text-xs text-slate-500 mt-1">模拟长文本请求进入系统后的执行队列</p>
                </div>
                <div className="flex gap-2">
                   <button 
                     onClick={runSimulation} 
                     disabled={isRunning}
                     className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-30 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-2"
                   >
                     <Play className="w-3 h-3 fill-current" /> 开始调度
                   </button>
                   <button 
                     onClick={reset}
                     className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg transition-all"
                   >
                     <RotateCcw className="w-4 h-4" />
                   </button>
                </div>
             </div>

             {/* Gantt Chart Container */}
             <div className="relative h-40 bg-slate-900/50 rounded-2xl border border-white/5 overflow-hidden flex items-center px-4">
                <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-slate-900/50 to-transparent z-10" />
                <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-slate-900/50 to-transparent z-10" />
                
                {/* Scrolling Track */}
                <div ref={scrollRef} className="flex gap-1 overflow-x-auto no-scrollbar w-full scroll-smooth items-center h-full px-4">
                   {timeline.length === 0 && (
                     <div className="absolute inset-0 flex items-center justify-center text-slate-600 text-xs italic">
                        Ready to process long context request...
                     </div>
                   )}
                   {timeline.map((block) => (
                     <div 
                       key={block.id}
                       className={`h-20 shrink-0 rounded-md flex flex-col items-center justify-center text-[10px] font-bold text-white shadow-lg transition-all animate-in slide-in-from-right-10 duration-300 ${block.color}`}
                       style={{ width: `${block.width}px` }}
                     >
                        <span className="opacity-90">{block.label}</span>
                        {block.type === 'overhead' && <Clock className="w-3 h-3 mt-1 opacity-50" />}
                     </div>
                   ))}
                </div>
             </div>

             {/* Legend */}
             <div className="flex gap-6 justify-center mt-6">
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded bg-emerald-500" />
                   <span className="text-[10px] text-slate-400">Decode (其他用户)</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded bg-blue-500" />
                   <span className="text-[10px] text-slate-400">Prefill (长文本分块)</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded bg-rose-500/50" />
                   <span className="text-[10px] text-slate-400">Overhead (调度损耗)</span>
                </div>
             </div>

             {/* Analysis Text */}
             <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/5 text-center">
                <p className="text-xs text-slate-300 leading-relaxed">
                  {mode === 'naive' 
                    ? '机械切分导致大量碎片化的 "Delay" (红色块)。每次切换到 Prefill 都要重新加载显存上下文，导致总耗时增加。'
                    : '自适应方案智能合并了 Prefill 块 (蓝色块更宽)。减少了切换次数，大幅降低了 Overhead，同时保证了 Decode 不被饿死。'}
                </p>
             </div>
          </div>
        </div>

        {/* Right: Metrics & Comparison */}
        <div className="lg:col-span-4 space-y-6">
           <div className="p-6 bg-slate-900 rounded-3xl border border-white/10 h-full flex flex-col">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-6">
                 <AlignLeft className="w-4 h-4 text-indigo-400" /> 性能指标 (Metrics)
              </h4>

              <div className="space-y-6 flex-1">
                 {/* Throughput */}
                 <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                       <span className="text-slate-400">系统吞吐量 (Throughput)</span>
                       <span className={`font-mono font-bold ${mode === 'adaptive' ? 'text-emerald-400' : 'text-amber-400'}`}>
                         {metrics.throughput.toFixed(1)} tokens/s
                       </span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                       <div className={`h-full transition-all duration-500 ${mode === 'adaptive' ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${Math.min(100, metrics.throughput * 2)}%` }} />
                    </div>
                 </div>

                 {/* Overhead */}
                 <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                       <span className="text-slate-400">调度损耗 (Overhead)</span>
                       <span className={`font-mono font-bold ${mode === 'naive' ? 'text-rose-400' : 'text-blue-400'}`}>
                         {metrics.overhead} ms
                       </span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                       <div className={`h-full transition-all duration-500 ${mode === 'naive' ? 'bg-rose-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(100, metrics.overhead)}%` }} />
                    </div>
                 </div>

                 {/* Time to Finish */}
                 <div className="p-4 bg-white/5 rounded-xl border border-white/5 mt-4">
                    <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">总耗时 (Total Time)</div>
                    <div className="text-2xl font-mono text-white">{metrics.totalTime} ms</div>
                    {mode === 'naive' && metrics.totalTime > 0 && (
                      <div className="text-[9px] text-rose-400 mt-1 flex items-center gap-1">
                        <ArrowRight className="w-3 h-3" /> 比优化方案慢约 30%
                      </div>
                    )}
                 </div>
              </div>

              {/* Scenario Explanation */}
              <div className="mt-8 pt-6 border-t border-white/5">
                 <div className="flex gap-3">
                    <div className="shrink-0 p-2 bg-indigo-500/10 rounded-lg text-indigo-400 h-fit">
                       <Settings className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                       <h5 className="text-[11px] font-bold text-indigo-300 uppercase">应用场景</h5>
                       <p className="text-[10px] text-slate-400 leading-relaxed">
                          当用户上传几万字的 PDF 进行分析时，系统需要做大量的 Prefill。
                          <b>自适应调度</b>确保了在快速处理 PDF 的同时，不影响其他正在聊天的用户的流畅度。
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ChunkSchedulingSim;
