
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
  Rocket
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

export const APP_MODULES: Module[] = [
  {
    id: 'fundamentals',
    title: '模型基础：参数与单位',
    category: ModuleCategory.FUNDAMENTALS,
    icon: <Cpu className="w-5 h-5" />,
    description: '什么是参数(Parameters)？“B”代表什么？探索大模型体积的秘密。',
    content: <ParameterSim />
  },
  {
    id: 'train-vs-inference',
    title: '训练 vs 推理',
    category: ModuleCategory.FUNDAMENTALS,
    icon: <RefreshCw className="w-5 h-5" />,
    description: '为什么对话不会改变模型？互动演示参数更新与冻结的区别。',
    content: <TrainingInferenceSim />
  },
  {
    id: 'transformer-arch',
    title: 'Transformer 架构解析',
    category: ModuleCategory.FUNDAMENTALS,
    icon: <Network className="w-5 h-5" />,
    description: '从 RNN 到 Attention：为什么 Transformer 是大模型的基石？+ 前沿架构画廊。',
    content: <TransformerSim />
  },
  {
    id: 'attention-complexity',
    title: 'Attention 复杂度 (O(N²))',
    category: ModuleCategory.FUNDAMENTALS,
    icon: <Grid3X3 className="w-5 h-5" />,
    description: '为什么长文本会爆炸？交互式演示 Scaled Dot-Product Attention 的平方级增长。',
    content: <AttentionComplexitySim />
  },
  {
    id: 'learning-paradigms',
    title: 'AI 学习范式游乐场',
    category: ModuleCategory.FUNDAMENTALS,
    icon: <GraduationCap className="w-5 h-5" />,
    description: '从监督学习到 RLVR：亲手互动演示 AI 是如何通过奖励变聪明的。',
    content: <LearningParadigmsSim />
  },
  {
    id: 'framework-lab',
    title: '推理框架实验室',
    category: ModuleCategory.PERFORMANCE,
    icon: <TerminalSquare className="w-5 h-5" />,
    description: '对比 vLLM, SGLang, Ollama 和 xinference：启动配置与调参艺术。',
    content: <FrameworkSim />
  },
  {
    id: 'radix-attention',
    title: 'RadixAttention (SGLang)',
    category: ModuleCategory.PERFORMANCE,
    icon: <GitBranch className="w-5 h-5" />,
    description: '像文件系统一样管理 KV Cache。揭秘 SGLang 如何通过前缀树实现极速复用。',
    content: <RadixAttentionSim />
  },
  {
    id: 'eagle-speculative',
    title: 'EAGLE-3 投机解码',
    category: ModuleCategory.PERFORMANCE,
    icon: <Rocket className="w-5 h-5" />,
    description: '算一次，出五个词。揭秘 EAGLE 如何利用多层特征外推实现无损 4x 加速。',
    content: <EagleSpeculativeSim />
  },
  {
    id: 'training-lab',
    title: '训练与微调实验室',
    category: ModuleCategory.ARCHITECTURE,
    icon: <Microscope className="w-5 h-5" />,
    description: '从预训练到 LoRA：模拟呼吸科专家大模型是如何“炼成”的。',
    content: <TrainingSim />
  },
  {
    id: 'agent-orchestration',
    title: 'Agent 智能体与编排',
    category: ModuleCategory.ARCHITECTURE,
    icon: <Bot className="w-5 h-5" />,
    description: '超越线性工作流：探索动态决策、多 Agent 协作与自主反思机制。',
    content: <AgentWorkflowSim />
  },
  {
    id: 'rag-workflow',
    title: 'RAG 技术全景',
    category: ModuleCategory.ARCHITECTURE,
    icon: <BookOpen className="w-5 h-5" />,
    description: '从数据清洗到向量库检索：深入理解检索增强生成的完整闭环。',
    content: <RAGWorkflowSim />
  },
  {
    id: 'tokenization-lab',
    title: 'Tokenization 实验室',
    category: ModuleCategory.FUNDAMENTALS,
    icon: <FlaskConical className="w-5 h-5" />,
    description: '模拟 DeepSeek 分词逻辑，探索文本是如何变成 Token ID 的。',
    content: <TokenizationLab />
  },
  {
    id: 'precision-lab',
    title: '数值精度实验室 (DType)',
    category: ModuleCategory.FUNDAMENTALS,
    icon: <Scale className="w-5 h-5" />,
    description: '深入理解 FP32, BF16, INT8, INT4。为什么大模型需要“降级”运行？',
    content: <PrecisionLab />
  },
  {
    id: 'tokenization-embeddings',
    title: '词向量 (Embeddings)',
    category: ModuleCategory.FUNDAMENTALS,
    icon: <Binary className="w-5 h-5" />,
    description: '从文本到向量：大模型是如何“读懂”人类文字的？',
    content: <EmbeddingSim />
  },
  {
    id: 'service-workflow',
    title: 'AI 业务全景与算力仿真',
    category: ModuleCategory.PERFORMANCE,
    icon: <Network className="w-5 h-5" />,
    description: '对比 RAG、Agent、微调等不同业务模式下的算力消耗与流程差异。',
    content: <ServiceWorkflowSim />
  },
  {
    id: 'inference-metrics',
    title: '推理性能指标 (TTFT/TPS)',
    category: ModuleCategory.PERFORMANCE,
    icon: <Activity className="w-5 h-5" />,
    description: '深入理解 TTFT、TPOT、TPS 和 E2E 延迟。',
    content: <MetricsSim />
  },
  {
    id: 'precision-quantization',
    title: '量化技术原理 (Quantization)',
    category: ModuleCategory.FUNDAMENTALS,
    icon: <Layers className="w-5 h-5" />,
    description: '精度(FP16, INT8)对模型效果和运行速度有什么影响？量化是如何减肥的？',
    content: <QuantizationSim />
  },
  {
    id: 'context-window',
    title: '上下文窗口 (Context Window)',
    category: ModuleCategory.ARCHITECTURE,
    icon: <Maximize className="w-5 h-5" />,
    description: '什么是 Token？上下文窗口长度如何决定模型的记忆能力？',
    content: <ContextWindowSim />
  },
  {
    id: 'china-models',
    title: '中国大模型全景图',
    category: ModuleCategory.ECOSYSTEM,
    icon: <Globe className="w-5 h-5" />,
    description: 'DeepSeek, Qwen, GLM, Kimi, Minimax... 盘点中国主流大模型竞争力。',
    content: <ChinaModelLandscape />
  },
  {
    id: 'small-models',
    title: '端侧小模型风云榜',
    category: ModuleCategory.ECOSYSTEM,
    icon: <Smartphone className="w-5 h-5" />,
    description: 'Phi-3, Gemma, Qwen-Mobile... 适合在手机/笔记本上运行的高效模型。',
    content: <SmallModelLandscape />
  },
  {
    id: 'prompt-engineering',
    title: '提示词工程与 OpenAPI',
    category: ModuleCategory.ECOSYSTEM,
    icon: <MessageSquare className="w-5 h-5" />,
    description: 'OpenAPI 协议标准以及如何通过 Prompt 激发模型潜力。',
    content: <OpenAPISim />
  },
  {
    id: 'mcp-protocol',
    title: 'MCP 协议 (Model Context Protocol)',
    category: ModuleCategory.ECOSYSTEM,
    icon: <Workflow className="w-5 h-5" />,
    description: '让 AI 访问你的工具 and 数据。MCP 如何重新定义 AI 交互？',
    content: <MCPSim />
  }
];
