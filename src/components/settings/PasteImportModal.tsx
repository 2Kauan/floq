import { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { parseImportText } from '../../services/importService';
import { ImportPreviewData } from '../../types';
import { ClipboardPaste } from 'lucide-react';
import { useToastStore } from '../../store/useToastStore';

export interface PasteImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onParsed: (data: ImportPreviewData) => void;
}

export function PasteImportModal({
  isOpen,
  onClose,
  onParsed,
}: PasteImportModalProps) {
  const { addToast } = useToastStore();
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = async () => {
    if (!text.trim()) {
      setError('Cole o código JSON do seu backup.');
      return;
    }

    try {
      setIsProcessing(true);
      setError('');
      const data = await parseImportText(text.trim());
      if (data.totalBooks === 0 && data.totalHighlights === 0) {
        setError('O JSON não contém nenhum livro ou destaque.');
        return;
      }
      onParsed(data);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'JSON inválido ou corrompido.';
      setError(msg);
      addToast({
        type: 'error',
        message: msg,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePasteClipboard = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      if (clipText) {
        setText(clipText);
        setError('');
      }
    } catch {
      // Ignored if permissions not granted
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Restaurar por Texto (JSON)"
      description="Cole o conteúdo do arquivo de backup JSON abaixo."
      maxWidth="lg"
    >
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="json-paste-area" className="text-xs font-semibold text-ink">
            Conteúdo JSON do Backup
          </label>
          <button
            type="button"
            onClick={handlePasteClipboard}
            className="text-xs text-accent hover:underline flex items-center gap-1 font-medium"
          >
            <ClipboardPaste className="w-3.5 h-3.5" />
            <span>Colar da área de transferência</span>
          </button>
        </div>

        <textarea
          id="json-paste-area"
          rows={8}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (error) setError('');
          }}
          placeholder='Cole aqui o JSON (ex: {"version": "1.0", "books": [...], ...})'
          className="w-full bg-bg text-ink border border-border rounded-xl p-3.5 text-xs font-mono outline-none focus:border-accent focus:ring-1 focus:ring-accent resize-y leading-relaxed"
        />

        {error && <p className="text-xs text-destructive">{error}</p>}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
          <Button variant="secondary" onClick={onClose} disabled={isProcessing}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleProcess} isLoading={isProcessing}>
            Processar e Visualizar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
