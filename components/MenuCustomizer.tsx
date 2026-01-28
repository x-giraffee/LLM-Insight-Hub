
import React, { useState, useEffect, useRef } from 'react';
import { X, Check, RotateCcw, CheckSquare, Square, Layers, List, Save, GripVertical } from 'lucide-react';
import { Module } from '../types';

interface MenuCustomizerProps {
  allModules: Module[];
  initialIds: string[];
  initialGroupBy: boolean;
  onSave: (ids: string[], groupBy: boolean) => void;
  onClose: () => void;
}

const MenuCustomizer: React.FC<MenuCustomizerProps> = ({
  allModules,
  initialIds,
  initialGroupBy,
  onSave,
  onClose
}) => {
  const [orderedIds, setOrderedIds] = useState<string[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [groupByCategory, setGroupByCategory] = useState(initialGroupBy);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Helper ref to keep track of the current list during drag operations to avoid closure staleness
  const listRef = useRef<string[]>([]);

  useEffect(() => {
    // Initialize master list (preserve existing order + append any missing new modules)
    const currentSet = new Set(initialIds);
    const missingIds = allModules.filter(m => !currentSet.has(m.id)).map(m => m.id);
    const initialList = [...initialIds, ...missingIds];
    
    setOrderedIds(initialList);
    listRef.current = initialList;
    setSelectedIds(currentSet);
  }, [initialIds, allModules]);

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  // --- Drag and Drop Logic ---

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    // Required for Firefox
    e.dataTransfer.setData("text/html", ""); 
    
    // Optional: Set custom drag image styling if needed, but default ghost is usually fine
    const ghost = e.currentTarget.cloneNode(true) as HTMLElement;
    ghost.style.opacity = "1";
    ghost.style.position = "absolute";
    ghost.style.top = "-1000px";
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 20, 20);
    setTimeout(() => document.body.removeChild(ghost), 0);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault(); // Necessary to allow dropping
    if (draggedIndex === null || draggedIndex === index) return;

    const currentList = [...orderedIds];
    const draggedItem = currentList[draggedIndex];

    // Remove item from old position
    currentList.splice(draggedIndex, 1);
    // Insert item at new position
    currentList.splice(index, 0, draggedItem);

    setOrderedIds(currentList);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // --- End Drag and Drop Logic ---

  const handleSave = () => {
    // Filter orderedIds to only include selected ones for the active config
    const finalIds = orderedIds.filter(id => selectedIds.has(id));
    onSave(finalIds, groupByCategory);
    onClose();
  };

  const selectAll = () => setSelectedIds(new Set(allModules.map(m => m.id)));
  const selectNone = () => setSelectedIds(new Set());
  const resetDefault = () => {
    const defaultOrder = allModules.map(m => m.id);
    setOrderedIds(defaultOrder);
    listRef.current = defaultOrder;
    setSelectedIds(new Set(defaultOrder));
    setGroupByCategory(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-slate-800/50 rounded-t-2xl">
          <div>
            <h3 className="text-lg font-bold text-white">自定义导航菜单</h3>
            <p className="text-xs text-slate-400 mt-1">按住右侧手柄拖拽排序，勾选需要演示的模块。</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-3 bg-black/20 border-b border-white/5 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2">
            <button onClick={selectAll} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs font-medium text-slate-300 transition-colors border border-white/5">
              <CheckSquare className="w-3.5 h-3.5" /> 全选
            </button>
            <button onClick={selectNone} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs font-medium text-slate-300 transition-colors border border-white/5">
              <Square className="w-3.5 h-3.5" /> 清空
            </button>
            <button onClick={resetDefault} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs font-medium text-slate-300 transition-colors border border-white/5">
              <RotateCcw className="w-3.5 h-3.5" /> 重置默认
            </button>
          </div>
          
          <button 
            onClick={() => setGroupByCategory(!groupByCategory)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold transition-all border
              ${groupByCategory 
                ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30' 
                : 'bg-slate-800 text-slate-400 border-white/5 hover:bg-slate-700'}`}
          >
            {groupByCategory ? <Layers className="w-3.5 h-3.5" /> : <List className="w-3.5 h-3.5" />}
            {groupByCategory ? '视图: 按分类分组' : '视图: 扁平列表'}
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar bg-slate-950/30">
          {orderedIds.map((id, index) => {
            const module = allModules.find(m => m.id === id);
            if (!module) return null;
            const isSelected = selectedIds.has(id);
            const isDragging = draggedIndex === index;

            return (
              <div 
                key={id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all duration-200 group cursor-default relative
                  ${isSelected ? 'bg-slate-800/40 border-white/5' : 'bg-transparent border-transparent opacity-50 hover:opacity-80 hover:bg-white/5'}
                  ${isDragging ? 'opacity-0' : 'opacity-100'} 
                `}
                style={{ 
                  transform: isDragging ? 'scale(1.02)' : 'none',
                  zIndex: isDragging ? 10 : 1 
                }}
              >
                {/* Drag Handle */}
                <div className="cursor-grab active:cursor-grabbing text-slate-600 hover:text-slate-300 p-1">
                  <GripVertical className="w-4 h-4" />
                </div>

                <button 
                  onClick={() => toggleSelection(id)}
                  className={`flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-all
                    ${isSelected ? 'bg-indigo-500 border-indigo-500 text-white shadow-md shadow-indigo-500/20' : 'border-slate-600 bg-slate-900/50 hover:border-slate-400'}`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </button>

                <div className={`p-2 rounded-md border border-white/5 flex items-center justify-center text-slate-400
                   ${isSelected ? 'bg-slate-800' : 'bg-slate-900'}
                `}>
                  {module.icon}
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className={`text-sm font-medium truncate ${isSelected ? 'text-slate-200' : 'text-slate-500'}`}>
                    {module.title}
                  </div>
                  <div className="text-[10px] text-slate-600 truncate flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                    {module.category}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-white/10 bg-slate-900/80 rounded-b-2xl flex justify-end gap-3 backdrop-blur-md">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            取消
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            应用配置
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCustomizer;
