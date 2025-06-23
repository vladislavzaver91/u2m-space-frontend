import { Link } from '@/i18n/routing';
import { ReactNode } from 'react';

interface TextPart {
  text: string;
  color?: string;
}

interface ButtonCustom {
  textParts?: TextPart[];
  text?: string;
  icon?: ReactNode;
  href?: string;
  isHover?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  className?: string;
  textClass?: string;
  iconWrapperClass?: string;
  disableClass?: string;
  disabled?: boolean;
}

export const ButtonCustom = ({
  textParts,
  text,
  icon,
  href,
  isHover = false,
  onClick,
  className = '',
  textClass = '',
  iconWrapperClass = '',
  disableClass = '',
  disabled = false,
}: ButtonCustom) => {
  const iconStyles = 'gap-4';
  const hover = 'hover:bg-[#F7F7F7] max-lg:focus:bg-[#F7F7F7]';
  const baseStyles = `inline-flex items-center bg-transparent text-[#4f4f4f] font-bold text-[16px] cursor-pointer group transition-colors ${
    disabled ? `cursor-not-allowed! ${disableClass}` : ''
  }`;

  const content = (
    <>
      <div className={iconWrapperClass}>{icon}</div>
      {textParts && (
        <span className='flex items-center gap-1 font-bold text-[16px]'>
          {textParts.map((part, index) => (
            <span
              key={index}
              className={part.color ? `text-${part.color}` : 'text-[#4f4f4f]'}
            >
              {part.text}
            </span>
          ))}
        </span>
      )}
      {text && <p className={textClass}>{text}</p>}
    </>
  );

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    console.log('ButtonCustom clicked:', { href });
    onClick?.(e);
    if (href && !e.defaultPrevented && href.startsWith('http')) {
      console.log('Opening external URL:', href);
      // Используем window.open для OAuth pop-up
      window.open(href, '_blank', 'noopener,noreferrer,width=500,height=600');
    }
  };

  // Добавляем touchstart для мобильных
  const handleTouchStart = (e: React.TouchEvent<HTMLAnchorElement>) => {
    console.log('ButtonCustom touchstart:', { href });
    if (href && href.startsWith('http')) {
      console.log('Opening external URL on touch:', href);
      window.open(href, '_blank', 'noopener,noreferrer,width=500,height=600');
    }
  };

  if (href) {
    if (href.startsWith('http')) {
      return (
        <a
          href={href}
          rel='noopener noreferrer'
          className={`${icon && iconStyles} ${baseStyles} ${isHover && hover} ${className} group select-none`}
          onClick={handleClick}
          onTouchStart={handleTouchStart}
        >
          {content}
        </a>
      );
    }
    return (
      <Link
        href={href}
        rel='preload'
        className={`${icon && iconStyles} ${baseStyles} ${isHover && hover} ${className} group select-none`}
        onClick={handleClick}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`${icon && iconStyles} ${baseStyles} ${isHover && hover} ${className} group select-none`}
      disabled={disabled}
    >
      {content}
    </button>
  );
};