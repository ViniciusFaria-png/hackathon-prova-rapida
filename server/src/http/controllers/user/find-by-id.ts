
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ResourceNotFoundError } from "../../../use-cases/errors/resource-not-found-error";
import { makeFindUserByIdUseCase } from "../../../use-cases/factories/make-find-user-by-id-use-case";

const findUserByIdParamsSchema = z.object({
  id: z.string().transform((val) => parseInt(val, 10)),
});

export async function findById(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = findUserByIdParamsSchema.parse(request.params);

    const findUserByIdUseCase = makeFindUserByIdUseCase();
    const { user } = await findUserByIdUseCase.execute({ userId: id });

    return reply.status(200).send({ user });
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    if (err instanceof z.ZodError) {
      return reply.status(400).send({
        message: "Validation error.",
        issues: err.issues,
      });
    }
    throw err;
  }
}

export const findUserByIdSchema = {
  summary: "Retrieve a user by ID",
  tags: ["Users"],
  params: {
    type: "object",
    properties: {
      id: { type: "string" },
    },
    required: ["id"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        user: {
          type: "object",
          properties: {
            id: { type: "number" },
            email: { type: "string" },
            senha: { type: "string" },
          },
          required: ["id", "email", "senha"],
        },
      },
    },
    400: {
      type: "object",
      properties: {
        message: { type: "string", example: "Validation error." },
        issues: {
          type: "array",
          items: {
            type: "object",
            properties: {
              code: { type: "string" },
              expected: { type: "string" },
              received: { type: "string" },
              path: { type: "array", items: { type: "string" } },
              message: { type: "string" },
            },
            required: ["code", "expected", "received", "path", "message"],
          },
        },
      },
    },
    404: {
      type: "object",
      properties: {
        message: { type: "string", example: "Resource not found" },
      },
    },
  },
};
