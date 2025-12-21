
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Dna, BookOpen, MessageSquare, Zap, Cpu, 
  Layers, LineChart, Play, RotateCcw, Activity,
  Database, ShieldCheck, Stethoscope, Binary,
  ArrowRight, HardDrive, Filter, Gauge,
  // Fix: Added missing icons to resolve name errors
  CheckCircle2, Info
} from 'lucide-react';
import { 
  LineChart as ReLineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';

type TrainingStage = 'pretrain' | 'cpt' | 'sft' | 'lora';

const STAGES: Record<TrainingStage, { 
  name: string; 
  subtitle: string;
  data: string; 
  objective: string; 
  compute: string; 
  vram: string;
  color: string;
  desc: string;
  demoInput: string;
  demoOutput: string;
}> = {
  pretrain: {
    name: '基础预训练 (Pre-training)',
    subtitle: '通才教育',
    data: '全网公海数据 (维基、代码、网页)',
    objective: '学习语言概率分布、基础常识',
    compute: '数万张 H100 / 数月',
    vram: '极高 (全量参数)',
    color: '#3b82f6',
    desc: '让模型学会“说话”和理解世界。此时它是通才，但不懂医学细节。',
    demoInput: '肺部是什么？',
    demoOutput: '肺是人体呼吸系统的重要器官，位于胸腔内...'
  },
  cpt: {
    name: '二次预训练 (CPT)',
    subtitle: '专科进修',
    data: '呼吸科教科书、柳叶刀论文、医学指南',
    objective: '注入垂直领域专业术语与逻辑',
    compute: '数百张 GPU / 数周',
    vram: '高 (全量参数)',
    color: '#10b981',
    desc: 'Continual Pre-training。喂入海量呼吸科文献，模型开始掌握专业词汇。',
    demoInput: 'COPD 的主要病理特征是什么？',
    demoOutput: '慢性阻塞性肺疾病 (COPD) 特征为持续性呼吸道症状和气流受限，通常由小气道疾病和肺气肿引起...'
  },
  sft: {
    name: '监督微调 (SFT)',
    subtitle: '临床问诊',
    data: '5万条 呼吸科医生模拟问诊对',
    objective: '对齐指令风格，学会医生思考逻辑',
    compute: '数十张 GPU / 数天',
    vram: '中 (全量参数)',
    color: '#8b5cf6',
    desc: 'Supervised Fine-tuning。通过高质量问答对，让模型像医生一样沟通。',
    demoInput: '大夫，我咳嗽三周了，痰中带血。',
    demoOutput: '您好。咳嗽三周伴咯血属于重要临床信号。建议立即进行胸部 CT 检查排除肺占位性病变，同时检测...'
  },
  lora: {
    name: 'LoRA 轻量化微调',
    subtitle: '高效微调',
    data: '特定科室病历 / 风格数据集',
    objective: '极低成本适配特定任务',
    compute: '1-8 张 GPU / 数小时',
    vram: '极低 (仅更新 1% 参数)',
    color: '#f43f5e',
    desc: 'Low-Rank Adaptation。不改动主权重，仅通过外挂两个“低秩小矩阵”实现快速适配。',
    demoInput: '帮我按照三甲医院标准写一份出院小结。',
    demoOutput: '【出院小结】患者因“间断咳嗽伴气促”入院... 诊断：支气管哮喘... 治疗方案：布地奈德福莫特罗...'
  }
};

const TrainingSim: React.FC = () => {
  const [stage, setStage] = useState<TrainingStage>('pretrain');
  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lossHistory, setLossHistory] = useState<{ step: number; loss: number }[]>([]);

  const config = STAGES[stage];

  useEffect(() => {
    if (isTraining) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsTraining(false);
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });

        setLossHistory(prev => {
          const step = prev.length;
          // Simulated loss decay formula
          const baseLoss = stage === 'pretrain' ? 4 : (stage === 'cpt' ? 2 : 1);
          const decay = stage === 'lora' ? 0.95 : 0.92;
          const newLoss = Math.max(0.1, baseLoss * Math.pow(decay, step) + Math.random() * 0.05);
          return [...prev, { step, loss: newLoss }];
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isTraining, stage]);

  const startTraining = () => {
    setIsTraining(true);
    setProgress(0);
    setLossHistory([]);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-rose-500/10 text-rose-500 rounded-full text-[9px] font-bold border border-rose-500/20 tracking-widest uppercase">Specialist Training</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-rose-500 bg-clip-text text-transparent">
            呼吸科专家模型演化实验室
          </h2>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={startTraining}
            disabled={isTraining}
            className="flex items-center gap-2 px-6 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-30 text-white rounded-xl text-xs font-bold transition-all shadow-lg"
          >
            {isTraining ? <Activity className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
            开始阶段训练
          </button>
          <button onClick={() => { setProgress(0); setLossHistory([]); setIsTraining(false); }} className="p-2 bg-slate-800 rounded-xl text-slate-400">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stage Selector */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {(Object.keys(STAGES) as TrainingStage[]).map((s) => (
          <button
            key={s}
            onClick={() => { setStage(s); setProgress(0); setLossHistory([]); setIsTraining(false); }}
            className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group
              ${stage === s ? 'bg-white/5 border-white/20 ring-1 ring-white/10 shadow-xl' : 'bg-transparent border-white/5 opacity-40 hover:opacity-100'}`}
          >
            <div className="flex justify-between items-start mb-2">
               <div className={`p-2 rounded-lg bg-slate-800 text-sm`} style={{ color: STAGES[s].color }}>
                 {s === 'pretrain' ? <Dna className="w-4 h-4" /> : s === 'cpt' ? <BookOpen className="w-4 h-4" /> : s === 'sft' ? <Stethoscope className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
               </div>
               <div className="text-[10px] text-slate-500 font-mono">Stage {Object.keys(STAGES).indexOf(s) + 1}</div>
            </div>
            <h4 className="text-xs font-bold text-white mb-1">{STAGES[s].name}</h4>
            <div className="text-[9px] font-bold uppercase tracking-widest opacity-60" style={{ color: STAGES[s].color }}>{STAGES[s].subtitle}</div>
            {stage === s && <div className="absolute bottom-0 left-0 h-1 bg-rose-500 w-full" style={{ backgroundColor: STAGES[s].color }} />}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left: Monitor */}
        <div className="xl:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Loss Chart */}
            <div className="p-6 bg-slate-900 border border-white/10 rounded-3xl h-64 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                 <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                   <LineChart className="w-4 h-4 text-rose-500" /> 训练损失 (Training Loss)
                 </h5>
                 {isTraining && <span className="text-[10px] text-emerald-500 animate-pulse">Running...</span>}
              </div>
              <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={lossHistory}>
                    <defs>
                      <linearGradient id="colorLoss" x1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={config.color} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={config.color} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="step" hide />
                    <YAxis fontSize={9} stroke="#475569" domain={[0, 'auto']} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '10px' }} 
                      labelStyle={{ display: 'none' }}
                    />
                    <Area type="monotone" dataKey="loss" stroke={config.color} fillOpacity={1} fill="url(#colorLoss)" isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Hardware Status */}
            <div className="p-6 bg-slate-900 border border-white/10 rounded-3xl space-y-6">
              <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-500" /> 算力资源监控
              </h5>
              <div className="space-y-4">
                 <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase">
                       <span className="text-slate-500">显存占用 (VRAM)</span>
                       <span className="text-white">{config.vram}</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: stage === 'lora' ? '15%' : stage === 'sft' ? '60%' : '100%' }} />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase">
                       <span className="text-slate-500">GPU 计算负载</span>
                       <span className="text-white">{isTraining ? '98.5%' : '0%'}</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                       <div className={`h-full bg-emerald-500 transition-all ${isTraining ? 'w-[98.5%]' : 'w-0'}`} />
                    </div>
                 </div>
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                   <div className="text-[9px] text-slate-500 font-bold uppercase mb-1">训练耗时估算</div>
                   <div className="text-sm font-mono text-white">{config.compute}</div>
                 </div>
              </div>
            </div>
          </div>

          {/* Training Visualization (Weight Matrix for LoRA vs Full) */}
          <div className="p-8 bg-slate-900 border border-white/10 rounded-3xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4">
               <Binary className="w-12 h-12 text-slate-800 opacity-20" />
             </div>
             <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">内部权重更新仿真 (Weight Delta)</h5>
             
             <div className="flex flex-col md:flex-row items-center justify-around gap-12">
                {/* Main Backbone weights */}
                <div className="text-center space-y-3">
                  <div className="grid grid-cols-6 gap-1 p-2 bg-black/40 border border-white/10 rounded-lg">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-4 h-4 rounded-sm transition-colors duration-500 ${stage === 'lora' ? 'bg-slate-700' : (isTraining ? 'bg-indigo-500 animate-pulse' : 'bg-indigo-900/40')}`}
                        style={{ opacity: stage === 'lora' ? 0.3 : (Math.random() * 0.5 + 0.5) }}
                      />
                    ))}
                  </div>
                  <div className="text-[9px] font-bold text-slate-600 uppercase">冻结的基座权重 (Backbone)</div>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <ArrowRight className={`w-6 h-6 ${isTraining ? 'text-rose-500 animate-bounce' : 'text-slate-700'}`} />
                  {stage === 'lora' && <span className="text-[9px] font-bold text-rose-500 uppercase px-2 py-0.5 bg-rose-500/10 rounded">LoRA Adapter</span>}
                </div>

                {/* Training updates */}
                {stage === 'lora' ? (
                  <div className="flex items-center gap-4">
                    <div className="text-center space-y-2">
                       <div className="w-12 h-24 bg-rose-500/20 border border-rose-500/30 rounded flex items-center justify-center">
                          <div className={`w-4 h-20 ${isTraining ? 'bg-rose-500 animate-pulse' : 'bg-rose-900/40'} rounded-sm`} />
                       </div>
                       <div className="text-[8px] font-bold text-slate-600">Matrix A</div>
                    </div>
                    <div className="text-xl text-slate-700">×</div>
                    <div className="text-center space-y-2">
                       <div className="w-24 h-12 bg-rose-500/20 border border-rose-500/30 rounded flex items-center justify-center">
                          <div className={`w-20 h-4 ${isTraining ? 'bg-rose-500 animate-pulse' : 'bg-rose-900/40'} rounded-sm`} />
                       </div>
                       <div className="text-[8px] font-bold text-slate-600">Matrix B</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-3">
                    <div className="grid grid-cols-6 gap-1 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                      {Array.from({ length: 36 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-4 h-4 rounded-sm transition-colors duration-500 ${isTraining ? 'bg-emerald-500 animate-pulse' : 'bg-emerald-900/40'}`}
                          style={{ opacity: Math.random() * 0.7 + 0.3 }}
                        />
                      ))}
                    </div>
                    <div className="text-[9px] font-bold text-emerald-600 uppercase">全量更新权重 (Full Update)</div>
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* Right: Interactive Case */}
        <div className="xl:col-span-4 space-y-6">
          <div className="p-8 bg-slate-900 border border-white/10 rounded-3xl h-full flex flex-col">
            <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-6">
              <MessageSquare className="w-4 h-4 text-rose-400" /> 医学场景推理实测
            </h5>
            
            <div className="flex-1 space-y-6">
               <div className="space-y-3">
                 <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center"><Layers className="w-3 h-3 text-blue-400" /></div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">输入问题</span>
                 </div>
                 <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-xs text-slate-300 leading-relaxed italic">
                   "{config.demoInput}"
                 </div>
               </div>

               <div className="space-y-3">
                 <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center"><ShieldCheck className="w-3 h-3 text-emerald-400" /></div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">模型回复</span>
                 </div>
                 <div className="p-5 bg-white/5 rounded-2xl border border-white/5 min-h-[160px] text-xs leading-relaxed text-slate-200">
                    {progress < 100 && !isTraining && <span className="text-slate-700 italic">点击“开始训练”观察进化效果...</span>}
                    {isTraining && (
                      <div className="space-y-2 animate-pulse">
                        <div className="h-3 w-3/4 bg-slate-800 rounded" />
                        <div className="h-3 w-full bg-slate-800 rounded" />
                        <div className="h-3 w-1/2 bg-slate-800 rounded" />
                      </div>
                    )}
                    {progress === 100 && (
                      <div className="animate-in fade-in duration-700">
                        {config.demoOutput}
                        <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span className="text-[9px] text-slate-500">此回复基于 {config.name} 后的知识权重生成</span>
                        </div>
                      </div>
                    )}
                 </div>
               </div>
            </div>

            <div className="mt-8 p-4 bg-rose-500/5 border border-rose-500/10 rounded-2xl">
               <div className="flex items-start gap-3">
                  <Info className="w-4 h-4 text-rose-500 mt-0.5" />
                  <div className="space-y-1">
                     <h6 className="text-[10px] font-bold text-rose-400 uppercase">为什么选这个阶段？</h6>
                     <p className="text-[9px] text-slate-500 leading-relaxed">
                       {config.desc}
                     </p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deep Concepts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="p-6 bg-slate-900/40 rounded-2xl border border-white/5 space-y-4">
           <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400"><Database className="w-5 h-5" /></div>
           <h4 className="font-bold text-sm">数据对齐 (Alignment)</h4>
           <p className="text-xs text-slate-400 leading-relaxed">
             训练不仅是灌入知识。SFT 和 RLHF（强化学习）更多是教导模型如何以“正确的人类风格”进行输出，确保安全、专业。
           </p>
        </div>
        <div className="p-6 bg-slate-900/40 rounded-2xl border border-white/5 space-y-4">
           <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400"><Filter className="w-5 h-5" /></div>
           <h4 className="font-bold text-sm">灾难性遗忘</h4>
           <p className="text-xs text-slate-400 leading-relaxed">
             如果在 CPT 阶段过度训练医学数据，模型可能会“忘记”如何写代码或普通对话。LoRA 微调由于冻结了主权重，能有效缓解这一问题。
           </p>
        </div>
        <div className="p-6 bg-slate-900/40 rounded-2xl border border-white/5 space-y-4">
           <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400"><Gauge className="w-5 h-5" /></div>
           <h4 className="font-bold text-sm">低秩分解原理</h4>
           <p className="text-xs text-slate-400 leading-relaxed">
             LoRA 假设权重的更新可以通过两个极低维度的矩阵相乘来近似。这就像用一张极小的网格贴图去修饰一张巨型照片。
           </p>
        </div>
      </div>
    </div>
  );
};

export default TrainingSim;
