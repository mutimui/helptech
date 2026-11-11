import React from 'react';

export const HELPTEC_LOGO_SRC =
  '/assets/aistudio/5511962517173_s_whatsapp_net-3EB02F4DEAF755B3D7A12B_0d6d4e6e.png';

interface HelpTecLogoProps {
  className?: string;
  size?: number | string;
  alt?: string;
}

export const HelpTecLogo: React.FC<HelpTecLogoProps> = ({
  className = '',
  size = 220,
  alt = 'HelpTec - Logo Oficial',
}) => {
  const dimensionStyle =
    typeof size === 'number'
      ? { width: `${size}px`, height: `${size}px` }
      : { width: size, height: size };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none shrink-0 ${className}`}
      style={dimensionStyle}
    >
      <img
        src={HELPTEC_LOGO_SRC}
        alt={alt}
        className="w-full h-full object-contain pointer-events-none drop-shadow-sm"
        draggable={false}
      />
    </div>
  );
};

// Alias to maintain full compatibility with any existing imports
export const HelpTecMascot = HelpTecLogo;
