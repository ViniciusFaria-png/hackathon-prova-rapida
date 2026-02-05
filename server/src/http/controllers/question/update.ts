import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeUpdateQuestionUseCase } from "../../../use-cases/factories/make-update-question-use-case";

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.uuid(),
  });

  const bodySchema = z.object({
    statement: z.string().optional(),
    subject: z.string().optional(),
    isPublic: z.boolean().optional(),
  });

  const { id } = paramsSchema.parse(request.params);
  const data = bodySchema.parse(request.body);

  const updateQuestionUseCase = makeUpdateQuestionUseCase();
  await updateQuestionUseCase.handler(id, data);

  return reply.status(204).send();
}
