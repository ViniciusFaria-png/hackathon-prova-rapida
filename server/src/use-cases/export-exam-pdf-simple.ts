import PDFDocument from 'pdfkit';
import { IExamRepository } from "../repositories/interfaces/exam-repository.interface";

export class ExportExamPdfSimpleUseCase {
  constructor(private readonly examRepository: IExamRepository) {}

  async handler(examId: string): Promise<Buffer> {
    console.log('[PDF] Buscando prova', examId);
    const exam = await this.examRepository.findById(examId);
    
    if (!exam) {
      console.error('[PDF] Prova não encontrada');
      throw new Error('Prova não encontrada');
    }
    
    console.log('[PDF] Prova encontrada:', exam.title, 'com', exam.questions?.length || 0, 'questões');
    
    if (!exam.questions || exam.questions.length === 0) {
      throw new Error('A prova não possui questões');
    }

    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const buffers: Buffer[] = [];
        
        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => {
          console.log('[PDF] Gerado com sucesso');
          resolve(Buffer.concat(buffers));
        });
        doc.on('error', reject);

        // Header
        doc.fontSize(20).text(exam.title, { align: 'center' });
        doc.fontSize(14).text(`Disciplina: ${exam.subject}`, { align: 'center' });
        doc.fontSize(12).text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, { align: 'center' });
        doc.moveDown(2);

        // Nome aluno
        doc.fontSize(10).text('Nome: _________________________________________________');
        doc.moveDown(2);

        // Questions
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
        console.error('[PDF] Erro ao gerar:', error);
        reject(error);
      }
    });
  }
}
