
import React, { useState, useMemo } from 'react';
import { Scale, Database, Zap, AlertTriangle, Info, Terminal, Box, CheckCircle2, Binary, Calculator, Fingerprint } from 'lucide-react';

interface DType {
  id: string;
  name: string;
  bits: number;
  category: '训练' | '推理' | '传统' | '极限压缩';
  vramPerB: number; // GB per 1B params
  range: string;
  precision: string;
  color: string;
  desc: string;
  layout: { sign: number; exponent: number; mantissa: number; bias: number };
}

const DTYPES: DType[] = [
  { 
    id: 'fp32', name: 'FP32 (单精度)', bits: 32, category: '传统', 
    vramPerB: 4, range: '极高', precision: '最高', color: 'text-slate-400',
    desc: '单精度浮点数。曾是深度学习标准，但对于大模型推理来说太重了。',
    layout: { sign: 1, exponent: 8, mantissa: 23, bias: 127 }
  },
  { 
    id: 'fp16', name: 'FP16 (半精度)', bits: 16, category: '推理', 
    vramPerB: 2, range: '高', precision: '高', color: 'text-emerald-400',
    desc: '半精度浮点数。平衡了计算速度与精度，是目前推理的主流格式。',
    layout: { sign: 1, exponent: 5, mantissa: 10, bias: 15 }
  },
  { 
    id: 'bf16', name: 'BF16 (大脑浮点)', bits: 16, category: '训练', 
    vramPerB: 2, range: '与FP32一致', precision: '中', color: 'text-blue-400',
    desc: 'Google 开发。牺牲精度以获得与 FP32 相同的动态范围，防止大模型训练时梯度爆炸。',
    layout: { sign: 1, exponent: 8, mantissa: 7, bias: 127 }
  },
  { 
    id: 'fp8_e4m3', name: 'FP8 E4M3', bits: 8, category: '推理', 
    vramPerB: 1, range: '低', precision: '高', color: 'text-indigo-400',
    desc: 'H100 支持。4位指数+3位尾数，侧重推理时的数值精度。',
    layout: { sign: 1, exponent: 4, mantissa: 3, bias: 7 }
  },
  { 
    id: 'fp8_e5m2', name: 'FP8 E5M2', bits: 8, category: '推理', 
    vramPerB: 1, range: '中', precision: '低', color: 'text-cyan-400',
    desc: 'H100 支持。5位指数+2位尾数，侧重训练或需要更大动态范围的场景。',
    layout: { sign: 1, exponent: 5, mantissa: 2, bias: 15 }
  },
  { 
    id: 'int8', name: 'INT8 (8位整型)', bits: 8, category: '推理', 
    vramPerB: 1, range: '低', precision: '中', color: 'text-amber-400',
    desc: '8位整数。最常见的量化格式，能将显存减半且几乎不损失效果。',
    layout: { sign: 1, exponent: 0, mantissa: 7, bias: 0 }
  },
  { 
    id: 'fp4', name: 'FP4 (E2M1)', bits: 4, category: '极限压缩', 
    vramPerB: 0.5, range: '极窄', precision: '极低', color: 'text-rose-400',
    desc: '4位浮点数。采用 E2M1 布局，是 Blackwell 等新架构探索的更精准的 4位量化方向。',
    layout: { sign: 1, exponent: 2, mantissa: 1, bias: 1 }
  },
  { 
    id: 'int4', name: 'INT4 (4位整型)', bits: 4, category: '极限压缩', 
    vramPerB: 0.5, range: '极低', precision: '低', color: 'text-purple-400',
    desc: '极限压缩。让 70B 模型能跑在普通家用电脑（甚至手机）上的关键。',
    layout: { sign: 1, exponent: 0, mantissa: 3, bias: 0 }
  }
];

const getBitString = (num: number, type: DType): string => {
  if (type.id.startsWith('int')) {
    const maxVal = Math.pow(2, type.bits - 1) - 1;
    const minVal = -Math.pow(2, type.bits - 1);
    let val = Math.round(num * maxVal);
    val = Math.max(minVal, Math.min(maxVal, val));
    const unsignedVal = val < 0 ? (1 << type.bits) + val : val;
    return unsignedVal.toString(2).padStart(type.bits, '0');
  }

  const sign = num < 0 ? '1' : '0';
  const absNum = Math.abs(num);
  if (absNum === 0) return '0'.repeat(type.bits);

  let exponent = Math.floor(Math.log2(absNum));
  let mantissaVal = absNum / Math.pow(2, exponent) - 1;
  let biasedExponent = exponent + type.layout.bias;
  
  if (biasedExponent <= 0) {
    biasedExponent = 0;
    mantissaVal = absNum / Math.pow(2, 1 - type.layout.bias);
  } else if (biasedExponent >= Math.pow(2, type.layout.exponent)) {
    biasedExponent = Math.pow(2, type.layout.exponent) - 1;
    mantissaVal = 0;
  }

  const expBits = biasedExponent.toString(2).padStart(type.layout.exponent, '0');
  let mantBits = '';
  let m = mantissaVal;
  for (let i = 0; i < type.layout.mantissa; i++) {
    m *= 2;
    if (m >= 1) {
      mantBits += '1';
      m -= 1;
    } else {
      mantBits += '0';
    }
  }

  return sign + expBits + mantBits;
};

