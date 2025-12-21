
import React, { useState, useEffect } from 'react';
import { 
  GitBranch, GitMerge, HardDrive, Cpu, Zap, 
  Search, FileText, Layers, RefreshCw, Database,
  ArrowRight, CheckCircle2, Split
} from 'lucide-react';

interface TreeNode {
  id: string;
  tokens: string;
  type: 'system' | 'user' | 'model';
  children: TreeNode[];
  isHit?: boolean;
  isNew?: boolean;
}

const RadixAttentionSim: React.FC = () => {
  const [step, setStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [hitRate, setHitRate] = useState(0);
  
  // Scenarios
  // 0: Empty
  // 1: Request A (Cold Start) -> [System, User A]
  // 2: Request B (Shared Prefix) -> [System] -> [User A], [User B]
  
  const [treeData, setTreeData] = useState<TreeNode>({
    id: 'root', tokens: 'ROOT', type: 'system', children: []
  });

  const SYSTEM_PROMPT = "System: You are a helpful assistant.";
  const USER_A = "User: Hello!";
  const USER_B = "User: Hi there!";

  const reset = () => {
    setStep(0);
    setLogs([]);
    setHitRate(0);
    setTreeData({ id: 'root', tokens: 'ROOT', type: 'system', children: [] });
  };

  const processRequestA = () => {
    setStep(1);
    setLogs(prev => [...prev, "📥收到请求 A: [System] + [User: Hello!]"]);
    setTimeout(() => {
      setLogs(prev => [...prev, "🔍 前缀匹配: 无 (Root Only)"]);
      setLogs(prev => [...prev, "⚙️ 计算: 全量计算 System + User A"]);
      setLogs(prev => [...prev, "💾 写入 Cache: 创建节点 Node_1"]);
      setTreeData({
        id: 'root', tokens: 'ROOT', type: 'system', children: [
          { id: 'n1', tokens: `${SYSTEM_PROMPT}\n${USER_A}`, type: 'system', children: [], isNew: true }
        ]
      });
      setHitRate(0);
    }, 500);
  };

  const processRequestB = () => {
    setStep(2);
    setLogs(prev => [...prev, "📥 收到请求 B: [System] + [User: Hi there!]"]);
    
    setTimeout(() => {
      setLogs(prev => [...prev, "🔍 前缀匹配: 发现公共前缀 'System...'"]);
      
      // Visualizing the SPLIT operation
      setTreeData(prev => {
        // Find the node that has the system prompt
        // In a real implementation this is a Trie traversal
        // Here we simulate the split of n1
        return {
          id: 'root', tokens: 'ROOT', type: 'system', children: [
            { 
              id: 'n1_split_common', 
              tokens: SYSTEM_PROMPT, 
              type: 'system', 
              isHit: true,
              children: [
                { id: 'n1_split_A', tokens: USER_A, type: 'user', children: [] },
                { id: 'n2_B', tokens: USER_B, type: 'user', children: [], isNew: true } // The new part
              ] 
            }
          ]
        };
      });

      setLogs(prev => [...prev, "✂️ 树结构分裂 (Split): 将 Node_1 拆分为 [System] 和 [User A]"]);
      setLogs(prev => [...prev, "⚡ Cache Hit: 复用 [System] KV Cache"]);
      setLogs(prev => [...prev, "⚙️ 计算: 仅计算 [User B] (增量计算)"]);
      setHitRate(50);
    }, 800);
  };

  const renderTree = (node: TreeNode, depth = 0) => {
    if (node.id === 'root') {
      return (
        <div className="flex flex-col items-center">
          <div className="mb-4 px-3 py-1 bg-slate-800 rounded-full text-[10px] text-slate-500 border border-white/5">KV Cache Radix Tree</div>
          <div className="flex gap-8">
            {node.children.map(child => renderTree(child, depth + 1))}
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500" key={node.id}>
        {/* Connection Line */}
        <div className="h-6 w-px bg-slate-600 mb-1" />
        
        {/* Node Card */}
        <div className={`
          relative w-48 p-3 rounded-xl border transition-all duration-500
          ${node.isHit ? 'bg-emerald-500/20 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : ''}
          ${node.isNew ? 'bg-blue-500/20 border-blue-500' : 'bg-slate-900 border-white/10'}
        `}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
              node.type === 'system' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-amber-500/20 text-amber-300'
            }`}>
              {node.type === 'system' ? 'Shared Prefix' : 'Unique Suffix'}
            </span>
            {node.isHit && <Zap className="w-3 h-3 text-emerald-400 fill-current" />}
          </div>
          <div className="text-xs font-mono text-slate-200 leading-relaxed whitespace-pre-wrap">
            {node.tokens}
          </div>
          
          {/* Status Indicator */}
          <div className="mt-2 pt-2 border-t border-white/5 flex justify-between items-center">
            <span className="text-[9px] text-slate-500">Node ID: {node.id.split('_')[0]}</span>
            {node.isHit ? (
              <span className="text-[9px] font-bold text-emerald-400">HIT</span>
            ) : node.isNew ? (
              <span className="text-[9px] font-bold text-blue-400">COMPUTED</span>
            ) : (
              <span className="text-[9px] font-bold text-slate-600">CACHED</span>
            )}
          </div>
        </div>

        {/* Children */}
        {node.children.length > 0 && (
          <div className="flex gap-4 mt-1 relative">
             {/* Branch connectors would go here in a more complex implementation */}
            {node.children.map(child => renderTree(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-full text-[9px] font-bold border border-indigo-500/20 tracking-widest uppercase">SGLang Core</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            RadixAttention 机制演示
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <GitBranch className="w-4 h-4" />
          <span>KV Cache as a Tree</span>
        </div>
      </div>

      {/* Main Interaction Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Controls & Context */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 bg-slate-900 rounded-3xl border border-white/10 space-y-6">
             <div className="space-y-2">
               <h3 className="font-bold text-slate-200 flex items-center gap-2">
                 <FileText className="w-4 h-4 text-blue-400" /> 请求模拟队列
               </h3>
               <p className="text-xs text-slate-400">
                 模拟向 SGLang 后端发送带有相同 System Prompt 的不同用户请求。
               </p>
             </div>

             <div className="space-y-4">
                {/* Request A */}
                <button 
                  onClick={processRequestA}
                  disabled={step > 0}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    step >= 1 ? 'bg-slate-800 border-white/5 opacity-50' : 'bg-blue-600/10 border-blue-500/30 hover:bg-blue-600/20'
                  }`}
                >
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-blue-400">Request A (Cold Start)</span>
                      {step >= 1 && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                   </div>
                   <div className="space-y-1">
                     <div className="text-[10px] font-mono bg-black/30 p-1.5 rounded text-slate-300 border border-white/5">
                       {SYSTEM_PROMPT}
                     </div>
                     <div className="text-[10px] font-mono bg-black/30 p-1.5 rounded text-blue-200 border border-blue-500/20">
                       {USER_A}
                     </div>
                   </div>
                </button>

                {/* Arrow */}
                <div className="flex justify-center">
                  <ArrowRight className="w-5 h-5 text-slate-600" />
                </div>

                {/* Request B */}
                <button 
                  onClick={processRequestB}
                  disabled={step !== 1}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    step === 2 ? 'bg-emerald-600/10 border-emerald-500/50' : 
                    step === 1 ? 'bg-blue-600/10 border-blue-500/30 hover:bg-blue-600/20 animate-pulse' : 
                    'bg-slate-800/50 border-white/5 opacity-30'
                  }`}
                >
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-emerald-400">Request B (Shared Prefix)</span>
                      {step === 2 && <Zap className="w-4 h-4 text-yellow-400 fill-current" />}
                   </div>
                   <div className="space-y-1">
                     <div className="text-[10px] font-mono bg-black/30 p-1.5 rounded text-slate-500 border border-white/5 border-dashed">
                       {SYSTEM_PROMPT} (Same)
                     </div>
                     <div className="text-[10px] font-mono bg-black/30 p-1.5 rounded text-emerald-200 border border-emerald-500/20">
                       {USER_B}
                     </div>
                   </div>
                </button>
             </div>

             <div className="pt-4 border-t border-white/5 flex justify-between items-center">
               <button onClick={reset} className="px-4 py-2 bg-slate-800 rounded-lg text-xs hover:bg-slate-700 transition-colors">
                  <RefreshCw className="w-3 h-3" /> 重置
               </button>
               <div className="text-right">
                  <div className="text-[9px] text-slate-500 uppercase font-bold">Token Hit Rate</div>
                  <div className="text-lg font-mono text-emerald-400 font-bold">{hitRate}%</div>
               </div>
             </div>
          </div>

          {/* Log Window */}
          <div className="p-4 bg-black/40 rounded-2xl border border-white/5 h-40 overflow-y-auto custom-scrollbar font-mono text-[10px] space-y-2">
            {logs.length === 0 && <span className="text-slate-600 italic">Server Logs waiting...</span>}
            {logs.map((log, i) => (
              <div key={i} className="animate-in slide-in-from-left-2 text-slate-300">
                <span className="text-slate-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
                {log}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Tree Visualization */}
        <div className="lg:col-span-8">
           <div className="h-full min-h-[500px] p-8 bg-slate-950 rounded-3xl border border-white/10 relative overflow-hidden flex flex-col items-center">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950" />
              
              {/* Legend */}
              <div className="absolute top-4 left-4 flex gap-3 z-10">
                 <div className="flex items-center gap-1.5">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                   <span className="text-[10px] text-slate-400">Hit (Zero Compute)</span>
                 </div>
                 <div className="flex items-center gap-1.5">
                   <div className="w-2 h-2 bg-blue-500 rounded-full" />
                   <span className="text-[10px] text-slate-400">New Compute</span>
                 </div>
              </div>

              {/* Tree Render */}
              <div className="relative z-10 mt-8 w-full overflow-x-auto flex justify-center">
                 {treeData.children.length === 0 ? (
                   <div className="flex flex-col items-center justify-center text-slate-600 mt-20 gap-4">
                      <Database className="w-12 h-12 opacity-20" />
                      <p className="text-sm">KV Cache is empty. Waiting for requests...</p>
                   </div>
                 ) : (
                   renderTree(treeData)
                 )}
              </div>

              {/* Concept Label */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-slate-900/80 backdrop-blur border border-white/10 rounded-full text-[10px] text-slate-400 flex items-center gap-2">
                 <Split className="w-3 h-3" />
                 <span>Radix Tree 自动维护最长公共前缀 (Longest Common Prefix)</span>
              </div>
           </div>
        </div>
      </div>

      {/* Comparison Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/5 space-y-4">
           <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Layers className="w-5 h-5" /></div>
              <div>
                <h4 className="font-bold text-sm text-slate-200">PagedAttention (vLLM)</h4>
                <div className="text-[10px] text-slate-500 uppercase">Like Virtual Memory</div>
              </div>
           </div>
           <p className="text-xs text-slate-400 leading-relaxed">
             将显存切分为固定大小的块（Blocks）。主要解决显存碎片问题，允许显存非连续存储。但在不同请求之间（Cross-Request），通常无法自动识别和复用公共前缀。
           </p>
        </div>

        <div className="p-6 bg-indigo-500/5 rounded-2xl border border-indigo-500/20 space-y-4">
           <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400"><GitBranch className="w-5 h-5" /></div>
              <div>
                <h4 className="font-bold text-sm text-white">RadixAttention (SGLang)</h4>
                <div className="text-[10px] text-indigo-400/80 uppercase">Like File System Cache</div>
              </div>
           </div>
           <p className="text-xs text-slate-300 leading-relaxed">
             在 PagedAttention 之上，维护一棵 Radix Tree。将 Token 序列视为路径。当新请求进来时，自动匹配树中最长的路径，直接复用其 KV Cache，<b>实现 0 计算成本的 Prompt 加载</b>。
           </p>
        </div>
      </div>
    </div>
  );
};

export default RadixAttentionSim;
