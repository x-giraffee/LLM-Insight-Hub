
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Copy, ArrowRight, Zap, Database, 
  FileText, ScanText, CheckCircle2, XCircle,
  Brain, RotateCcw, Play, Layers, Briefcase,
  Smartphone, Stethoscope, Code as CodeIcon
} from 'lucide-react';

type Mode = 'standard' | 'pld' | 'llma';
type CaseId = 'code' | 'sales' | 'finance' | 'medical';

interface UseCaseData {
  id: CaseId;
  name: string;
  icon: React.ReactNode;
  desc: string;
  target: string;      // The text LLM wants to generate
  context: string;     // Local context (for PLD) containing repeatable parts
  db: string;          // External DB (for LLMA) containing repeatable parts
}

const USE_CASES: UseCaseData[] = [
  {
    id: 'code',
    name: '代码补全 (Coding)',
    icon: <CodeIcon className="w-4 h-4" />,
    desc: '代码具有极高的结构重复性，函数签名和变量名经常复用。',
    target: `class Attention(nn.Module):
    def __init__(self, dim, heads):
        super().__init__()
        self.dim = dim
        self.scale = dim ** -0.5
        
    def forward(self, x):
        B, N, C = x.shape
        qkv = self.qkv(x).reshape(B, N, 3, self.heads, C // self.heads)
        q, k, v = qkv.unbind(2)
        attn = (q @ k.transpose(-2, -1)) * self.scale
        return attn @ v`,
    context: `# Previous definitions in this file
class MultiHeadAttention(nn.Module):
    def __init__(self, dim, heads):
        # We often copy-paste init logic
        super().__init__()
        self.dim = dim
        self.scale = dim ** -0.5`,
    db: `# External Library: pytorch_modeling.py
def standard_attention(q, k, v, scale):
    attn = (q @ k.transpose(-2, -1)) * scale
    return attn @ v`
  },
  {
    id: 'sales',
    name: 'AI 销售 Agent',
    icon: <Briefcase className="w-4 h-4" />,
    desc: '销售话术和产品介绍往往是标准化的，大量内容可直接从知识库检索。',
    target: "根据您的需求，我强烈推荐尊享版套餐。它包含 24小时专属客服、无限云存储空间以及高级数据分析功能，非常适合企业级用户。",
    context: "用户：尊享版套餐里具体都有什么服务？\nSalesBot：收到。为您查询产品手册... 尊享版套餐是我们最高级的服务，包含 24小时专属客服、无限云存储空间以及高级数据分析功能。",
    db: "【产品手册 v2.0】\n基础版：邮件支持。\n进阶版：电话支持 + 1TB 存储。\n尊享版套餐：包含 24小时专属客服、无限云存储空间以及高级数据分析功能。"
  },
  {
    id: 'finance',
    name: '手机银行 APP',
    icon: <Smartphone className="w-4 h-4" />,
    desc: '转账确认页面的账号、金额、流水号等信息，本质上是上一步用户输入的重复。',
    target: "转账确认：已成功向 尾号8899 的账户转账 500.00 元。交易流水号：TXN-20240520-8899。预计 2小时内到账。",
    context: "用户指令：向 尾号8899 转账 500 元。\n系统：正在核验... 目标账户：尾号8899，金额：500.00 元。\n系统：交易流水号 TXN-20240520-8899 已生成。",
    db: "【历史交易模板】\n转账确认：已成功向 {ACCOUNT} 的账户转账 {AMOUNT} 元。交易流水号：{REF}。预计 2小时内到账。"
  },
  {
    id: 'medical',
    name: '医疗病例生成',
    icon: <Stethoscope className="w-4 h-4" />,
    desc: '医生写病历时，症状描述、诊断结论和处方建议通常遵循严格的医学指南范式。',
    target: "患者主诉急性支气管炎。临床表现为持续性咳嗽、低热及呼吸急促。建议处方：阿莫西林胶囊，每日三次，并建议多休息多饮水。",
    context: "医生手记：\n- 诊断：急性支气管炎\n- 症状：持续性咳嗽、低热、呼吸急促\n- 计划：阿莫西林胶囊，每日三次；多休息多饮水。",
    db: "【临床诊疗指南 - 呼吸科】\n急性支气管炎：\n典型症状包括持续性咳嗽、低热及呼吸急促。\n标准治疗方案：建议处方阿莫西林胶囊，每日三次，并建议多休息多饮水。"
  }
];

