
import React from 'react';
import { 
  Zap, 
  Cpu, 
  Activity, 
  Layers, 
  Maximize, 
  MessageSquare, 
  Link as LinkIcon, 
  Eye, 
  Mic,
  Workflow,
  Hash,
  Binary,
  FlaskConical,
  Scale,
  Network,
  BookOpen,
  Bot,
  Microscope,
  TerminalSquare,
  Globe,
  Smartphone,
  GraduationCap,
  Grid3X3,
  GitBranch,
  RefreshCw,
  Rocket,
  Database,
  HelpCircle,
  Search,
  Split,
  Copy,
  Server,
  Cloud,
  Scissors,
  FastForward,
  Microchip
} from 'lucide-react';
import { Module, ModuleCategory } from './types';
import ParameterSim from './components/ParameterSim';
import MetricsSim from './components/MetricsSim';
import ContextWindowSim from './components/ContextWindowSim';
import QuantizationSim from './components/QuantizationSim';
import MCPSim from './components/MCPSim';
import EmbeddingSim from './components/EmbeddingSim';
import TokenizationLab from './components/TokenizationLab';
import PrecisionLab from './components/PrecisionLab';
import ServiceWorkflowSim from './components/ServiceWorkflowSim';
import ComparisonSim from './components/ComparisonSim';
import RAGWorkflowSim from './components/RAGWorkflowSim';
import AgentWorkflowSim from './components/AgentWorkflowSim';
import OpenAPISim from './components/OpenAPISim';
import TrainingSim from './components/TrainingSim';
import FrameworkSim from './components/FrameworkSim';
import ChinaModelLandscape from './components/ChinaModelLandscape';
import SmallModelLandscape from './components/SmallModelLandscape';
import LearningParadigmsSim from './components/LearningParadigmsSim';
import TransformerSim from './components/TransformerSim';
import AttentionComplexitySim from './components/AttentionComplexitySim';
import RadixAttentionSim from './components/RadixAttentionSim';
import TrainingInferenceSim from './components/TrainingInferenceSim';
import EagleSpeculativeSim from './components/EagleSpeculativeSim';
import KVCacheSim from './components/KVCacheSim';
import QCacheAbsenceSim from './components/QCacheAbsenceSim';
import QKVConceptSim from './components/QKVConceptSim';
import RetrievalSpeculativeSim from './components/RetrievalSpeculativeSim';
import GPUDirectSim from './components/GPUDirectSim';
import LMCacheSim from './components/LMCacheSim';
import ChunkSchedulingSim from './components/ChunkSchedulingSim';
import PrefillDecodeSim from './components/PrefillDecodeSim';
import CacheRoutingSim from './components/CacheRoutingSim';
import MoEKernelSim from './components/MoEKernelSim';

