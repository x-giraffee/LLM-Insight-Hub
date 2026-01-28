import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, Zap, Database, ArrowRight, Activity, 
  BarChart3, Layers, Settings, Rocket, 
  Microchip, Gauge, ArrowDown, Box
} from 'lucide-react';

type Mode = 'standard' | 'triton';

const MoEKernelSim: React.FC = () => {
  const [mode, setMode] = useState<Mode>('standard');
  const [isSimulating, setIsSimulating] = useState(false);
  
  // Simulation Metrics
  const [metrics, setMetrics] = useState({
    computeUtil: 0,  // Tensor Core Utilization
    memoryBandwidth: 0, // VRAM Bandwidth
    smemUsage: 0,    // Shared Memory Usage
    throughput: 0    // Tokens/s
  });

  // Animation States
  const [dataFlow, setDataFlow] = useState<number[]>([]); // Array of positions 0-100
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    // Reset simulation when mode changes
    setIsSimulating(false);
    setMetrics({ computeUtil: 0, memoryBandwidth: 0, smemUsage: 0, throughput: 0 });
    setDataFlow([]);
  }, [mode]);

  const toggleSimulation = () => {
    setIsSimulating(!isSimulating);
  };

  useEffect(() => {
    if (!isSimulating) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    let lastTime = performance.now();
    
    const animate = (time: number) => {
      const delta = time - lastTime;
      
      // Update Metrics based on mode
      if (mode === 'standard') {
        // DeepGemm / Unoptimized: 
        // High VRAM dependency, Low Compute Util (Stalls)
        setMetrics({
          computeUtil: 35 + Math.random() * 10,
          memoryBandwidth: 85 + Math.random() * 5, // Bottlenecked
          smemUsage: 20, // Low usage of fast memory
          throughput: 5.5 // From the image baseline
        });
      } else {
        // Triton Optimized:
        // Efficient SMEM pipelining, High Compute Util
        setMetrics({
          computeUtil: 92 + Math.random() * 5, // Saturated
          memoryBandwidth: 60 + Math.random() * 10, // Efficient reuse
          smemUsage: 85, // High usage (Prefetching)
          throughput: 40.7 // From the image optimized
        });
      }

      // Animate Data Flow
      if (delta > 50) { // Throttle updates
        setDataFlow(prev => {
          // Spawn new data packets
          const spawnRate = mode === 'triton' ? 0.8 : 0.3;
          const newPackets = Math.random() < spawnRate ? [0] : [];
          
          // Move existing packets
          // Standard: Slow movement due to memory stalls
          // Triton: Fast, continuous movement
          const speed = mode === 'triton' ? 2.5 : 0.8;
          
          return [...prev, ...newPackets]
            .map(p => p + speed)
            .filter(p => p < 100);
        });
        lastTime = time;
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isSimulating, mode]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-green-500/10 text-green-400 rounded-full text-[9px] font-bold border border-green-500/20 tracking-widest uppercase">
              NVIDIA Kernel Tuning
            </span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            MoE 算子极致优化 (Kernel Optimization)
          </h2>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex bg-slate-900 p-1 rounded-xl border border-white/5">
              <button 
                onClick={() => setMode('standard')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${mode === 'standard' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Layers className="w-3 h-3" /> 原始版本 (Standard)
              </button>
              <button 
                onClick={() => setMode('triton')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${mode === 'triton' ? 'bg-green-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Rocket className="w-3 h-3" /> 算子优化 (Triton)
              </button>
           </div>
           <button 
             onClick={toggleSimulation}
             className={`p-3 rounded-xl transition-all ${isSimulating ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}
           >
             <Activity className={`w-4 h-4 ${isSimulating ? 'animate-pulse' : ''}`} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: GPU Internal View */}
        <div className="lg:col-span-8 space-y-6">
          <div className="relative p-8 bg-slate-950 rounded-3xl border border-white/10 min-h-[500px] flex flex-col overflow-hidden">
             
             {/* Background Grid */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

             <div className="relative z-10 flex-1 flex flex-col gap-8">
                
                {/* 1. HBM (High Bandwidth Memory) Layer */}
                <div className="flex flex-col gap-2">
                   <div className="flex justify-between items-center text-xs font-bold text-slate-400 px-2">
                      <div className="flex items-center gap-2"><Database className="w-4 h-4" /> 显存 (HBM3e) - MoE Experts Weights</div>
                      <div className={`font-mono ${metrics.memoryBandwidth > 80 ? 'text-red-400 animate-pulse' : 'text-slate-600'}`}>
                        Bandwidth: {metrics.memoryBandwidth.toFixed(1)}%
                      </div>
                   </div>
                   <div className="h-16 bg-slate-900/80 border border-white/10 rounded-xl flex items-center justify-around px-4 relative overflow-hidden">
                      {/* Expert Blocks */}
                      {[1,2,3,4,5,6].map(i => (
                        <div key={i} className={`w-12 h-10 rounded border flex items-center justify-center text-[10px] font-bold transition-all duration-300
                          ${isSimulating 
                            ? (mode === 'standard' && i % 2 === 0 ? 'bg-red-900/20 border-red-500/50 text-red-400 animate-pulse' : 'bg-slate-800 border-slate-600 text-slate-500')
                            : 'bg-slate-800 border-slate-600 text-slate-500'
                          }
                          ${isSimulating && mode === 'triton' ? 'bg-green-900/20 border-green-500/30 text-green-400' : ''}
                        `}>
                          Exp_{i}
                        </div>
                      ))}
                      
                      {/* Data Particles Leaving HBM */}
                      {dataFlow.filter(p => p < 30).map((p, i) => (
                        <div key={i} 
                          className={`absolute w-2 h-2 rounded-full ${mode === 'triton' ? 'bg-green-400' : 'bg-amber-500'}`}
                          style={{ left: `${p * 3.3}%`, top: '50%', transform: 'translateY(-50%)' }}
                        />
                      ))}
                   </div>
                </div>

                {/* Arrow Down */}
                <div className="flex justify-center text-slate-600">
                   <ArrowDown className={`w-6 h-6 ${isSimulating ? 'animate-bounce' : ''}`} />
                </div>

                {/* 2. On-Chip Memory (L2 + SMEM) */}
                <div className="flex flex-col gap-2">
                   <div className="flex justify-between items-center text-xs font-bold text-slate-400 px-2">
                      <div className="flex items-center gap-2"><Box className="w-4 h-4" /> 片上共享内存 (SMEM / L1)</div>
                      <div className={`font-mono ${mode === 'triton' ? 'text-green-400' : 'text-slate-600'}`}>
                        Hit Rate: {mode === 'triton' ? 'High (Prefetch)' : 'Low'}
                      </div>
                   </div>
                   <div className={`h-24 bg-slate-900/80 border rounded-xl flex items-center justify-center gap-4 relative overflow-hidden transition-colors duration-500
                     ${mode === 'triton' ? 'border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'border-white/10'}
                   `}>
                      <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-20">
                         {Array.from({length: 20}).map((_, i) => <div key={i} className="w-1 h-full bg-slate-700" />)}
                      </div>
                      
                      {/* Pipeline Visualization */}
                      {mode === 'triton' && isSimulating ? (
                        <div className="flex gap-2 w-full px-4">
                           <div className="flex-1 h-12 bg-green-500/20 border border-green-500/50 rounded flex items-center justify-center text-[9px] text-green-300">
                             Stage 1: Load
                           </div>
                           <div className="flex-1 h-12 bg-green-500/20 border border-green-500/50 rounded flex items-center justify-center text-[9px] text-green-300">
                             Stage 2: Compute
                           </div>
                           <div className="flex-1 h-12 bg-green-500/20 border border-green-500/50 rounded flex items-center justify-center text-[9px] text-green-300">
                             Stage 3: Store
                           </div>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-500 font-mono">
                          {isSimulating ? 'Random Access Pattern (Inefficient)' : 'Software Managed Cache'}
                        </div>
                      )}

                      {/* Data Particles in SMEM */}
                      {dataFlow.filter(p => p >= 30 && p < 70).map((p, i) => (
                        <div key={i} 
                          className={`absolute w-3 h-3 rounded-sm ${mode === 'triton' ? 'bg-green-300 shadow-lg shadow-green-500' : 'bg-amber-500'}`}
                          style={{ left: `${(p - 30) * 2.5}%`, top: '50%', transform: 'translateY(-50%)' }}
                        />
                      ))}
                   </div>
                </div>

                {/* Arrow Down */}
                <div className="flex justify-center text-slate-600">
                   <ArrowDown className={`w-6 h-6 ${isSimulating ? 'animate-bounce' : ''}`} />
                </div>

                {/* 3. Compute Units (Tensor Cores) */}
                <div className="flex flex-col gap-2">
                   <div className="flex justify-between items-center text-xs font-bold text-slate-400 px-2">
                      <div className="flex items-center gap-2"><Microchip className="w-4 h-4" /> Tensor Cores (Math)</div>
                      <div className={`font-mono ${metrics.computeUtil > 90 ? 'text-green-400' : 'text-amber-400'}`}>
                        Util: {metrics.computeUtil.toFixed(1)}%
                      </div>
                   </div>
                   <div className="grid grid-cols-8 gap-2">
                      {Array.from({length: 16}).map((_, i) => (
                        <div key={i} className={`h-12 rounded border flex flex-col items-center justify-center transition-all duration-100
                          ${isSimulating 
                            ? (metrics.computeUtil > 80 && Math.random() > 0.2 ? 'bg-green-500 border-green-400 shadow-lg scale-105' : 'bg-slate-800 border-slate-700')
                            : 'bg-slate-800 border-slate-700'}
                        `}>
                           <div className={`w-1.5 h-1.5 rounded-full mb-1 ${isSimulating ? 'bg-white animate-ping' : 'bg-slate-600'}`} />
                        </div>
                      ))}
                   </div>
                </div>

             </div>
          </div>
        </div>

        {/* Right: Metrics & Comparison */}
        <div className="lg:col-span-4 space-y-6">
           
           {/* Performance Card (Replicating Image Data) */}
           <div className="p-6 bg-slate-900 rounded-3xl border border-white/10 space-y-6">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                 <BarChart3 className="w-4 h-4 text-emerald-400" /> 300 用户并发性能对比
              </h4>
              
              <div className="space-y-4">
                 {/* TTFT */}
                 <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400 uppercase font-bold">
                       <span>TTFT (首字延迟)</span>
                       <span className={mode === 'triton' ? 'text-green-400' : 'text-slate-200'}>
                         {mode === 'triton' ? '3.72s' : '11.12s'}
                       </span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                       <div className={`h-full transition-all duration-500 ${mode === 'triton' ? 'bg-green-500 w-[30%]' : 'bg-slate-500 w-[90%]'}`} />
                    </div>
                    {mode === 'triton' && <div className="text-[9px] text-green-500 font-bold text-right">2.0x Faster</div>}
                 </div>

                 {/* Decode Speed */}
                 <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400 uppercase font-bold">
                       <span>Decode Speed (Tokens/s)</span>
                       <span className={mode === 'triton' ? 'text-green-400' : 'text-slate-200'}>
                         {mode === 'triton' ? '40.71 t/s' : '5.5 t/s'}
                       </span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                       <div className={`h-full transition-all duration-500 ${mode === 'triton' ? 'bg-green-500 w-[90%]' : 'bg-slate-500 w-[15%]'}`} />
                    </div>
                    {mode === 'triton' && <div className="text-[9px] text-green-500 font-bold text-right">6.4x Faster</div>}
                 </div>

                 {/* E2E Latency */}
                 <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400 uppercase font-bold">
                       <span>E2E Latency</span>
                       <span className={mode === 'triton' ? 'text-green-400' : 'text-slate-200'}>
                         {mode === 'triton' ? '12.85s' : '37.29s'}
                       </span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                       <div className={`h-full transition-all duration-500 ${mode === 'triton' ? 'bg-green-500 w-[35%]' : 'bg-slate-500 w-[100%]'}`} />
                    </div>
                    {mode === 'triton' && <div className="text-[9px] text-green-500 font-bold text-right">1.9x Faster</div>}
                 </div>
              </div>
           </div>

           {/* Principles */}
           <div className={`p-5 rounded-2xl border transition-colors duration-500 space-y-3
             ${mode === 'triton' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-slate-900 border-white/5'}
           `}>
              <h5 className={`text-xs font-bold uppercase flex items-center gap-2 ${mode === 'triton' ? 'text-emerald-400' : 'text-slate-400'}`}>
                {mode === 'triton' ? <Zap className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
                {mode === 'triton' ? '核心技术：Triton 算子库' : '传统方案：DeepGemm'}
              </h5>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {mode === 'triton' 
                  ? '针对 H20/H800 等 N 卡架构，使用 Triton 重写 MoE 核心算子。通过 SMEM 异步预取和 Tensor Core 流水线优化，解决了专家切换导致的显存带宽瓶颈。'
                  : '使用通用的 GEMM 库。在处理 MoE 这种稀疏、跳跃的内存访问模式时，GPU 大部分时间在等待数据从 HBM 加载，导致计算单元闲置。'}
              </p>
           </div>

           {/* Support List */}
           <div className="p-5 bg-slate-900 rounded-2xl border border-white/5 space-y-3">
              <h5 className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
                 <Gauge className="w-4 h-4 text-blue-400" /> 支持优化的模型
              </h5>
              <div className="flex flex-wrap gap-2">
                 {['DeepSeek-V3', 'Qwen-2.5', 'GLM-4', 'Mixtral 8x7B'].map(m => (
                   <span key={m} className="px-2 py-1 rounded bg-blue-500/10 text-blue-300 text-[10px] font-bold border border-blue-500/20">
                     {m}
                   </span>
                 ))}
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default MoEKernelSim;