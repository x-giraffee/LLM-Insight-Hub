// Fix: Added React import to resolve namespace errors for ReactNode
import React from 'react';

export enum ModuleCategory {
  FUNDAMENTALS = 'Fundamentals',
  PERFORMANCE = 'Performance',
  ARCHITECTURE = 'Architecture',
  ECOSYSTEM = 'Ecosystem'
}

export interface Module {
  id: string;
  title: string;
  description: string;
  category: ModuleCategory;
  // Fix: React.ReactNode requires React to be imported in the file scope
  icon: React.ReactNode;
  // Fix: React.ReactNode requires React to be imported in the file scope
  content: React.ReactNode;
}

export interface ParameterData {
  name: string;
  size: number; // in Billions
  memory: number; // estimated VRAM in GB
}