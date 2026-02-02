import { FastifyReply, FastifyRequest } from "fastify";
import { makeFindAllExamsUseCase } from "../../../use-cases/factories/make-find-all-exams-use-case";

export async function findAll(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub;

  const findAllExamsUseCase = makeFindAllExamsUseCase();
  const exams = await findAllExamsUseCase.handler(userId);

  return reply.status(200).send(exams);
}
