
import React, { useState, useEffect, useRef } from 'react';
import { 
  Network, Server, ArrowRight, FileText, 
  Code, RefreshCw, BarChart3, AlertCircle, 
  CheckCircle2, Split, Database, Trash2, 
  FastForward, Shuffle, AlertTriangle
} from 'lucide-react';

type Strategy = 'round-robin' | 'semantic';
type Topic = 'finance' | 'coding';

interface Request {
  id: number;
  topic: Topic;
  targetWorker?: number;
  status: 'queued' | 'routed' | 'processing' | 'done';
  isHit?: boolean;
}

interface WorkerState {
  id: number;
  currentCache: Topic | null;
  isBusy: boolean;
  tasksProcessed: number;
  cacheHits: number;
  cacheMisses: number;
  statusMessage: string;
}

const CacheRoutingSim: React.FC = () => {
  const [strategy, setStrategy] = useState<Strategy>('round-robin');
  const [isRunning, setIsRunning] = useState(false);
  
  // State
  const [queue, setQueue] = useState<Request[]>([]);
  const [workers, setWorkers] = useState<WorkerState[]>([
    { id: 0, currentCache: null, isBusy: false, tasksProcessed: 0, cacheHits: 0, cacheMisses: 0, statusMessage: 'IDLE' },
    { id: 1, currentCache: null, isBusy: false, tasksProcessed: 0, cacheHits: 0, cacheMisses: 0, statusMessage: 'IDLE' }
  ]);
  const [activeRequest, setActiveRequest] = useState<Request | null>(null);
  
  // Simulation Metrics
  const [totalRequests, setTotalRequests] = useState(0);
  const [totalHits, setTotalHits] = useState(0);

  const requestCounter = useRef(0);
  const roundRobinIndex = useRef(0);
  const intervalRef = useRef<number | null>(null);

  // Generate a random queue
  const generateInitialQueue = (count: number) => {
    return Array.from({ length: count }).map((_, i) => {
      const id = requestCounter.current++;
      // Totally random distribution: 50/50 chance
      const topic: Topic = Math.random() > 0.5 ? 'finance' : 'coding';
      return { id, topic, status: 'queued' } as Request;
    });
  };

  // Initial setup
  useEffect(() => {
    reset();
  }, [strategy]);

  const reset = () => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    requestCounter.current = 0;
    roundRobinIndex.current = 0;
    
    // Generate a long random queue to show patterns
    const initialQueue = generateInitialQueue(12);
    
    setQueue(initialQueue);
    setWorkers([
      { id: 0, currentCache: null, isBusy: false, tasksProcessed: 0, cacheHits: 0, cacheMisses: 0, statusMessage: 'IDLE' },
      { id: 1, currentCache: null, isBusy: false, tasksProcessed: 0, cacheHits: 0, cacheMisses: 0, statusMessage: 'IDLE' }
    ]);
    setActiveRequest(null);
    setTotalRequests(0);
    setTotalHits(0);
  };

  const regenerateQueue = () => {
    reset();
  };

  const processStep = () => {
    setQueue(prevQueue => {
      if (prevQueue.length === 0) {
        // Auto-refill queue to keep simulation going
        const nextId = requestCounter.current++;
        const topic: Topic = Math.random() > 0.5 ? 'finance' : 'coding';
        return [{ id: nextId, topic, status: 'queued' }];
      }
      
      const [current, ...rest] = prevQueue;
      
      // Determine Target Worker
      let targetWorkerIdx = -1;
      if (strategy === 'round-robin') {
        // Blindly rotate: 0 -> 1 -> 0 -> 1
        targetWorkerIdx = roundRobinIndex.current;
        roundRobinIndex.current = (roundRobinIndex.current + 1) % 2;
      } else {
        // Semantic: Finance -> Worker 0, Coding -> Worker 1
        // This ensures Cache Affinity
        targetWorkerIdx = current.topic === 'finance' ? 0 : 1;
      }

      // Check Logic BEFORE state update to determine Hit/Miss
      setWorkers(prevWorkers => {
        const worker = prevWorkers[targetWorkerIdx];
        const isHit = worker.currentCache === current.topic;
        
        // Update Metrics
        if (isHit) setTotalHits(h => h + 1);
        setTotalRequests(r => r + 1);

        // Update Active Request for Animation
        setActiveRequest({ 
          ...current, 
          targetWorker: targetWorkerIdx, 
          status: 'routed', 
          isHit 
        });

        // Worker Update Logic
        return prevWorkers.map((w, idx) => {
          if (idx !== targetWorkerIdx) return { ...w, isBusy: false, statusMessage: 'IDLE' };
          
          if (isHit) {
             return {
               ...w,
               isBusy: true,
               tasksProcessed: w.tasksProcessed + 1,
               cacheHits: w.cacheHits + 1,
               statusMessage: '⚡ HIT: Instant Inference'
             };
          } else {
             // MISS Logic
             return {
               ...w,
               isBusy: true,
               currentCache: current.topic, // Load new cache
               tasksProcessed: w.tasksProcessed + 1,
               cacheMisses: w.cacheMisses + 1,
               statusMessage: '🐢 MISS: Evict & Reloading...'
             };
          }
        });
      });

      return rest;
    });
  };

  const toggleSimulation = () => {
    if (isRunning) {
      setIsRunning(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else {
      setIsRunning(true);
      // Speed depends on if we just had a miss (to simulate latency penalty)
      // But for visual flow, we keep it consistent but show the penalty visually
      intervalRef.current = window.setInterval(processStep, 1200); 
    }
  };

  // Cleanup
  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const hitRate = totalRequests > 0 ? ((totalHits / totalRequests) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 rounded-full text-[9px] font-bold border border-cyan-500/20 tracking-widest uppercase">
              Smart Dispatcher
            </span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            基于场景语义感知的路由优化
          </h2>
        </div>
        
        <div className="flex flex-wrap gap-2 bg-slate-900 p-1 rounded-xl border border-white/5">
          <button 
            onClick={() => setStrategy('round-robin')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${strategy === 'round-robin' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <RefreshCw className="w-3 h-3" /> 传统轮询 (Round-Robin)
          </button>
          <button 
            onClick={() => setStrategy('semantic')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${strategy === 'semantic' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Split className="w-3 h-3" /> 语义路由 (Semantic)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Simulation Canvas */}
        <div className="lg:col-span-8 space-y-6">
          <div className="relative p-8 bg-slate-950 rounded-3xl border border-white/10 min-h-[520px] flex flex-col items-center overflow-hidden">
             
             {/* Background Grid */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

             {/* 1. Request Queue (Top) */}
             <div className="relative z-10 w-full mb-8">
                <div className="flex items-center justify-between mb-2 px-4">
                   <div className="flex items-center gap-4">
                     <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                       <Database className="w-3 h-3" /> 随机请求队列 (Random Queue)
                     </div>
                     <button onClick={regenerateQueue} className="text-[10px] flex items-center gap-1 text-slate-400 hover:text-white transition-colors bg-white/5 px-2 py-0.5 rounded-full">
                        <Shuffle className="w-3 h-3" /> 随机重置
                     </button>
                   </div>
                   <div className="flex gap-2">
                      <span className="flex items-center gap-1 text-[9px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20"><FileText className="w-3 h-3" /> 金融</span>
                      <span className="flex items-center gap-1 text-[9px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20"><Code className="w-3 h-3" /> 代码</span>
                   </div>
                </div>
                
                {/* Queue Visualization */}
                <div className="flex gap-2 p-2 bg-slate-900/80 border border-white/5 rounded-xl overflow-hidden min-h-[60px] items-center relative shadow-inner">
                   {queue.length === 0 && (
                     <div className="w-full text-center text-[10px] text-slate-600">Generating requests...</div>
                   )}
                   {queue.slice(0, 10).map((req, i) => (
                     <div 
                       key={req.id} 
                       className={`shrink-0 w-12 h-10 rounded-lg flex flex-col items-center justify-center border transition-all duration-300
                         ${req.topic === 'finance' ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' : 'bg-blue-500/20 border-blue-500/50 text-blue-300'}
                         ${i === 0 ? 'scale-110 border-white shadow-lg z-10 ring-2 ring-white/20' : 'opacity-60 scale-90'}
                       `}
                     >
                       {req.topic === 'finance' ? <FileText className="w-4 h-4" /> : <Code className="w-4 h-4" />}
                       <span className="text-[8px] font-mono opacity-50">#{req.id % 100}</span>
                     </div>
                   ))}
                   <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-900 via-slate-900/80 to-transparent pointer-events-none" />
                </div>
             </div>

             {/* 2. Load Balancer & Routing Animation */}
             <div className="relative z-10 w-full flex-1 flex flex-col items-center">
                
                {/* Router Node */}
                <div className="relative mb-16">
                   <div className={`p-4 rounded-full border shadow-2xl z-20 relative transition-all duration-300 ${isRunning ? 'bg-slate-800 border-cyan-500/50 shadow-cyan-500/20' : 'bg-slate-800 border-white/10'}`}>
                      <Network className={`w-8 h-8 ${isRunning ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`} />
                   </div>
                   
                   {/* Routing Path Lines (SVG) */}
                   <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[180px] -z-10 pointer-events-none overflow-visible">
                      {/* Left Path (Worker 0) */}
                      <path d="M 160 0 C 160 80, 0 80, 0 180" fill="none" 
                        stroke={activeRequest?.targetWorker === 0 ? (activeRequest.topic === 'finance' ? '#fbbf24' : '#60a5fa') : '#334155'} 
                        strokeWidth={activeRequest?.targetWorker === 0 ? 3 : 1} 
                        strokeDasharray="6" 
                        className={activeRequest?.targetWorker === 0 ? 'animate-[dash_0.5s_linear_infinite]' : ''} 
                        opacity={activeRequest?.targetWorker === 0 ? 1 : 0.3}
                      />
                      {/* Right Path (Worker 1) */}
                      <path d="M 160 0 C 160 80, 320 80, 320 180" fill="none" 
                        stroke={activeRequest?.targetWorker === 1 ? (activeRequest.topic === 'finance' ? '#fbbf24' : '#60a5fa') : '#334155'} 
                        strokeWidth={activeRequest?.targetWorker === 1 ? 3 : 1} 
                        strokeDasharray="6" 
                        className={activeRequest?.targetWorker === 1 ? 'animate-[dash_0.5s_linear_infinite]' : ''} 
                        opacity={activeRequest?.targetWorker === 1 ? 1 : 0.3}
                      />
                   </svg>
                </div>

                {/* Flying Packet Animation */}
                {activeRequest && (
                  <div 
                    key={activeRequest.id} 
                    className={`absolute z-30 flex items-center gap-2 px-3 py-1.5 rounded-lg border shadow-xl animate-[flyDown_0.8s_cubic-bezier(0.4,0,0.2,1)_forwards]
                      ${activeRequest.topic === 'finance' ? 'bg-amber-500 text-amber-100 border-amber-400' : 'bg-blue-500 text-blue-100 border-blue-400'}
                    `}
                    style={{
                      top: '120px', 
                      left: '50%',
                      transform: 'translateX(-50%)',
                      ['--target-x' as any]: activeRequest.targetWorker === 0 ? '-160px' : '160px',
                      ['--target-y' as any]: '200px'
                    }}
                  >
                    {activeRequest.topic === 'finance' ? <FileText className="w-3 h-3" /> : <Code className="w-3 h-3" />}
                    <span className="text-[10px] font-bold uppercase">{activeRequest.topic}</span>
                  </div>
                )}

                {/* 3. Workers */}
                <div className="w-full flex justify-between px-10 items-end mt-auto pb-6">
                   {workers.map((worker, idx) => (
                     <div key={worker.id} className="flex flex-col items-center gap-3 w-48">
                        {/* Status Bubble */}
                        <div className={`h-8 px-3 rounded-full text-[10px] font-bold flex items-center justify-center min-w-[120px] transition-all duration-300
                          ${worker.statusMessage.includes('HIT') ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 
                            worker.statusMessage.includes('MISS') ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 animate-pulse' : 
                            'bg-slate-800 text-slate-500'}
                        `}>
                          {worker.statusMessage}
                        </div>

                        {/* Worker Box */}
                        <div className={`relative w-full p-4 rounded-2xl border transition-all duration-300 flex flex-col gap-3 group
                          ${worker.isBusy ? 'bg-slate-900' : 'bg-slate-900/50'}
                          ${worker.statusMessage.includes('HIT') ? 'border-emerald-500 ring-1 ring-emerald-500/50' : 
                            worker.statusMessage.includes('MISS') ? 'border-rose-500 ring-1 ring-rose-500/50' : 'border-slate-700'}
                        `}>
                           <div className="flex items-center justify-between border-b border-white/5 pb-2">
                              <div className="flex items-center gap-2">
                                 <Server className={`w-4 h-4 ${worker.isBusy ? 'text-white' : 'text-slate-600'}`} />
                                 <span className="text-xs font-bold text-slate-300">Worker {idx + 1}</span>
                              </div>
                              <span className="text-[9px] font-mono text-slate-500">GPU:{idx}</span>
                           </div>

                           {/* Cache Slot */}
                           <div className="space-y-1">
                             <div className="text-[9px] text-slate-500 uppercase font-bold">KV Cache (VRAM)</div>
                             <div className={`relative h-12 rounded-lg border flex items-center justify-center gap-2 transition-all overflow-hidden
                               ${worker.currentCache === 'finance' ? 'bg-amber-500/10 border-amber-500/30' : 
                                 worker.currentCache === 'coding' ? 'bg-blue-500/10 border-blue-500/30' : 
                                 'bg-black/20 border-white/5'}
                             `}>
                                {worker.currentCache ? (
                                  <>
                                    {worker.currentCache === 'finance' ? <FileText className="w-4 h-4 text-amber-400" /> : <Code className="w-4 h-4 text-blue-400" />}
                                    <span className={`text-[10px] font-bold uppercase ${worker.currentCache === 'finance' ? 'text-amber-400' : 'text-blue-400'}`}>
                                      {worker.currentCache}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-[10px] text-slate-600">Empty</span>
                                )}
                                
                                {/* Eviction Overlay */}
                                {worker.statusMessage.includes('MISS') && (
                                  <div className="absolute inset-0 bg-rose-500/90 flex flex-col items-center justify-center text-white animate-in fade-in duration-200">
                                     <Trash2 className="w-4 h-4 mb-1" />
                                     <span className="text-[9px] font-bold">EVICTING...</span>
                                  </div>
                                )}
                             </div>
                           </div>

                           {/* Stats */}
                           <div className="flex justify-between text-[9px] font-bold text-slate-500 pt-1">
                              <span className="text-emerald-400">Hits: {worker.cacheHits}</span>
                              <span className="text-rose-400">Misses: {worker.cacheMisses}</span>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             {/* Style for flying packet */}
             <style>{`
               @keyframes flyDown {
                 0% { top: 120px; transform: translateX(-50%) scale(0.5); opacity: 0; }
                 20% { opacity: 1; transform: translateX(-50%) scale(1); }
                 100% { top: 320px; transform: translateX(var(--target-x)) scale(0.8); opacity: 0; }
               }
             `}</style>

          </div>
        </div>

        {/* Right: Metrics & Analysis */}
        <div className="lg:col-span-4 space-y-6">
           
           {/* Control Card */}
           <div className="p-6 bg-slate-900 rounded-3xl border border-white/10 flex flex-col items-center text-center space-y-4 shadow-xl">
              <div className="space-y-1">
                 <h4 className="text-sm font-bold text-white">压力测试控制台</h4>
                 <p className="text-[10px] text-slate-400">模拟高并发下的随机混合负载</p>
              </div>
              <button 
                onClick={toggleSimulation}
                className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg
                  ${isRunning ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}
                `}
              >
                {isRunning ? '暂停仿真' : '开始/继续仿真'} <FastForward className="w-3 h-3 fill-current" />
              </button>
              <button onClick={reset} className="text-[10px] text-slate-500 hover:text-white flex items-center gap-1 transition-colors">
                 <RefreshCw className="w-3 h-3" /> 重置统计
              </button>
           </div>

           {/* Hit Rate Dashboard */}
           <div className="p-6 bg-slate-900 rounded-3xl border border-white/10 space-y-6">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                 <BarChart3 className="w-4 h-4 text-cyan-400" /> 缓存命中率 (Hit Rate)
              </h4>
              
              <div className="flex items-end gap-2">
                 <span className={`text-5xl font-mono font-bold tracking-tighter ${Number(hitRate) > 80 ? 'text-emerald-400' : Number(hitRate) < 40 ? 'text-rose-400' : 'text-amber-400'}`}>
                   {hitRate}%
                 </span>
                 <span className="text-xs text-slate-500 mb-2 font-bold uppercase">AVG</span>
              </div>

              <div className="space-y-3">
                 <div className="flex justify-between text-[10px] text-slate-400 uppercase font-bold">
                    <span>Performance</span>
                    <span>{Number(hitRate) > 80 ? 'Excellent' : Number(hitRate) < 40 ? 'Thrashing (颠簸)' : 'Unstable'}</span>
                 </div>
                 <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${Number(hitRate) > 80 ? 'bg-emerald-500' : Number(hitRate) < 40 ? 'bg-rose-500' : 'bg-amber-500'}`} 
                      style={{ width: `${hitRate}%` }} 
                    />
                 </div>
              </div>
           </div>

           {/* Comparison Info */}
           <div className={`p-5 rounded-2xl border space-y-4 transition-colors duration-500
             ${strategy === 'round-robin' ? 'bg-rose-500/5 border-rose-500/20' : 'bg-emerald-500/5 border-emerald-500/20'}
           `}>
              <h5 className={`font-bold text-xs uppercase flex items-center gap-2 ${strategy === 'round-robin' ? 'text-rose-400' : 'text-emerald-400'}`}>
                {strategy === 'round-robin' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                {strategy === 'round-robin' ? '问题：随机性下的失效' : '方案：亲和性调度'}
              </h5>
              <div className="text-[11px] text-slate-400 leading-relaxed space-y-2">
                <p>
                {strategy === 'round-robin' 
                  ? '当请求类型随机分布时（如 A, A, B, A, B），轮询只是机械地分发任务。'
                  : '语义路由通过识别请求特征，将其“钉”在特定的 Worker 上。'
                }
                </p>
                <p className={`font-bold ${strategy === 'round-robin' ? 'text-rose-300' : 'text-emerald-300'}`}>
                  {strategy === 'round-robin'
                    ? '后果：Worker 1 虽然存了金融 KV，但轮询可能非要把代码请求塞给它，导致它被迫清空缓存重新加载，造成严重的显存带宽浪费。'
                    : '效果：Worker 1 专心处理金融，Worker 2 专心处理代码。无论队列多随机，Worker 内部永远是 Cache Hit。'
                  }
                </p>
              </div>
           </div>

           {strategy === 'round-robin' && totalHits < totalRequests * 0.4 && totalRequests > 5 && (
             <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2 animate-in fade-in">
               <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
               <p className="text-[10px] text-amber-200">
                 检测到明显的 <b>Cache Thrashing</b> 现象。显存正在频繁地进行“驱逐-重载”循环。
               </p>
             </div>
           )}

        </div>
      </div>
    </div>
  );
};

export default CacheRoutingSim;
