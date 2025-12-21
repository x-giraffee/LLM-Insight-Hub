
import React, { useState } from 'react';
import { 
  Smartphone, Laptop, Zap, Battery, 
  Microchip, Box, ArrowDown, Gauge,
  WifiOff, Layers, Scale, ShieldCheck,
  Eye, FileText, Music, Image as ImageIcon,
  Search, Mic, Database, ScanText
} from 'lucide-react';

type Category = 'llm' | 'vision' | 'rag' | 'audio' | 'genai';

interface SmallModel {
  id: string;
  name: string;
  org: string;
  size: string;
  vram: string; // FP16/INT4 estimated
  target: 'Mobile' | 'Laptop' | 'Edge' | 'Server';
  desc: string;
  category: Category;
  tags: string[];
  color: string;
}

const MODELS_DATA: SmallModel[] = [
  // --- LLM ---
  {
    id: 'phi3',
    name: 'Phi-3.5 Mini',
    org: 'Microsoft',
    size: '3.8B',
    vram: '≈ 2.5GB (INT4)',
    target: 'Mobile',
    category: 'llm',
    desc: '微软“小而美”的巅峰之作。通过高质量教科书数据训练，3.8B 参数在推理和逻辑题上的表现堪比 Llama-3-8B，是手机端部署的首选。',
    tags: ['逻辑推理', '长上下文'],
    color: 'blue'
  },
  {
    id: 'gemma2',
    name: 'Gemma 2 2B',
    org: 'Google',
    size: '2.6B',
    vram: '≈ 1.8GB (INT4)',
    target: 'Mobile',
    category: 'llm',
    desc: '谷歌 Gemini 技术的轻量化下放。2B 版本专为端侧设计，响应速度极快，适合作为手机上的即时翻译、摘要助手。',
    tags: ['Google生态', '高速'],
    color: 'emerald'
  },
  {
    id: 'qwen2.5',
    name: 'Qwen2.5-3B',
    org: 'Alibaba Cloud',
    size: '3B',
    vram: '≈ 2.0GB (INT4)',
    target: 'Mobile',
    category: 'llm',
    desc: '在 3B 尺寸下的最强编码与指令跟随模型。完美平衡了体积与智力，能在中端手机芯片上流畅运行 RAG 应用。',
    tags: ['Coding', '多语言'],
    color: 'indigo'
  },
  {
    id: 'llama3.2',
    name: 'Llama 3.2 3B',
    org: 'Meta',
    size: '3.2B',
    vram: '≈ 2.2GB (INT4)',
    target: 'Mobile',
    category: 'llm',
    desc: 'Meta 专门为端侧优化的轻量版。支持 128k 上下文，具备强大的多语言处理能力，是安卓生态系统的标准基座。',
    tags: ['工业标准', '生态丰富'],
    color: 'orange'
  },

  // --- Vision & OCR ---
  {
    id: 'florence2',
    name: 'Florence-2',
    org: 'Microsoft',
    size: '0.2B / 0.8B',
    vram: '< 1GB',
    target: 'Edge',
    category: 'vision',
    desc: '不可思议的小巧全能视觉模型。支持 OCR、目标检测、分割、Caption 等多种任务，速度极快，适合在树莓派等边缘设备运行。',
    tags: ['Unified Vision', 'OCR'],
    color: 'cyan'
  },
  {
    id: 'got-ocr',
    name: 'GOT-OCR 2.0',
    org: 'StepFun',
    size: '580M',
    vram: '≈ 1GB',
    target: 'Laptop',
    category: 'vision',
    desc: '新一代通用 OCR 模型。专门针对数学公式、乐谱、几何图形和图表进行了优化，文档解析能力远超传统 OCR 引擎。',
    tags: ['文档解析', 'LaTeX'],
    color: 'slate'
  },
  {
    id: 'qwen2-vl',
    name: 'Qwen2-VL-2B',
    org: 'Alibaba Cloud',
    size: '2B',
    vram: '≈ 1.5GB (INT4)',
    target: 'Mobile',
    category: 'vision',
    desc: '可以塞进手机的 VLM。支持长视频理解（20分钟以上）和复杂视觉推理，是端侧多模态交互的理想选择。',
    tags: ['视频理解', 'VLM'],
    color: 'violet'
  },

  // --- RAG (Embedding & Rerank) ---
  {
    id: 'bge-m3',
    name: 'BGE-M3',
    org: 'BAAI (智源)',
    size: '567M',
    vram: '≈ 1.2GB',
    target: 'Server',
    category: 'rag',
    desc: '目前最强的开源 Embedding 模型之一。支持多语言（Multi-Lingual）、多功能（Multi-Functionality）和多粒度（Multi-Granularity）。',
    tags: ['Embedding', 'SOTA'],
    color: 'blue'
  },
  {
    id: 'bge-reranker',
    name: 'BGE-Reranker-v2',
    org: 'BAAI (智源)',
    size: '567M',
    vram: '≈ 1.2GB',
    target: 'Server',
    category: 'rag',
    desc: 'RAG 系统必备的精排模型。用于对检索回来的文档进行二次打分排序，能显著提升最终回答的准确性。',
    tags: ['Rerank', 'RAG'],
    color: 'indigo'
  },
  {
    id: 'jina-v3',
    name: 'Jina-Embeddings-v3',
    org: 'Jina AI',
    size: '570M',
    vram: '≈ 1GB',
    target: 'Server',
    category: 'rag',
    desc: '支持 Matryoshka 表征学习，可以根据需求弹性调整向量维度（如 256 到 1024 维），完美平衡存储成本与精度。',
    tags: ['弹性维度', '8k Context'],
    color: 'rose'
  },

  // --- Audio (TTS & ASR) ---
  {
    id: 'whisper-turbo',
    name: 'Whisper Turbo',
    org: 'OpenAI',
    size: '809M',
    vram: '≈ 2GB',
    target: 'Server',
    category: 'audio',
    desc: 'OpenAI 官方推出的极致优化版。在保持 Large-v3 级识别精度的同时，推理速度提升了 8 倍，适合实时字幕生成。',
    tags: ['ASR', '实时转写'],
    color: 'emerald'
  },
  {
    id: 'chattts',
    name: 'ChatTTS',
    org: '2Noise',
    size: '700M',
    vram: '≈ 1.5GB',
    target: 'Laptop',
    category: 'audio',
    desc: '专为对话场景设计的 TTS。能自动生成笑声、停顿、口癖等副语言特征，声音拟人度极高，适合做数字人配音。',
    tags: ['TTS', '超拟人'],
    color: 'amber'
  },
  {
    id: 'sensevoice',
    name: 'SenseVoice',
    org: 'Alibaba / FunAudio',
    size: '300M',
    vram: '< 1GB',
    target: 'Edge',
    category: 'audio',
    desc: '极速语音理解模型。不仅能识别语音内容，还能识别情感（开心/悲伤）和音频事件（音乐/掌声），延迟极低。',
    tags: ['ASR', '情感识别'],
    color: 'orange'
  },

  // --- GenAI (Image) ---
  {
    id: 'sdxs',
    name: 'SDXS-512',
    org: 'IDKiro',
    size: '< 1GB',
    vram: '≈ 1GB',
    target: 'Edge',
    category: 'genai',
    desc: '实时文生图模型。基于 Stable Diffusion 蒸馏，在普通显卡上可达 100 FPS，实现“打字即出图”的流畅体验。',
    tags: ['实时生成', 'LCM'],
    color: 'pink'
  },
  {
    id: 'flux-schnell',
    name: 'Flux.1 Schnell (Q)',
    org: 'Black Forest Labs',
    size: '12B -> 3GB (INT4)',
    vram: '≈ 4GB',
    target: 'Laptop',
    category: 'genai',
    desc: '当前最强开源画图模型 Flux 的 4步蒸馏版。经过 INT4 量化后，可在 MacBook 或 8G 显存的 PC 上运行，画质惊人。',
    tags: ['SOTA画质', '文本渲染'],
    color: 'fuchsia'
  }
];

