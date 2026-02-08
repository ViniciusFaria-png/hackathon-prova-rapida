/**
 * PDF Layout Presets — "Botão Mágico" de Economia
 *
 * Modos de impressão que permitem ao professor economizar papel e/ou tinta
 * na hora de exportar provas em PDF.
 *
 * - normal:      layout padrão, sem otimizações
 * - save-paper:  margens reduzidas, fonte menor, espaçamentos compactos
 * - save-ink:    cores removidas, fonte eco-friendly, sem elementos decorativos
 * - eco-max:     combinação de save-paper + save-ink para economia máxima
 */

export type PdfEcoMode = 'normal' | 'save-paper' | 'save-ink' | 'eco-max' | 'accessibility';

export interface PdfLayoutConfig {
  /** Tamanho da página */
  pageSize: string;
  /** Margens em pontos */
  margins: { top: number; bottom: number; left: number; right: number };
  /** Família de fonte principal (PDFKit built-in) */
  fontFamily: string;
  /** Família de fonte bold */
  fontFamilyBold: string;
  /** Tamanhos de fonte */
  fontSize: {
    title: number;
    subtitle: number;
    question: number;
    alternative: number;
    header: number;
    footer: number;
  };
  /** Cor do texto principal */
  textColor: string;
  /** Cor do texto secundário (subtítulos, datas) */
  secondaryTextColor: string;
  /** Cor dos separadores */
  separatorColor: string;
  /** Mostrar linhas separadoras entre questões */
  showSeparators: boolean;
  /** Mostrar background colorido no gabarito */
  showAnswerHighlight: boolean;
  /** Cor do highlight da resposta correta */
  answerHighlightColor: string;
  /** Cor do texto da resposta correta */
  answerTextColor: string;
  /** Espaçamento após cada questão (em unidades moveDown) */
  questionSpacing: number;
  /** Espaçamento após cada alternativa */
  alternativeSpacing: number;
  /** Espaçamento após cabeçalho */
  headerSpacing: number;
  /** Recuo das alternativas (em pontos) */
  alternativeIndent: number;
  /** Largura útil da página (calculada) */
  contentWidth: number;
  /** Modo de colunas para alternativas curtas (futuro) */
  compactAlternatives: boolean;
  /** Rótulo do modo para exibir no rodapé */
  modeLabel: string;
  /** Estimativa de economia (para exibição) */
  savingsEstimate: { paper: string; ink: string };
}

const PAGE_WIDTH_A4 = 595.28;

function contentWidth(margins: { left: number; right: number }): number {
  return PAGE_WIDTH_A4 - margins.left - margins.right;
}

const normalMargins = { top: 60, bottom: 60, left: 50, right: 50 };

const NORMAL_PRESET: PdfLayoutConfig = {
  pageSize: 'A4',
  margins: normalMargins,
  fontFamily: 'Helvetica',
  fontFamilyBold: 'Helvetica-Bold',
  fontSize: {
    title: 18,
    subtitle: 11,
    question: 11,
    alternative: 10,
    header: 10,
    footer: 8,
  },
  textColor: '#000000',
  secondaryTextColor: '#555555',
  separatorColor: '#cccccc',
  showSeparators: true,
  showAnswerHighlight: true,
  answerHighlightColor: '#e8f5e9',
  answerTextColor: '#2e7d32',
  questionSpacing: 0.6,
  alternativeSpacing: 0,
  headerSpacing: 0.5,
  alternativeIndent: 58,
  contentWidth: contentWidth(normalMargins),
  compactAlternatives: false,
  modeLabel: '',
  savingsEstimate: { paper: '0%', ink: '0%' },
};

const savePaperMargins = { top: 30, bottom: 30, left: 30, right: 30 };

const SAVE_PAPER_PRESET: PdfLayoutConfig = {
  pageSize: 'A4',
  margins: savePaperMargins,
  fontFamily: 'Helvetica',
  fontFamilyBold: 'Helvetica-Bold',
  fontSize: {
    title: 14,
    subtitle: 9,
    question: 9,
    alternative: 8.5,
    header: 8,
    footer: 7,
  },
  textColor: '#000000',
  secondaryTextColor: '#555555',
  separatorColor: '#dddddd',
  showSeparators: false,
  showAnswerHighlight: true,
  answerHighlightColor: '#e8f5e9',
  answerTextColor: '#2e7d32',
  questionSpacing: 0.25,
  alternativeSpacing: 0,
  headerSpacing: 0.2,
  alternativeIndent: 38,
  contentWidth: contentWidth(savePaperMargins),
  compactAlternatives: true,
  modeLabel: '📄 Modo Economia de Papel',
  savingsEstimate: { paper: '~30-40%', ink: '0%' },
};

const saveInkMargins = { top: 60, bottom: 60, left: 50, right: 50 };

