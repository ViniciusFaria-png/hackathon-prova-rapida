import { FastifyReply, FastifyRequest } from "fastify";
import { PGExamRepository } from "../../repositories/pg/exam-repository";
import { PGQuestionRepository } from "../../repositories/pg/question-repository";
import { BusinessRuleError } from "../../use-cases/errors/business-rule-error";
import { ForbiddenError } from "../../use-cases/errors/forbidden-error";
import { ResourceNotFoundError } from "../../use-cases/errors/resource-not-found-error";

const examRepository = new PGExamRepository();
const questionRepository = new PGQuestionRepository();

export async function canEditExam(userId: string, examId: string): Promise<void> {
  const exam = await examRepository.findById(examId);
  
  if (!exam) {
    throw new ResourceNotFoundError();
  }

  if (exam.user_id !== userId) {
    throw new ForbiddenError("Você não tem permissão para editar esta prova.");
  }

  const isFinalized = await examRepository.isExamFinalized(examId);
  if (isFinalized) {
    throw new BusinessRuleError("Não é possível editar uma prova que possui versões finalizadas.");
  }
}

export async function canDeleteQuestion(userId: string, questionId: string): Promise<void> {
  const question = await questionRepository.findById(questionId);
  
  if (!question) {
    throw new ResourceNotFoundError();
  }

  if (question.user_id && question.user_id !== userId) {
    throw new ForbiddenError("Você não tem permissão para excluir esta questão.");
  }

  const usages = await examRepository.getQuestionExamUsage(questionId);
  const inFinalized = usages.some(u => u.status === 'finalized');
  
  if (inFinalized) {
    throw new BusinessRuleError("Não é possível excluir uma questão que está em provas finalizadas.");
  }
}

export async function canEditQuestion(userId: string, questionId: string): Promise<void> {
  const question = await questionRepository.findById(questionId);
  
  if (!question) {
    throw new ResourceNotFoundError();
  }

  if (question.user_id && question.user_id !== userId) {
    throw new ForbiddenError("Você não tem permissão para editar esta questão.");
  }

  const usages = await examRepository.getQuestionExamUsage(questionId);
  const inFinalized = usages.some(u => u.status === 'finalized');
  
  if (inFinalized) {
    throw new BusinessRuleError("Não é possível editar uma questão que está em provas finalizadas.");
  }
}

export async function canUseQuestion(userId: string, questionId: string): Promise<void> {
  const question = await questionRepository.findById(questionId);
  
  if (!question) {
    throw new ResourceNotFoundError();
  }

  if (question.is_public) {
    return;
  }

  if (question.user_id !== userId) {
    throw new ForbiddenError("Você não tem permissão para usar esta questão privada.");
  }
}

export function requireExamEditPermission() {
  return async (request: FastifyRequest, _reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const userId = request.user.sub;
    await canEditExam(userId, id);
  };
}

export function requireQuestionEditPermission() {
  return async (request: FastifyRequest, _reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const userId = request.user.sub;
    await canEditQuestion(userId, id);
  };
}

export function requireQuestionDeletePermission() {
  return async (request: FastifyRequest, _reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const userId = request.user.sub;
    await canDeleteQuestion(userId, id);
  };
}
