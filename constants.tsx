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
  Bot
} from 'lucide-react';
import { Module, ModuleCategory } from './types';
import ParameterSim from './components/ParameterSim';
import MetricsSim from './components/MetricsSim';
import ComparisonSim from './components/ComparisonSim';
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
    id: 'model-comparison',
    title: '小模型 vs 大模型',
    category: ModuleCategory.ARCHITECTURE,
    icon: <Eye className="w-5 h-5" />,
    description: '传统 OCR、语音识别(ASR)与 LLM/多模态模型有什么区别？',
    content: <ComparisonSim />
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