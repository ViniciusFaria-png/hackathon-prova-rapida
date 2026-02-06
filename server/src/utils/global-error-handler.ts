
import { FastifyReply, FastifyRequest } from "fastify";
import { env } from "process";
import { ZodError } from "zod";
import { InvalidCredentialsError } from "../use-cases/errors/invalid-credentials-error";
import { ResourceNotFoundError } from "../use-cases/errors/resource-not-found-error";

interface ErrorHandlerMap {
  [key: string]: (
    error: Error | ZodError | ResourceNotFoundError | InvalidCredentialsError,
    request: FastifyRequest,
    reply: FastifyReply
  ) => void;
}

export const errorHandlerMap: ErrorHandlerMap = {
  ZodError: (error, _, reply) => {
    return reply.status(400).send({
      success: false,
      message: "Validation error",
      ...(error instanceof ZodError && { error: error.format() }),
    });
  },
  ResourceNotFoundError: (error, __, reply) => {
    return reply.status(404).send({ success: false, message: error.message });
  },
  InvalidCredentialsError: (error, __, reply) => {
    return reply.status(401).send({ success: false, message: error.message });
  },
  ForbiddenError: (error, __, reply) => {
    return reply.status(403).send({ success: false, message: error.message });
  },
  BusinessRuleError: (error, __, reply) => {
    return reply.status(422).send({ success: false, message: error.message });
  },
};

export const globalErrorHandler = (
  error: Error,
  _: FastifyRequest,
  reply: FastifyReply
) => {
  if (env.NODE_ENV === "development") {
    console.error(error);
  }

  const handler = errorHandlerMap[error.constructor.name];

  if (handler) return handler(error, _, reply);

  return reply.status(500).send({ message: "Internal server error" });
};
