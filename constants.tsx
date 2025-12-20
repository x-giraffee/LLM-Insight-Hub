
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
  Scale
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
    id: 'precision-quantization',
    title: '量化技术原理 (Quantization)',
    category: ModuleCategory.FUNDAMENTALS,
    icon: <Layers className="w-5 h-5" />,
    description: '精度(FP16, INT8)对模型效果和运行速度有什么影响？量化是如何减肥的？',
    content: <QuantizationSim />
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
    content: (
      <div className="space-y-6">
        <section>
          <h3 className="text-xl font-bold text-blue-400 mb-2">提示词工程 (Prompt Engineering)</h3>
          <p className="text-gray-300">
            Prompt 是模型的输入，它是引导模型逻辑输出的“方向盘”。包括 Few-Shot (少样本学习)、CoT (思维链) 等技术。
          </p>
        </section>
        <section>
          <h3 className="text-xl font-bold text-purple-400 mb-2">OpenAPI 协议</h3>
          <p className="text-gray-300">
            这是大模型服务化的行业标准。它定义了诸如 `/v1/chat/completions` 的端点，使开发者能以统一的方式调用不同的模型。
          </p>
          <div className="bg-gray-900 p-4 rounded-lg mt-4 border border-gray-700">
            <code className="text-sm text-green-400">
              {`POST /v1/chat/completions\n{\n  "model": "gpt-4o",\n  "messages": [{ "role": "user", "content": "Hello!" }],\n  "stream": true\n}`}
            </code>
          </div>
        </section>
      </div>
    )
  },
  {
    id: 'mcp-protocol',
    title: 'MCP 协议 (Model Context Protocol)',
    category: ModuleCategory.ECOSYSTEM,
    icon: <Workflow className="w-5 h-5" />,
    description: '让 AI 访问你的工具和数据。MCP 如何重新定义 AI 交互？',
    content: <MCPSim />
  }
];