export const APP_MODULES: Module[] = [
  {
    id: 'params',
    title: '参数与显存',
    description: '理解大语言模型的参数量与其对硬件资源的要求。',
    category: ModuleCategory.FUNDAMENTALS,
    icon: <Database className="w-4 h-4" />,
    content: <ParameterSim />
  },
  {
    id: 'tokenization',
    title: '分词实验室',
    description: '探索模型如何将文本拆分为 Token。',
    category: ModuleCategory.FUNDAMENTALS,
    icon: <Hash className="w-4 h-4" />,
    content: <TokenizationLab />
  },
  {
    id: 'embeddings',
    title: '词向量空间',
    description: '可视化文本如何转化为高维空间中的数值向量。',
    category: ModuleCategory.FUNDAMENTALS,
    icon: <Layers className="w-4 h-4" />,
    content: <EmbeddingSim />
  },
  {
    id: 'prefill-decode',
    title: 'Prefill 与 Decode',
    description: '揭秘推理过程的两个阶段：为什么首字慢，后续快？',
    category: ModuleCategory.FUNDAMENTALS,
    icon: <FastForward className="w-4 h-4" />,
    content: <PrefillDecodeSim />
  },
  {
    id: 'transformer',
    title: 'Transformer 架构',
    description: '深入理解注意力机制与并行计算的威力。',
    category: ModuleCategory.ARCHITECTURE,
    icon: <Network className="w-4 h-4" />,
    content: <TransformerSim />
  },
  {
    id: 'qkv-deepdive',
    title: 'Q / K / V 详解',
    description: '揭秘 Query, Key, Value 的设计灵感与解耦魅力。',
    category: ModuleCategory.ARCHITECTURE,
    icon: <Split className="w-4 h-4" />,
    content: <QKVConceptSim />
  },
  {
    id: 'attn-complexity',
    title: '注意力复杂度',
    description: '可视化 O(N²) 复杂度对长文本处理的挑战。',
    category: ModuleCategory.ARCHITECTURE,
    icon: <Grid3X3 className="w-4 h-4" />,
    content: <AttentionComplexitySim />
  },
  {
    id: 'training-inference',
    title: '训练与推理',
    description: '对比模型学习阶段与应用阶段的差异。',
    category: ModuleCategory.FUNDAMENTALS,
    icon: <GraduationCap className="w-4 h-4" />,
    content: <TrainingInferenceSim />
  },
  {
    id: 'moe-kernel',
    title: 'MoE 算子优化',
    description: '深入 GPU 内部，揭秘 Triton 如何加速专家模型推理。',
    category: ModuleCategory.PERFORMANCE,
    icon: <Microchip className="w-4 h-4" />,
    content: <MoEKernelSim />
  },
  {
    id: 'metrics',
    title: '性能指标',
    description: '实测 TTFT、TPS 等关键大模型性能参数。',
    category: ModuleCategory.PERFORMANCE,
    icon: <Activity className="w-4 h-4" />,
    content: <MetricsSim />
  },
  {
    id: 'quantization',
    title: '模型量化',
    description: '了解如何通过牺牲微小精度换取巨大的速度提升。',
    category: ModuleCategory.PERFORMANCE,
    icon: <Zap className="w-4 h-4" />,
    content: <QuantizationSim />
  },
  {
    id: 'precision',
    title: '参数精度',
    description: '对比 FP16, BF16, INT8 等不同的数值表示方法。',
    category: ModuleCategory.PERFORMANCE,
    icon: <Scale className="w-4 h-4" />,
    content: <PrecisionLab />
  },
  {
    id: 'kv-cache',
    title: 'KV Cache 机制',
    description: '深度理解推理加速的核心——空间换时间。',
    category: ModuleCategory.PERFORMANCE,
    icon: <RefreshCw className="w-4 h-4" />,
    content: <KVCacheSim />
  },
  {
    id: 'chunk-scheduling',
    title: '分块调度优化',
    description: 'Chunked Prefill：如何在处理长文本时兼顾低延迟。',
    category: ModuleCategory.PERFORMANCE,
    icon: <Scissors className="w-4 h-4" />,
    content: <ChunkSchedulingSim />
  },
  {
    id: 'cache-routing',
    title: '语义感知路由',
    description: '拒绝缓存颠簸：如何通过场景识别提升 Cache 命中率。',
    category: ModuleCategory.PERFORMANCE,
    icon: <Split className="w-4 h-4" />,
    content: <CacheRoutingSim />
  },
  {
    id: 'lmcache',
    title: 'LMCache 共享',
    description: 'LLM 的"Redis"：如何实现 KV Cache 的跨节点共享。',
    category: ModuleCategory.PERFORMANCE,
    icon: <Cloud className="w-4 h-4" />,
    content: <LMCacheSim />
  },
  {
    id: 'gpudirect',
    title: 'GPUDirect P2P',
    description: '多卡通信原理：为什么 PIX 优于 SYS？',
    category: ModuleCategory.PERFORMANCE,
    icon: <Server className="w-4 h-4" />,
    content: <GPUDirectSim />
  },
  {
    id: 'q-cache',
    title: 'Q 缓存之谜',
    description: '为什么我们只存 KV 却不存 Q？揭开数学背后的真相。',
    category: ModuleCategory.ARCHITECTURE,
    icon: <HelpCircle className="w-4 h-4" />,
    content: <QCacheAbsenceSim />
  },
  {
    id: 'radix-attention',
    title: 'RadixAttention',
    description: 'SGLang 中的前缀缓存优化技术。',
    category: ModuleCategory.ARCHITECTURE,
    icon: <GitBranch className="w-4 h-4" />,
    content: <RadixAttentionSim />
  },
  {
    id: 'eagle',
    title: '投机采样 EAGLE',
    description: '探索 EAGLE-3 如何实现 5x 以上的推理加速。',
    category: ModuleCategory.PERFORMANCE,
    icon: <Zap className="w-4 h-4" />,
    content: <EagleSpeculativeSim />
  },
  {
    id: 'retrieval-spec',
    title: '检索投机推理',
    description: 'Prompt Lookup: 不用模型也能猜对下一个词？',
    category: ModuleCategory.PERFORMANCE,
    icon: <Copy className="w-4 h-4" />,
    content: <RetrievalSpeculativeSim />
  },
  {
    id: 'context-window',
    title: '上下文窗口',
    description: '模拟模型记忆极限与 Token 消耗情况。',
    category: ModuleCategory.FUNDAMENTALS,
    icon: <Maximize className="w-4 h-4" />,
    content: <ContextWindowSim />
  },
  {
    id: 'rag',
    title: 'RAG 架构',
    description: '检索增强生成：让 AI 访问私有知识库。',
    category: ModuleCategory.ARCHITECTURE,
    icon: <Search className="w-4 h-4" />,
    content: <RAGWorkflowSim />
  },
  {
    id: 'mcp',
    title: 'MCP 协议',
    description: '模型上下文协议：连接 AI 与外部工具的标准。',
    category: ModuleCategory.ECOSYSTEM,
    icon: <LinkIcon className="w-4 h-4" />,
    content: <MCPSim />
  },
  {
    id: 'agents',
    title: '智能体协作',
    description: '多 Agent 编排：解决复杂任务的新范式。',
    category: ModuleCategory.ARCHITECTURE,
    icon: <Bot className="w-4 h-4" />,
    content: <AgentWorkflowSim />
  },
  {
    id: 'openapi',
    title: 'OpenAPI 接口',
    description: '学习标准的大模型 API 调用协议。',
    category: ModuleCategory.ECOSYSTEM,
    icon: <Globe className="w-4 h-4" />,
    content: <OpenAPISim />
  },
  {
    id: 'training',
    title: '模型微调',
    description: '从预训练到 LoRA：模型的进化之路。',
    category: ModuleCategory.FUNDAMENTALS,
    icon: <FlaskConical className="w-4 h-4" />,
    content: <TrainingSim />
  },
  {
    id: 'paradigms',
    title: '学习范式',
    description: '对比监督学习、RLHF 与可验证奖励学习。',
    category: ModuleCategory.FUNDAMENTALS,
    icon: <Microscope className="w-4 h-4" />,
    content: <LearningParadigmsSim />
  },
  {
    id: 'frameworks',
    title: '推理引擎',
    description: '对比 vLLM, SGLang, Ollama 等主流框架。',
    category: ModuleCategory.PERFORMANCE,
    icon: <Rocket className="w-4 h-4" />,
    content: <FrameworkSim />
  },
  {
    id: 'cn-landscape',
    title: '国产模型版图',
    description: '了解 DeepSeek, Qwen, Kimi 等国产大模型现状。',
    category: ModuleCategory.ECOSYSTEM,
    icon: <Globe className="w-4 h-4" />,
    content: <ChinaModelLandscape />
  },
  {
    id: 'small-models',
    title: '高效小模型',
    description: '在端侧设备上流畅运行的 AI 模型。',
    category: ModuleCategory.ECOSYSTEM,
    icon: <Smartphone className="w-4 h-4" />,
    content: <SmallModelLandscape />
  },
  {
    id: 'service-workflow',
    title: '业务全链路',
    description: '从资源预估到硬件部署的决策仿真。',
    category: ModuleCategory.PERFORMANCE,
    icon: <Workflow className="w-4 h-4" />,
    content: <ServiceWorkflowSim />
  },
  {
    id: 'comparison',
    title: '新老技术对比',
    description: '传统深度学习与大模型时代的差异。',
    category: ModuleCategory.FUNDAMENTALS,
    icon: <Scale className="w-4 h-4" />,
    content: <ComparisonSim />
  }
];
