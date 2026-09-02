import { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Book, Highlight } from '../../types';
import { formatDate } from '../../utils/date';
import { Copy, Check, Edit3, Trash2, Tag, BookOpen } from 'lucide-react';
import { useToastStore } from '../../store/useToastStore';

export interface HighlightExpandedModalProps {
  isOpen: boolean;
  highlight: Highlight | null;
  book?: Book | null;
  onClose: () => void;
  onEdit: (highlight: Highlight) => void;
  onDelete: (highlight: Highlight) => void;
}

export function HighlightExpandedModal({
  isOpen,
  highlight,
  book,
  onClose,
  onEdit,
  onDelete,
}: HighlightExpandedModalProps) {
  const { addToast } = useToastStore();
  const [hasCopied, setHasCopied] = useState(false);

  if (!highlight) return null;

  const handleCopyText = async () => {
    let copyString = `“${highlight.text}”`;
    if (book) {
      copyString += `\n— ${book.author ? `${book.author}, ` : ''}《${book.title}》`;
      if (highlight.page) {
        copyString += ` (p. ${highlight.page})`;
      }
    }

    try {
      await navigator.clipboard.writeText(copyString);
      setHasCopied(true);
      addToast({
        type: 'success',
        message: 'Citação copiada para a área de transferência.',
      });
      setTimeout(() => setHasCopied(false), 2000);
    } catch {
      addToast({
        type: 'error',
        message: 'Não foi possível copiar o texto.',
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      showCloseButton={true}
    >
      <div className="flex flex-col py-2">
        {/* Book Context Snippet */}
        {book && (
          <div className="flex items-center gap-2 text-xs text-ink-muted mb-4 pb-3 border-b border-border">
            <BookOpen className="w-3.5 h-3.5 text-accent" />
            <span className="font-semibold text-ink">{book.title}</span>
            {book.author && <span>por {book.author}</span>}
            {highlight.page && (
              <span className="ml-auto bg-surface border border-border px-2 py-0.5 rounded-full text-[11px]">
                p. {highlight.page}
              </span>
            )}
          </div>
        )}

        {/* Serif Quote */}
        <div className="relative px-3 sm:px-5 py-3 sm:py-4 my-1">
          <blockquote className="text-lg sm:text-xl font-serif text-ink leading-relaxed italic">
            <span className="text-2xl sm:text-3xl text-accent font-serif font-bold mr-1.5 select-none opacity-80">
              “
            </span>
            {highlight.text}
            <span className="text-2xl sm:text-3xl text-accent font-serif font-bold ml-1.5 select-none opacity-80">
              ”
            </span>
          </blockquote>
        </div>

        {/* Reflection / Margin Note */}
        {highlight.comment && (
          <div className="mt-4 p-4 bg-bg/70 border-l-4 border-accent rounded-r-lg">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-ink-muted mb-1">
              Reflexão / Anotação Pessoal
            </span>
            <p className="text-sm text-ink leading-relaxed font-sans">
              {highlight.comment}
            </p>
          </div>
        )}

        {/* Tags & Date */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-border">
          <div className="flex flex-wrap items-center gap-1.5">
            {highlight.tags && highlight.tags.length > 0 ? (
              highlight.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-bg border border-border text-ink-muted"
                >
                  <Tag className="w-2.5 h-2.5" />
                  <span>#{tag}</span>
                </span>
              ))
            ) : (
              <span className="text-xs text-ink-muted">Sem tags</span>
            )}
          </div>

          <div className="text-xs text-ink-muted">
            Marcado em {formatDate(highlight.createdAt)}
          </div>
        </div>

        {/* Actions Toolbar */}
        <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(highlight)}
            leftIcon={<Trash2 className="w-4 h-4 text-destructive" />}
            className="text-destructive hover:bg-destructive/10"
          >
            Excluir
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopyText}
              leftIcon={
                hasCopied ? (
                  <Check className="w-4 h-4 text-success" />
                ) : (
                  <Copy className="w-4 h-4" />
                )
              }
            >
              {hasCopied ? 'Copiado!' : 'Copiar Citação'}
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => onEdit(highlight)}
              leftIcon={<Edit3 className="w-4 h-4" />}
            >
              Editar
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
