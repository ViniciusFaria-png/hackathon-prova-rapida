import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { PGExamRepository } from "../../../repositories/pg/exam-repository";
import { ExportExamPdfUseCase } from "../../../use-cases/export-exam-pdf";

export async function exportPdf(request: FastifyRequest, reply: FastifyReply) {
  console.log('[ROUTE] Export PDF chamado');
  const paramsSchema = z.object({
    id: z.uuid(),
  });

  const querySchema = z.object({
    versionId: z.string().uuid().optional(),
    includeAnswerKey: z.string().optional().transform(val => val === 'true'),
    ecoMode: z.enum(['normal', 'save-paper', 'save-ink', 'eco-max']).optional().default('normal'),
  });

  try {
    const { id: examId } = paramsSchema.parse(request.params);
    const { versionId, includeAnswerKey, ecoMode } = querySchema.parse(request.query);
    
    console.log('[ROUTE] ExamId:', examId, 'ecoMode:', ecoMode);

    const examRepo = new PGExamRepository();
    const useCase = new ExportExamPdfUseCase(examRepo);
    const pdfBuffer = await useCase.handler({
      examId,
      versionId,
      includeAnswerKey,
      ecoMode,
    });

    console.log('[ROUTE] PDF gerado, enviando...');
    return reply
      .header('Content-Type', 'application/pdf')
      .header('Content-Disposition', `attachment; filename="prova-${examId}.pdf"`)
      .send(pdfBuffer);
  } catch (error: any) {
    console.error('[ROUTE] Erro:', error.message, error.stack);
    return reply.status(500).send({ message: error.message || 'Erro ao gerar PDF' });
  }
}
