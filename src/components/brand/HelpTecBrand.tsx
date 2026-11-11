import React from 'react';
import { HelpTecMascot } from './HelpTecMascot.tsx';

interface HelpTecBrandProps {
  variant?: 'login' | 'sidebar';
  className?: string;
}

export const HelpTecBrand: React.FC<HelpTecBrandProps> = ({
  variant = 'login',
  className = '',
}) => {
  if (variant === 'sidebar') {
    return (
      <div className={`flex flex-col items-center justify-center text-center select-none ${className}`}>
        <div className="flex items-center justify-center mb-2">
          <HelpTecMascot size={88} />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white leading-none">
          HelpTec
        </h1>
        <p className="text-[11px] font-normal text-white/80 tracking-wide mt-1">
          Sistema de Chamado
        </p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center text-center select-none ${className}`}>
      {/* Brand Name Typography */}
      <div className="flex items-baseline justify-center leading-none mb-1.5">
        <span
          className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-slate-100 tracking-tight transition-colors"
          style={{ fontFamily: 'monospace', fontWeight: 'bold' }}
        >
          Help
        </span>
        <span
          className="text-4xl md:text-5xl font-bold text-[#990000] dark:text-red-500 tracking-tight transition-colors"
          style={{ fontFamily: 'monospace', fontStyle: 'normal', fontWeight: 'bold' }}
        >
          Tec
        </span>
      </div>

      {/* Subtitle */}
      <span className="text-xs md:text-sm font-medium tracking-normal mb-6 text-black dark:text-slate-300 transition-colors">
        Suporte de Manutenção
      </span>

      {/* Mascot Graphic */}
      <div className="flex items-center justify-center">
        <HelpTecMascot size={260} />
      </div>
    </div>
  );
};
