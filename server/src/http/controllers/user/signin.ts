
import { compare } from "bcryptjs";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeSigninUseCase } from "../../../use-cases/factories/make-signin-use-case";

export async function signin(request: FastifyRequest, reply: FastifyReply) {
  const signinBodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  try {
    const { email, password } = signinBodySchema.parse(request.body);

    const signinUserUseCase = makeSigninUseCase();
    const user = await signinUserUseCase.handler(email);

    if (!user) {
      return reply.status(401).send({ message: "Email ou senha incorretos" });
    }

    const doesPasswordMatch = await compare(password, user.password);

    if (!doesPasswordMatch) {
      return reply.status(401).send({ message: "Email ou senha incorretos" });
    }

    const token = await reply.jwtSign(
      {
        sub: user.id,
        email: user.email,
      },
      {
        expiresIn: "7d",
      }
    );

    return reply.status(200).send({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
      message: "Login realizado com sucesso",
    });
  } catch (error) {

    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        message: "Dados inválidos",
        issues: error.issues,
      });
    }

    return reply.status(500).send({
      message: "Erro interno do servidor",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
}

export const signinSchema = {
  summary: "User authentication",
  tags: ["Auth"],
  body: {
    type: "object",
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 1 },
    },
    required: ["email", "password"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        user: {
          type: "object",
          properties: {
            id: { type: "string" },
            email: { type: "string" },
          },
        },
        token: { type: "string" },
        message: { type: "string" },
      },
    },
    401: {
      type: "object",
      properties: {
        message: { type: "string", example: "Email ou senha incorretos" },
      },
    },
  },
};
