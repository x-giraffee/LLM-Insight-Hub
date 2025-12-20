
import React, { useState, useEffect, useCallback } from 'react';
import { Zap, Timer, Play, RotateCcw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const MetricsSim: React.FC = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [ttft, setTtft] = useState(0);
  const [tps, setTps] = useState(0);
  const [tokens, setTokens] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const sampleText = "Large language models (LLMs) have revolutionized natural language processing by scaling model size to hundreds of billions of parameters.".split(' ');

  const runSimulation = useCallback(() => {
    setIsSimulating(true);
    setTokens([]);
    setTtft(0);
    setTps(0);
    setProgress(0);

    const startTime = Date.now();
    let firstTokenTime = 0;

    // Simulate TTFT (Pre-fill lag)
    const ttftDuration = 800 + Math.random() * 1000;
    setTimeout(() => {
      firstTokenTime = Date.now();
      setTtft(firstTokenTime - startTime);
      
      // Simulate Decoding
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex < sampleText.length) {
          setTokens(prev => [...prev, sampleText[currentIndex]]);
          currentIndex++;
          setProgress((currentIndex / sampleText.length) * 100);
        } else {
          clearInterval(interval);
          const endTime = Date.now();
          const totalDuration = (endTime - firstTokenTime) / 1000;
          setTps(sampleText.length / totalDuration);
          setIsSimulating(false);
        }
      }, 100);
    }, ttftDuration);
  }, []);

  const metricData = [
    { name: 'TTFT (ms)', value: ttft, color: '#f59e0b', desc: '首字延迟' },
    { name: 'TPS (tok/s)', value: tps * 10, color: '#10b981', desc: '生成速度' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <h3 className="text-2xl font-bold">性能指标实测</h3>
          <p className="text-slate-400 text-sm">
            点击下方按钮观察真实的 Token 生成过程。了解延迟与吞吐量的权衡。
          </p>
          
          <div className="flex gap-3">
            <button 
              disabled={isSimulating}
              onClick={runSimulation}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg font-bold transition-all"
            >
              {isSimulating ? <Timer className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
              开始推理
            </button>
            <button 
              onClick={() => { setTokens([]); setTtft(0); setTps(0); setProgress(0); }}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-all"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 bg-slate-900/50 rounded-xl border border-amber-500/20">
              <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">TTFT (首字时间)</span>
              <div className="text-2xl font-mono font-bold text-slate-100">{ttft > 0 ? `${ttft.toFixed(0)}ms` : '--'}</div>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-xl border border-emerald-500/20">
              <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">TPS (每秒Token)</span>
              <div className="text-2xl font-mono font-bold text-slate-100">{tps > 0 ? `${tps.toFixed(1)}` : '--'}</div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-80 h-64 bg-slate-900/50 rounded-2xl border border-white/5 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500">模型输出流</span>
            <div className={`w-2 h-2 rounded-full ${isSimulating ? 'bg-green-500 animate-pulse' : 'bg-slate-700'}`} />
          </div>
          <div className="flex-1 overflow-y-auto font-mono text-sm leading-relaxed text-slate-300 custom-scrollbar">
            {tokens.length === 0 ? (
              <span className="text-slate-600 italic">等待输入...</span>
            ) : (
              tokens.map((t, i) => (
                <span key={i} className="inline-block bg-indigo-500/10 px-1 rounded mr-1 mb-1 animate-in fade-in zoom-in duration-200">
                  {t}
                </span>
              ))
            )}
            {isSimulating && <span className="inline-block w-2 h-4 bg-indigo-500 animate-pulse ml-1" />}
          </div>
          <div className="mt-4 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="bg-slate-900/40 p-6 rounded-2xl border border-white/5">
        <h4 className="font-bold mb-6 flex items-center gap-2">
          <Zap className="w-4 h-4 text-indigo-400" />
          指标详解 (Metrics Glossary)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { id: 'TTFT', label: 'Time To First Token', desc: '首个字符生成的时间。代表了模型的“反应速度”。' },
            { id: 'TPOT', label: 'Time Per Output Token', desc: '生成每个中间字符的时间。决定了模型的“说话速度”。' },
            { id: 'TPS', label: 'Tokens Per Second', desc: '单位时间内生成的字符数，反映了系统的总吞吐能力。' },
            { id: 'E2E', label: 'End-to-End Latency', desc: '从用户点击发送到接收完所有结果的总时长。' },
          ].map(m => (
            <div key={m.id} className="p-3 bg-white/5 rounded-lg border border-white/5">
              <div className="text-indigo-400 font-bold text-sm mb-1">{m.id}</div>
              <div className="text-[10px] text-slate-500 mb-2 font-medium">{m.label}</div>
              <p className="text-[11px] text-slate-400 leading-snug">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MetricsSim;
