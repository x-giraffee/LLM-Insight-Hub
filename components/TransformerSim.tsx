
import React, { useState, useEffect, useRef } from 'react';
import { 
  Network, ArrowRight, Zap, RefreshCw, Brain, 
  Cpu, Layers, GitBranch, Box, Code, Scale,
  Eye, Timer, Lock, Sparkles, LayoutGrid, Play
} from 'lucide-react';

type ArchType = 'rnn' | 'transformer';

const DEMO_SENTENCE = ["The", "animal", "didn't", "cross", "the", "street", "because", "it", "was", "too", "tired"];
// Target: "it" refers to "animal" (because of "tired")

const ARCH_GALLERY = [
  {
    id: 'deepseek-v3',
    name: 'DeepSeek-V3',
    org: 'DeepSeek',
    arch: 'MoE + MLA',
    params: '671B (37B Active)',
    desc: '当前开源架构的巅峰。引入 MLA (Multi-head Latent Attention) 极大压缩了 KV Cache，结合 DeepSeekMoE 细粒度专家混合架构，实现了极致的推理效率与显存优化。',
    features: ['MLA 注意力机制', 'FP8 混合精度训练', '细粒度专家路由'],
    color: 'blue'
  },
  {
    id: 'qwen3',
    name: 'Qwen-3 (Next-Gen)',
    org: 'Alibaba Cloud',
    arch: 'Dense / Sparse MoE',
    params: 'Unknown (Est. 72B+)',
    desc: '通义千问下一代旗舰。预计进一步强化代码与数学能力，可能采用更深层的 MoE 架构来平衡庞大的知识容量与推理延迟，强化多模态原生支持。',
    features: ['原生多模态', '超长上下文窗口', '强化逻辑推理'],
    color: 'indigo'
  },
  {
    id: 'kimi-k2',
    name: 'Kimi-K2',
    org: 'Moonshot AI',
    arch: 'Long-Context Transformer',
    params: 'Undisclosed',
    desc: '月之暗面新一代基座。专注于“无损”超长上下文记忆（Lossless Long Context），优化了 RoPE 旋转位置编码，支持百万级 Token 的精准检索与分析。',
    features: ['2M+ 上下文', '无损记忆检索', '超强指令遵循'],
    color: 'rose'
  },
  {
    id: 'glm-4.6',
    name: 'GLM-4.6 / 4.6V',
    org: 'Zhipu AI',
    arch: 'GLM (General Language Model)',
    params: '130B+',
    desc: 'GLM 架构的最新迭代。独特的自回归填空训练目标使其在 Agent 工具调用和复杂任务规划上表现卓越。V 版本强化了端到端视觉理解。',
    features: ['Agent 规划能力', 'GLM 独特架构', '端到端视觉'],
    color: 'purple'
  }
];

