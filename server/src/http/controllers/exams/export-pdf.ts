import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeExportExamPdfUseCase } from "../../../use-cases/factories/make-export-exam-pdf-use-case";

export async function exportPdf(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.uuid(),
  });

  const querySchema = z.object({
    versionId: z.string().uuid().optional(),
    includeAnswerKey: z.string().transform(val => val === 'true').optional(),
  });

  const { id: examId } = paramsSchema.parse(request.params);
  const { versionId, includeAnswerKey } = querySchema.parse(request.query);

  const exportPdfUseCase = makeExportExamPdfUseCase();
  const pdfBuffer = await exportPdfUseCase.handler({
    examId,
    versionId,
    includeAnswerKey: includeAnswerKey || false,
  });

  return reply
    .header('Content-Type', 'application/pdf')
    .header('Content-Disposition', `attachment; filename="prova-${examId}.pdf"`)
    .send(pdfBuffer);
}