const RetrievalSpeculativeSim: React.FC = () => {
  const [activeCaseId, setActiveCaseId] = useState<CaseId>('code');
  const [mode, setMode] = useState<Mode>('pld');
  const [isRunning, setIsRunning] = useState(false);
  const [generatedText, setGeneratedText] = useState("");
  const [draft, setDraft] = useState("");
  const [cursor, setCursor] = useState(0);
  const [matchHighlight, setMatchHighlight] = useState<{start: number, end: number, source: 'local' | 'db'} | null>(null);
  const [stats, setStats] = useState({ steps: 0, drafted: 0, time: 0 });

  const activeCase = useMemo(() => USE_CASES.find(c => c.id === activeCaseId) || USE_CASES[0], [activeCaseId]);

  // Simulation speed constants
  const BASE_DELAY = 80; 
  const VERIFY_DELAY = 120;

  useEffect(() => {
    reset(); // Reset when case changes
  }, [activeCaseId]);

  useEffect(() => {
    if (!isRunning) return;

    const target = activeCase.target;
    let timeoutId: number;

    const step = () => {
      if (cursor >= target.length) {
        setIsRunning(false);
        return;
      }

      // 1. STANDARD MODE: One char at a time
      if (mode === 'standard') {
        timeoutId = window.setTimeout(() => {
          setGeneratedText(target.substring(0, cursor + 1));
          setCursor(c => c + 1);
          setStats(s => ({ ...s, steps: s.steps + 1, time: s.time + 1 }));
          step();
        }, BASE_DELAY);
        return;
      }

      // 2. RETRIEVAL MODES (PLD / LLMA)
      const currentContext = target.substring(0, cursor);
      // For non-code, look back fewer chars to trigger matches easier
      const lookback = activeCaseId === 'code' ? 10 : 4; 
      const query = currentContext.slice(-lookback);
      
      let matchIdx = -1;
      let sourceText = "";
      
      if (query.length >= (activeCaseId === 'code' ? 3 : 2)) {
        if (mode === 'pld') {
          // Search in Context (Prompt + Generated so far)
          // Simplified: We search in the `context` string provided in USE_CASES
          // In real PLD, it searches (Prompt + Generated_So_Far). 
          // Here we simulate by searching the pre-defined 'context' string which mimics prompt history.
          sourceText = activeCase.context;
          matchIdx = sourceText.lastIndexOf(query);
        } else if (mode === 'llma') {
          sourceText = activeCase.db;
          matchIdx = sourceText.indexOf(query);
        }
      }

      // HIT: Found a match
      if (matchIdx !== -1) {
        const matchEnd = matchIdx + query.length;
        // Grab next K chars as draft
        const draftLen = 12; 
        const potentialDraft = sourceText.substring(matchEnd, matchEnd + draftLen);
        
        // Verify against Ground Truth
        const groundTruthFuture = target.substring(cursor, cursor + draftLen);
        let validLen = 0;
        // Simple matching logic
        while (validLen < potentialDraft.length && validLen < groundTruthFuture.length) {
          if (potentialDraft[validLen] === groundTruthFuture[validLen]) validLen++;
          else break;
        }

        if (validLen > 0) {
            // Visualize Match
            setMatchHighlight({ 
            start: matchIdx, 
            end: matchEnd + validLen, 
            source: mode === 'pld' ? 'local' : 'db' 
            });
            setDraft(potentialDraft.substring(0, validLen));

            timeoutId = window.setTimeout(() => {
            const newCursor = cursor + validLen + 1;
            setGeneratedText(target.substring(0, newCursor));
            setCursor(newCursor);
            setDraft("");
            setMatchHighlight(null);
            
            setStats(s => ({ 
                steps: s.steps + 1, 
                drafted: s.drafted + validLen,
                time: s.time + 1.5 
            }));
            step();
            }, VERIFY_DELAY);
            return;
        }
      } 
      
      // MISS or Validation Failed
      timeoutId = window.setTimeout(() => {
        setGeneratedText(target.substring(0, cursor + 1));
        setCursor(c => c + 1);
        setMatchHighlight(null);
        setStats(s => ({ ...s, steps: s.steps + 1, time: s.time + 1 }));
        step();
      }, BASE_DELAY);
    };

    step();
    return () => window.clearTimeout(timeoutId);
  }, [isRunning, cursor, mode, activeCase, activeCaseId]);

  const reset = () => {
    setIsRunning(false);
    setGeneratedText("");
    setCursor(0);
    setDraft("");
    setMatchHighlight(null);
    setStats({ steps: 0, drafted: 0, time: 0 });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-teal-500/10 text-teal-400 rounded-full text-[9px] font-bold border border-teal-500/20 tracking-widest uppercase">Copy-Paste Acceleration</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
            检索投机推理 (Retrieval Speculative)
          </h2>
        </div>
        <div className="flex gap-4">
           <div className="text-right">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Speedup</div>
              <div className="text-2xl font-mono font-bold text-teal-400">
                {stats.time > 0 ? (activeCase.target.length / stats.time).toFixed(1) : '0.0'}x
              </div>
           </div>
           <button 
             onClick={() => { reset(); setIsRunning(true); }}
             disabled={isRunning}
             className="px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-30 rounded-xl font-bold text-xs text-white transition-all shadow-lg flex items-center gap-2"
           >
             {isRunning ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
             {isRunning ? '生成中...' : '开始生成'}
           </button>
        </div>
      </div>

      {/* Case Selectors */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {USE_CASES.map(uc => (
          <button
            key={uc.id}
            onClick={() => setActiveCaseId(uc.id)}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-2 relative overflow-hidden
              ${activeCaseId === uc.id 
                ? 'bg-teal-500/10 border-teal-500 ring-1 ring-teal-500/20' 
                : 'bg-slate-900/50 border-white/5 hover:bg-slate-800'}`}
          >
            <div className={`flex items-center gap-2 font-bold text-xs ${activeCaseId === uc.id ? 'text-teal-300' : 'text-slate-400'}`}>
              {uc.icon} {uc.name}
            </div>
            {activeCaseId === uc.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-500" />}
          </button>
        ))}
      </div>

      {/* Mode Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { id: 'standard', name: 'Standard Decoding', icon: <Brain className="w-4 h-4" />, desc: '逐词生成，无加速' },
          { id: 'pld', name: 'Prompt Lookup (PLD)', icon: <ScanText className="w-4 h-4" />, desc: 'N-gram 匹配上下文 (Context)' },
          { id: 'llma', name: 'LLMA (External DB)', icon: <Database className="w-4 h-4" />, desc: '检索外部知识库 (RAG)' },
        ].map(m => (
          <button
            key={m.id}
            onClick={() => { setMode(m.id as Mode); reset(); }}
            className={`p-4 rounded-xl border text-left transition-all ${
              mode === m.id 
                ? 'bg-slate-800 border-teal-500/50 shadow-md' 
                : 'bg-slate-900/30 border-white/5 hover:bg-slate-800'
            }`}
          >
            <div className={`font-bold text-sm mb-1 flex items-center gap-2 ${mode === m.id ? 'text-teal-400' : 'text-slate-200'}`}>
              {m.icon} {m.name}
            </div>
            <div className="text-[10px] text-slate-500">{m.desc}</div>
          </button>
        ))}
      </div>

      {/* Main Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Retrieval Source */}
        <div className="lg:col-span-5 flex flex-col gap-4">
           <div className={`flex-1 p-6 rounded-3xl border relative overflow-hidden transition-colors duration-500
             ${matchHighlight ? 'bg-teal-900/10 border-teal-500/30' : 'bg-slate-900/50 border-white/5'}`}>
              
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                   <Search className="w-4 h-4" /> 
                   {mode === 'pld' ? '上下文 (Context/History)' : mode === 'llma' ? '外部知识库 (Knowledge Base)' : '无检索源'}
                 </h3>
                 {matchHighlight && (
                   <span className="px-2 py-0.5 bg-teal-500 text-black text-[10px] font-bold rounded animate-pulse">
                     MATCH FOUND
                   </span>
                 )}
              </div>

              <div className="font-mono text-[11px] leading-relaxed text-slate-500 whitespace-pre-wrap relative h-[280px] overflow-y-auto custom-scrollbar">
                 {mode === 'standard' && <div className="text-slate-700 italic text-center mt-20">标准模式不进行检索...</div>}
                 
                 {mode === 'pld' && (
                   <div className="relative">
                     {/* For Demo purposes, highlighting works by splitting string. Real implementation would be coordinate based */}
                     {activeCase.context.split(matchHighlight && matchHighlight.source === 'local' ? 'XXXX' : 'XXXX').map((part, i) => (
                        <span key={i}>
                           {/* Simplified highlight logic for demo: If we have a match, just highlighting the whole context isn't right. 
                               We are just showing the source text here. 
                               The real "highlight" effect is simpler to fake by just blinking the container bg as done above.
                           */}
                           {activeCase.context} 
                        </span>
                     ))}
                     {matchHighlight && matchHighlight.source === 'local' && (
                       <div className="absolute inset-0 bg-teal-500/5 animate-pulse pointer-events-none" />
                     )}
                   </div>
                 )}

                 {mode === 'llma' && (
                   <div className="relative">
                      {activeCase.db}
                      {matchHighlight && matchHighlight.source === 'db' && (
                        <div className="absolute inset-0 bg-teal-500/5 animate-pulse pointer-events-none" />
                      )}
                   </div>
                 )}
              </div>

              {/* Scanner Visual */}
              {mode !== 'standard' && isRunning && !matchHighlight && (
                 <div className="absolute top-0 left-0 w-full h-1 bg-teal-500/50 shadow-[0_0_15px_rgba(20,184,166,0.5)] animate-[scan_1.5s_infinite_linear]" />
              )}
           </div>
        </div>

        {/* Center: Action Arrow */}
        <div className="lg:col-span-1 flex flex-col items-center justify-center gap-2">
           {matchHighlight ? (
             <>
               <div className="text-[10px] font-bold text-teal-500 uppercase animate-pulse">Copy</div>
               <ArrowRight className="w-8 h-8 text-teal-400 animate-in slide-in-from-left-4 duration-300" />
               <div className="text-[10px] font-bold text-teal-500 uppercase">+{(matchHighlight.end - matchHighlight.start)} chars</div>
             </>
           ) : (
             <div className="h-full w-px bg-white/5" />
           )}
        </div>

        {/* Right: Generation Stream */}
        <div className="lg:col-span-6 flex flex-col gap-4">
           <div className="flex-1 p-6 bg-slate-950 rounded-3xl border border-white/10 relative h-full">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                   <Zap className="w-4 h-4 text-yellow-400" /> 实时生成流 (Output)
                 </h3>
                 <div className="flex gap-3 text-[10px] font-mono text-slate-500">
                    <span>Drafted: <span className="text-teal-400">{stats.drafted}</span> chars</span>
                 </div>
              </div>

              <div className="font-mono text-xs leading-loose whitespace-pre-wrap text-slate-300">
                 {generatedText}
                 {draft && (
                   <span className="bg-teal-500/20 text-teal-300 border-b border-dashed border-teal-500/50 animate-pulse">
                     {draft}
                   </span>
                 )}
                 <span className="inline-block w-2 h-4 bg-teal-500 ml-0.5 animate-pulse align-middle" />
              </div>
           </div>
        </div>
      </div>

      {/* Case Description Card */}
      <div className="p-5 bg-slate-900/50 rounded-2xl border border-white/5 flex items-start gap-4">
         <div className="p-3 bg-teal-500/10 rounded-xl text-teal-400">
            {activeCase.icon}
         </div>
         <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-200">为什么 {activeCase.name} 适合检索投机？</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
               {activeCase.desc} 
               {activeCaseId === 'code' && " 代码中的 import 语句、类定义结构高度重复。"}
               {activeCaseId === 'sales' && " 客服回复通常包含大量标准术语和产品参数。"}
               {activeCaseId === 'finance' && " 交易确认包含用户刚刚输入的金额和账号，属于 Context 内的重复。"}
               {activeCaseId === 'medical' && " 病历书写遵循 SOAP 标准格式，大量医学术语在指南中已有定义。"}
            </p>
         </div>
      </div>
    </div>
  );
};

export default RetrievalSpeculativeSim;