const TransformerSim: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'playground' | 'gallery'>('playground');
  const [selectedArch, setSelectedArch] = useState<ArchType>('transformer');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [memoryStrength, setMemoryStrength] = useState(100);
  const [attentionLines, setAttentionLines] = useState<{from: number, to: number, strength: number}[]>([]);

  // Simulation Logic
  const startSimulation = () => {
    setIsProcessing(true);
    setCurrentStep(-1);
    setMemoryStrength(100);
    setAttentionLines([]);

    if (selectedArch === 'rnn') {
      // RNN Sequence Logic
      let step = 0;
      const interval = setInterval(() => {
        setCurrentStep(step);
        // Memory fades as sequence gets longer
        setMemoryStrength(prev => Math.max(20, prev - 8)); 
        
        step++;
        if (step >= DEMO_SENTENCE.length) {
          clearInterval(interval);
          setIsProcessing(false);
        }
      }, 600);
    } else {
      // Transformer Parallel Logic
      setTimeout(() => {
        // 1. Parallel Embedding (All light up)
        setCurrentStep(DEMO_SENTENCE.length); 
        
        // 2. Self-Attention Calculation (Draw lines)
        setTimeout(() => {
           // Specifically highlighting the "it" -> "animal" connection
           const itIndex = 7; // "it"
           const animalIndex = 1; // "animal"
           const streetIndex = 5; // "street"
           const tiredIndex = 10; // "tired"

           setAttentionLines([
             { from: itIndex, to: animalIndex, strength: 1.0 }, // Strong connection because of "tired"
             { from: itIndex, to: streetIndex, strength: 0.1 }, // Weak connection
             { from: itIndex, to: tiredIndex, strength: 0.8 },  // "tired" helps resolve "it"
           ]);
           setIsProcessing(false);
        }, 800);
      }, 300);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-500 rounded-full text-[9px] font-bold border border-yellow-500/20 tracking-widest uppercase">Deep Learning Core</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Transformer 架构与前沿模型
          </h2>
        </div>
        
        <div className="flex bg-slate-900 p-1 rounded-xl border border-white/5">
          <button 
            onClick={() => setActiveTab('playground')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'playground' ? 'bg-yellow-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Zap className="w-3 h-3" /> 原理演示
          </button>
          <button 
            onClick={() => setActiveTab('gallery')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'gallery' ? 'bg-yellow-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <LayoutGrid className="w-3 h-3" /> 前沿架构库
          </button>
        </div>
      </div>

      {activeTab === 'playground' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls & Explanation */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 bg-slate-900 rounded-3xl border border-white/10 space-y-6">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">选择架构模式</h3>
              
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => { setSelectedArch('rnn'); setAttentionLines([]); setCurrentStep(-1); }}
                  className={`p-4 rounded-2xl border text-left transition-all ${selectedArch === 'rnn' ? 'bg-slate-800 border-white/20 ring-1 ring-white/10' : 'bg-white/5 border-white/5 opacity-60'}`}
                >
                  <div className="flex items-center gap-2 mb-1 text-slate-300 font-bold">
                    <Timer className="w-4 h-4" /> 传统 RNN/LSTM
                  </div>
                  <p className="text-[10px] text-slate-500">
                    顺序处理。看后面忘前面，难以处理长距离依赖关系。就像人只能逐字阅读，不能一目十行。
                  </p>
                </button>

                <button
                  onClick={() => { setSelectedArch('transformer'); setAttentionLines([]); setCurrentStep(-1); }}
                  className={`p-4 rounded-2xl border text-left transition-all ${selectedArch === 'transformer' ? 'bg-yellow-500/10 border-yellow-500/50 ring-1 ring-yellow-500/20' : 'bg-white/5 border-white/5 opacity-60'}`}
                >
                  <div className="flex items-center gap-2 mb-1 text-yellow-400 font-bold">
                    <Network className="w-4 h-4" /> Transformer (Attention)
                  </div>
                  <p className="text-[10px] text-slate-500">
                    并行处理 + 自注意力机制。无论距离多远，关键词之间都能直接“连线”。这是 GPT 能够理解复杂逻辑的关键。
                  </p>
                </button>
              </div>

              <button
                onClick={startSimulation}
                disabled={isProcessing}
                className="w-full py-3 bg-slate-100 text-slate-900 hover:bg-white disabled:opacity-50 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                执行任务：指代消解
              </button>
            </div>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2">核心差异 (Why Transformer Wins)</h4>
              <ul className="space-y-2 text-[11px] text-slate-400">
                <li className="flex gap-2">
                  <span className="text-red-400">×</span> RNN 必须等上一个词处理完才能处理下一个，无法并行训练（慢）。
                </li>
                <li className="flex gap-2">
                  <span className="text-green-400">√</span> Transformer 一次性输入整句话，GPU 并行计算效率极高（快）。
                </li>
                <li className="flex gap-2">
                  <span className="text-green-400">√</span> <span className="text-yellow-400 font-bold">Self-Attention</span> 让模型能根据上下文动态调整每个词的权重。
                </li>
              </ul>
            </div>
          </div>

          {/* Visualization Stage */}
          <div className="lg:col-span-8 space-y-6">
            <div className="relative p-8 bg-slate-950 rounded-3xl border border-white/10 min-h-[400px] flex flex-col items-center justify-center overflow-hidden">
               {/* Background Grid */}
               <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />
               
               <div className="absolute top-4 left-4 text-[10px] font-bold text-slate-500 uppercase">
                 Task: 这里的 "it" 到底是指 "animal" 还是 "street"？
               </div>

               {/* Tokens Row */}
               <div className="relative z-10 flex flex-wrap justify-center gap-3 max-w-2xl">
                 {DEMO_SENTENCE.map((word, idx) => {
                   const isActive = selectedArch === 'rnn' ? idx === currentStep : currentStep >= DEMO_SENTENCE.length;
                   // In RNN mode, previous words fade out to simulate memory loss
                   const opacity = selectedArch === 'rnn' 
                      ? (idx <= currentStep ? Math.max(0.2, 1 - (currentStep - idx) * 0.15) : 0.1)
                      : (isActive ? 1 : 0.3);
                   
                   return (
                     <div 
                       key={idx}
                       id={`token-${idx}`}
                       className={`relative px-3 py-2 rounded-lg text-sm font-mono border transition-all duration-300
                         ${isActive 
                           ? 'bg-yellow-500 text-black border-yellow-400 scale-110 shadow-[0_0_15px_rgba(234,179,8,0.5)]' 
                           : 'bg-slate-900 text-slate-400 border-white/10'}`}
                       style={{ opacity }}
                     >
                       {word}
                       {/* Connection Anchors for Transformer */}
                       {selectedArch === 'transformer' && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-1 h-1 bg-white/20 rounded-full" />}
                     </div>
                   );
                 })}
               </div>

               {/* RNN Memory Bar */}
               {selectedArch === 'rnn' && (
                 <div className="mt-12 w-64 space-y-2 animate-in fade-in">
                    <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500">
                       <span>Context Vector Strength</span>
                       <span>{Math.round(memoryStrength)}%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                       <div 
                         className={`h-full transition-all duration-300 ${memoryStrength < 40 ? 'bg-red-500' : 'bg-green-500'}`} 
                         style={{ width: `${memoryStrength}%` }} 
                       />
                    </div>
                    <p className="text-[10px] text-slate-500 text-center pt-2">
                       {memoryStrength < 40 ? "⚠️ 距离太远，'animal' 的信息已丢失 (Vanishing Gradient)" : "正在逐步传递信息..."}
                    </p>
                 </div>
               )}

               {/* Transformer Attention Lines (SVG Overlay) */}
               {selectedArch === 'transformer' && attentionLines.length > 0 && (
                 <svg className="absolute inset-0 w-full h-full pointer-events-none animate-in fade-in duration-1000">
                    <defs>
                      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#eab308" />
                      </marker>
                    </defs>
                    {attentionLines.map((line, i) => {
                       // Simple calculation to find positions (In a real app, use ref.getBoundingClientRect)
                       // This is a visual approximation for the demo layout
                       const startX = 50 + (line.from - 5) * 60; // Approximate relative pos
                       const endX = 50 + (line.to - 5) * 60;
                       
                       // We can't easily get exact pixel positions in this mocked SVG without DOM refs, 
                       // so we visualize the concept with a static illustration or simplified lines if logic allows.
                       // For this demo, let's render a conceptual visualization below the tokens.
                       return null; 
                    })}
                 </svg>
               )}
               
               {/* Conceptual Attention Visualization (easier to implement than dynamic SVG coordinates) */}
               {selectedArch === 'transformer' && attentionLines.length > 0 && (
                 <div className="mt-12 w-full max-w-lg p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl relative">
                    <div className="text-[10px] font-bold text-yellow-500 uppercase mb-4 text-center">Self-Attention Weights (Focus on "it")</div>
                    <div className="flex items-end justify-between gap-2 h-24 px-4">
                       {DEMO_SENTENCE.map((word, idx) => {
                          const line = attentionLines.find(l => l.to === idx);
                          const height = line ? line.strength * 100 : 5;
                          const isTarget = idx === 7; // "it"

                          return (
                            <div key={idx} className="flex flex-col items-center gap-1 flex-1">
                               {isTarget ? (
                                 <div className="text-[10px] font-bold text-white mb-1">Target</div>
                               ) : (
                                 <div 
                                    className={`w-full rounded-t transition-all duration-1000 ${line ? 'bg-yellow-500' : 'bg-slate-800'}`}
                                    style={{ height: `${height}%`, opacity: line ? 1 : 0.3 }}
                                 />
                               )}
                               <span className="text-[9px] text-slate-500 rotate-45 origin-left translate-y-2">{word}</span>
                            </div>
                          );
                       })}
                    </div>
                    <div className="mt-6 text-center">
                       <span className="text-xs text-yellow-400 font-bold">结论：</span>
                       <span className="text-xs text-slate-300"> 模型成功将 "it" 与 "animal" (Weight: High) 关联，因为 "tired" 的语义特征激活了这一连接。</span>
                    </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      ) : (
        /* Architecture Gallery */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4">
           {ARCH_GALLERY.map(model => (
             <div key={model.id} className={`group relative p-6 bg-slate-900 rounded-3xl border border-white/10 hover:border-${model.color}-500/50 transition-all hover:-translate-y-1 hover:shadow-2xl`}>
                <div className={`absolute inset-0 bg-gradient-to-br from-${model.color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                
                <div className="relative z-10 flex justify-between items-start mb-4">
                   <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-${model.color}-500/10 text-${model.color}-400 border border-${model.color}-500/20`}>
                         <Brain className="w-6 h-6" />
                      </div>
                      <div>
                         <h3 className="text-lg font-bold text-slate-100">{model.name}</h3>
                         <div className="text-[10px] text-slate-500 uppercase font-bold">{model.org}</div>
                      </div>
                   </div>
                   <div className={`px-2 py-1 rounded text-[10px] font-bold border bg-${model.color}-500/10 border-${model.color}-500/20 text-${model.color}-400`}>
                      {model.arch}
                   </div>
                </div>

                <div className="relative z-10 space-y-4">
                   <p className="text-xs text-slate-400 leading-relaxed min-h-[48px]">
                      {model.desc}
                   </p>
                   
                   <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                         <div className="text-[9px] text-slate-500 uppercase font-bold">参数规模</div>
                         <div className="text-xs font-mono text-white">{model.params}</div>
                      </div>
                      <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                         <div className="text-[9px] text-slate-500 uppercase font-bold">核心突破</div>
                         <div className="text-xs font-mono text-white truncate">{model.features[0]}</div>
                      </div>
                   </div>

                   <div className="flex flex-wrap gap-2 pt-2">
                      {model.features.map(f => (
                        <span key={f} className={`text-[10px] px-2 py-0.5 rounded-full border bg-slate-950 border-white/10 text-slate-400`}>
                           {f}
                        </span>
                      ))}
                   </div>
                </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};

export default TransformerSim;
