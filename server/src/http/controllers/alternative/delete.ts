import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { PGAlternativeRepository } from "../../../repositories/pg/alternative-repository";
import { DeleteAlternativeUseCase } from "../../../use-cases/delete-alternative";

export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.uuid(),
  });

  const { id } = paramsSchema.parse(request.params);

  const alternativeRepository = new PGAlternativeRepository();
  const deleteAlternativeUseCase = new DeleteAlternativeUseCase(alternativeRepository);
  await deleteAlternativeUseCase.handler(id);

  return reply.status(204).send();
}
