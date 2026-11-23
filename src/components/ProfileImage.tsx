import React, { useState } from 'react';

export interface ProfileImageProps {
  src?: string;
  alt?: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero' | 'custom';
  shape?: 'circle' | 'rounded-lg' | 'rounded-xl' | 'rounded-2xl' | 'rounded-3xl';
  bordered?: boolean;
}

const sizeClasses: Record<string, string> = {
  xs: 'w-7 h-7',
  sm: 'w-9 h-9 sm:w-10 sm:h-10',
  md: 'w-12 h-12',
  lg: 'w-14 h-14 sm:w-16 sm:h-16',
  xl: 'w-20 h-20 sm:w-24 sm:h-24',
  hero: 'w-72 h-72 sm:w-80 sm:h-80',
  custom: '',
};

const shapeClasses: Record<string, string> = {
  circle: 'rounded-full',
  'rounded-lg': 'rounded-lg',
  'rounded-xl': 'rounded-xl',
  'rounded-2xl': 'rounded-2xl',
  'rounded-3xl': 'rounded-3xl',
};

export const ProfileImage: React.FC<ProfileImageProps> = ({
  src = '/images/profile.jpg',
  alt = 'Abderrahman El Harakani - Data Scientist & AI Engineer',
  className = '',
  size = 'md',
  shape = 'rounded-xl',
  bordered = false,
}) => {
  const [imgError, setImgError] = useState(false);

  // Fallback to primary professional portrait
  const imageSource = imgError || !src || src.trim() === '' ? '/images/profile.jpg' : src;

  const sizeClass = sizeClasses[size] || '';
  const shapeClass = shapeClasses[shape] || 'rounded-xl';
  const borderClass = bordered
    ? 'border-2 border-white dark:border-[#162238] shadow-md ring-1 ring-slate-200/50 dark:ring-slate-700/50'
    : '';

  return (
    <div
      className={`relative overflow-hidden shrink-0 select-none bg-slate-100 dark:bg-slate-800 ${sizeClass} ${shapeClass} ${borderClass} ${className}`}
    >
      <img
        src={imageSource}
        alt={alt}
        onError={() => setImgError(true)}
        className="w-full h-full object-cover object-top transition-transform duration-300"
        loading="eager"
      />
    </div>
  );
};
