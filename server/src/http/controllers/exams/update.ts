import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeUpdateExamUseCase } from "../../../use-cases/factories/make-update-exam-use-case";
import { canEditExam } from "../../middleware/permissions";

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const updateParamsSchema = z.object({
    id: z.uuid(),
  });

  const updateBodySchema = z.object({
    title: z.string().optional(),
    subject: z.string().optional(),
  });

  const { id } = updateParamsSchema.parse(request.params);
  const data = updateBodySchema.parse(request.body);
  const userId = request.user.sub;

  await canEditExam(userId, id);

  const updateExamUseCase = makeUpdateExamUseCase();
  await updateExamUseCase.handler(id, data);

  return reply.status(204).send();
}
