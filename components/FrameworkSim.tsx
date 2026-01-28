
import React, { useState } from 'react';
import { 
  Terminal, Server, Settings, Cpu, HardDrive, 
  Zap, Play, Activity, Code, Layers, 
  Globe, Info, CheckCircle2, AlertTriangle,
  ChevronRight, Copy, Monitor, Cpu as GpuIcon,
  Box, Workflow
} from 'lucide-react';

type FrameworkId = 'vllm' | 'sglang' | 'ollama' | 'xinference';

interface FrameworkData {
  id: FrameworkId;
  name: string;
  tag: string;
  desc: string;
  color: string;
  icon: React.ReactNode;
  bestFor: string;
  requirements: {
    gpu: string;
    vram: string;
    platform: string;
  };
  launchCmd: string;
  keyParams: {
    name: string;
    value: string;
    desc: string;
  }[];
  optimizations: string[];
}

const FRAMEWORKS: Record<FrameworkId, FrameworkData> = {
  vllm: {
    id: 'vllm',
    name: 'vLLM',
    tag: '吞吐量之王',
    desc: '最受欢迎的工业级推理框架，核心技术为 PagedAttention。',
    color: '#3b82f6',
    icon: <Zap className="w-5 h-5" />,
    bestFor: '云端大规模并发、OpenAI API 兼容服务。',
    requirements: {
      gpu: 'NVIDIA Ampere (A100/H100) / RoCm',
      vram: '高 (需显存预分配)',
      platform: 'Linux Only'
    },
    launchCmd: 'python -m vllm.entrypoints.openai.api_server \\\n  --model facebook/opt-125m \\\n  --gpu-memory-utilization 0.9 \\\n  --max-model-len 4096',
    keyParams: [
      { name: '--gpu-memory-utilization', value: '0.9', desc: '控制预分配显存比例' },
      { name: '--tensor-parallel-size', value: '2', desc: '多卡并行切分数量' },
      { name: '--max-num-seqs', value: '256', desc: '单批次最大并发请求数' },
      { name: '--max-model-len', value: '4096', desc: '最大上下文长度 (KV Cache容量)' }
    ],
    optimizations: ['PagedAttention (解决显存碎片)', 'Continuous Batching', 'FP8 支持']
  },
  sglang: {
    id: 'sglang',
    name: 'SGLang',
    tag: '多模态与快感',
    desc: '专注于多模态模型和复杂结构化生成的推理框架。',
    color: '#10b981',
    icon: <Monitor className="w-5 h-5" />,
    bestFor: '视觉大模型 (VLM)、复杂 JSON 模式生成、极速推理。',
    requirements: {
      gpu: 'NVIDIA GPU (支持 FlashAttention-2)',
      vram: '中高',
      platform: 'Linux'
    },
    launchCmd: 'python -m sglang.launch_server \\\n  --model-path lmms-lab/llama3-llava-next-8b \\\n  --tp 1 \\\n  --context-length 32768 \\\n  --mem-fraction-static 0.8',
    keyParams: [
      { name: '--mem-fraction-static', value: '0.8', desc: '静态缓存分配比例' },
      { name: '--enable-flashinfer', value: 'True', desc: '开启极速 Attention 算子' },
      { name: '--context-length', value: '32768', desc: '最大上下文窗口限制' },
      { name: '--tokenizer-mode', value: 'auto', desc: '分词器加载模式' }
    ],
    optimizations: ['RadixAttention (前缀缓存优化)', 'Compressed Structure Decoding', '原生多模态支持']
  },
  ollama: {
    id: 'ollama',
    name: 'Ollama',
    tag: '开箱即用',
    desc: '专为本地运行设计的框架，支持 GGUF 格式。',
    color: '#f59e0b',
    icon: <Box className="w-5 h-5" />,
    bestFor: '个人电脑本地运行、CPU 推理、快速原型验证。',
    requirements: {
      gpu: 'Apple M-Series / NVIDIA / AMD / CPU',
      vram: '极低 (支持内存/显存混合)',
      platform: 'macOS / Windows / Linux'
    },
    launchCmd: 'ollama run deepseek-r1:8b',
    keyParams: [
      { name: 'num_gpu', value: '1', desc: '指定使用的 GPU 数量' },
      { name: 'num_thread', value: '8', desc: 'CPU 模式下的线程数' },
      { name: 'num_ctx', value: '4096', desc: '上下文窗口大小' },
      { name: 'repeat_penalty', value: '1.1', desc: '惩罚项，减少重复生成' }
    ],
    optimizations: ['GGUF 量化支持', 'Llama.cpp 后端', '自动跨平台调度']
  },
  xinference: {
    id: 'xinference',
    name: 'XInference',
    tag: '多模型全家桶',
    desc: '分布式的模型管理框架，支持同时运行多个小模型。',
    color: '#8b5cf6',
    icon: <Workflow className="w-5 h-5" />,
    bestFor: '集群管理、多模型对比测试、轻量化 Embedding 服务。',
    requirements: {
      gpu: '各种主流 GPU',
      vram: '自适应',
      platform: 'Windows / macOS / Linux'
    },
    launchCmd: 'xinference launch --model-uid my-model \\\n  --model-name qwen2-beta \\\n  --size-in-billions 1.5',
    keyParams: [
      { name: '--host', value: '0.0.0.0', desc: '监听地址' },
      { name: '--model-format', value: 'pytorch', desc: '指定权重格式' },
      { name: '--quantization', value: '4bit', desc: '开启量化选项' }
    ],
    optimizations: ['多后端支持 (vLLM/Llama.cpp)', '分布式节点注册', '内置 Web UI']
  }
};

