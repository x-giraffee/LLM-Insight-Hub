
import React, { useState } from 'react';
import { 
  Cpu, Globe, Code, Zap, Trophy, 
  LayoutGrid, Star, Building2, GitFork, 
  MessageSquare, Brain, Target,
  Files, Smile, Sparkles, Video
} from 'lucide-react';

interface ModelCard {
  id: string;
  name: string;
  org: string;
  series: string[];
  bestFor: string;
  desc: string;
  stats: {
    context: string;
    params: string;
    ranking: string;
  };
  tags: string[];
  color: string;
}

const CN_MODELS: ModelCard[] = [
  {
    id: 'deepseek',
    name: 'DeepSeek (深度求索)',
    org: 'DeepSeek AI',
    series: ['DeepSeek-V3', 'DeepSeek-R1', 'Janus-Pro'],
    bestFor: '推理能力(Reasoning)、代码、极低成本',
    desc: '2024-2025 年的全球黑马。V3 采用 MoE 架构，以极低的成本达到了 SOTA 水平。R1 版本通过强化学习开启了推理模型新纪元，Janus 则是多模态理解的新标杆。',
    stats: { context: '128K', params: '671B (MoE)', ranking: 'Global Tier 1' },
    tags: ['开源精神', '强逻辑', 'MoE架构'],
    color: 'blue'
  },
  {
    id: 'qwen',
    name: 'Qwen (通义千问)',
    org: 'Alibaba Cloud',
    series: ['Qwen2.5', 'Qwen-Max', 'Qwen-VL', 'QwQ'],
    bestFor: '全能表现、多语言、多模态融合',
    desc: '开源界的“六边形战士”。Qwen2.5 72B 在各项基准测试中表现统治级，是目前生态最丰富、微调适配最广泛的基座模型之一。',
    stats: { context: '1M+', params: '0.5B - 72B', ranking: 'Open SOTA' },
    tags: ['生态最全', '多模态', '全球化'],
    color: 'indigo'
  },
  {
    id: 'glm',
    name: 'GLM (智谱AI)',
    org: 'Zhipu AI (清华系)',
    series: ['GLM-4', 'GLM-4V', 'CogVideo'],
    bestFor: '工具调用 (Agent)、视频生成、意图理解',
    desc: '源自清华 KEG 实验室。GLM-4 在智能体（Agent）规划和工具调用方面表现出色。近期发布的 CogVideo 更是国产视频生成模型的领跑者。',
    stats: { context: '128K', params: '9B / 130B', ranking: 'Agent Choice' },
    tags: ['清华系', '视频生成', '工具调用'],
    color: 'purple'
  },
  {
    id: 'kimi',
    name: 'Kimi (月之暗面)',
    org: 'Moonshot AI',
    series: ['Moonshot-v1', 'Kimi k1.5'],
    bestFor: '超长无损上下文、长文档分析',
    desc: '以支持 20 万字以上超长上下文一战成名。在处理财报、法律文书等长文档时具备极高的“大海捞针”准确率，是长文本领域的标杆。',
    stats: { context: '2M+ (Beta)', params: 'Closed', ranking: 'Long Context' },
    tags: ['长文本之王', '高粘性', '无损记忆'],
    color: 'rose'
  },
  {
    id: 'minimax',
    name: 'Minimax (名之梦)',
    org: 'Minimax',
    series: ['abab 6.5', 'abab 7', 'Video-01'],
    bestFor: '拟人对话、语音/视频生成、MoE',
    desc: '国内最早押注 MoE 架构的厂商。abab 系列在角色扮演（Roleplay）和语音合成（TTS）上极具优势，Video-01 视频模型也展现了惊人的生成质量。',
    stats: { context: '32K+', params: 'MoE', ranking: 'Interaction' },
    tags: ['拟人交互', '语音/视频', 'MoE先驱'],
    color: 'orange'
  },
  {
    id: 'stepfun',
    name: 'StepFun (阶跃星辰)',
    org: 'StepFun',
    series: ['Step-1', 'Step-2', 'Step-1V'],
    bestFor: '多模态理解、逻辑推理、万亿参数',
    desc: '由微软前高管创立，拥有国内少有的万亿参数语言模型 Step-2。在图像理解、复杂逻辑推理以及多模态融合领域展现了迈向 AGI 的潜力。',
    stats: { context: '128K', params: 'Trillion', ranking: 'Multimodal' },
    tags: ['万亿参数', '多模态', '微软基因'],
    color: 'cyan'
  }
];

