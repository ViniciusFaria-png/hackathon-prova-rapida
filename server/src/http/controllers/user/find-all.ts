
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

export const findAllUsersSchema = {
  summary: "Retrieve all users",
  tags: ["Users"],
  response: {
    200: {
      type: "object",
      properties: {
        users: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "number" },
              email: { type: "string" },
              senha: { type: "string" },
            },
          },
        },
      },
    },
    500: {
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
  },
};
