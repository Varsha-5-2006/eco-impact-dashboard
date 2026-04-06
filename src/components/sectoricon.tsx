import React from 'react';
import { Home, Building2, ShoppingBag, Plane, TrendingDown } from 'lucide-react';

interface SectorIconProps {
  sector: 'Housing' | 'Office' | 'Retail' | 'Tourism' | 'Transport';
}

export const SectorIcon: React.FC<SectorIconProps> = ({ sector }) => {
  switch(sector) {
    case 'Housing': return <Home className="w-5 h-5" />;
    case 'Office': return <Building2 className="w-5 h-5" />;
    case 'Retail': return <ShoppingBag className="w-5 h-5" />;
    case 'Tourism': return <Plane className="w-5 h-5" />;
    case 'Transport': return <TrendingDown className="w-5 h-5" />;
    default: return null;
  }
};