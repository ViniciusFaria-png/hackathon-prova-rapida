
import { FastifyReply, FastifyRequest } from "fastify";
import { makeFindAllUsersUseCase } from "../../../use-cases/factories/make-find-all-users-use-case";

export async function findAll(request: FastifyRequest, reply: FastifyReply) {
  try {
    const findAllUsersUseCase = makeFindAllUsersUseCase();
    const { users } = await findAllUsersUseCase.execute();

    return reply.status(200).send({ users });
  } catch (err) {
    throw err;
  }
}
