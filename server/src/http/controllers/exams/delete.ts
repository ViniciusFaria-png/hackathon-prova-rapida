import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { PGExamRepository } from "../../../repositories/pg/exam-repository";
import { DeleteExamUseCase } from "../../../use-cases/delete-exam";
import { ForbiddenError } from "../../../use-cases/errors/forbidden-error";

export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const deleteParamsSchema = z.object({
    id: z.uuid(),
  });

  const { id } = deleteParamsSchema.parse(request.params);
  const userId = request.user.sub;

  const examRepository = new PGExamRepository();

  const exam = await examRepository.findById(id);
  if (exam && exam.user_id !== userId) {
    throw new ForbiddenError("Você não tem permissão para excluir esta prova.");
  }

  const deleteExamUseCase = new DeleteExamUseCase(examRepository);
  await deleteExamUseCase.handler(id);

  return reply.status(204).send();
}
