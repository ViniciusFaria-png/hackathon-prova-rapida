import { FastifyReply, FastifyRequest } from "fastify";
import { makeFindUserByIdUseCase } from "../../../use-cases/factories/make-find-user-by-id-use-case";

export async function me(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub;

  const findUserByIdUseCase = makeFindUserByIdUseCase();
  const { user } = await findUserByIdUseCase.execute({ userId });

  const { password, ...userWithoutPassword } = user;

  return reply.status(200).send(userWithoutPassword);
}

