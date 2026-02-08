import PDFDocument from 'pdfkit';
import { IExamRepository } from "../repositories/interfaces/exam-repository.interface";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { PdfEcoMode, PdfLayoutConfig, getPdfLayoutConfig } from "./pdf-layout-presets";

interface ExportOptions {
  examId: string;
  versionId?: string;
  includeAnswerKey?: boolean;
  /** Modo de economia: 'normal' | 'save-paper' | 'save-ink' | 'eco-max' */
  ecoMode?: PdfEcoMode;
}

export class ExportExamPdfUseCase {
  constructor(private readonly examRepository: IExamRepository) {}

  async handler(options: ExportOptions): Promise<Buffer> {
    try {
      console.log('Iniciando exportação de PDF com opções:', options);
      const { examId, versionId, includeAnswerKey, ecoMode = 'normal' } = options;
      const layout = getPdfLayoutConfig(ecoMode);

      let title: string;
      let subject: string;
      let versionLabel: string | null = null;
      let questions: Array<{
        id: string;
        statement: string;
        subject: string;
        position: number;
        alternatives: Array<{ id: string; text: string; is_correct: boolean }>;
      }>;

      if (versionId) {
        console.log('Buscando versão:', versionId);
        const version = await this.examRepository.findVersionById(versionId);
        if (!version) throw new ResourceNotFoundError();
        
        const exam = await this.examRepository.findById(version.exam_id);
        if (!exam) throw new ResourceNotFoundError();
        
        title = exam.title;
        subject = exam.subject;
        versionLabel = version.version_name;
        questions = version.questions;
      } else {
        console.log('Buscando prova:', examId);
        const exam = await this.examRepository.findById(examId);
        if (!exam) {
          console.error('Prova não encontrada:', examId);
          throw new ResourceNotFoundError();
        }
        
        console.log('Prova encontrada:', { title: exam.title, questionsCount: exam.questions?.length || 0 });
        title = exam.title;
        subject = exam.subject;
        questions = exam.questions;
      }

      if (!questions || questions.length === 0) {
        console.error('Prova sem questões!');
        throw new Error('A prova não possui questões para exportar.');
      }

      console.log(`Gerando PDF com ${questions.length} questões`);
      return this.generatePDF(title, subject, versionLabel, questions, includeAnswerKey || false, layout);
    } catch (error) {
      console.error('Erro no handler de exportação:', error);
      throw error;
    }
  }

