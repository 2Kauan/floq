import React, { useState, useRef } from 'react';
import { useSettings } from '../hooks/useSettings';
import { exportLibrary, ExportResult } from '../services/exportService';
import { parseImportZip } from '../services/importService';
import { ImportPreviewModal } from '../components/settings/ImportPreviewModal';
import { ExportSuccessModal } from '../components/settings/ExportSuccessModal';
import { PasteImportModal } from '../components/settings/PasteImportModal';
import { Button } from '../components/common/Button';
import { useToastStore } from '../store/useToastStore';
import { formatDateTime } from '../utils/date';
import { ImportPreviewData, ThemeMode } from '../types';
import {
  Sun,
  Moon,
  Laptop,
  Download,
  Upload,
  ShieldCheck,
  Feather,
  Info,
  ClipboardPaste,
} from 'lucide-react';

export function SettingsPage() {
  const { settings, setTheme } = useSettings();
  const { addToast } = useToastStore();

  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // Modals state
  const [exportResult, setExportResult] = useState<ExportResult | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const [previewData, setPreviewData] = useState<ImportPreviewData | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const result = await exportLibrary();
      setExportResult(result);
      setIsExportModalOpen(true);
      addToast({
        type: 'success',
        message: `Backup gerado! (${result.bookCount} livros e ${result.highlightCount} destaques).`,
      });
    } catch {
      addToast({
        type: 'error',
        message: 'Erro ao gerar o backup da biblioteca.',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      const data = await parseImportZip(file);
      if (data.totalBooks === 0 && data.totalHighlights === 0) {
        addToast({
          type: 'info',
          message: 'O arquivo selecionado não contém livros ou destaques.',
        });
        return;
      }
      setPreviewData(data);
      setIsImportModalOpen(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao ler arquivo de importação.';
      addToast({
        type: 'error',
        message: msg,
        duration: 6000,
      });
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const themeOptions: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
    { value: 'light', label: 'Claro', icon: Sun },
    { value: 'dark', label: 'Escuro', icon: Moon },
    { value: 'system', label: 'Sistema', icon: Laptop },
  ];

  return (
    <div className="max-w-2xl mx-auto flex flex-col space-y-8 pb-12 animate-fade-in-up">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ink tracking-tight">
          Ajustes & Biblioteca
        </h1>
        <p className="text-xs text-ink-muted mt-0.5">
          Personalização, backup e restauração dos seus dados no FLOQT.
        </p>
      </div>

      {/* Theme Selection */}
      <section className="p-5 bg-surface border border-border rounded-xl space-y-3 shadow-2xs">
        <h2 className="text-sm font-semibold font-serif text-ink">Aparência</h2>
        <div className="grid grid-cols-3 gap-2">
          {themeOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = settings.theme === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setTheme(opt.value)}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'border-accent bg-accent/10 text-accent font-semibold shadow-2xs'
                    : 'border-border bg-bg text-ink-muted hover:text-ink hover:bg-bg/80'
                }`}
              >
                <Icon className="w-5 h-5 mb-1.5" />
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Backup & Restore (Export / Import) */}
      <section className="p-5 bg-surface border border-border rounded-xl space-y-4 shadow-2xs">
        <div>
          <h2 className="text-sm font-semibold font-serif text-ink">
            Backup e Restauração
          </h2>
          <p className="text-xs text-ink-muted mt-1 leading-relaxed">
            Seus livros, destaques e imagens de capa ficam salvos no seu navegador. Faça backups com frequência para transferir entre dispositivos ou guardar uma cópia segura.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {/* Export Button */}
          <Button
            variant="primary"
            className="flex-1"
            onClick={handleExport}
            isLoading={isExporting}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Exportar Biblioteca (.zip)
          </Button>

          {/* Import Button */}
          <input
            type="file"
            ref={fileInputRef}
            onClick={() => {
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            onChange={handleFileSelected}
            accept=".zip,.json,application/zip,application/x-zip-compressed,application/json,application/octet-stream"
            className="hidden"
          />
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => fileInputRef.current?.click()}
            isLoading={isImporting}
            leftIcon={<Upload className="w-4 h-4" />}
          >
            Importar Arquivo (.zip ou .json)
          </Button>
        </div>

        {/* Alternative Import by Text */}
        <div className="pt-2 border-t border-border flex items-center justify-between">
          <span className="text-xs text-ink-muted">Opção alternativa:</span>
          <button
            type="button"
            onClick={() => setIsPasteModalOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs text-accent font-medium py-1 px-2 rounded-md hover:bg-bg transition-colors cursor-pointer"
          >
            <ClipboardPaste className="w-3.5 h-3.5" />
            <span>Restaurar colando texto JSON</span>
          </button>
        </div>

        {settings.lastExportAt && (
          <p className="text-[11px] text-ink-muted pt-1">
            Último backup exportado em:{' '}
            <span className="font-semibold text-ink">
              {formatDateTime(settings.lastExportAt)}
            </span>
          </p>
        )}
      </section>

      {/* Privacy & Architecture Notice */}
      <section className="p-5 bg-surface border border-border rounded-xl space-y-3 shadow-2xs">
        <div className="flex items-center gap-2 text-accent">
          <ShieldCheck className="w-5 h-5" />
          <h2 className="text-sm font-semibold font-serif text-ink">Privacidade Absoluta</h2>
        </div>
        <p className="text-xs text-ink-muted leading-relaxed">
          O <strong>FLOQT</strong> funciona 100% no seu dispositivo. Sem login, sem servidores na nuvem e sem anúncios. Todos os seus livros e destaques residem no banco de dados local do seu navegador (IndexedDB).
        </p>
      </section>

      {/* About Application */}
      <section className="p-5 bg-bg border border-border rounded-xl flex items-center justify-between text-xs text-ink-muted">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent text-white flex items-center justify-center font-serif font-bold text-sm">
            <Feather className="w-4 h-4" />
          </div>
          <div>
            <p className="font-serif font-bold text-ink text-sm">FLOQT</p>
            <p className="text-[11px]">Versão 1.0.0 • Biblioteca Digital Pessoal</p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px]">
          <Info className="w-3.5 h-3.5 text-accent" />
          <span>Offline-First PWA</span>
        </div>
      </section>

      {/* Export Success Modal */}
      <ExportSuccessModal
        isOpen={isExportModalOpen}
        exportResult={exportResult}
        onClose={() => setIsExportModalOpen(false)}
      />

      {/* Paste Import Modal */}
      <PasteImportModal
        isOpen={isPasteModalOpen}
        onClose={() => setIsPasteModalOpen(false)}
        onParsed={(data) => {
          setPreviewData(data);
          setIsImportModalOpen(true);
        }}
      />

      {/* Import Preview Modal */}
      <ImportPreviewModal
        isOpen={isImportModalOpen}
        previewData={previewData}
        onClose={() => {
          setIsImportModalOpen(false);
          setPreviewData(null);
        }}
        onImportComplete={() => {
          setIsImportModalOpen(false);
          setPreviewData(null);
        }}
      />
    </div>
  );
}
