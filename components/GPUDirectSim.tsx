
import React, { useState, useEffect } from 'react';
import { 
  Cpu, HardDrive, Server, ArrowUp, ArrowDown, 
  ArrowRight, ArrowLeft, Zap, Activity, Grid, 
  Share2, AlertCircle, CheckCircle2, XCircle
} from 'lucide-react';

const GPUDirectSim: React.FC = () => {
  const [p2pEnabled, setP2pEnabled] = useState(false);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [metrics, setMetrics] = useState({ bandwidth: 0, latency: 0, cpuLoad: 0 });

  // Animation Loop
  useEffect(() => {
    let interval: number;
    if (isTransmitting) {
      interval = window.setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsTransmitting(false);
            return 0;
          }
          // P2P is faster
          const speed = p2pEnabled ? 4 : 1.5; 
          return prev + speed;
        });
      }, 30);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [isTransmitting, p2pEnabled]);

  // Metrics Simulation
  useEffect(() => {
    if (isTransmitting) {
      if (p2pEnabled) {
        setMetrics({ bandwidth: 26.5, latency: 1.2, cpuLoad: 2 });
      } else {
        setMetrics({ bandwidth: 12.8, latency: 45.0, cpuLoad: 85 });
      }
    } else {
      setMetrics({ bandwidth: 0, latency: 0, cpuLoad: p2pEnabled ? 1 : 5 });
    }
  }, [isTransmitting, p2pEnabled]);

  const toggleTransmission = () => {
    if (!isTransmitting) {
      setIsTransmitting(true);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-green-500/10 text-green-400 rounded-full text-[9px] font-bold border border-green-500/20 tracking-widest uppercase">
              NVIDIA GPUDirect
            </span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            P2P (Peer-to-Peer) 通信原理
          </h2>
        </div>
        <div className="flex gap-4">
           <div className="text-right">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Status</div>
              <div className={`text-xl font-mono font-bold ${p2pEnabled ? 'text-green-400' : 'text-slate-400'}`}>
                {p2pEnabled ? 'P2P ENABLED' : 'TRADITIONAL'}
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Interactive Visualization */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-8 bg-slate-950 rounded-3xl border border-white/10 relative overflow-hidden min-h-[500px] flex flex-col justify-between">
            
            {/* Legend / Control */}
            <div className="flex justify-between items-center z-10 mb-8">
               <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setP2pEnabled(!p2pEnabled)}
                    disabled={isTransmitting}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2
                      ${p2pEnabled 
                        ? 'bg-green-600/20 border-green-500 text-green-400' 
                        : 'bg-slate-800 border-white/10 text-slate-400 hover:bg-slate-700'}`}
                  >
                    <Share2 className="w-4 h-4" />
                    {p2pEnabled ? 'P2P 模式 (Direct)' : '传统模式 (Bounce)'}
                  </button>
                  <button 
                    onClick={toggleTransmission}
                    disabled={isTransmitting}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                  >
                    <Zap className="w-4 h-4 fill-current" /> 发送数据 (GPU0 → GPU1)
                  </button>
               </div>
            </div>

            {/* Architecture Diagram */}
            <div className="relative flex-1 flex flex-col items-center justify-center">
               
               {/* Top: CPU & RAM */}
               <div className={`relative flex gap-6 p-4 rounded-2xl border transition-all duration-500 mb-12
                 ${!p2pEnabled && isTransmitting ? 'bg-red-500/10 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]' : 'bg-slate-900 border-slate-700'}`}>
                  <div className="flex flex-col items-center gap-2">
                     <Cpu className={`w-8 h-8 ${!p2pEnabled && isTransmitting ? 'text-red-400 animate-pulse' : 'text-slate-500'}`} />
                     <span className="text-[10px] font-bold text-slate-400">CPU</span>
                  </div>
                  <div className="w-px h-12 bg-slate-700" />
                  <div className="flex flex-col items-center gap-2">
                     <HardDrive className={`w-8 h-8 ${!p2pEnabled && isTransmitting ? 'text-red-400 animate-pulse' : 'text-slate-500'}`} />
                     <span className="text-[10px] font-bold text-slate-400">System RAM</span>
                  </div>
                  
                  {/* Data Bounce Animation (Traditional) */}
                  {!p2pEnabled && isTransmitting && (
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-red-500 text-white text-[9px] font-bold rounded-full animate-bounce">
                      CPU BUFFER COPY
                    </div>
                  )}
               </div>

               {/* Middle: PCIe Switch */}
               <div className="relative w-64 h-12 bg-slate-800 rounded-lg border border-slate-600 flex items-center justify-center z-10">
                  <span className="text-[10px] font-mono text-slate-400">PCIe Switch / NVLink Fabric</span>
                  {/* Vertical Connection to CPU */}
                  <div className={`absolute -top-12 left-1/2 -translate-x-1/2 w-1 h-12 transition-colors duration-300 
                    ${!p2pEnabled && isTransmitting ? 'bg-red-500/50' : 'bg-slate-700'}`} 
                  />
               </div>

               {/* Bottom: GPUs */}
               <div className="flex gap-20 mt-12 relative">
                  {/* GPU 0 */}
                  <div className="flex flex-col items-center gap-2 relative">
                     <div className={`w-24 h-32 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all duration-300
                       ${isTransmitting && progress < 50 ? 'bg-green-500/20 border-green-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>
                        <Server className="w-8 h-8" />
                        <span className="text-xs font-bold">GPU 0</span>
                        <span className="text-[9px] font-mono opacity-50">Sender</span>
                     </div>
                     {/* Link to Switch */}
                     <div className={`absolute -top-12 left-1/2 -translate-x-1/2 w-1 h-12 transition-colors duration-300
                       ${isTransmitting ? 'bg-green-500' : 'bg-slate-700'}`} 
                     />
                  </div>

                  {/* P2P Direct Path (Horizontal) - Only visible conceptually, data goes via switch */}
                  {p2pEnabled && isTransmitting && (
                    <div className="absolute top-[-24px] left-1/2 -translate-x-1/2 w-40 h-1 bg-green-500 animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.8)]">
                       <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] text-green-400 font-bold whitespace-nowrap">
                         DMA DIRECT COPY
                       </div>
                    </div>
                  )}

                  {/* GPU 1 */}
                  <div className="flex flex-col items-center gap-2 relative">
                     <div className={`w-24 h-32 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all duration-300
                       ${isTransmitting && progress > 50 ? 'bg-green-500/20 border-green-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>
                        <Server className="w-8 h-8" />
                        <span className="text-xs font-bold">GPU 1</span>
                        <span className="text-[9px] font-mono opacity-50">Receiver</span>
                     </div>
                     {/* Link to Switch */}
                     <div className={`absolute -top-12 left-1/2 -translate-x-1/2 w-1 h-12 transition-colors duration-300
                       ${isTransmitting ? 'bg-green-500' : 'bg-slate-700'}`} 
                     />
                  </div>
               </div>

               {/* Data Particle Animation */}
               {isTransmitting && (
                 <div 
                   className={`absolute w-4 h-4 rounded-full shadow-lg z-20 transition-all duration-75
                     ${p2pEnabled ? 'bg-green-400 shadow-green-500/50' : 'bg-red-400 shadow-red-500/50'}`}
                   style={{
                     left: !p2pEnabled 
                       ? (progress < 50 ? 'calc(30% + 20px)' : 'calc(70% - 20px)') // Bounce X
                       : (progress < 50 ? '30%' : '70%'), // Direct X (Simulated)
                     top: !p2pEnabled
                       ? (progress < 50 ? `${50 - progress}%` : `${progress}%`) // Go Up then Down
                       : (progress < 50 ? `60%` : `60%`), // Stay low (at switch level) - Simplified visual
                     transform: 'translate(-50%, -50%)',
                     transition: p2pEnabled ? 'left 0.5s linear' : 'all 0.5s ease-in-out' // Different movement feel
                   }}
                 />
               )}

            </div>
          </div>
        </div>

        {/* Right: Metrics & Topology Matrix */}
        <div className="lg:col-span-5 space-y-6">
           
           {/* Real-time Metrics */}
           <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900 rounded-2xl border border-white/10">
                 <div className="text-[10px] text-slate-500 uppercase font-bold mb-1 flex items-center gap-2">
                   <Activity className="w-3 h-3" /> Bandwidth
                 </div>
                 <div className={`text-2xl font-mono font-bold ${isTransmitting ? (p2pEnabled ? 'text-green-400' : 'text-amber-400') : 'text-slate-600'}`}>
                    {metrics.bandwidth.toFixed(1)} <span className="text-xs text-slate-500">GB/s</span>
                 </div>
                 <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${(metrics.bandwidth / 30) * 100}%` }} />
                 </div>
              </div>
              <div className="p-4 bg-slate-900 rounded-2xl border border-white/10">
                 <div className="text-[10px] text-slate-500 uppercase font-bold mb-1 flex items-center gap-2">
                   <Cpu className="w-3 h-3" /> CPU Overhead
                 </div>
                 <div className={`text-2xl font-mono font-bold ${isTransmitting ? (p2pEnabled ? 'text-green-400' : 'text-red-400') : 'text-slate-600'}`}>
                    {metrics.cpuLoad.toFixed(0)} <span className="text-xs text-slate-500">%</span>
                 </div>
                 <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                    <div className={`h-full transition-all duration-300 ${p2pEnabled ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${metrics.cpuLoad}%` }} />
                 </div>
              </div>
           </div>

           {/* Topology Matrix Teaching */}
           <div className="p-6 bg-slate-900 rounded-3xl border border-white/10 space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                 <Grid className="w-4 h-4 text-indigo-400" /> 拓扑检测 (nvidia-smi topo -m)
              </h4>
              
              <div className="overflow-hidden rounded-xl border border-white/10">
                 <table className="w-full text-[10px] font-mono text-center">
                    <thead className="bg-slate-800 text-slate-400">
                       <tr>
                          <th className="p-2"></th>
                          <th className="p-2">GPU0</th>
                          <th className="p-2">GPU1</th>
                          <th className="p-2">GPU2</th>
                       </tr>
                    </thead>
                    <tbody className="bg-black/20 text-slate-300">
                       <tr className="border-t border-white/5">
                          <td className="p-2 bg-slate-800/50 font-bold">GPU0</td>
                          <td className="p-2 text-slate-600">X</td>
                          <td className={`p-2 font-bold transition-colors duration-500 ${p2pEnabled ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                             {p2pEnabled ? 'PIX' : 'SYS'}
                          </td>
                          <td className="p-2 text-slate-500">PHB</td>
                       </tr>
                       <tr className="border-t border-white/5">
                          <td className="p-2 bg-slate-800/50 font-bold">GPU1</td>
                          <td className={`p-2 font-bold transition-colors duration-500 ${p2pEnabled ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                             {p2pEnabled ? 'PIX' : 'SYS'}
                          </td>
                          <td className="p-2 text-slate-600">X</td>
                          <td className="p-2 text-slate-500">PHB</td>
                       </tr>
                    </tbody>
                 </table>
              </div>

              <div className="space-y-2 pt-2">
                 <div className={`p-2 rounded-lg text-[10px] flex items-center gap-2 transition-all ${p2pEnabled ? 'bg-green-500/10 text-green-400' : 'opacity-50 text-slate-500'}`}>
                    <CheckCircle2 className="w-3 h-3" />
                    <span><b>PIX / NVL</b>: 同一 Switch 下或 NVLink 直连。支持 P2P，速度极快。</span>
                 </div>
                 <div className={`p-2 rounded-lg text-[10px] flex items-center gap-2 transition-all ${!p2pEnabled ? 'bg-red-500/10 text-red-400' : 'opacity-50 text-slate-500'}`}>
                    <XCircle className="w-3 h-3" />
                    <span><b>SYS</b>: 跨 NUMA 节点，需经过 CPU 总线 (QPI/UPI)。P2P 通常被禁用，性能差。</span>
                 </div>
              </div>
           </div>

           {/* Deep Insight */}
           <div className="p-5 bg-indigo-500/5 rounded-2xl border border-indigo-500/20">
              <h5 className="text-[10px] font-bold text-indigo-400 uppercase mb-2">为什么 TP 推理必开 P2P？</h5>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                 在张量并行 (Tensor Parallelism) 中，每一层计算结束后，所有 GPU 必须交换中间结果 (All-Reduce)。
                 如果走 CPU 内存 (SYS)，通信延迟会高达微秒级，导致推理速度下降 3-5 倍，甚至卡顿。
              </p>
           </div>

        </div>
      </div>
    </div>
  );
};

export default GPUDirectSim;
