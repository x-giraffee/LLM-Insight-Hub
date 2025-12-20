
import React, { useState } from 'react';
import { Box, Sliders, AlertCircle } from 'lucide-react';

const QuantizationSim: React.FC = () => {
  const [precision, setPrecision] = useState<'fp16' | 'int8' | 'int4'>('fp16');

  const configs = {
    fp16: {
      bits: 16,
      loss: "无损",
      speed: "1x",
      color: "text-emerald-400",
      bg: "bg-emerald-500",
      vram: "100%",
      desc: "深度神经网络训练和全精度推理的标准。每个权重占用 2 字节。"
    },
    int8: {
      bits: 8,
      loss: "轻微（<1%）",
      speed: "1.8x",
      color: "text-blue-400",
      bg: "bg-blue-500",
      vram: "50%",
      desc: "广泛应用于端侧设备和云端加速推理。每个权重占用 1 字节。"
    },
    int4: {
      bits: 4,
      loss: "中等（1-3%）",
      speed: "3x",
      color: "text-purple-400",
      bg: "bg-purple-500",
      vram: "25%",
      desc: "极限压缩，使得 70B 模型甚至能在普通个人电脑上运行。每个权重仅占 0.5 字节。"
    }
  };

  const current = configs[precision];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-10">
        <div className="flex-1 space-y-6">
          <h3 className="text-2xl font-bold">量化：给权重“瘦身”</h3>
          <p className="text-slate-400 leading-relaxed">
            量化 (Quantization) 是将高精度浮点数映射到低位宽整数的过程。它像视频压缩一样，牺牲一点精度来换取巨大的存储和速度收益。
          </p>

          <div className="grid grid-cols-3 gap-3">
            {(['fp16', 'int8', 'int4'] as const).map(p => (
              <button 
                key={p}
                onClick={() => setPrecision(p)}
                className={`p-4 rounded-xl border text-center transition-all ${precision === p ? 'bg-white/10 border-white/30' : 'bg-transparent border-white/5 opacity-50'}`}
              >
                <div className={`text-lg font-bold ${configs[p].color}`}>{p.toUpperCase()}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase">{configs[p].bits} Bits</div>
              </button>
            ))}
          </div>

          <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">资源占用 (VRAM)</span>
              <span className={`text-sm font-bold ${current.color}`}>{current.vram}</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full">
              <div className={`h-full rounded-full transition-all duration-500 ${current.bg}`} style={{ width: current.vram }} />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-white/5 p-3 rounded-lg">
                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">推理速度</div>
                <div className="text-lg font-bold">{current.speed}</div>
              </div>
              <div className="bg-white/5 p-3 rounded-lg">
                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">精度损耗</div>
                <div className="text-lg font-bold">{current.loss}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-80 space-y-4">
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <h4 className="flex items-center gap-2 font-bold text-amber-500 text-sm mb-2">
              <AlertCircle className="w-4 h-4" />
              为什么我们需要它？
            </h4>
            <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
              <li>降低推理显存门槛</li>
              <li>提高 Token 每秒生成速度</li>
              <li>减少模型部署成本</li>
              <li>赋能手机、电脑等本地 AI 运行</li>
            </ul>
          </div>
          
          <div className="relative aspect-square bg-slate-900 rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center p-8">
            <div className="grid grid-cols-4 gap-2 opacity-30">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className={`w-8 h-8 rounded-sm ${current.bg}`} />
              ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
               <Box className={`w-16 h-16 ${current.color} drop-shadow-2xl animate-pulse`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuantizationSim;