const FrameworkSim: React.FC = () => {
  const [selectedId, setSelectedId] = useState<FrameworkId>('vllm');
  const [isLaunching, setIsLaunching] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);

  const data = FRAMEWORKS[selectedId];

  const simulateLaunch = () => {
    setIsLaunching(true);
    setConsoleLogs([]);
    const logs = [
      `Initializing ${data.name} engine...`,
      `Detecting hardware: ${data.requirements.gpu}...`,
      `Loading weights (this might take a few seconds)...`,
      `Applying optimizations: ${data.optimizations.join(', ')}...`,
      `[INFO] Starting API server on port 8000`,
      `[SUCCESS] Model is ready for inference!`
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < logs.length) {
        setConsoleLogs(prev => [...prev, logs[i]]);
        i++;
      } else {
        setIsLaunching(false);
        clearInterval(interval);
      }
    }, 800);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-full text-[9px] font-bold border border-indigo-500/20 tracking-widest uppercase">Inference Engines</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            推理框架与启动实验室
          </h2>
        </div>
      </div>

      {/* Framework Switcher */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {(Object.values(FRAMEWORKS)).map((fw) => (
          <button
            key={fw.id}
            onClick={() => { setSelectedId(fw.id); setConsoleLogs([]); }}
            className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group
              ${selectedId === fw.id ? 'bg-white/5 border-white/20 ring-1 ring-white/10 shadow-xl' : 'bg-transparent border-white/5 opacity-40 hover:opacity-100'}`}
          >
            <div className="flex justify-between items-start mb-2">
               <div className={`p-2 rounded-lg bg-slate-800 text-sm`} style={{ color: fw.color }}>
                 {fw.icon}
               </div>
            </div>
            <h4 className="text-xs font-bold text-white mb-1">{fw.name}</h4>
            <div className="text-[9px] font-bold uppercase tracking-widest opacity-60" style={{ color: fw.color }}>{fw.tag}</div>
            {selectedId === fw.id && <div className="absolute bottom-0 left-0 h-1 bg-indigo-500 w-full" style={{ backgroundColor: fw.color }} />}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left: Configuration & Requirements */}
        <div className="xl:col-span-7 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Specs */}
            <div className="p-6 bg-slate-900 border border-white/10 rounded-3xl space-y-4">
              <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <GpuIcon className="w-4 h-4 text-emerald-400" /> 硬件与平台限制
              </h5>
              <div className="space-y-3">
                 <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">GPU 建议</span>
                    <span className="text-[11px] text-white font-medium">{data.requirements.gpu}</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">显存需求</span>
                    <span className="text-[11px] text-white font-medium">{data.requirements.vram}</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">操作系统</span>
                    <span className="text-[11px] text-white font-medium">{data.requirements.platform}</span>
                 </div>
              </div>
              <div className="pt-4 mt-2 border-t border-white/5">
                <div className="text-[9px] text-slate-500 font-bold uppercase mb-2">核心优化技术</div>
                <div className="flex flex-wrap gap-2">
                  {data.optimizations.map(opt => (
                    <span key={opt} className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded text-[9px] font-bold border border-indigo-500/20">{opt}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Launch Console Simulation Area */}
            <div className="p-6 bg-slate-900 border border-white/10 rounded-3xl space-y-4">
              <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                <div className="flex items-center gap-2"><Play className="w-4 h-4 text-blue-400" /> 模拟启动环境</div>
                <button 
                  onClick={simulateLaunch}
                  disabled={isLaunching}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-30 rounded-lg text-[9px] font-bold text-white transition-all"
                >
                  EXECUTE
                </button>
              </h5>
              <div className="h-40 bg-black/50 rounded-xl border border-white/5 p-4 font-mono text-[10px] text-slate-300 overflow-y-auto custom-scrollbar space-y-1">
                 {consoleLogs.length === 0 ? (
                   <span className="text-slate-700 italic">Ready to launch...</span>
                 ) : (
                   consoleLogs.map((log, idx) => (
                     <div key={idx} className="animate-in fade-in slide-in-from-left-2 flex gap-2">
                        <span className="text-blue-500">$</span> {log}
                     </div>
                   ))
                 )}
                 {isLaunching && <div className="w-1.5 h-3 bg-blue-500 animate-pulse inline-block ml-4" />}
              </div>
            </div>
          </div>

          {/* Key Parameters Table */}
          <div className="p-8 bg-slate-900 border border-white/10 rounded-3xl overflow-hidden relative">
             <div className="absolute top-0 right-0 p-6 opacity-10">
               <Settings className="w-24 h-24" />
             </div>
             <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">关键调参指南 (Parameter Tuning)</h5>
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="border-b border-white/5">
                     <th className="py-3 px-2 text-[10px] font-bold text-slate-500 uppercase">参数名称</th>
                     <th className="py-3 px-2 text-[10px] font-bold text-slate-500 uppercase">默认/推荐值</th>
                     <th className="py-3 px-2 text-[10px] font-bold text-slate-500 uppercase">影响说明</th>
                   </tr>
                 </thead>
                 <tbody>
                   {data.keyParams.map(param => (
                     <tr key={param.name} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                       <td className="py-4 px-2 font-mono text-xs text-indigo-400">{param.name}</td>
                       <td className="py-4 px-2 font-mono text-xs text-white">{param.value}</td>
                       <td className="py-4 px-2 text-[11px] text-slate-400 leading-relaxed">{param.desc}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        </div>

        {/* Right: Command Preview & Explanation */}
        <div className="xl:col-span-5 space-y-6">
          <div className="p-8 bg-slate-950 rounded-3xl border border-white/10 flex flex-col h-full shadow-2xl relative">
            <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-6">
              <Terminal className="w-4 h-4 text-blue-400" /> CLI 启动指令预览
            </h5>
            
            <div className="flex-1 space-y-6">
               <div className="relative group">
                 <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Copy className="w-4 h-4 text-slate-600 cursor-pointer hover:text-white" />
                 </div>
                 <pre className="p-6 bg-black/40 border border-white/5 rounded-2xl text-[11px] font-mono leading-relaxed text-indigo-300 overflow-x-auto">
                    {data.launchCmd}
                 </pre>
               </div>

               <div className="space-y-4">
                 <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                    <Info className="w-4 h-4 text-blue-400" /> 框架选型深度解析
                 </div>
                 <div className="p-5 bg-white/5 rounded-2xl border border-white/5 text-xs text-slate-400 leading-relaxed space-y-3">
                    <p>{data.desc}</p>
                    <div className="p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-xl">
                      <span className="font-bold text-indigo-300">适用场景：</span>{data.bestFor}
                    </div>
                 </div>
               </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
               <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                  <div className="flex items-center gap-2 text-emerald-400 mb-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase">框架优势</span>
                  </div>
                  <p className="text-[9px] text-slate-500 leading-relaxed">
                    {data.id === 'vllm' ? '极高的并行处理能力和稳定的显存管理。' : 
                     data.id === 'sglang' ? '复杂的逻辑控制流和图解译码性能。' : 
                     data.id === 'ollama' ? '极致的便捷性，一行命令运行 Llama 3。' : 
                     '完善的分布式后端调度和模型全生命周期管理。'}
                  </p>
               </div>
               <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
                  <div className="flex items-center gap-2 text-amber-400 mb-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase">已知瓶颈</span>
                  </div>
                  <p className="text-[9px] text-slate-500 leading-relaxed">
                    {data.id === 'vllm' ? '显存占用固定且高，不支持 CPU 推理。' : 
                     data.id === 'sglang' ? '主要针对 NVIDIA 显卡优化，代码较新波动大。' : 
                     data.id === 'ollama' ? '不支持大规模分布式和高度自定义调优。' : 
                     '性能上限取决于调用的底层后端。'}
                  </p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrameworkSim;
