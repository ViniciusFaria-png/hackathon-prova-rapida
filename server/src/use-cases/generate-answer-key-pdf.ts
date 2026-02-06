import PDFDocument from 'pdfkit';
import { IExamRepository } from "../repositories/interfaces/exam-repository.interface";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

export class GenerateAnswerKeyPdfUseCase {
  constructor(private readonly examRepository: IExamRepository) {}

  async handler(examId: string, versionId?: string): Promise<Buffer> {
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

    return this.generateAnswerKeyPDF(title, subject, versionLabel, questions);
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
    }>
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 60, bottom: 60, left: 50, right: 50 },
      });

      const buffers: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      doc.fontSize(18).font('Helvetica-Bold')
        .text(title, { align: 'center' });
      
      doc.moveDown(0.3);
      doc.fontSize(14).font('Helvetica-Bold')
        .fillColor('#cc0000')
        .text('GABARITO OFICIAL', { align: 'center' });
      doc.fillColor('#000000');
      
      doc.moveDown(0.3);
      doc.fontSize(11).font('Helvetica')
        .fillColor('#555555')
        .text(`Disciplina: ${subject}`, { align: 'center' });
      
      if (versionLabel) {
        doc.text(versionLabel, { align: 'center' });
      }

      const date = new Date().toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
      });
      doc.text(`Data: ${date}`, { align: 'center' });
      doc.fillColor('#000000');

      doc.moveDown(1);
      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke('#cccccc');
      doc.moveDown(0.8);

      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const colWidth = 120;
      const rowHeight = 22;
      const startX = 80;
      let currentX = startX;
      let currentY = doc.y;
      const cols = 4;

      doc.fontSize(10).font('Helvetica-Bold');
      for (let c = 0; c < cols; c++) {
        doc.text('Questão', currentX, currentY, { width: 50, align: 'left' });
        doc.text('Resp.', currentX + 55, currentY, { width: 40, align: 'left' });
        currentX += colWidth;
      }
      currentY += rowHeight;
      doc.moveTo(startX, currentY - 4).lineTo(startX + colWidth * cols, currentY - 4).stroke('#cccccc');

      currentX = startX;
      doc.font('Helvetica').fontSize(10);

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

        if (currentY + rowHeight > doc.page.height - 80) {
          doc.addPage();
          currentY = 60;
        }

        doc.font('Helvetica-Bold')
          .text(`${questionNumber}.`, currentX, currentY, { width: 30, align: 'right' });
        doc.font('Helvetica-Bold')
          .fillColor('#2e7d32')
          .text(correctLetter, currentX + 55, currentY, { width: 40, align: 'left' });
        doc.fillColor('#000000');

        currentX += colWidth;
      }

      doc.end();
    });
  }
}
