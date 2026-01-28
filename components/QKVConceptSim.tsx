
import React, { useState } from 'react';
import { 
  Search, Database, ArrowRight, Layers, 
  Zap, Library, Book, Info, MoveRight, 
  Split, GitMerge, LayoutGrid, MousePointerClick,
  Binary, Calculator, Eye, HelpCircle, CheckCircle2
} from 'lucide-react';

const QKVConceptSim: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'analogy' | 'projection' | 'math'>('analogy');
  const [selectedWord, setSelectedWord] = useState<number>(1); // 0: 我, 1: 喜欢, 2: 苹果
  const [isAsymmetric, setIsAsymmetric] = useState(true);

  const sentence = [
    { text: "我", type: "代词", color: "text-blue-400", q: "找主语动作", k: "第一人称, 主语" },
    { text: "喜欢", type: "动词", color: "text-amber-400", q: "找宾语(名词)", k: "动作, 情感" },
    { text: "苹果", type: "名词", color: "text-rose-400", q: "找修饰语", k: "物体, 食物, 名词" }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="border-b border-white/5 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-full text-[9px] font-bold border border-blue-500/20 tracking-widest uppercase">Deep Architecture</span>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          QKV 之谜：Transformer 的灵魂三剑客
        </h2>
        <p className="text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
          为什么要大费周章地把一个词拆成 Q、K、V？这本质上是模拟人类的<b>“精准信息检索”</b>：用特定意图去匹配特征，再提取所需内容。
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-900 p-1 rounded-2xl border border-white/5 w-fit">
        {[
          { id: 'analogy', label: '角色直觉 (比喻)', icon: <Library className="w-3 h-3" /> },
          { id: 'projection', label: '映射实验室', icon: <Split className="w-3 h-3" /> },
          { id: 'math', label: '为什么解耦？', icon: <Calculator className="w-3 h-3" /> }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveMode(t.id as any)}
            className={`px-4 py-2 rounded-xl text-[11px] font-bold transition-all flex items-center gap-2 ${activeMode === t.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Interactive Stage */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. Analogy View */}
          {activeMode === 'analogy' && (
            <div className="p-8 bg-slate-950 rounded-3xl border border-white/10 min-h-[450px] space-y-12 relative overflow-hidden">
               <div className="flex justify-center gap-4">
                  {sentence.map((w, i) => (
                    <button 
                      key={i}
                      onClick={() => setSelectedWord(i)}
                      className={`px-6 py-3 rounded-2xl border-2 transition-all font-bold 
                        ${selectedWord === i ? 'bg-blue-500/20 border-blue-500 text-white scale-110 shadow-lg' : 'bg-slate-900 border-white/5 text-slate-500'}`}
                    >
                      {w.text}
                    </button>
                  ))}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Q - The Searcher */}
                  <div className="flex flex-col items-center gap-4 p-6 bg-blue-500/5 rounded-2xl border border-blue-500/20 animate-in slide-in-from-bottom-2">
                     <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <Search className="w-6 h-6" />
                     </div>
                     <div className="text-center">
                        <h4 className="font-bold text-blue-300 text-sm">Query (Q)</h4>
                        <p className="text-[10px] text-slate-500 uppercase font-mono mt-1">“我想找谁？”</p>
                     </div>
                     <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-[11px] text-blue-200 italic w-full text-center">
                        "{sentence[selectedWord].q}"
                     </div>
                  </div>

                  {/* K - The Index */}
                  <div className="flex flex-col items-center gap-4 p-6 bg-emerald-500/5 rounded-2xl border border-emerald-500/20 animate-in slide-in-from-bottom-4">
                     <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <Info className="w-6 h-6" />
                     </div>
                     <div className="text-center">
                        <h4 className="font-bold text-emerald-300 text-sm">Key (K)</h4>
                        <p className="text-[10px] text-slate-500 uppercase font-mono mt-1">“我是谁？”</p>
                     </div>
                     <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-[11px] text-emerald-200 italic w-full text-center">
                        "{sentence[selectedWord].k}"
                     </div>
                  </div>

                  {/* V - The Value */}
                  <div className="flex flex-col items-center gap-4 p-6 bg-purple-500/5 rounded-2xl border border-purple-500/20 animate-in slide-in-from-bottom-6">
                     <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                        <Book className="w-6 h-6" />
                     </div>
                     <div className="text-center">
                        <h4 className="font-bold text-purple-300 text-sm">Value (V)</h4>
                        <p className="text-[10px] text-slate-500 uppercase font-mono mt-1">“我要传达什么？”</p>
                     </div>
                     <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-[11px] text-purple-200 italic w-full text-center">
                        包含：{sentence[selectedWord].text}的完整语义
                     </div>
                  </div>
               </div>

               <div className="p-5 bg-slate-900/50 rounded-2xl border border-white/5 flex items-center gap-6">
                  <div className="shrink-0 p-3 bg-indigo-500/10 rounded-full text-indigo-400">
                    <Zap className="w-5 h-5 animate-pulse" />
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed italic">
                    点击上方词汇切换：当选中<b>“喜欢”</b>时，它的 <b>Q</b> 会带着“寻找宾语”的意图，去扫描其他词的 <b>K</b>。发现<b>“苹果”</b>的 K 是名词且是物体，于是产生极高相关性，最后把<b>“苹果”</b>的 <b>V</b>（语义信息）加权提取出来。
                  </p>
               </div>
            </div>
          )}

          {/* 2. Projection View */}
          {activeMode === 'projection' && (
            <div className="p-8 bg-slate-950 rounded-3xl border border-white/10 min-h-[450px] flex flex-col items-center justify-center space-y-12">
               <div className="flex items-center gap-8">
                  {/* Raw Input X */}
                  <div className="flex flex-col items-center gap-3">
                     <div className="text-[10px] font-bold text-slate-500 uppercase">原始输入 (X)</div>
                     <div className="w-12 h-40 bg-slate-800 rounded-xl border border-white/10 flex flex-col justify-around p-2 gap-1">
                        {Array.from({length: 8}).map((_, i) => (
                          <div key={i} className="h-full w-full bg-slate-600/50 rounded-sm" />
                        ))}
                     </div>
                     <span className="text-xs font-bold text-white">"{sentence[selectedWord].text}"</span>
                  </div>

                  <ArrowRight className="w-6 h-6 text-slate-700" />

                  {/* Projection Matrices */}
                  <div className="flex flex-col gap-6">
                     <div className="flex items-center gap-4 group">
                        <div className="w-16 h-10 bg-blue-500/20 border border-blue-500/50 rounded-lg flex items-center justify-center text-[10px] font-bold text-blue-400 group-hover:scale-105 transition-all">W_Q</div>
                        <div className="w-8 h-px bg-slate-700" />
                        <div className="w-10 h-24 bg-blue-600/40 rounded border border-blue-400 flex flex-col p-1 gap-0.5 animate-pulse">
                           {Array.from({length: 6}).map((_, i) => <div key={i} className="h-full bg-blue-400/50 rounded-sm" />)}
                        </div>
                        <span className="text-[10px] font-mono font-bold text-blue-300">Query</span>
                     </div>
                     <div className="flex items-center gap-4 group">
                        <div className="w-16 h-10 bg-emerald-500/20 border border-emerald-500/50 rounded-lg flex items-center justify-center text-[10px] font-bold text-emerald-400 group-hover:scale-105 transition-all">W_K</div>
                        <div className="w-8 h-px bg-slate-700" />
                        <div className="w-10 h-24 bg-emerald-600/40 rounded border border-emerald-400 flex flex-col p-1 gap-0.5 animate-pulse">
                           {Array.from({length: 6}).map((_, i) => <div key={i} className="h-full bg-emerald-400/50 rounded-sm" />)}
                        </div>
                        <span className="text-[10px] font-mono font-bold text-emerald-300">Key</span>
                     </div>
                     <div className="flex items-center gap-4 group">
                        <div className="w-16 h-10 bg-purple-500/20 border border-purple-500/50 rounded-lg flex items-center justify-center text-[10px] font-bold text-purple-400 group-hover:scale-105 transition-all">W_V</div>
                        <div className="w-8 h-px bg-slate-700" />
                        <div className="w-10 h-24 bg-purple-600/40 rounded border border-purple-400 flex flex-col p-1 gap-0.5 animate-pulse">
                           {Array.from({length: 6}).map((_, i) => <div key={i} className="h-full bg-purple-400/50 rounded-sm" />)}
                        </div>
                        <span className="text-[10px] font-mono font-bold text-purple-300">Value</span>
                     </div>
                  </div>
               </div>

               <div className="max-w-md p-5 bg-white/5 rounded-2xl border border-white/5 text-center">
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">
                    <b>映射的秘密：</b> 即使是同一个词，它在不同的时刻扮演着不同的角色。W_Q 提取出它<b>“想看谁”</b>的特征，W_K 提取出它<b>“长什么样”</b>的特征，W_V 则是<b>“它到底有什么干货”</b>。这种分离让模型极其灵活。
                  </p>
               </div>
            </div>
          )}

          {/* 3. Math View */}
          {activeMode === 'math' && (
            <div className="p-8 bg-slate-950 rounded-3xl border border-white/10 min-h-[450px] space-y-8 animate-in fade-in">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="font-bold text-slate-200">为什么不直接用 X 而要解耦？</h3>
                  <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-white/5">
                     <button 
                       onClick={() => setIsAsymmetric(true)}
                       className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${isAsymmetric ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
                     >解耦 (QKV)</button>
                     <button 
                       onClick={() => setIsAsymmetric(false)}
                       className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${!isAsymmetric ? 'bg-rose-600 text-white' : 'text-slate-500'}`}
                     >不解耦 (X·Xᵀ)</button>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-6 bg-slate-900 rounded-3xl border border-white/10 space-y-4">
                     <h4 className="flex items-center gap-2 text-sm font-bold text-indigo-400">
                        {isAsymmetric ? <CheckCircle2 className="w-4 h-4" /> : <HelpCircle className="w-4 h-4" />}
                        {isAsymmetric ? '非对称性 (Asymmetry)' : '对称性陷阱'}
                     </h4>
                     <p className="text-xs text-slate-400 leading-relaxed">
                        {isAsymmetric 
                          ? '“喜欢”非常关注“苹果”，但“苹果”可能更关注前面的形容词“红色的”。Q 和 K 的分离让这种单向关注成为可能。' 
                          : '如果直接用 X 乘 Xᵀ，结果矩阵永远是对称的。这意味着 A 对 B 的关注度永远等于 B 对 A，这不符合语言逻辑。'}
                     </p>
                     <div className="flex justify-center py-4">
                        <div className="relative w-40 h-40 border border-dashed border-slate-700 rounded-full flex items-center justify-center">
                           <div className="absolute top-0 text-[10px] text-blue-400 font-bold">喜欢 (A)</div>
                           <div className="absolute bottom-0 text-[10px] text-rose-400 font-bold">苹果 (B)</div>
                           <ArrowRight className={`w-8 h-8 text-indigo-500 transition-all duration-700 ${isAsymmetric ? 'translate-y-[-10px] rotate-90 scale-x-150' : 'rotate-90'}`} />
                           {!isAsymmetric && <ArrowRight className="absolute w-8 h-8 text-rose-500 -rotate-90 translate-y-[10px]" />}
                        </div>
                     </div>
                  </div>

                  <div className="p-6 bg-slate-900 rounded-3xl border border-white/10 space-y-4">
                     <h4 className="flex items-center gap-2 text-sm font-bold text-purple-400">
                        匹配与内容的隔离
                     </h4>
                     <p className="text-xs text-slate-400 leading-relaxed italic">
                        “就像在图书馆找书：分类号 (K) 负责被找到，而书里的知识 (V) 才是你真正要带走的东西。你不会因为分类号长得帅而读这本书。”
                     </p>
                     <div className="space-y-3 pt-4">
                        <div className="flex items-center gap-3">
                           <div className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[9px] font-mono">K: TP311</div>
                           <ArrowRight className="w-3 h-3 text-slate-700" />
                           <div className="text-[10px] text-slate-500">用于匹配 Query</div>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="px-2 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded text-[9px] font-mono">V: Python核心编程</div>
                           <ArrowRight className="w-3 h-3 text-slate-700" />
                           <div className="text-[10px] text-slate-500">用于生成结果</div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* Right Info Panel */}
        <div className="lg:col-span-4 space-y-6">
           <div className="p-6 bg-slate-900 border border-white/10 rounded-3xl shadow-2xl h-full flex flex-col">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
                 <LayoutGrid className="w-6 h-6 text-blue-400" />
              </div>
              
              <h3 className="text-xl font-bold mb-4 text-slate-100">核心洞察</h3>
              
              <div className="flex-1 space-y-6 overflow-y-auto custom-scrollbar pr-2">
                 <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2">
                    <h4 className="text-xs font-bold text-blue-300 flex items-center gap-2">
                       <Split className="w-3 h-3" /> 解耦的力量
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                       QKV 的拆分实现了<b>“寻找意图”</b>与<b>“承载信息”</b>的解耦。这使得模型可以在不同的注意力头里学习不同的匹配逻辑。
                    </p>
                 </div>

                 <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2">
                    <h4 className="text-xs font-bold text-amber-300 flex items-center gap-2">
                       <GitMerge className="w-3 h-3" /> 软性检索
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                       不同于数据库的“非黑即白”，Attention 计算的是概率分布。它不是只取一个 Value，而是把所有相关的 Value <b>加权求和</b>。
                    </p>
                 </div>

                 <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/20 space-y-2">
                    <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                       <Binary className="w-3 h-3" /> 多头(Multi-Head)基础
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                       因为有可学习的矩阵 W，模型可以同时开启多个头：一个头关注语法关系，一个头关注逻辑引用。
                    </p>
                 </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5">
                 <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <MousePointerClick className="w-3 h-3" />
                    <span>点击左侧模式探索 Transformer 的心脏</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default QKVConceptSim;