const SAVE_INK_PRESET: PdfLayoutConfig = {
  pageSize: 'A4',
  margins: saveInkMargins,
  fontFamily: 'Helvetica',
  fontFamilyBold: 'Helvetica',
  fontSize: {
    title: 16,
    subtitle: 10,
    question: 10,
    alternative: 9.5,
    header: 9,
    footer: 7.5,
  },
  textColor: '#444444',
  secondaryTextColor: '#777777',
  separatorColor: '#cccccc',
  showSeparators: false,
  showAnswerHighlight: false,
  answerHighlightColor: 'transparent',
  answerTextColor: '#444444',
  questionSpacing: 0.5,
  alternativeSpacing: 0,
  headerSpacing: 0.4,
  alternativeIndent: 58,
  contentWidth: contentWidth(saveInkMargins),
  compactAlternatives: false,
  modeLabel: '🖨️ Modo Economia de Tinta',
  savingsEstimate: { paper: '0%', ink: '~25-35%' },
};

const ecoMaxMargins = { top: 25, bottom: 25, left: 25, right: 25 };

const ECO_MAX_PRESET: PdfLayoutConfig = {
  pageSize: 'A4',
  margins: ecoMaxMargins,
  fontFamily: 'Helvetica',
  fontFamilyBold: 'Helvetica',
  fontSize: {
    title: 12,
    subtitle: 8,
    question: 8.5,
    alternative: 8,
    header: 7,
    footer: 6.5,
  },
  textColor: '#555555',
  secondaryTextColor: '#888888',
  separatorColor: '#dddddd',
  showSeparators: false,
  showAnswerHighlight: false,
  answerHighlightColor: 'transparent',
  answerTextColor: '#555555',
  questionSpacing: 0.15,
  alternativeSpacing: 0,
  headerSpacing: 0.15,
  alternativeIndent: 32,
  contentWidth: contentWidth(ecoMaxMargins),
  compactAlternatives: true,
  modeLabel: '♻️ Modo Economia Máxima',
  savingsEstimate: { paper: '~40-50%', ink: '~25-35%' },
};

const accessibilityMargins = { top: 60, bottom: 60, left: 50, right: 50 };

const ACCESSIBILITY_PRESET: PdfLayoutConfig = {
  pageSize: 'A4',
  margins: accessibilityMargins,
  fontFamily: 'Helvetica',
  fontFamilyBold: 'Helvetica-Bold',
  fontSize: { title: 22, subtitle: 16, question: 16, alternative: 16, header: 14, footer: 12 },
  textColor: '#000000',
  secondaryTextColor: '#333333',
  separatorColor: '#999999',
  showSeparators: true,
  showAnswerHighlight: true,
  answerHighlightColor: '#e8f5e9',
  answerTextColor: '#2e7d32',
  questionSpacing: 1.5,
  alternativeSpacing: 0.5,
  headerSpacing: 1,
  alternativeIndent: 60,
  contentWidth: contentWidth(accessibilityMargins),
  compactAlternatives: false,
  modeLabel: '',
  savingsEstimate: { paper: '0%', ink: '0%' },
};

const PRESETS: Record<PdfEcoMode, PdfLayoutConfig> = {
  'normal': NORMAL_PRESET,
  'save-paper': SAVE_PAPER_PRESET,
  'save-ink': SAVE_INK_PRESET,
  'eco-max': ECO_MAX_PRESET,
  'accessibility': ACCESSIBILITY_PRESET,
};

export function getPdfLayoutConfig(mode: PdfEcoMode): PdfLayoutConfig {
  return PRESETS[mode] ?? PRESETS['normal'];
}

export function getAllPdfModes(): Array<{ mode: PdfEcoMode; label: string; description: string; savings: { paper: string; ink: string } }> {
  return [
    {
      mode: 'normal',
      label: 'Normal',
      description: 'Layout padrão com margens confortáveis e formatação completa.',
      savings: { paper: '0%', ink: '0%' },
    },
    {
      mode: 'save-paper',
      label: 'Economia de Papel',
      description: 'Margens reduzidas, fonte menor e espaçamentos compactos para caber mais questões por página.',
      savings: { paper: '~30-40%', ink: '0%' },
    },
    {
      mode: 'save-ink',
      label: 'Economia de Tinta',
      description: 'Remove elementos decorativos, usa tons de cinza e evita negrito para gastar menos tinta.',
      savings: { paper: '0%', ink: '~25-35%' },
    },
    {
      mode: 'eco-max',
      label: 'Economia Máxima',
      description: 'Combina economia de papel e tinta. Ideal para escolas com orçamento limitado.',
      savings: { paper: '~40-50%', ink: '~25-35%' },
    },
    {
      mode: 'accessibility',
      label: 'Modo Acessibilidade',
      description: 'Fonte grande (16px mínimo), espaçamento 1.5 entre linhas. Ideal para alunos com baixa visão.',
      savings: { paper: '0%', ink: '0%' },
    },
  ];
}
