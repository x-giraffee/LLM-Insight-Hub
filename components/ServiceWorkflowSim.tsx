
import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, 
  RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend 
} from 'recharts';
import { 
  Search, Workflow, Database, Cpu, HardDrive, Zap, 
  Play, ShieldCheck, ChevronRight, Info, AlertTriangle, 
  Layers, Settings, Repeat,
  Activity,
  Maximize
} from 'lucide-react';

type ServiceMode = 'inference' | 'rag' | 'agent' | 'batch' | 'finetune';

interface ResourceData {
  weights: number;
  cache: number;
  optimizer: number;
  compute: number;
  latency: number;
  throughput: number;
}

const ServiceWorkflowSim: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<ServiceMode>('inference');
  const [modelSize, setModelSize] = useState<number>(7); // 7B, 14B, 70B
  const [concurrency, setConcurrency] = useState<number>(1);
  const [contextLength, setContextLength] = useState<number>(8); // In K tokens, default 8k

  const MODES: Record<ServiceMode, { name: string; icon: any; desc: string; color: string }> = {
    inference: { 
      name: '基础推理', 
      icon: <Zap className="w-4 h-4" />, 
      desc: '单次问答模式，侧重极速响应。',
      color: 'blue'
    },
    rag: { 
      name: 'RAG 应用', 
      icon: <Search className="w-4 h-4" />, 
      desc: '外挂知识库检索，上下文极长，对显存压力大。',
      color: 'emerald'
    },
    agent: { 
      name: '智能体 Agent', 
      icon: <Workflow className="w-4 h-4" />, 
      desc: '多步思考循环，调用工具，算力消耗呈倍数增长。',
      color: 'purple'
    },
    batch: { 
      name: '离线跑批', 
      icon: <Repeat className="w-4 h-4" />, 
      desc: '追求最大化利用算力，通过高并发降低单次处理成本。',
      color: 'amber'
    },
    finetune: { 
      name: '微调训练', 
      icon: <Settings className="w-4 h-4" />, 
      desc: '更新模型权重，需存储梯度与优化器状态，资源消耗之王。',
      color: 'rose'
    },
  };

  const calculateResources = useMemo(() => {
    // 权重计算 (FP16: 1B params = 2GB)
    const baseWeights = modelSize * 2;
    let weights = baseWeights;
    
    /**
     * KV Cache 计算逻辑仿真:
     * 经验公式: 1B 参数模型在 1k 上下文下的 KV Cache 约为 0.1 - 0.2GB (取决于层数/Head数)
     * 这里设定基准: 7B 模型在 8k 上下文下，单个并发约占 0.5GB KV Cache
     */
    let cache = (modelSize / 7) * (contextLength / 8) * 0.5 * concurrency;
    
    let optimizer = 0;
    let compute = concurrency * (modelSize / 7) * (contextLength / 8);
    let latency = 1 * (contextLength / 8);
    let throughput = 100 / ((modelSize / 7) * (contextLength / 8));

    switch (selectedMode) {
      case 'rag':
        // RAG 通常意味着较长的检索上下文
        compute *= 1.2; 
        latency *= 1.5;
        break;
      case 'agent':
        // Agent 需要多次推理循环
        compute *= 8; 
        latency *= 5;
        throughput *= 0.2;
        break;
      case 'batch':
        // 批处理优化
        throughput *= 2;
        break;
      case 'finetune':
        // 训练状态: 显存需额外存储梯度和优化器状态 (通常是权重的 2.5-4 倍)
        optimizer = baseWeights * 2.5; 
        compute *= 100;
        latency *= 50;
        throughput *= 0.01;
        break;
    }

    return { weights, cache, optimizer, compute, latency, throughput };
  }, [selectedMode, modelSize, concurrency, contextLength]);

  const vramData = [
    { name: '显存构成 (GB)', 权重: calculateResources.weights, 缓存: calculateResources.cache, 梯度与优化器: calculateResources.optimizer }
  ];

  const characteristicData = [
    { subject: '算力需求', A: Math.min(10, calculateResources.compute / 5) },
    { subject: '实时性', A: Math.max(0.5, 10 / calculateResources.latency) },
    { subject: '存储密度', A: Math.min(10, calculateResources.weights / 20) },
    { subject: '任务复杂性', A: selectedMode === 'agent' ? 10 : (selectedMode === 'finetune' ? 8 : 3) },
    { subject: '吞吐潜力', A: Math.min(10, calculateResources.throughput / 10) },
  ];

  const getHardwareRec = () => {
    const totalVram = calculateResources.weights + calculateResources.cache + calculateResources.optimizer;
    if (selectedMode === 'finetune' || totalVram > 500) return 'H100/H800/B200 超算集群';
    if (totalVram > 80) return 'H100 (80GB) x 8 节点';
    if (totalVram > 40) return 'A6000/L40S (48GB)';
    if (totalVram > 20) return 'RTX 3090/4090 (24GB)';
    return 'RTX 4060 Ti (16GB) 或 T4';
  };

  const renderWorkflow = () => {
    const steps = {
      inference: ['用户提问', 'Prompt 解析', 'LLM 推理', '生成回复'],
      rag: ['用户提问', '知识库检索 (Vector Search)', '上下文注入', 'LLM 推理', '结果生成'],
      agent: ['目标规划', '工具调研 (Tools)', '思维循环 (ReAct)', '子任务执行', '最终汇总'],
      batch: ['海量数据源', '任务调度', '满载并发处理', '结果异步存储'],
      finetune: ['标注数据集', '前向传播 (Forward)', '误差计算', '反向传播 (Backward)', '权重更新']
    };

    return (
      <div className="flex flex-wrap items-center justify-center gap-2 py-4">
        {steps[selectedMode].map((step, i) => (
          <React.Fragment key={i}>
            <div className={`px-3 py-2 rounded-lg border text-[10px] font-bold uppercase transition-all duration-500
              ${selectedMode === 'finetune' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'}`}>
              {step}
            </div>
            {i < steps[selectedMode].length - 1 && <ChevronRight className="w-3 h-3 text-slate-700" />}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* 控制面板 */}
        <div className="w-full lg:w-80 space-y-6">
          <div className="p-5 bg-slate-900/50 rounded-2xl border border-white/10 space-y-6">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Settings className="w-4 h-4" /> 仿真参数控制
            </h4>
            
            <div className="space-y-3">
              <label className="text-[10px] text-slate-500 uppercase font-bold">选择业务模式</label>
              <div className="grid grid-cols-1 gap-2">
                {(Object.keys(MODES) as ServiceMode[]).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setSelectedMode(mode)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all
                      ${selectedMode === mode 
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400 shadow-lg' 
                        : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/20'}`}
                  >
                    <div className={`${selectedMode === mode ? 'text-indigo-400' : 'text-slate-600'}`}>
                      {MODES[mode].icon}
                    </div>
                    <span className="text-xs font-bold">{MODES[mode].name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-2 border-t border-white/5">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-slate-500 uppercase">模型参数量</span>
                  <span className="text-indigo-400">{modelSize}B</span>
                </div>
                <input 
                  type="range" min="1" max="1024" step="1" value={modelSize}
                  onChange={(e) => setModelSize(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none accent-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-slate-500 uppercase flex items-center gap-1">
                    <Maximize className="w-3 h-3" /> 上下文长度
                  </span>
                  <span className="text-indigo-400">{contextLength}k</span>
                </div>
                <input 
                  type="range" min="1" max="1024" step="1" value={contextLength}
                  onChange={(e) => setContextLength(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none accent-indigo-500"
                />
                <div className="flex justify-between text-[8px] text-slate-600 font-mono">
                  <span>8k</span>
                  <span>128k</span>
                  <span>1M</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-slate-500 uppercase">并发用户/任务数</span>
                  <span className="text-indigo-400">{concurrency}</span>
                </div>
                <input 
                  type="range" min="1" max="100" step="1" value={concurrency}
                  onChange={(e) => setConcurrency(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none accent-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="p-5 bg-indigo-500/5 rounded-2xl border border-indigo-500/20 space-y-3">
             <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase">
               <Cpu className="w-4 h-4" /> 硬件推荐建议
             </div>
             <div className="p-3 bg-black/40 rounded-xl text-xs font-mono text-center text-white border border-white/5">
               {getHardwareRec()}
             </div>
             <p className="text-[10px] text-slate-500 leading-relaxed italic">
                * 估算基于 FP16 精度，量化后需求可减半。训练资源消耗受 Batch Size 影响波动较大。
             </p>
          </div>
        </div>

        {/* 仿真分析视图 */}
        <div className="flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 显存构成对比 */}
            <div className="p-6 bg-slate-900 rounded-3xl border border-white/10 space-y-6">
              <h5 className="text-[11px] font-bold text-slate-300 uppercase tracking-[0.2em] flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-emerald-400" /> 显存需求构成 (VRAM)
              </h5>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={vramData} layout="vertical" stackOffset="expand">
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" hide />
                    <Tooltip 
                      cursor={{fill: 'transparent'}}
                      contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px'}}
                    />
                    <Legend iconType="circle" wrapperStyle={{fontSize: '10px', paddingTop: '20px'}} />
                    <Bar dataKey="权重" stackId="a" fill="#3b82f6" radius={[4, 0, 0, 4]} />
                    <Bar dataKey="缓存" stackId="a" fill="#10b981" />
                    <Bar dataKey="梯度与优化器" stackId="a" fill="#f43f5e" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="text-center p-2 bg-white/5 rounded-xl border border-white/5">
                  <div className="text-[9px] text-slate-500 uppercase mb-1">总显存需求</div>
                  <div className="text-sm font-bold text-white">{(calculateResources.weights + calculateResources.cache + calculateResources.optimizer).toFixed(1)}GB</div>
                </div>
                <div className="text-center p-2 bg-white/5 rounded-xl border border-white/5">
                  <div className="text-[9px] text-slate-500 uppercase mb-1">KV缓存占用</div>
                  <div className="text-sm font-bold text-emerald-400">{calculateResources.cache.toFixed(1)}GB</div>
                </div>
                <div className="text-center p-2 bg-white/5 rounded-xl border border-white/5">
                  <div className="text-[9px] text-slate-500 uppercase mb-1">计算压力</div>
                  <div className="text-sm font-bold text-amber-400">{calculateResources.compute > 100 ? '极高' : (calculateResources.compute > 20 ? '高' : '中低')}</div>
                </div>
              </div>
            </div>

            {/* 业务特性分析 */}
            <div className="p-6 bg-slate-900 rounded-3xl border border-white/10 space-y-6">
              <h5 className="text-[11px] font-bold text-slate-300 uppercase tracking-[0.2em] flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" /> 模式负载雷达图
              </h5>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={characteristicData}>
                    <PolarGrid stroke="#1e293b" />
                    <PolarAngleAxis dataKey="subject" tick={{fill: '#475569', fontSize: 9}} />
                    <Radar 
                      name={MODES[selectedMode].name} 
                      dataKey="A" 
                      stroke="#6366f1" 
                      fill="#6366f1" 
                      fillOpacity={0.5} 
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="p-4 bg-indigo-500/5 rounded-xl border border-indigo-500/10">
                <p className="text-[11px] text-slate-400 leading-relaxed italic text-center">
                  "{MODES[selectedMode].desc}"
                </p>
              </div>
            </div>
          </div>

          {/* 流程图可视化 */}
          <div className="p-8 bg-slate-900/50 rounded-3xl border border-white/10 shadow-inner">
            <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center mb-6">
              业务执行流程链路 (Workflow Pipeline)
            </h5>
            {renderWorkflow()}
            
            <div className="mt-8 flex items-center gap-4 p-4 bg-red-500/5 rounded-2xl border border-red-500/10">
               <AlertTriangle className="w-5 h-5 text-red-500/60" />
               <div className="text-[10px] text-slate-400 leading-relaxed">
                 <span className="font-bold text-red-400">资源警示:</span> 
                 {selectedMode === 'finetune' 
                   ? ' 微调任务正在进行的权重更新需要存储巨大的反向传播梯度。建议至少配备 8x H800 集群。' 
                   : contextLength > 128
                     ? ` 超长上下文 (${contextLength}k) 导致 KV Cache 占据了 ${(calculateResources.cache / (calculateResources.weights + calculateResources.cache) * 100).toFixed(0)}% 的可用显存。建议开启 FlashAttention。`
                     : selectedMode === 'agent' 
                       ? ' Agent 的多次调用循环会导致延迟激增。如果并发过高，GPU 算力将成为首要瓶颈。'
                       : ' 当前模式负载处于健康水平。增加并发数将主要挤占 KV Cache 所需的显存。'}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceWorkflowSim;
