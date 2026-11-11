import React from 'react';

export const FATEC_LOGO_SRC =
  '/assets/aistudio/1d461362ba4f02ad3ae6f56361791eb0e14b35a9_91ccd60a.png';

interface FatecLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const FatecLogo: React.FC<FatecLogoProps> = ({ className = '', size = 'lg' }) => {
  const sizeClasses =
    size === 'lg'
      ? 'h-12 md:h-14'
      : size === 'sm'
      ? 'h-8 md:h-9'
      : 'h-10 md:h-12';

  return (
    <div className={`inline-flex items-center justify-center select-none ${className}`}>
      <img
        src={FATEC_LOGO_SRC}
        alt="Fatec - Faculdade de Tecnologia"
        className={`${sizeClasses} w-auto object-contain block select-none`}
        draggable={false}
      />
    </div>
  );
};