const CATEGORIES: { id: Category; label: string; icon: any }[] = [
  { id: 'llm', label: '端侧语言模型 (SLM)', icon: <Smartphone className="w-4 h-4" /> },
  { id: 'vision', label: '视觉与文档 (OCR)', icon: <Eye className="w-4 h-4" /> },
  { id: 'rag', label: '检索与向量 (RAG)', icon: <Database className="w-4 h-4" /> },
  { id: 'audio', label: '语音交互 (Audio)', icon: <Mic className="w-4 h-4" /> },
  { id: 'genai', label: '生成式绘图 (GenAI)', icon: <ImageIcon className="w-4 h-4" /> },
];

const SmallModelLandscape: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Category>('llm');

  const filteredModels = MODELS_DATA.filter(m => m.category === activeTab);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-full text-[9px] font-bold border border-emerald-500/20 tracking-widest uppercase">Efficient AI Gallery</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
            高效能小模型风云榜
          </h2>
        </div>
        <div className="flex gap-4 text-xs text-slate-500 font-medium">
           <div className="flex items-center gap-1.5">
             <WifiOff className="w-4 h-4" /> 离线可用
           </div>
           <div className="flex items-center gap-1.5">
             <Battery className="w-4 h-4" /> 低功耗
           </div>
           <div className="flex items-center gap-1.5">
             <ShieldCheck className="w-4 h-4" /> 隐私安全
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border
              ${activeTab === cat.id 
                ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg' 
                : 'bg-slate-900 border-white/5 text-slate-400 hover:bg-white/5'}`}
          >
            {cat.icon}
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModels.map((model) => (
          <div key={model.id} className="group p-6 bg-slate-900 border border-white/10 rounded-3xl hover:border-emerald-500/30 transition-all hover:-translate-y-1 hover:shadow-2xl flex flex-col animate-in fade-in slide-in-from-bottom-2">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl bg-${model.color}-500/10 text-${model.color}-400 border border-${model.color}-500/20`}>
                  {model.category === 'vision' ? <ScanText className="w-5 h-5" /> : 
                   model.category === 'audio' ? <Music className="w-5 h-5" /> :
                   model.category === 'rag' ? <Search className="w-5 h-5" /> :
                   model.category === 'genai' ? <ImageIcon className="w-5 h-5" /> :
                   <Box className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-100">{model.name}</h3>
                  <div className="text-[10px] text-slate-500">{model.org}</div>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 bg-white/5 border border-white/5 text-slate-400`}>
                {model.target === 'Mobile' ? <Smartphone className="w-3 h-3" /> : <Laptop className="w-3 h-3" />}
                {model.target}
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-6 flex-1">
              {model.desc}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
               {model.tags.map(tag => (
                 <span key={tag} className="text-[9px] px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5">
                   {tag}
                 </span>
               ))}
            </div>

            <div className="bg-black/40 rounded-xl p-3 border border-white/5 space-y-3">
               <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                    <Scale className="w-3 h-3" /> 参数量
                  </span>
                  <span className="text-xs font-mono text-white">{model.size}</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                    <Microchip className="w-3 h-3" /> 显存需求
                  </span>
                  <span className={`text-xs font-mono font-bold text-${model.color}-400`}>{model.vram}</span>
               </div>
            </div>
          </div>
        ))}
        
        {/* Special Card: Why Small? (Context sensitive) */}
        <div className="p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-3xl border border-white/10 flex flex-col justify-center space-y-4">
           <h3 className="text-lg font-bold text-white flex items-center gap-2">
             <Zap className="w-5 h-5 text-yellow-400 fill-current" /> 
             {activeTab === 'llm' ? '为什么需要小模型？' : 
              activeTab === 'vision' ? '端侧视觉的意义' :
              activeTab === 'rag' ? 'Embedding 的作用' :
              activeTab === 'audio' ? '本地语音的优势' :
              '本地生图的未来'}
           </h3>
           <ul className="space-y-3">
             <li className="flex items-start gap-2 text-xs text-slate-300">
               <ArrowDown className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
               <span><b>成本极低：</b>无需 H100 GPU，普通游戏本甚至手机 NPU 即可运行。</span>
             </li>
             <li className="flex items-start gap-2 text-xs text-slate-300">
               <Gauge className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
               <span><b>低延迟：</b>本地推理无需网络请求，{activeTab === 'audio' ? '语音交互更流畅' : '响应速度毫秒级'}。</span>
             </li>
             <li className="flex items-start gap-2 text-xs text-slate-300">
               <Layers className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
               <span><b>隐私保护：</b>{activeTab === 'rag' ? '企业私有数据不出域' : activeTab === 'audio' ? '通话录音无需上传云端' : '所有数据处理均在本地闭环'}，绝对安全。</span>
             </li>
           </ul>
        </div>
      </div>
    </div>
  );
};

export default SmallModelLandscape;
