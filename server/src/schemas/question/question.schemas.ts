import { bearerSecurity, errorSchemas, uuidParamSchema } from '../common.schemas';

const alternativeObject = {
  type: 'object' as const,
  properties: {
    id: { type: 'string' as const, format: 'uuid' },
    text: { type: 'string' as const },
    is_correct: { type: 'boolean' as const },
    question_id: { type: 'string' as const, format: 'uuid' },
  },
};

const questionObject = {
  type: 'object' as const,
  properties: {
    id: { type: 'string' as const, format: 'uuid' },
    statement: { type: 'string' as const },
    subject: { type: 'string' as const },
    difficulty: { type: 'string' as const, enum: ['easy', 'medium', 'hard'] },
    is_public: { type: 'boolean' as const },
    user_id: { type: 'string' as const, format: 'uuid' },
    alternatives: { type: 'array' as const, items: alternativeObject },
    created_at: { type: 'string' as const, format: 'date-time' },
    updated_at: { type: 'string' as const, format: 'date-time' },
  },
};

export const createQuestionSchema = {
  summary: 'Criar questão',
  description:
    'Cria uma nova questão com suas alternativas. Deve conter pelo menos 2 alternativas e ao menos uma correta.',
  tags: ['Questions'],
  security: bearerSecurity,
  body: {
    type: 'object' as const,
    required: ['statement', 'subject', 'alternatives'] as const,
    properties: {
      statement: { type: 'string' as const, description: 'Enunciado da questão' },
      subject: { type: 'string' as const, description: 'Disciplina/matéria' },
      difficulty: {
        type: 'string' as const,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium',
        description: 'Nível de dificuldade',
      },
      isPublic: { type: 'boolean' as const, default: false, description: 'Questão pública?' },
      alternatives: {
        type: 'array' as const,
        minItems: 2,
        description: 'Alternativas (mín. 2, ao menos 1 correta)',
        items: {
          type: 'object' as const,
          required: ['text', 'isCorrect'] as const,
          properties: {
            text: { type: 'string' as const },
            isCorrect: { type: 'boolean' as const },
          },
        },
      },
    },
  },
  response: {
    201: {
      type: 'object' as const,
      description: 'Questão criada com sucesso',
      properties: {
        success: { type: 'boolean' as const },
        data: questionObject,
      },
    },
    400: errorSchemas.validationError,
    401: errorSchemas.unauthorized,
    500: errorSchemas.internalError,
  },
};

export const findAllQuestionsSchema = {
  summary: 'Listar questões',
  description: 'Retorna questões com filtros opcionais de página, disciplina, dificuldade e busca textual.',
  tags: ['Questions'],
  security: bearerSecurity,
  querystring: {
    type: 'object' as const,
    properties: {
      page: { type: 'string' as const, description: 'Número da página' },
      limit: { type: 'string' as const, description: 'Itens por página' },
      subject: { type: 'string' as const, description: 'Filtrar por disciplina' },
      difficulty: { type: 'string' as const, description: 'Filtrar por dificuldade' },
      search: { type: 'string' as const, description: 'Busca textual no enunciado' },
      userId: { type: 'string' as const, format: 'uuid', description: 'Filtrar por autor' },
      isPublic: { type: 'string' as const, description: 'Filtrar por visibilidade (true/false)' },
      excludeUsedIn: { type: 'string' as const, format: 'uuid', description: 'Excluir questões já usadas nesta prova' },
    },
  },
  response: {
    200: {
      type: 'object' as const,
      description: 'Lista paginada de questões',
      properties: {
        success: { type: 'boolean' as const },
        questions: { type: 'array' as const, items: questionObject },
        total: { type: 'number' as const },
        page: { type: 'number' as const },
        totalPages: { type: 'number' as const },
      },
    },
    401: errorSchemas.unauthorized,
  },
};

export const findQuestionByIdSchema = {
  summary: 'Buscar questão por ID',
  description: 'Retorna uma questão específica com suas alternativas.',
  tags: ['Questions'],
  security: bearerSecurity,
  params: uuidParamSchema,
  response: {
    200: {
      ...questionObject,
      description: 'Dados da questão',
    },
    400: errorSchemas.validationError,
    401: errorSchemas.unauthorized,
    404: errorSchemas.notFound,
  },
};

export const updateQuestionSchema = {
  summary: 'Atualizar questão',
  description:
    'Atualiza campos da questão. Se a questão pertence a outro usuário e é pública, uma cópia privada é criada (copy-on-write).',
  tags: ['Questions'],
  security: bearerSecurity,
  params: uuidParamSchema,
  body: {
    type: 'object' as const,
    properties: {
      statement: { type: 'string' as const },
      subject: { type: 'string' as const },
      difficulty: { type: 'string' as const, enum: ['easy', 'medium', 'hard'] },
      isPublic: { type: 'boolean' as const },
    },
    minProperties: 1,
  },
  response: {
    201: {
      type: 'object' as const,
      description: 'Cópia criada (copy-on-write)',
      properties: {
        id: { type: 'string' as const, format: 'uuid' },
        copied: { type: 'boolean' as const, example: true },
      },
    },
    204: { type: 'null' as const, description: 'Questão atualizada com sucesso' },
    400: errorSchemas.validationError,
    401: errorSchemas.unauthorized,
    403: errorSchemas.forbidden,
    404: errorSchemas.notFound,
  },
};

export const deleteQuestionSchema = {
  summary: 'Excluir questão',
  description: 'Remove uma questão permanentemente. Requer permissão de proprietário.',
  tags: ['Questions'],
  security: bearerSecurity,
  params: uuidParamSchema,
  response: {
    204: { type: 'null' as const, description: 'Questão removida com sucesso' },
    400: errorSchemas.validationError,
    401: errorSchemas.unauthorized,
    403: errorSchemas.forbidden,
    404: errorSchemas.notFound,
  },
};