  private generatePDF(
    title: string,
    subject: string,
    versionLabel: string | null,
    questions: Array<{
      id: string;
      statement: string;
      subject: string;
      position: number;
      alternatives: Array<{ id: string; text: string; is_correct: boolean }>;
    }>,
    includeAnswerKey: boolean,
    layout: PdfLayoutConfig
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        console.log('Criando documento PDF...');
        const doc = new PDFDocument({
          size: layout.pageSize as string,
          margins: layout.margins,
        });

        const buffers: Buffer[] = [];
        doc.on('data', (chunk: Buffer) => buffers.push(chunk));
        doc.on('end', () => {
          console.log('PDF gerado com sucesso, tamanho:', Buffer.concat(buffers).length);
          resolve(Buffer.concat(buffers));
        });
        doc.on('error', (err: Error) => {
          console.error('Erro no documento PDF:', err);
          reject(err);
        });

        const leftEdge = layout.margins.left;
        const rightEdge = doc.page.width - layout.margins.right;
        const totalContentWidth = rightEdge - leftEdge;

        console.log('Renderizando cabeçalho...');
        this.renderHeader(doc, title, subject, versionLabel, layout);

        if (includeAnswerKey) {
          doc.fontSize(layout.fontSize.title - 2).font(layout.fontFamilyBold)
            .fillColor('#cc0000')
            .text('GABARITO', { align: 'center' })
            .moveDown(layout.headerSpacing);
          doc.fillColor(layout.textColor);
        } else {
          this.renderStudentInfo(doc, layout);
        }

        if (layout.showSeparators) {
          doc.moveTo(leftEdge, doc.y).lineTo(rightEdge, doc.y).stroke(layout.separatorColor);
        }
        doc.moveDown(layout.questionSpacing + 0.2);

        // ─── Column mode: 2 columns ONLY for save-paper / eco-max ─────
        const useTwoColumns = layout.compactAlternatives; // true for save-paper & eco-max
        const gutterWidth = useTwoColumns ? 18 : 0;
        const colWidth = useTwoColumns
          ? (totalContentWidth - gutterWidth) / 2
          : totalContentWidth;
        const leftColX = leftEdge;
        const rightColX = leftEdge + colWidth + gutterWidth;
        const pageBottom = doc.page.height - layout.margins.bottom - 20;
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        let leftY = doc.y;
        let rightY = doc.y;
        // In single-column mode, always stay on 'left'
        let currentCol: 'left' | 'right' = 'left';

        const estimateQuestionHeight = (q: typeof questions[0]): number => {
          const stmtHeight = doc.fontSize(layout.fontSize.question)
            .font(layout.fontFamily)
            .heightOfString(`${1}. ${q.statement}`, { width: colWidth - 5 });
          const altLineH = layout.fontSize.alternative * 1.5;
          const altHeight = q.alternatives.length * altLineH;
          const spacing = (layout.questionSpacing + 0.3) * layout.fontSize.question;
          return stmtHeight + altHeight + spacing + 8;
        };

        const startNewPage = () => {
          doc.addPage();
          this.renderPageHeader(doc, title, versionLabel, layout);
          leftY = doc.y;
          rightY = doc.y;
          currentCol = 'left';
        };

        for (let i = 0; i < questions.length; i++) {
          const q = questions[i];
          const questionNumber = i + 1;
          const estimatedH = estimateQuestionHeight(q);

          // Determine which column to place this question
          // RULE: Fill left column COMPLETELY first, then right column
          if (!useTwoColumns) {
            // Single column: just check if we need a new page
            if (leftY + estimatedH > pageBottom) {
              startNewPage();
            }
          } else if (currentCol === 'left') {
            if (leftY + estimatedH > pageBottom) {
              // Left column full → switch to right column (same page)
              currentCol = 'right';
              if (rightY + estimatedH > pageBottom) {
                // Right also full → new page, back to left
                startNewPage();
                currentCol = 'left';
              }
            }
          } else {
            // We're in right column
            if (rightY + estimatedH > pageBottom) {
              // Right column full → new page, back to left
              startNewPage();
              currentCol = 'left';
            }
          }

          const colX = currentCol === 'left' ? leftColX : rightColX;
          const startY = currentCol === 'left' ? leftY : rightY;

          // Question number + statement
          doc.fontSize(layout.fontSize.question).font(layout.fontFamilyBold)
            .fillColor(layout.textColor)
            .text(`${questionNumber}.`, colX, startY, { continued: true, width: colWidth - 5 })
            .font(layout.fontFamily)
            .text(` ${q.statement}`, { width: colWidth - 5 });

          let cursorY = doc.y + (layout.compactAlternatives ? 1 : 3);

          // Alternatives
          for (let j = 0; j < q.alternatives.length; j++) {
            const alt = q.alternatives[j];
            const letter = letters[j];
            const altIndent = colX + 14;

            if (includeAnswerKey && alt.is_correct) {
              if (layout.showAnswerHighlight) {
                doc.rect(altIndent - 3, cursorY - 1, colWidth - 18, layout.fontSize.alternative + 4)
                  .fill(layout.answerHighlightColor);
                doc.fillColor(layout.answerTextColor)
                  .fontSize(layout.fontSize.alternative).font(layout.fontFamilyBold)
                  .text(`(${letter}) ${alt.text}  ✓`, altIndent, cursorY, { width: colWidth - 22 });
                doc.fillColor(layout.textColor);
              } else {
                doc.fontSize(layout.fontSize.alternative).font(layout.fontFamily)
                  .fillColor(layout.textColor)
                  .text(`(${letter}) ${alt.text}  [✓]`, altIndent, cursorY, { width: colWidth - 22 });
              }
            } else {
              doc.fontSize(layout.fontSize.alternative).font(layout.fontFamily)
                .fillColor(layout.textColor)
                .text(`(${letter}) ${alt.text}`, altIndent, cursorY, { width: colWidth - 22 });
            }

            cursorY = doc.y + (layout.compactAlternatives ? 0 : 1);
          }

          cursorY += layout.questionSpacing * layout.fontSize.question;

          // Separator between questions within the column
          if (layout.showSeparators) {
            doc.moveTo(colX, cursorY - 2).lineTo(colX + colWidth - 5, cursorY - 2).stroke(layout.separatorColor);
            cursorY += 4;
          }

          // Update column Y position — SEQUENTIAL: fill left first, then right
          if (!useTwoColumns) {
            leftY = cursorY;
          } else if (currentCol === 'left') {
            leftY = cursorY;
            // Stay in left column until it's full (don't switch early)
          } else {
            rightY = cursorY;
            // Stay in right column until it's full
          }
        }

        doc.end();
      } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        reject(error);
      }
    });
  }

  private renderHeader(doc: PDFKit.PDFDocument, title: string, subject: string, versionLabel: string | null, layout: PdfLayoutConfig) {
    doc.fontSize(layout.fontSize.title).font(layout.fontFamilyBold)
      .fillColor(layout.textColor)
      .text(title, { align: 'center' });
    
    doc.moveDown(layout.headerSpacing * 0.6);
    
    doc.fontSize(layout.fontSize.subtitle).font(layout.fontFamily)
      .fillColor(layout.secondaryTextColor)
      .text(`Disciplina: ${subject}`, { align: 'center' });
    
    if (versionLabel) {
      doc.text(`${versionLabel}`, { align: 'center' });
    }

    const date = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    doc.text(`Data: ${date}`, { align: 'center' });
    
    doc.fillColor(layout.textColor);
    doc.moveDown(layout.headerSpacing);
  }

  private renderPageHeader(doc: PDFKit.PDFDocument, title: string, versionLabel: string | null, layout: PdfLayoutConfig) {
    const headerText = versionLabel ? `${title} - ${versionLabel}` : title;
    doc.fontSize(layout.fontSize.header).font(layout.fontFamily)
      .fillColor(layout.secondaryTextColor)
      .text(headerText, { align: 'right' });
    doc.fillColor(layout.textColor);
    doc.moveDown(layout.headerSpacing * 0.5);
    if (layout.showSeparators) {
      const leftEdge = layout.margins.left;
      const rightEdge = doc.page.width - layout.margins.right;
      doc.moveTo(leftEdge, doc.y).lineTo(rightEdge, doc.y).stroke(layout.separatorColor);
    }
    doc.moveDown(layout.headerSpacing * 0.5);
  }

  private renderStudentInfo(doc: PDFKit.PDFDocument, layout: PdfLayoutConfig) {
    doc.moveDown(layout.headerSpacing * 0.4);
    
    const leftEdge = layout.margins.left;
    const rightEdge = doc.page.width - layout.margins.right;
    const contentWidth = rightEdge - leftEdge;
    const fontSize = layout.fontSize.subtitle;
    
    // Boxed student info — SINGLE LINE: Nome, Turma, Data side by side
    const boxPadding = 8;
    const lineHeight = fontSize + 8;
    const boxHeight = boxPadding * 2 + lineHeight;
    const boxY = doc.y;
    
    // Draw the box
    doc.lineWidth(1)
      .rect(leftEdge, boxY, contentWidth, boxHeight)
      .stroke(layout.textColor);
    
    doc.fontSize(fontSize).font(layout.fontFamily)
      .fillColor(layout.textColor);
    
    // Single row: Nome, Turma, Data ALL on the same line
    const rowY = boxY + boxPadding;
    const nomeW = contentWidth * 0.50;
    const turmaW = contentWidth * 0.24;
    const dataW = contentWidth * 0.22;
    
    doc.text('Nome:________________________', leftEdge + boxPadding, rowY, { width: nomeW });
    doc.text('Turma:________', leftEdge + boxPadding + nomeW, rowY, { width: turmaW });
    doc.text('Data: ___/___/___', leftEdge + boxPadding + nomeW + turmaW, rowY, { width: dataW });
    
    // Move doc.y past the box
    doc.y = boxY + boxHeight + 4;
    doc.moveDown(layout.headerSpacing * 0.5);
  }
}
