import { getPlaceholderColor, getInitialLetter } from '../../utils/colors';

export interface CoverPlaceholderProps {
  title: string;
  className?: string;
}

export function CoverPlaceholder({ title, className = '' }: CoverPlaceholderProps) {
  const bgColor = getPlaceholderColor(title);
  const initial = getInitialLetter(title);

  return (
    <div
      style={{ backgroundColor: bgColor }}
      className={`relative w-full aspect-2/3 rounded-sm flex flex-col items-center justify-between p-4 text-white overflow-hidden shadow-cover select-none ${className}`}
      aria-label={`Capa ilustrada para ${title}`}
    >
      {/* Decorative Book Spine & Corner subtle gradient */}
      <div className="absolute inset-y-0 left-0 w-3 bg-black/20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-tr from-black/25 via-transparent to-white/10 pointer-events-none" />

      {/* Top Title Snippet */}
      <div className="w-full text-center z-10 pt-1">
        <span className="text-[10px] font-sans tracking-widest uppercase opacity-75 line-clamp-1">
          {title}
        </span>
      </div>

      {/* Large Serif Initial */}
      <div className="z-10 my-auto">
        <span className="font-serif font-bold text-5xl sm:text-6xl drop-shadow-md text-white/90">
          {initial}
        </span>
      </div>

      {/* Bottom accent line */}
      <div className="w-10 h-0.5 bg-white/30 rounded-full z-10 mb-1" />
    </div>
  );
}
