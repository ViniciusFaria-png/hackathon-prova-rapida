import { FastifyReply, FastifyRequest } from "fastify";

export async function logout(request: FastifyRequest, reply: FastifyReply) {
  return reply.status(200).send({ message: "Logout realizado com sucesso" });
}
