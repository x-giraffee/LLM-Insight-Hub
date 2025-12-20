
import React, { useState, useMemo } from 'react';
import { 
  ChevronRight, 
  Menu, 
  X, 
  Search, 
  Info,
  Github,
  Monitor
} from 'lucide-react';
import { APP_MODULES } from './constants';
import { Module, ModuleCategory } from './types';

const App: React.FC = () => {
  const [activeModuleId, setActiveModuleId] = useState<string>(APP_MODULES[0].id);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const activeModule = useMemo(() => 
    APP_MODULES.find(m => m.id === activeModuleId) || APP_MODULES[0],
    [activeModuleId]
  );

  const filteredModules = useMemo(() => 
    APP_MODULES.filter(m => 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [searchQuery]
  );

  const categories = Object.values(ModuleCategory);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Sidebar - Mobile Overlay */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
      </div>

      {/* Sidebar Content */}
      <aside className={`fixed lg:static z-50 h-full w-72 glass-card border-r transition-transform duration-300 flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Monitor className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">LLM Insights</h1>
              <p className="text-[10px] text-slate-400 font-medium tracking-[0.2em] uppercase">Architecture Hub</p>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="搜索原理解析..."
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {categories.map(category => {
            const categoryModules = filteredModules.filter(m => m.category === category);
            if (categoryModules.length === 0) return null;

            return (
              <div key={category} className="mb-6">
                <h3 className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">{category}</h3>
                <div className="space-y-1">
                  {categoryModules.map(module => (
                    <button
                      key={module.id}
                      onClick={() => {
                        setActiveModuleId(module.id);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all group
                        ${activeModuleId === module.id 
                          ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 shadow-inner' 
                          : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
                    >
                      <span className={`transition-colors ${activeModuleId === module.id ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                        {module.icon}
                      </span>
                      <span className="truncate">{module.title}</span>
                      {activeModuleId === module.id && <ChevronRight className="ml-auto w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 bg-black/20">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>v2.0 Beta</span>
            <div className="flex gap-3">
              <Github className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
              <Info className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto bg-slate-950">
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 glass-card border-b">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-xl font-bold tracking-tight">{activeModule.title}</h2>
              <p className="text-xs text-slate-400 hidden sm:block">{activeModule.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase rounded-full border border-green-500/20">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Environment Ready
            </span>
          </div>
        </header>

        {/* Module Content */}
        <div className="p-6 lg:p-10 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="glass-card rounded-2xl p-6 lg:p-8 min-h-[60vh]">
            {activeModule.content}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
