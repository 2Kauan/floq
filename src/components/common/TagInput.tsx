import { useState, KeyboardEvent } from 'react';
import { X, Tag as TagIcon } from 'lucide-react';

export interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
  placeholder?: string;
  disabled?: boolean;
}

export function TagInput({
  tags,
  onChange,
  maxTags = 10,
  placeholder = 'Adicionar tag (Enter ou vírgula)...',
  disabled = false,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const addTag = (text: string) => {
    const clean = text.trim().replace(/^#/, '');
    if (!clean) return;
    if (tags.length >= maxTags) return;
    if (tags.some((t) => t.toLowerCase() === clean.toLowerCase())) {
      setInputValue('');
      return;
    }
    onChange([...tags, clean]);
    setInputValue('');
  };

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, i) => i !== indexToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-1.5 p-2 bg-bg/50 border border-border rounded-lg min-h-[44px] focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-colors">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-surface text-ink border border-border shadow-2xs"
          >
            <TagIcon className="w-3 h-3 text-ink-muted" />
            <span>{tag}</span>
            {!disabled && (
              <button
                type="button"
                onClick={() => removeTag(index)}
                aria-label={`Remover tag ${tag}`}
                className="p-0.5 rounded-full hover:bg-ink/10 text-ink-muted hover:text-ink transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </span>
        ))}

        {tags.length < maxTags && !disabled && (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => addTag(inputValue)}
            placeholder={tags.length === 0 ? placeholder : 'Adicionar...'}
            className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-sm text-ink placeholder:text-ink-muted/70 px-1 py-0.5"
          />
        )}
      </div>

      <div className="flex justify-between items-center text-xs text-ink-muted px-1">
        <span>Pressione Enter ou vírgula para adicionar</span>
        <span>{tags.length}/{maxTags}</span>
      </div>
    </div>
  );
}
