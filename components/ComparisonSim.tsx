
import React from 'react';
import { Check, X, MoveRight, Eye, Mic, Brain } from 'lucide-react';

const ComparisonSim: React.FC = () => {
  const comparisons = [
    {
      feature: 'OCR (文档解析)',
      traditional: '基于规则/模板。只能提取文本，无法理解段落逻辑和情感。',
      llm: '基于视觉语义。不仅能提取，还能直接摘要、翻译和转换格式。',
      tech: 'Tesseract/EasyOCR vs. LayoutLM/GPT-4o'
    },
    {
      feature: '语音识别 (ASR)',
      traditional: '声学+语言模型拼接。转写准确率受口音干扰大，无法实时纠错。',
      llm: '端到端多模态。具备强大的上下文推理，即使背景嘈杂也能“猜出”正确词义。',
      tech: 'Kaldi/PocketSphinx vs. Whisper/Gemini Audio'
    },
    {
      feature: '泛化能力',
      traditional: '单一任务模型。OCR 模型无法进行对话。',
      llm: '通用推理机。一个模型同时处理文本、图像、语音和代码。',
      tech: 'Specific Models vs. Generalist LLMs'
    }
  ];

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all group">
          <Eye className="w-8 h-8 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
          <h4 className="text-lg font-bold mb-2">多模态大模型 (LMM)</h4>
          <p className="text-sm text-slate-400 leading-relaxed">
            LMM 并不是简单的“大语言模型 + 眼睛”。它是在预训练阶段就同时吸收了视觉、音频和文本信号的模型，具备跨模态的统一理解力。
          </p>
        </div>
        <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all group">
          <Brain className="w-8 h-8 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
          <h4 className="text-lg font-bold mb-2">大语言模型 (LLM)</h4>
          <p className="text-sm text-slate-400 leading-relaxed">
            核心是 Transformer 架构，专精于文本序列的生成。它是所有现代多模态模型的“大脑”底座。
          </p>
        </div>
        <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/5 hover:border-pink-500/30 transition-all group">
          <Mic className="w-8 h-8 text-pink-400 mb-4 group-hover:scale-110 transition-transform" />
          <h4 className="text-lg font-bold mb-2">原生多模态 vs 级联</h4>
          <p className="text-sm text-slate-400 leading-relaxed">
            传统是将 ASR 结果喂给 LLM（级联）。现代原生模型直接处理音频波形（如 Gemini 2.0），响应更快，语义更准。
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              <th className="py-4 px-4 text-sm font-bold text-slate-500 uppercase">能力维度</th>
              <th className="py-4 px-4 text-sm font-bold text-slate-500 uppercase bg-slate-900/30">传统小模型 (Deep Learning 1.0)</th>
              <th className="py-4 px-4 text-sm font-bold text-indigo-400 uppercase bg-indigo-500/5">大模型时代 (Foundation Models)</th>
            </tr>
          </thead>
          <tbody>
            {comparisons.map((item, idx) => (
              <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="py-6 px-4 font-bold text-slate-200">{item.feature}</td>
                <td className="py-6 px-4 text-sm text-slate-400 bg-slate-900/30 leading-relaxed">{item.traditional}</td>
                <td className="py-6 px-4 text-sm text-slate-300 bg-indigo-500/5 leading-relaxed font-medium">
                  <div className="flex gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded text-[10px] font-bold">NEXT GEN</span>
                  </div>
                  {item.llm}
                  <div className="mt-3 text-[10px] font-mono text-slate-500">关键技术: {item.tech}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparisonSim;
