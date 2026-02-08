import PDFDocument from 'pdfkit';
import { IExamRepository } from "../repositories/interfaces/exam-repository.interface";

export class ExportExamPdfSimpleUseCase {
  constructor(private readonly examRepository: IExamRepository) {}

  async handler(examId: string): Promise<Buffer> {
    const exam = await this.examRepository.findById(examId);
    
    if (!exam) {
      throw new Error('Prova não encontrada');
    }
    
    if (!exam.questions || exam.questions.length === 0) {
      throw new Error('A prova não possui questões');
    }

    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const buffers: Buffer[] = [];
        
        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => {
          resolve(Buffer.concat(buffers));
        });
        doc.on('error', reject);

        doc.fontSize(20).text(exam.title, { align: 'center' });
        doc.fontSize(14).text(`Disciplina: ${exam.subject}`, { align: 'center' });
        doc.fontSize(12).text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, { align: 'center' });
        doc.moveDown(2);

        doc.fontSize(10).text('Nome: _________________________________________________');
        doc.moveDown(2);

        exam.questions.forEach((q, idx) => {
          doc.fontSize(12).font('Helvetica-Bold').text(`${idx + 1}. ${q.statement}`);
          doc.font('Helvetica').moveDown(0.5);

          q.alternatives.forEach((alt, altIdx) => {
            const letter = String.fromCharCode(65 + altIdx);
            doc.fontSize(11).text(`   ${letter}) ${alt.text}`);
          });
          
          doc.moveDown(1.5);
        });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}
