import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeGenerateAnswerKeyPdfUseCase } from "../../../use-cases/factories/make-generate-answer-key-pdf-use-case";

export async function answerKey(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.uuid(),
  });

  const querySchema = z.object({
    versionId: z.string().uuid().optional(),
  });

  const { id: examId } = paramsSchema.parse(request.params);
  const { versionId } = querySchema.parse(request.query);

  const answerKeyUseCase = makeGenerateAnswerKeyPdfUseCase();
  const pdfBuffer = await answerKeyUseCase.handler(examId, versionId);

  return reply
    .header('Content-Type', 'application/pdf')
    .header('Content-Disposition', `attachment; filename="gabarito-${examId}.pdf"`)
    .send(pdfBuffer);
}
