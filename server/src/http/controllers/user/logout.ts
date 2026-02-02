import { FastifyReply, FastifyRequest } from "fastify";

export async function logout(request: FastifyRequest, reply: FastifyReply) {
  // No JWT, o logout é feito no client removendo o token
  // Aqui apenas retornamos sucesso
  return reply.status(200).send({ message: "Logout realizado com sucesso" });
}
