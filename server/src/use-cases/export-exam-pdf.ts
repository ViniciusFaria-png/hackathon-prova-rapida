import PDFDocument from 'pdfkit';
import { IExamRepository } from "../repositories/interfaces/exam-repository.interface";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface ExportOptions {
  examId: string;
  versionId?: string;
  includeAnswerKey?: boolean;
}

export class ExportExamPdfUseCase {
  constructor(private readonly examRepository: IExamRepository) {}

  async handler(options: ExportOptions): Promise<Buffer> {
    const { examId, versionId, includeAnswerKey } = options;

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

    return this.generatePDF(title, subject, versionLabel, questions, includeAnswerKey || false);
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
    includeAnswerKey: boolean
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 60, bottom: 60, left: 50, right: 50 },
        bufferPages: true,
      });

      const buffers: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      this.renderHeader(doc, title, subject, versionLabel);

      if (includeAnswerKey) {
        doc.fontSize(16).font('Helvetica-Bold')
          .fillColor('#cc0000')
          .text('GABARITO', { align: 'center' })
          .moveDown(0.5);
        doc.fillColor('#000000');
      } else {
        this.renderStudentInfo(doc);
      }

      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke('#cccccc');
      doc.moveDown(0.8);

      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const questionNumber = i + 1;

        const estimatedHeight = 80 + (q.alternatives.length * 22);
        if (doc.y + estimatedHeight > doc.page.height - 80) {
          doc.addPage();
          this.renderPageHeader(doc, title, versionLabel);
        }

        doc.fontSize(11).font('Helvetica-Bold')
          .text(`${questionNumber}.`, { continued: true })
          .font('Helvetica')
          .text(` ${q.statement}`);
        
        doc.moveDown(0.3);

        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (let j = 0; j < q.alternatives.length; j++) {
          const alt = q.alternatives[j];
          const letter = letters[j];

          if (includeAnswerKey && alt.is_correct) {
            const startY = doc.y;
            doc.rect(55, startY - 2, 480, 18).fill('#e8f5e9');
            doc.fillColor('#2e7d32')
              .fontSize(10).font('Helvetica-Bold')
              .text(`  (${letter})`, 58, startY, { continued: true })
              .font('Helvetica-Bold')
              .text(` ${alt.text}  ✓`);
            doc.fillColor('#000000');
          } else {
            doc.fontSize(10).font('Helvetica')
              .text(`  (${letter}) ${alt.text}`, 58);
          }
        }

        doc.moveDown(0.6);

        if (i < questions.length - 1) {
          doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke('#eeeeee');
          doc.moveDown(0.4);
        }
      }

      const pages = doc.bufferedPageRange();
      for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(i);
        doc.fontSize(8).font('Helvetica')
          .fillColor('#999999')
          .text(
            `Página ${i + 1} de ${pages.count}`,
            50,
            doc.page.height - 40,
            { align: 'center' }
          );
      }

      doc.end();
    });
  }

  private renderHeader(doc: PDFKit.PDFDocument, title: string, subject: string, versionLabel: string | null) {
    doc.fontSize(18).font('Helvetica-Bold')
      .text(title, { align: 'center' });
    
    doc.moveDown(0.3);
    
    doc.fontSize(11).font('Helvetica')
      .fillColor('#555555')
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
    
    doc.fillColor('#000000');
    doc.moveDown(0.5);
  }

  private renderPageHeader(doc: PDFKit.PDFDocument, title: string, versionLabel: string | null) {
    const headerText = versionLabel ? `${title} - ${versionLabel}` : title;
    doc.fontSize(10).font('Helvetica')
      .fillColor('#999999')
      .text(headerText, { align: 'right' });
    doc.fillColor('#000000');
    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke('#cccccc');
    doc.moveDown(0.5);
  }

  private renderStudentInfo(doc: PDFKit.PDFDocument) {
    doc.moveDown(0.3);
    doc.fontSize(10).font('Helvetica')
      .text('Nome: _______________________________________________     Turma: __________     Data: ___/___/______');
    doc.moveDown(0.5);
  }
}
