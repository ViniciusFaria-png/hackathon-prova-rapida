import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeGenerateExamVersionsUseCase } from "../../../use-cases/factories/make-generate-exam-versions-use-case";

export async function generateVersions(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.uuid(),
  });

  const bodySchema = z.object({
    count: z.number().int().min(1).max(26),
  });

  const { id: examId } = paramsSchema.parse(request.params);
  const { count } = bodySchema.parse(request.body);

  const generateVersionsUseCase = makeGenerateExamVersionsUseCase();
  const versions = await generateVersionsUseCase.handler(examId, count);

  return reply.status(201).send({
    success: true,
    data: versions,
  });
}
