import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeGetExamStatsUseCase } from "../../../use-cases/factories/make-get-exam-stats-use-case";

export async function stats(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.uuid(),
  });

  const { id: examId } = paramsSchema.parse(request.params);

  const getStatsUseCase = makeGetExamStatsUseCase();
  const examStats = await getStatsUseCase.handler(examId);

  return reply.status(200).send({
    success: true,
    data: examStats,
  });
}
