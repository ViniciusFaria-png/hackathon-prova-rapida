import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeFinalizeExamVersionUseCase } from "../../../use-cases/factories/make-finalize-exam-version-use-case";

export async function finalize(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.uuid(),
  });

  const { id: examId } = paramsSchema.parse(request.params);

  const finalizeUseCase = makeFinalizeExamVersionUseCase();
  const result = await finalizeUseCase.handler(examId);

  return reply.status(201).send({
    success: true,
    data: result,
  });
}
