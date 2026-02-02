import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { PGExamRepository } from "../../../repositories/pg/exam-repository";
import { DeleteExamUseCase } from "../../../use-cases/delete-exam";

export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const deleteParamsSchema = z.object({
    id: z.uuid(),
  });

  const { id } = deleteParamsSchema.parse(request.params);

  const examRepository = new PGExamRepository();
  const deleteExamUseCase = new DeleteExamUseCase(examRepository);
  await deleteExamUseCase.handler(id);

  return reply.status(204).send();
}
