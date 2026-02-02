import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeUpdateAlternativeUseCase } from "../../../use-cases/factories/make-update-alternative-use-case";

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.uuid()
  });

  const bodySchema = z.object({
    text: z.string().optional(),
    isCorrect: z.boolean().optional(),
  });

  const { id } = paramsSchema.parse(request.params);
  const data = bodySchema.parse(request.body);

  const updateAlternativeUseCase = makeUpdateAlternativeUseCase();
  await updateAlternativeUseCase.handler(id, data);

  return reply.status(204).send();
}
