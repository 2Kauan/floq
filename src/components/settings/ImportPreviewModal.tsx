import { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { ConflictResolutionOption, ImportPreviewData } from '../../types';
import { executeImport } from '../../services/importService';
import { useToastStore } from '../../store/useToastStore';
import { BookOpen, Quote, AlertTriangle } from 'lucide-react';

export interface ImportPreviewModalProps {
  isOpen: boolean;
  previewData: ImportPreviewData | null;
  onClose: () => void;
  onImportComplete: () => void;
}

export function ImportPreviewModal({
  isOpen,
  previewData,
  onClose,
  onImportComplete,
}: ImportPreviewModalProps) {
  const { addToast } = useToastStore();
  const [resolutions, setResolutions] = useState<Map<string, ConflictResolutionOption>>(new Map());
  const [isProcessing, setIsProcessing] = useState(false);

  if (!previewData) return null;

  const handleResolutionChange = (bookId: string, option: ConflictResolutionOption) => {
    const next = new Map(resolutions);
    next.set(bookId, option);
    setResolutions(next);
  };

  const handleConfirmImport = async () => {
    try {
      setIsProcessing(true);
      const result = await executeImport(previewData, resolutions);
      addToast({
        type: 'success',
        message: `${result.booksImported} livros e ${result.highlightsImported} destaques importados com sucesso.`,
      });
      onImportComplete();
      onClose();
    } catch {
      addToast({
        type: 'error',
        message: 'Erro ao processar importação.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Revisão de Importação"
      description="Revise os livros e destaques encontrados no arquivo antes de confirmar."
      maxWidth="lg"
    >
      <div className="flex flex-col space-y-6">
        {/* Import Summary Counters */}
        <div className="grid grid-cols-2 gap-3 p-4 bg-bg/70 border border-border rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10 text-accent">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-base font-serif font-bold text-ink">{previewData.totalBooks}</p>
              <p className="text-xs text-ink-muted">Livros no backup</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10 text-accent">
              <Quote className="w-5 h-5" />
            </div>
            <div>
              <p className="text-base font-serif font-bold text-ink">{previewData.totalHighlights}</p>
              <p className="text-xs text-ink-muted">Destaques no backup</p>
            </div>
          </div>
        </div>

        {/* New Books Info */}
        {previewData.newBooks.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-2">
              Novos livros a adicionar ({previewData.newBooks.length})
            </h4>
            <div className="max-h-36 overflow-y-auto space-y-1 p-2 bg-bg/40 border border-border rounded-lg text-xs">
              {previewData.newBooks.map((b) => (
                <div key={b.id} className="py-1 px-2 flex justify-between items-center">
                  <span className="font-semibold text-ink line-clamp-1">{b.title}</span>
                  {b.author && <span className="text-ink-muted shrink-0 ml-2">{b.author}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conflicts Resolution Section */}
        {previewData.conflicts.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-destructive">
              <AlertTriangle className="w-4 h-4" />
              <span>Livros já existentes detectados ({previewData.conflicts.length})</span>
            </div>

            <p className="text-xs text-ink-muted">
              Estes livros já existem em sua biblioteca. Escolha como deseja tratar cada um:
            </p>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {previewData.conflicts.map((c) => {
                const currentRes = resolutions.get(c.incomingBook.id) || 'merge';
                return (
                  <div
                    key={c.incomingBook.id}
                    className="p-3 bg-surface border border-border rounded-lg shadow-2xs space-y-2"
                  >
                    <div>
                      <h5 className="text-sm font-serif font-semibold text-ink">{c.incomingBook.title}</h5>
                      <p className="text-xs text-ink-muted">
                        {c.incomingBook.author} • {c.incomingHighlights.length} destaques no arquivo
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name={`res-${c.incomingBook.id}`}
                          value="merge"
                          checked={currentRes === 'merge'}
                          onChange={() => handleResolutionChange(c.incomingBook.id, 'merge')}
                          className="text-accent"
                        />
                        <span>Mesclar destaques</span>
                      </label>

                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name={`res-${c.incomingBook.id}`}
                          value="replace"
                          checked={currentRes === 'replace'}
                          onChange={() => handleResolutionChange(c.incomingBook.id, 'replace')}
                          className="text-accent"
                        />
                        <span>Substituir</span>
                      </label>

                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name={`res-${c.incomingBook.id}`}
                          value="skip"
                          checked={currentRes === 'skip'}
                          onChange={() => handleResolutionChange(c.incomingBook.id, 'skip')}
                          className="text-accent"
                        />
                        <span>Pular</span>
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
          <Button variant="secondary" onClick={onClose} disabled={isProcessing}>
            Cancelar
          </Button>

          <Button variant="primary" onClick={handleConfirmImport} isLoading={isProcessing}>
            Confirmar e Importar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