const BitRow: React.FC<{ type: DType; isActive: boolean; value: number }> = ({ type, isActive, value }) => {
  const bitString = useMemo(() => getBitString(value, type), [value, type]);
  
  const bitWidth = type.bits === 32 ? 'w-2.5 sm:w-3' : 'w-5 sm:w-6';
  const bitHeight = 'h-5 sm:h-6';

  const signStr = bitString.slice(0, type.layout.sign);
  const expStr = bitString.slice(type.layout.sign, type.layout.sign + type.layout.exponent);
  const mantStr = bitString.slice(type.layout.sign + type.layout.exponent);

  return (
    <div className={`space-y-2 p-3 sm:p-4 rounded-xl transition-all ${isActive ? 'bg-white/5 ring-1 ring-white/10 shadow-lg' : 'opacity-30 hover:opacity-50'}`}>
      <div className="flex justify-between items-center mb-1">
        <span className={`text-[11px] font-bold tracking-wider ${type.color}`}>{type.name}</span>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-slate-600 font-mono hidden sm:inline">布局: {type.layout.sign}-{type.layout.exponent}-{type.layout.mantissa}</span>
          <span className="text-[9px] text-slate-600 font-mono font-bold uppercase">{type.bits} bits</span>
        </div>
      </div>
      
      <div className="flex flex-nowrap gap-0.5 overflow-x-auto custom-scrollbar pb-1">
        {signStr.split('').map((bit, i) => (
          <div key={`s-${i}`} className={`flex-none ${bitWidth} ${bitHeight} bg-emerald-500/80 rounded-sm border border-emerald-400/20 flex items-center justify-center text-[9px] font-bold text-black select-none shadow-sm transition-all duration-300 ${bit === '1' ? 'brightness-125 scale-105' : 'brightness-75'}`} title="符号位">{bit}</div>
        ))}
        {expStr.split('').map((bit, i) => (
          <div key={`e-${i}`} className={`flex-none ${bitWidth} ${bitHeight} bg-rose-500/80 rounded-sm border border-rose-400/20 flex items-center justify-center text-[9px] font-bold text-black select-none shadow-sm transition-all duration-300 ${bit === '1' ? 'brightness-125 scale-105' : 'brightness-75'}`} title="指数位">{bit}</div>
        ))}
        {mantStr.split('').map((bit, i) => (
          <div key={`m-${i}`} className={`flex-none ${bitWidth} ${bitHeight} bg-blue-500/80 rounded-sm border border-blue-400/20 flex items-center justify-center text-[9px] font-bold text-black select-none shadow-sm transition-all duration-300 ${bit === '1' ? 'brightness-125 scale-105' : 'brightness-75'}`} title={type.id.startsWith('int') ? "数值位" : "尾数位"}>{bit}</div>
        ))}
      </div>

      {isActive && (
        <div className="space-y-2 pt-2 border-t border-white/5 mt-2 animate-in fade-in slide-in-from-top-1 duration-300">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-mono text-slate-400">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-emerald-500 rounded-xs" /> 
              符号: <span className="text-white">{signStr}</span>
            </div>
            {type.layout.exponent > 0 && (
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-rose-500 rounded-xs" /> 
                指数: <span className="text-white">{expStr}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-blue-500 rounded-xs" /> 
              {type.id.startsWith('int') ? '数值' : '尾数'}: <span className="text-white">{mantStr}</span>
            </div>
          </div>
          <div className="p-2 bg-black/50 rounded-lg border border-white/10 font-mono text-[10px] text-blue-400/90 break-all leading-relaxed flex gap-2">
            <span className="text-slate-600 shrink-0">流:</span> {bitString}
          </div>
        </div>
      )}
    </div>
  );
};

const PrecisionLab: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('fp16');
  const [inputValue, setInputValue] = useState<number>(3.14159);
  
  const currentType = useMemo(() => DTYPES.find(d => d.id === selectedType)!, [selectedType]);

  const quantizedValue = useMemo(() => {
    if (currentType.id === 'fp32') return inputValue;
    if (currentType.id.startsWith('int')) {
        const factor = Math.pow(2, currentType.bits - 1) - 1;
        return Math.min(1, Math.max(-1, Math.round(inputValue * factor) / factor));
    }
    const precisionMap: Record<string, number> = { 
      'fp16': 1000, 
      'bf16': 100, 
      'fp8_e4m3': 20, 
      'fp8_e5m2': 10,
      'fp4': 2 
    };
    const p = precisionMap[currentType.id] || 1000;
    return Math.round(inputValue * p) / p;
  }, [inputValue, currentType]);

  const error = Math.abs(inputValue - quantizedValue);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col xl:flex-row gap-6 items-start">
        <div className="w-full xl:flex-1 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-full text-[9px] font-bold border border-indigo-500/20 tracking-wider">交互式实验室</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-indigo-400 tracking-tight">参数精度与量化</h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
              大模型存储由亿万个<b>浮点数</b>组成的权重。精度决定了每个数字在显存中占用的格子大小及其分布。
              <br/><br/>
              <b>符号位</b>决定正负，<b>指数位</b>决定范围，<b>尾数位</b>决定精细程度。
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {DTYPES.map(type => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group
                  ${selectedType === type.id 
                    ? 'bg-indigo-600/10 border-indigo-500 shadow-xl shadow-indigo-500/10' 
                    : 'bg-white/5 border-white/5 hover:border-white/20'}`}
              >
                <div className="flex justify-between items-start mb-0.5">
                  <span className={`text-[12px] font-bold ${type.color}`}>{type.name}</span>
                  <span className="text-[9px] bg-white/10 px-1 py-0.5 rounded text-slate-500 uppercase font-mono">{type.bits}b</span>
                </div>
                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">{type.category}</div>
                {selectedType === type.id && <div className="absolute top-0 right-0 w-1 h-full bg-indigo-500" />}
              </button>
            ))}
          </div>

          <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/10 space-y-6 shadow-inner">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2 tracking-[0.15em]">
                <Calculator className="w-4 h-4" /> 转换模拟
              </label>
              <div className="text-[9px] text-indigo-400 px-2 py-0.5 bg-indigo-500/10 rounded-full border border-indigo-500/20 flex items-center gap-1">
                <Fingerprint className="w-3 h-3" /> 逻辑实时映射
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex-1 w-full">
                  <span className="text-[9px] text-slate-500 block mb-1.5 uppercase font-bold tracking-wider">原始权重 (FP32)</span>
                  <input 
                    type="number" step="0.0001" value={inputValue}
                    onChange={(e) => setInputValue(parseFloat(e.target.value) || 0)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-base font-mono text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner"
                  />
                </div>
                <div className="shrink-0 pt-4 sm:pt-0">
                   <Zap className="w-6 h-6 animate-pulse text-indigo-500" />
                </div>
                <div className="flex-1 w-full">
                  <span className="text-[9px] text-slate-500 block mb-1.5 uppercase font-bold tracking-wider">{currentType.name} 结果</span>
                  <div className="w-full bg-indigo-500/5 border border-indigo-500/20 rounded-xl px-4 py-2.5 text-base font-mono text-indigo-400 shadow-sm">
                    {quantizedValue.toFixed(4)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-5 bg-red-500/5 rounded-xl border border-red-500/10">
                <AlertTriangle className="w-6 h-6 text-red-500/60" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">精度损耗:</span>
                    <b className="text-red-400 font-mono text-3xl drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]">{error.toFixed(6)}</b>
                  </div>
                  <p className="text-[11px] text-slate-500 italic opacity-80">
                    量化带来的细微偏差，通常在可控范围内。数值越大，代表信息损失越严重。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full xl:w-[460px] space-y-4 shrink-0">
          <div className="p-6 bg-slate-900 rounded-3xl border border-white/10 shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="font-bold flex items-center gap-2.5 text-[11px] uppercase tracking-[0.2em] text-slate-300">
                <Binary className="w-4 h-4 text-blue-500" /> 二进制结构实时展示
              </h4>
              <span className="text-[9px] text-slate-500 italic">映射分配</span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
              {DTYPES.map(type => (
                <BitRow key={type.id} type={type} isActive={selectedType === type.id} value={inputValue} />
              ))}
            </div>

            <div className="pt-4 border-t border-white/5">
              <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                <h5 className="text-[10px] font-bold text-blue-400 uppercase mb-2 flex items-center gap-2">
                  <Info className="w-3 h-3" /> 量化本质
                </h5>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  <b>FP32</b> 极其精确但体积庞大。<b>FP4/INT4</b> 则通过更极端的压缩将显存需求降低了 8 倍。大模型部署的关键就在于对这种“信息密度”的精巧权衡。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { color: 'blue', label: '训练 (TRAINING)', desc: '首选 BF16。其动态范围确保梯度在极值处不丢失，防止训练崩溃。' },
          { color: 'emerald', label: '推理 (INFERENCE)', desc: '首选 FP8/INT8。利用 H100 等新架构硬件，速度可提升近 2 倍。' },
          { color: 'rose', label: '新一代架构 (Blackwell)', desc: 'FP4 成为焦点。相比 INT4，4位浮点能更好地保留模型在微小权重上的表现力。' }
        ].map((item, i) => (
          <div key={i} className={`bg-slate-900/40 p-5 rounded-2xl border border-white/5 space-y-3 transition-all hover:border-${item.color}-500/30`}>
            <div className={`flex items-center gap-2 text-${item.color}-400`}>
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrecisionLab;
