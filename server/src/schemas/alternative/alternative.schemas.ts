import { bearerSecurity, errorSchemas } from '../common.schemas';

const alternativeObject = {
  type: 'object' as const,
  properties: {
    id: { type: 'string' as const, format: 'uuid' },
    text: { type: 'string' as const },
    is_correct: { type: 'boolean' as const },
    question_id: { type: 'string' as const, format: 'uuid' },
  },
};

export const createAlternativeSchema = {
  summary: 'Criar alternativa',
  description: 'Adiciona uma nova alternativa a uma questão existente.',
  tags: ['Alternatives'],
  security: bearerSecurity,
  params: {
    type: 'object' as const,
    required: ['questionId'] as const,
    properties: {
      questionId: { type: 'string' as const, format: 'uuid', description: 'UUID da questão' },
    },
  },
  body: {
    type: 'object' as const,
    required: ['text', 'isCorrect'] as const,
    properties: {
      text: { type: 'string' as const, description: 'Texto da alternativa' },
      isCorrect: { type: 'boolean' as const, description: 'Alternativa correta?' },
    },
  },
  response: {
    201: {
      ...alternativeObject,
      description: 'Alternativa criada com sucesso',
    },
    400: errorSchemas.validationError,
    401: errorSchemas.unauthorized,
    404: errorSchemas.notFound,
  },
};

export const updateAlternativeSchema = {
  summary: 'Atualizar alternativa',
  description: 'Atualiza texto e/ou flag de correta de uma alternativa.',
  tags: ['Alternatives'],
  security: bearerSecurity,
  params: {
    type: 'object' as const,
    required: ['id'] as const,
    properties: {
      id: { type: 'string' as const, format: 'uuid', description: 'UUID da alternativa' },
    },
  },
  body: {
    type: 'object' as const,
    properties: {
      text: { type: 'string' as const },
      isCorrect: { type: 'boolean' as const },
    },
    minProperties: 1,
  },
  response: {
    204: { type: 'null' as const, description: 'Alternativa atualizada com sucesso' },
    400: errorSchemas.validationError,
    401: errorSchemas.unauthorized,
    404: errorSchemas.notFound,
  },
};

export const deleteAlternativeSchema = {
  summary: 'Excluir alternativa',
  description: 'Remove uma alternativa permanentemente.',
  tags: ['Alternatives'],
  security: bearerSecurity,
  params: {
    type: 'object' as const,
    required: ['id'] as const,
    properties: {
      id: { type: 'string' as const, format: 'uuid', description: 'UUID da alternativa' },
    },
  },
  response: {
    204: { type: 'null' as const, description: 'Alternativa removida com sucesso' },
    401: errorSchemas.unauthorized,
    404: errorSchemas.notFound,
  },
};
