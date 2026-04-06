import React from 'react';
import { clsx } from 'clsx';
import { LucideIcon } from 'lucide-react'; // import type for icon

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  textColor: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, color, textColor }) => {
  return (
    <div className="bg-white h-[120px] p-6 rounded-2xl border border-zinc-100 shadow-sm flex items-center justify-between">
      <div className="flex-1">
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
        <h3 className={clsx("text-3xl font-bold", textColor)}>{value}</h3>
      </div>
      <div className={`p-4 rounded-2xl shrink-0 ml-4 ${color}`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
    </div>
  );
};