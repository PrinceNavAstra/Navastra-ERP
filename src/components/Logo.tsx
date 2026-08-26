import React from 'react';

interface LogoProps {
  size?: number | string;
  className?: string;
  variant?: 'icon' | 'badge' | 'full';
  showText?: boolean;
  textClassName?: string;
}

export const ErpLogoIcon: React.FC<{ size?: number | string; className?: string }> = ({ 
  size = 36, 
  className = '' 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      {/* 
        Official ERP Monogram Vector:
        Features 180° rotational symmetry with 4 vibrant geometric ribbon strokes:
        - Orange: Left vertical pillar + top-left angled inner hook (#F97316)
        - Cyan/Teal: Upper diagonal link (#00A887)
        - Red: Lower diagonal link (#E5232F)
        - Green: Right vertical pillar + bottom-right angled inner hook (#22C55E)
      */}
      
      {/* Red lower diagonal bar */}
      <path
        d="M 116 470 L 332 274"
        stroke="#E5232F"
        strokeWidth="68"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Cyan / Teal upper diagonal bar */}
      <path
        d="M 180 274 L 396 78"
        stroke="#00A887"
        strokeWidth="68"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Orange left vertical stem with hook */}
      <path
        d="M 116 432 L 116 118 L 184 180"
        stroke="#FA7C17"
        strokeWidth="68"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Green right vertical stem with hook */}
      <path
        d="M 396 80 L 396 394 L 328 332"
        stroke="#22C55E"
        strokeWidth="68"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const ErpLogoBadge: React.FC<{ 
  size?: number; 
  className?: string; 
  bg?: 'dark' | 'white' | 'glass';
  onClick?: () => void;
  title?: string;
}> = ({ 
  size = 38, 
  className = '', 
  bg = 'dark',
  onClick,
  title
}) => {
  const bgClasses = {
    dark: 'bg-[#151b2e] border border-[#2a3556] shadow-sm',
    white: 'bg-white border border-slate-200/90 shadow-sm',
    glass: 'bg-white/10 backdrop-blur-md border border-white/20 shadow-sm'
  }[bg];

  return (
    <div 
      onClick={onClick}
      title={title}
      className={`rounded-xl flex items-center justify-center p-1.5 transition-all duration-200 ${bgClasses} ${
        onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
      } ${className}`}
      style={{ width: size, height: size }}
    >
      <ErpLogoIcon size={size * 0.76} />
    </div>
  );
};

export const Logo: React.FC<LogoProps> = ({
  size = 38,
  className = '',
  variant = 'full',
  showText = true,
  textClassName = ''
}) => {
  if (variant === 'icon') {
    return <ErpLogoIcon size={size} className={className} />;
  }

  if (variant === 'badge') {
    return <ErpLogoBadge size={typeof size === 'number' ? size : 38} className={className} />;
  }

  return (
    <div className={`flex items-center space-x-3 select-none ${className}`}>
      <ErpLogoBadge size={typeof size === 'number' ? size : 38} />
      {showText && (
        <div className="min-w-0">
          <div className={`font-bold text-white text-base leading-tight tracking-tight flex items-center gap-1.5 ${textClassName}`}>
            <span>Navastra</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#232b45] text-emerald-400 border border-emerald-700/40">
              ERP
            </span>
          </div>
          <div className="text-[11px] text-slate-400 font-medium truncate">
            Enterprise Modular Platform
          </div>
        </div>
      )}
    </div>
  );
};

export default Logo;
