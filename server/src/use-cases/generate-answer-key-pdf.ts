import PDFDocument from 'pdfkit';
import { IExamRepository } from "../repositories/interfaces/exam-repository.interface";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { PdfEcoMode, PdfLayoutConfig, getPdfLayoutConfig } from "./pdf-layout-presets";

export class GenerateAnswerKeyPdfUseCase {
  constructor(private readonly examRepository: IExamRepository) {}

  async handler(examId: string, versionId?: string, ecoMode: PdfEcoMode = 'normal'): Promise<Buffer> {
    const layout = getPdfLayoutConfig(ecoMode);

    let title: string;
    let subject: string;
    let versionLabel: string | null = null;
    let questions: Array<{
      id: string;
      statement: string;
      position: number;
      alternatives: Array<{ id: string; text: string; is_correct: boolean }>;
    }>;

    if (versionId) {
      const version = await this.examRepository.findVersionById(versionId);
      if (!version) throw new ResourceNotFoundError();

      const exam = await this.examRepository.findById(version.exam_id);
      if (!exam) throw new ResourceNotFoundError();

      title = exam.title;
      subject = exam.subject;
      versionLabel = version.version_name;
      questions = version.questions;
    } else {
      const exam = await this.examRepository.findById(examId);
      if (!exam) throw new ResourceNotFoundError();

      title = exam.title;
      subject = exam.subject;
      questions = exam.questions;
    }

    return this.generateAnswerKeyPDF(title, subject, versionLabel, questions, layout);
  }

  private generateAnswerKeyPDF(
    title: string,
    subject: string,
    versionLabel: string | null,
    questions: Array<{
      id: string;
      statement: string;
      position: number;
      alternatives: Array<{ id: string; text: string; is_correct: boolean }>;
    }>,
    layout: PdfLayoutConfig
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: layout.pageSize as string,
        margins: layout.margins,
      });

      const buffers: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      const leftEdge = layout.margins.left;
      const rightEdge = doc.page.width - layout.margins.right;

      // Título
      doc.fontSize(layout.fontSize.title).font(layout.fontFamilyBold)
        .fillColor(layout.textColor)
        .text(title, { align: 'center' });
      
      doc.moveDown(layout.headerSpacing * 0.6);
      doc.fontSize(layout.fontSize.title - 4).font(layout.fontFamilyBold)
        .fillColor('#cc0000')
        .text('GABARITO OFICIAL', { align: 'center' });
      doc.fillColor(layout.textColor);
      
      doc.moveDown(layout.headerSpacing * 0.6);
      doc.fontSize(layout.fontSize.subtitle).font(layout.fontFamily)
        .fillColor(layout.secondaryTextColor)
        .text(`Disciplina: ${subject}`, { align: 'center' });
      
      if (versionLabel) {
        doc.text(versionLabel, { align: 'center' });
      }

      const date = new Date().toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
      });
      doc.text(`Data: ${date}`, { align: 'center' });
      doc.fillColor(layout.textColor);

      doc.moveDown(layout.headerSpacing + 0.5);
      if (layout.showSeparators) {
        doc.moveTo(leftEdge, doc.y).lineTo(rightEdge, doc.y).stroke(layout.separatorColor);
      }
      doc.moveDown(layout.questionSpacing + 0.3);

      // Tabela de gabarito compacta
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const cols = 4;
      const colWidth = Math.floor(layout.contentWidth / cols);
      const rowHeight = layout.compactAlternatives ? 16 : 22;
      const startX = leftEdge + 10;
      let currentX = startX;
      let currentY = doc.y;

      // Cabeçalho da tabela
      doc.fontSize(layout.fontSize.alternative).font(layout.fontFamilyBold)
        .fillColor(layout.textColor);
      for (let c = 0; c < cols; c++) {
        doc.text('Questão', currentX, currentY, { width: 50, align: 'left' });
        doc.text('Resp.', currentX + 55, currentY, { width: 40, align: 'left' });
        currentX += colWidth;
      }
      currentY += rowHeight;

      if (layout.showSeparators) {
        doc.moveTo(startX, currentY - 4).lineTo(startX + colWidth * cols, currentY - 4).stroke(layout.separatorColor);
      }

      currentX = startX;
      doc.font(layout.fontFamily).fontSize(layout.fontSize.alternative);

      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const questionNumber = i + 1;
        
        const correctIndex = q.alternatives.findIndex(a => a.is_correct);
        const correctLetter = correctIndex >= 0 ? letters[correctIndex] : '-';

        const col = i % cols;
        if (col === 0 && i > 0) {
          currentY += rowHeight;
          currentX = startX;
        }

        if (currentY + rowHeight > doc.page.height - layout.margins.bottom - 20) {
          doc.addPage();
          currentY = layout.margins.top;
        }

        doc.font(layout.fontFamilyBold)
          .fillColor(layout.textColor)
          .text(`${questionNumber}.`, currentX, currentY, { width: 30, align: 'right' });
        doc.font(layout.fontFamilyBold)
          .fillColor(layout.answerTextColor)
          .text(correctLetter, currentX + 55, currentY, { width: 40, align: 'left' });
        doc.fillColor(layout.textColor);

        currentX += colWidth;
      }

      // Badge do modo eco
      if (layout.modeLabel) {
        doc.fontSize(layout.fontSize.footer).font(layout.fontFamily)
          .fillColor(layout.secondaryTextColor)
          .text(
            layout.modeLabel,
            leftEdge,
            doc.page.height - layout.margins.bottom + 10,
            { align: 'center', width: layout.contentWidth }
          );
      }

      doc.end();
    });
  }
}
