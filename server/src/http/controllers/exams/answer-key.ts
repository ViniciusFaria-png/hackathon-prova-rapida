import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeGenerateAnswerKeyPdfUseCase } from "../../../use-cases/factories/make-generate-answer-key-pdf-use-case";
import { PdfEcoMode } from "../../../use-cases/pdf-layout-presets";

export async function answerKey(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.uuid(),
  });

  const querySchema = z.object({
    versionId: z.string().uuid().optional(),
    ecoMode: z.enum(['normal', 'save-paper', 'save-ink', 'eco-max']).optional().default('normal'),
  });

  const { id: examId } = paramsSchema.parse(request.params);
  const { versionId, ecoMode } = querySchema.parse(request.query);

  const answerKeyUseCase = makeGenerateAnswerKeyPdfUseCase();
  const pdfBuffer = await answerKeyUseCase.handler(examId, versionId, ecoMode as PdfEcoMode);

  return reply
    .header('Content-Type', 'application/pdf')
    .header('Content-Disposition', `attachment; filename="gabarito-${examId}.pdf"`)
    .send(pdfBuffer);
}
