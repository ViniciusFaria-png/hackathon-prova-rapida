import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeShuffleExamUseCase } from "../../../use-cases/factories/make-shuffle-exam-use-case";

export async function shuffle(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.uuid(),
  });

  const bodySchema = z.object({
    versionName: z.string(),
  });

  const { id: examId } = paramsSchema.parse(request.params);
  const { versionName } = bodySchema.parse(request.body);

  const shuffleUseCase = makeShuffleExamUseCase();
  const version = await shuffleUseCase.handler(examId, versionName);

  return reply.status(201).send(version);
}
