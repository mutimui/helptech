import React from 'react';
import { FatecLogo } from '../brand/FatecLogo.tsx';

export const FatecHeader: React.FC = () => {
  return (
    <header className="w-full bg-[#990000] h-20 md:h-24 flex items-center px-8 md:px-16 shadow-sm shrink-0">
      <FatecLogo size="lg" />
    </header>
  );
};
