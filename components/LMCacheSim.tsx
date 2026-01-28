
import React, { useState, useEffect } from 'react';
import { 
  Server, Database, Cloud, Network, ArrowRight, 
  RefreshCw, Zap, HardDrive, Cpu, Share2, 
  Globe, LayoutGrid, ArrowUpFromLine, ArrowDownToLine,
  CheckCircle2, Clock
} from 'lucide-react';

type SystemMode = 'isolated' | 'shared';
type NodeState = 'idle' | 'computing' | 'uploading' | 'downloading';

const LMCacheSim: React.FC = () => {
  const [mode, setMode] = useState<SystemMode>('shared');
  const [cacheStatus, setCacheStatus] = useState<'empty' | 'stored'>('empty');
  
  // Node States
  const [nodeAState, setNodeAState] = useState<NodeState>('idle');
  const [nodeAProgress, setNodeAProgress] = useState(0);
  const [nodeBState, setNodeBState] = useState<NodeState>('idle');
  const [nodeBProgress, setNodeBProgress] = useState(0);
  
  const [logs, setLogs] = useState<string[]>([]);

  // Constants
  const PREFILL_TIME = 2000; // ms
  const TRANSFER_TIME = 600; // ms (LMCache is fast)

  const addLog = (msg: string) => setLogs(prev => [msg, ...prev].slice(0, 5));

  const runRequestA = () => {
    if (nodeAState !== 'idle') return;
    
    setNodeAState('computing');
    setNodeAProgress(0);
    addLog("Node A: 收到请求 (Context: 10k tokens)");

    // Simulate Compute
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setNodeAProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        
        if (mode === 'shared') {
          setNodeAState('uploading');
          addLog("Node A: 计算完成，正在推流 KV Cache 至 LMCache...");
          setTimeout(() => {
            setNodeAState('idle');
            setCacheStatus('stored');
            addLog("LMCache: KV Cache 已持久化 (Key: doc_fin_report)");
          }, TRANSFER_TIME);
        } else {
          setNodeAState('idle');
          addLog("Node A: 计算完成 (本地缓存)");
        }
      }
    }, PREFILL_TIME / 20);
  };

  const runRequestB = () => {
    if (nodeBState !== 'idle') return;

    if (mode === 'shared' && cacheStatus === 'stored') {
      // Fast Path
      setNodeBState('downloading');
      addLog("Node B: 收到相同请求，检测到 LMCache 命中！");
      
      setTimeout(() => {
        setNodeBState('idle');
        addLog("Node B: 🚀 KV Cache 拉取完成，跳过 Prefill，直接输出！");
      }, TRANSFER_TIME);
    } else {
      // Slow Path
      setNodeBState('computing');
      setNodeBProgress(0);
      addLog(mode === 'shared' ? "Node B: LMCache 未命中，开始重新计算..." : "Node B: 收到请求 (独立节点)，开始重新计算...");

      let p = 0;
      const interval = setInterval(() => {
        p += 5;
        setNodeBProgress(p);
        if (p >= 100) {
          clearInterval(interval);
          setNodeBState('idle');
          addLog("Node B: 计算完成");
        }
      }, PREFILL_TIME / 20);
    }
  };

  const reset = () => {
    setCacheStatus('empty');
    setNodeAState('idle');
    setNodeBState('idle');
    setNodeAProgress(0);
    setNodeBProgress(0);
    setLogs([]);
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
              Distributed Inference
            </span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            LMCache: 跨节点 KV 共享
          </h2>
        </div>
        
        <div className="flex bg-slate-900 p-1 rounded-xl border border-white/5">
          <button 
            onClick={() => setMode('isolated')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${mode === 'isolated' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Server className="w-3 h-3" /> 传统孤岛模式
          </button>
          <button 
            onClick={() => setMode('shared')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${mode === 'shared' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Share2 className="w-3 h-3" /> LMCache 共享模式
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Interactive Diagram */}
        <div className="lg:col-span-8 space-y-6">
          <div className="relative p-8 bg-slate-950 rounded-3xl border border-white/10 min-h-[500px] flex flex-col justify-between overflow-hidden">
             
             {/* Background Grid */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

             {/* Top: Nodes Layer */}
             <div className="relative z-10 flex justify-around items-start pt-4">
                {/* Node A */}
                <div className="flex flex-col items-center gap-4 w-40">
                   <div className={`relative w-24 h-32 bg-slate-900 border-2 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-300
                     ${nodeAState === 'computing' ? 'border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)]' : 'border-slate-700'}
                     ${nodeAState === 'uploading' ? 'border-indigo-400' : ''}
                   `}>
                      <Server className={`w-8 h-8 ${nodeAState === 'idle' ? 'text-slate-600' : 'text-white'}`} />
                      <span className="text-xs font-bold text-slate-300">Node A</span>
                      
                      {/* Internal Progress */}
                      {nodeAState === 'computing' && (
                        <div className="absolute bottom-2 left-2 right-2 h-1 bg-slate-800 rounded-full overflow-hidden">
                           <div className="h-full bg-cyan-400" style={{ width: `${nodeAProgress}%` }} />
                        </div>
                      )}
                      
                      {/* Upload Animation */}
                      {nodeAState === 'uploading' && (
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
                           <ArrowDownToLine className="w-4 h-4 text-indigo-400" />
                        </div>
                      )}
                   </div>
                   <button 
                     onClick={runRequestA}
                     disabled={nodeAState !== 'idle'}
                     className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-lg text-[10px] font-bold text-white border border-white/5 transition-all"
                   >
                     发送请求 (Prefill)
                   </button>
                </div>

                {/* Node B */}
                <div className="flex flex-col items-center gap-4 w-40">
                   <div className={`relative w-24 h-32 bg-slate-900 border-2 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-300
                     ${nodeBState === 'computing' ? 'border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)]' : 'border-slate-700'}
                     ${nodeBState === 'downloading' ? 'border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.3)]' : ''}
                   `}>
                      <Server className={`w-8 h-8 ${nodeBState === 'idle' ? 'text-slate-600' : 'text-white'}`} />
                      <span className="text-xs font-bold text-slate-300">Node B</span>

                      {/* Internal Progress */}
                      {nodeBState === 'computing' && (
                        <div className="absolute bottom-2 left-2 right-2 h-1 bg-slate-800 rounded-full overflow-hidden">
                           <div className="h-full bg-amber-400" style={{ width: `${nodeBProgress}%` }} />
                        </div>
                      )}

                      {/* Download Animation */}
                      {nodeBState === 'downloading' && (
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce reverse">
                           <ArrowUpFromLine className="w-4 h-4 text-emerald-400" />
                        </div>
                      )}
                   </div>
                   <button 
                     onClick={runRequestB}
                     disabled={nodeBState !== 'idle'}
                     className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-lg text-[10px] font-bold text-white border border-white/5 transition-all"
                   >
                     发送相同请求
                   </button>
                </div>
             </div>

             {/* Connection Lines */}
             <div className="absolute top-48 left-0 w-full h-24 flex justify-center items-center pointer-events-none">
                {mode === 'shared' && (
                  <>
                    {/* Line A to Storage */}
                    <svg className="absolute w-full h-full">
                       <path d="M 25% 0 C 25% 50, 50% 50, 50% 100" fill="none" stroke={nodeAState === 'uploading' ? '#818cf8' : '#334155'} strokeWidth="2" strokeDasharray="4" className={nodeAState === 'uploading' ? 'animate-[dash_1s_linear_infinite]' : ''} />
                       <path d="M 75% 0 C 75% 50, 50% 50, 50% 100" fill="none" stroke={nodeBState === 'downloading' ? '#34d399' : '#334155'} strokeWidth="2" strokeDasharray="4" className={nodeBState === 'downloading' ? 'animate-[dash_1s_linear_infinite_reverse]' : ''} />
                    </svg>
                  </>
                )}
             </div>

             {/* Bottom: LMCache Storage Layer */}
             <div className="relative z-10 mt-12 mx-auto w-full max-w-lg">
                <div className={`p-6 rounded-2xl border transition-all duration-500 flex flex-col items-center gap-4
                  ${mode === 'shared' ? 'bg-slate-900 border-indigo-500/30' : 'bg-slate-900/30 border-dashed border-slate-700 opacity-50'}
                `}>
                   <div className="flex items-center gap-3">
                      <Cloud className={`w-6 h-6 ${mode === 'shared' ? 'text-indigo-400' : 'text-slate-600'}`} />
                      <span className={`text-sm font-bold uppercase tracking-widest ${mode === 'shared' ? 'text-indigo-300' : 'text-slate-600'}`}>
                        LMCache Layer (Redis / Network)
                      </span>
                   </div>
                   
                   {/* Storage Slots */}
                   <div className="flex gap-3">
                      <div className={`w-32 h-12 rounded-lg border flex items-center justify-center gap-2 transition-all duration-500
                        ${cacheStatus === 'stored' ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' : 'bg-black/20 border-white/5 text-slate-600'}
                      `}>
                         <Database className="w-4 h-4" />
                         <span className="text-[10px] font-mono">{cacheStatus === 'stored' ? 'KV: doc_fin' : 'Empty'}</span>
                      </div>
                      <div className="w-12 h-12 rounded-lg border border-white/5 bg-black/20 flex items-center justify-center">
                         <div className="w-1 h-1 bg-slate-700 rounded-full mx-0.5" />
                         <div className="w-1 h-1 bg-slate-700 rounded-full mx-0.5" />
                         <div className="w-1 h-1 bg-slate-700 rounded-full mx-0.5" />
                      </div>
                   </div>

                   {mode === 'shared' && cacheStatus === 'stored' && (
                     <div className="absolute -right-4 top-1/2 -translate-y-1/2 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg animate-in slide-in-from-left-2">
                        <span className="text-[9px] font-bold text-emerald-400">Ready to Share</span>
                     </div>
                   )}
                </div>
             </div>

          </div>
        </div>

        {/* Right: Info & Logs */}
        <div className="lg:col-span-4 space-y-6">
           
           {/* Hierarchy Card */}
           <div className="p-6 bg-slate-900 rounded-3xl border border-white/10 space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                 <LayoutGrid className="w-4 h-4 text-cyan-400" /> 存储层级 (Hierarchy)
              </h4>
              <div className="space-y-2">
                 <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3">
                       <Cpu className="w-4 h-4 text-rose-400" />
                       <span className="text-xs text-slate-300">L1: GPU VRAM</span>
                    </div>
                    <span className="text-[9px] text-rose-400 font-bold">最快 (本地)</span>
                 </div>
                 <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3">
                       <HardDrive className="w-4 h-4 text-amber-400" />
                       <span className="text-xs text-slate-300">L2: CPU RAM</span>
                    </div>
                    <span className="text-[9px] text-amber-400 font-bold">较快 (本地)</span>
                 </div>
                 <div className="flex items-center justify-between p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/30 ring-1 ring-indigo-500/20">
                    <div className="flex items-center gap-3">
                       <Network className="w-4 h-4 text-indigo-400" />
                       <span className="text-xs text-indigo-200">L3: LMCache (Network)</span>
                    </div>
                    <span className="text-[9px] text-indigo-400 font-bold">共享 (分布式)</span>
                 </div>
              </div>
           </div>

           {/* Logs */}
           <div className="h-64 bg-slate-950 rounded-3xl border border-white/10 p-5 flex flex-col">
              <div className="text-[10px] font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                 <RefreshCw className="w-3 h-3" /> System Events
              </div>
              <div className="flex-1 overflow-y-auto space-y-2 font-mono text-[10px]">
                 {logs.length === 0 && <span className="text-slate-700 italic">等待操作...</span>}
                 {logs.map((log, i) => (
                    <div key={i} className="animate-in slide-in-from-left-2 text-slate-300 border-l-2 border-slate-800 pl-2 py-1">
                       {log}
                    </div>
                 ))}
              </div>
           </div>

           {/* Benefits */}
           <div className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl border border-cyan-500/20">
              <h5 className="text-[10px] font-bold text-cyan-400 uppercase mb-2">为什么需要 LMCache？</h5>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                 当集群负载均衡调度时，用户的请求可能漂移到不同 GPU。如果没有 LMCache，新节点必须重新计算前缀（Prefill），造成巨大的算力浪费和延迟抖动。
              </p>
           </div>

        </div>
      </div>
    </div>
  );
};

export default LMCacheSim;