const ChinaModelLandscape: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-red-500/10 text-red-500 rounded-full text-[9px] font-bold border border-red-500/20 tracking-widest uppercase">CN Model Landscape</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
            中国大模型全景图
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Globe className="w-4 h-4" />
          <span>Global Impact: Top Tier</span>
        </div>
      </div>

      {/* Grid Landscape */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {CN_MODELS.map((model) => (
          <div 
            key={model.id}
            onMouseEnter={() => setHoveredId(model.id)}
            onMouseLeave={() => setHoveredId(null)}
            className={`relative group p-6 rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col h-full
              ${hoveredId === model.id 
                ? `bg-slate-900 border-${model.color}-500/50 shadow-2xl shadow-${model.color}-500/10 scale-[1.02]` 
                : 'bg-slate-900/40 border-white/5 hover:border-white/10'}`}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br from-${model.color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

            {/* Header */}
            <div className="relative z-10 flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-${model.color}-400 bg-${model.color}-500/10 border border-${model.color}-500/20`}>
                  {model.id === 'deepseek' ? <Brain className="w-6 h-6" /> : 
                   model.id === 'qwen' ? <LayoutGrid className="w-6 h-6" /> :
                   model.id === 'stepfun' ? <Sparkles className="w-6 h-6" /> :
                   model.id === 'glm' ? <Code className="w-6 h-6" /> :
                   model.id === 'kimi' ? <Files className="w-6 h-6" /> :
                   <Smile className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-100">{model.name}</h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <Building2 className="w-3 h-3" />
                    {model.org}
                  </div>
                </div>
              </div>
              <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase border bg-${model.color}-500/10 border-${model.color}-500/20 text-${model.color}-400`}>
                {model.stats.ranking}
              </div>
            </div>

            {/* Description */}
            <p className="relative z-10 text-xs text-slate-400 leading-relaxed mb-6 flex-1">
              {model.desc}
            </p>

            {/* Stats Grid */}
            <div className="relative z-10 grid grid-cols-2 gap-2 mb-6">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="text-[9px] text-slate-500 uppercase font-bold mb-1">Max Context</div>
                <div className="text-sm font-mono text-white">{model.stats.context}</div>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="text-[9px] text-slate-500 uppercase font-bold mb-1">Params / Arch</div>
                <div className="text-sm font-mono text-white">{model.stats.params}</div>
              </div>
            </div>

            {/* Tags & Series */}
            <div className="relative z-10 space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {model.series.map((s, i) => (
                   <span key={i} className="text-[9px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/5 font-mono">
                     {s}
                   </span>
                ))}
              </div>
              <div className="h-px w-full bg-white/5" />
              <div className="flex flex-wrap gap-2">
                {model.tags.map((tag, i) => (
                  <span key={i} className={`text-[10px] font-bold flex items-center gap-1 text-${model.color}-400`}>
                    <Star className="w-3 h-3 fill-current" /> {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Footer */}
      <div className="p-6 bg-slate-900/50 rounded-3xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/10 rounded-full">
              <Trophy className="w-6 h-6 text-red-500" />
            </div>
            <div>
               <h4 className="font-bold text-slate-200">中国模型百花齐放 (Blooming of CN Models)</h4>
               <p className="text-xs text-slate-400 max-w-2xl leading-relaxed mt-1">
                 从开源界的 <strong>DeepSeek、Qwen</strong> 到应用层的 <strong>Kimi、Minimax</strong>，中国大模型在<strong>逻辑推理、长文本、多模态交互</strong>以及<strong>视频生成</strong>领域已形成独特的竞争优势。
               </p>
            </div>
         </div>
         <div className="flex gap-8 pr-4">
            <div className="text-center">
               <div className="text-xl font-bold text-white font-mono">6+</div>
               <div className="text-[10px] text-slate-500 uppercase font-bold">Unicorns</div>
            </div>
            <div className="text-center">
               <div className="text-xl font-bold text-white font-mono">2M+</div>
               <div className="text-[10px] text-slate-500 uppercase font-bold">Context Win</div>
            </div>
            <div className="text-center">
               <div className="text-xl font-bold text-white font-mono">SOTA</div>
               <div className="text-[10px] text-slate-500 uppercase font-bold">Performance</div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ChinaModelLandscape;
