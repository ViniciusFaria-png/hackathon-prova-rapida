import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCreateAlternativeUseCase } from "../../../use-cases/factories/make-create-alternative-use-case";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    questionId: z.uuid(),
  });

  const bodySchema = z.object({
    text: z.string(),
    isCorrect: z.boolean(),
  });

  const { questionId } = paramsSchema.parse(request.params);
  const { text, isCorrect } = bodySchema.parse(request.body);

  const createAlternativeUseCase = makeCreateAlternativeUseCase();
  const alternative = await createAlternativeUseCase.handler({
    text,
    isCorrect,
    questionId,
  });

  return reply.status(201).send(alternative);
}
