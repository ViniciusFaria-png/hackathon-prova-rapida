import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeDuplicateExamUseCase } from "../../../use-cases/factories/make-duplicate-exam-use-case";

export async function duplicate(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.uuid(),
  });

  const bodySchema = z.object({
    newTitle: z.string().optional(),
  });

  const { id: examId } = paramsSchema.parse(request.params);
  const { newTitle } = bodySchema.parse(request.body);
  const userId = request.user.sub;

  const duplicateUseCase = makeDuplicateExamUseCase();
  const result = await duplicateUseCase.handler(examId, userId, newTitle);

  return reply.status(201).send(result);
}
