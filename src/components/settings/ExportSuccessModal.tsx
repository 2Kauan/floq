import { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Download, Copy, Check, FileArchive, FileJson, CheckCircle2 } from 'lucide-react';
import { useToastStore } from '../../store/useToastStore';
import { ExportResult } from '../../services/exportService';

export interface ExportSuccessModalProps {
  isOpen: boolean;
  exportResult: ExportResult | null;
  onClose: () => void;
}

export function ExportSuccessModal({
  isOpen,
  exportResult,
  onClose,
}: ExportSuccessModalProps) {
  const { addToast } = useToastStore();
  const [copied, setCopied] = useState(false);

  if (!exportResult) return null;

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(exportResult.jsonString);
      setCopied(true);
      addToast({
        type: 'success',
        message: 'Backup JSON copiado para a área de transferência!',
      });
      setTimeout(() => setCopied(false), 3000);
    } catch {
      addToast({
        type: 'error',
        message: 'Erro ao copiar dados para a área de transferência.',
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Backup Pronto!"
      description="Seus dados foram empacotados com sucesso."
      maxWidth="md"
    >
      <div className="flex flex-col space-y-6">
        <div className="p-4 bg-success/10 border border-success/30 rounded-xl flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-success shrink-0" />
          <div className="text-xs text-ink">
            <p className="font-semibold text-sm">
              {exportResult.bookCount} {exportResult.bookCount === 1 ? 'livro' : 'livros'} e{' '}
              {exportResult.highlightCount} {exportResult.highlightCount === 1 ? 'destaque' : 'destaques'}
            </p>
            <p className="text-ink-muted">
              {exportResult.savedViaPicker
                ? 'Arquivo salvo na pasta escolhida.'
                : 'Se o download não iniciou automaticamente, use os botões abaixo.'}
            </p>
          </div>
        </div>

        {/* Primary Download Button */}
        <div className="flex flex-col gap-3">
          <a
            href={exportResult.downloadUrl}
            download={exportResult.filename}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-lg shadow-sm transition-all text-center min-h-[44px]"
          >
            <Download className="w-5 h-5" />
            <span>Baixar Arquivo ({exportResult.filename})</span>
          </a>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button
              variant="secondary"
              onClick={handleCopyJson}
              leftIcon={copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
            >
              {copied ? 'JSON Copiado!' : 'Copiar JSON'}
            </Button>

            <a
              href={`data:application/json;charset=utf-8,${encodeURIComponent(exportResult.jsonString)}`}
              download={`floqt-backup-${new Date().toISOString().split('T')[0]}.json`}
              className="inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-md border border-border bg-surface text-ink hover:bg-bg transition-colors min-h-[44px]"
            >
              <FileJson className="w-4 h-4 text-accent" />
              <span>Baixar .JSON puro</span>
            </a>
          </div>
        </div>

        {/* Information Box */}
        <div className="p-3 bg-bg/60 border border-border rounded-lg text-[11px] text-ink-muted space-y-1">
          <p className="font-semibold text-ink flex items-center gap-1">
            <FileArchive className="w-3.5 h-3.5 text-accent" />
            Onde fica o arquivo?
          </p>
          <p>
            O arquivo é salvo na pasta de <strong>Downloads</strong> do seu computador. Ao importar futuramente, basta selecionar este arquivo <code>{exportResult.filename}</code>.
          </p>
        </div>

        <div className="flex justify-end pt-2 border-t border-border">
          <Button variant="primary" onClick={onClose}>
            Concluir
          </Button>
        </div>
      </div>
    </Modal>
  );
}
