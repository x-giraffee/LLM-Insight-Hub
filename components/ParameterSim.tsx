
import React, { useState } from 'react';
import { Layers, Database, HardDrive } from 'lucide-react';

const ParameterSim: React.FC = () => {
  const [params, setParams] = useState(7); // default 7B

  const getMemoryReq = (p: number) => {
    // Basic rule: 1B params ≈ 2GB in FP16, ≈ 1GB in INT8, ≈ 0.5GB in INT4
    const fp16 = p * 2;
    const int8 = p * 1;
    const int4 = p * 0.5;
    return { fp16, int8, int4 };
  };

  const mem = getMemoryReq(params);

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-indigo-400">大模型的“脑容量”</h3>
          <p className="text-slate-400 leading-relaxed">
            <b>参数 (Parameters)</b> 是神经网络中的权重和偏置。简单来说，它们就像大脑中的神经元连接。
            <b>“B” (Billion)</b> 代表十亿。例如 7B 就是 70亿参数量。
          </p>
          
          <div className="space-y-4 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-300">调整模型参数量 (B)</span>
              <span className="text-2xl font-bold text-indigo-500">{params}B</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="1024" 
              step="1"
              value={params}
              onChange={(e) => setParams(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>NANO (1B)</span>
              <span>MEDIUM (70B)</span>
              <span>GIANT (1024B)</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-slate-900/50 rounded-xl border border-white/5 space-y-4">
            <h4 className="flex items-center gap-2 font-bold text-slate-200">
              <HardDrive className="w-4 h-4 text-emerald-400" />
              显存占用估算 (VRAM)
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">FP16 (标准精度)</span>
                <span className="text-sm font-mono text-emerald-400 font-bold">{mem.fp16.toFixed(1)} GB</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, mem.fp16 / 40)}%` }} />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400">INT8 (量化)</span>
                <span className="text-sm font-mono text-blue-400 font-bold">{mem.int8.toFixed(1)} GB</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: `${Math.min(100, mem.int8 / 40)}%` }} />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400">INT4 (深度量化)</span>
                <span className="text-sm font-mono text-purple-400 font-bold">{mem.int4.toFixed(1)} GB</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500" style={{ width: `${Math.min(100, mem.int4 / 40)}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-6">
        <div className="flex gap-4">
          <div className="shrink-0">
            <Database className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h4 className="font-bold text-indigo-300 mb-1">推理与训练的关系</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              <b>训练 (Training)</b> 就像是学习过程，模型通过海量数据更新参数。这是一个极其昂贵的计算过程（需要成千上万个 GPU）。
              <b>推理 (Inference)</b> 就像是考试过程，模型参数固定，根据你的提问实时计算结果。我们通常使用的 ChatGPT 就是推理过程。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParameterSim;
