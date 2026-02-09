import { bearerSecurity, errorSchemas, uuidParamSchema } from '../common.schemas';

const alternativePreview = {
  type: 'object' as const,
  properties: {
    id: { type: 'string' as const, format: 'uuid' },
    text: { type: 'string' as const },
    is_correct: { type: 'boolean' as const },
  },
};

const questionInExam = {
  type: 'object' as const,
  properties: {
    id: { type: 'string' as const, format: 'uuid' },
    statement: { type: 'string' as const },
    subject: { type: 'string' as const },
    position: { type: 'integer' as const },
    alternatives: { type: 'array' as const, items: alternativePreview },
  },
};

const examObject = {
  type: 'object' as const,
  properties: {
    id: { type: 'string' as const, format: 'uuid' },
    title: { type: 'string' as const },
    subject: { type: 'string' as const },
    user_id: { type: 'string' as const, format: 'uuid' },
    questions: { type: 'array' as const, items: questionInExam },
    created_at: { type: 'string' as const, format: 'date-time' },
    updated_at: { type: 'string' as const, format: 'date-time' },
  },
};

const examVersionObject = {
  type: 'object' as const,
  properties: {
    id: { type: 'string' as const, format: 'uuid' },
    exam_id: { type: 'string' as const, format: 'uuid' },
    version_name: { type: 'string' as const },
    status: { type: 'string' as const, enum: ['draft', 'finalized'] },
    shuffle_seed: { type: 'integer' as const, nullable: true },
    questions: { type: 'array' as const, items: questionInExam },
    created_at: { type: 'string' as const, format: 'date-time' },
  },
};

const successWrapper = (dataSchema: object, description: string) => ({
  type: 'object' as const,
  description,
  properties: {
    success: { type: 'boolean' as const, example: true },
    data: dataSchema,
  },
});

export const createExamSchema = {
  summary: 'Criar prova',
  description: 'Cria uma nova prova vazia associada ao usuário autenticado.',
  tags: ['Exams'],
  security: bearerSecurity,
  body: {
    type: 'object' as const,
    required: ['title', 'subject'] as const,
    properties: {
      title: { type: 'string' as const, description: 'Título da prova' },
      subject: { type: 'string' as const, description: 'Disciplina' },
    },
  },
  response: {
    201: { ...examObject, description: 'Prova criada com sucesso' },
    400: errorSchemas.validationError,
    401: errorSchemas.unauthorized,
  },
};

export const findAllExamsSchema = {
  summary: 'Listar provas',
  description: 'Retorna provas do usuário autenticado com filtros opcionais.',
  tags: ['Exams'],
  security: bearerSecurity,
  querystring: {
    type: 'object' as const,
    properties: {
      page: { type: 'string' as const, description: 'Número da página' },
      limit: { type: 'string' as const, description: 'Itens por página' },
      subject: { type: 'string' as const, description: 'Filtrar por disciplina' },
      search: { type: 'string' as const, description: 'Busca textual no título' },
      status: { type: 'string' as const, enum: ['draft', 'finalized'], description: 'Filtrar por status' },
    },
  },
  response: {
    200: {
      type: 'object' as const,
      description: 'Lista paginada de provas',
      properties: {
        success: { type: 'boolean' as const },
        exams: { type: 'array' as const, items: examObject },
        total: { type: 'number' as const },
        page: { type: 'number' as const },
        totalPages: { type: 'number' as const },
      },
    },
    401: errorSchemas.unauthorized,
  },
};

export const findExamByIdSchema = {
  summary: 'Buscar prova por ID',
  description: 'Retorna uma prova com suas questões, alternativas e versões.',
  tags: ['Exams'],
  security: bearerSecurity,
  params: uuidParamSchema,
  response: {
    200: {
      type: 'object' as const,
      description: 'Dados completos da prova',
      properties: {
        ...examObject.properties,
        versions: { type: 'array' as const, items: examVersionObject },
      },
    },
    400: errorSchemas.validationError,
    401: errorSchemas.unauthorized,
    404: errorSchemas.notFound,
  },
};

export const updateExamSchema = {
  summary: 'Atualizar prova',
  description: 'Atualiza título e/ou disciplina de uma prova. Somente o proprietário pode editar.',
  tags: ['Exams'],
  security: bearerSecurity,
  params: uuidParamSchema,
  body: {
    type: 'object' as const,
    properties: {
      title: { type: 'string' as const },
      subject: { type: 'string' as const },
    },
    minProperties: 1,
  },
  response: {
    204: { type: 'null' as const, description: 'Prova atualizada com sucesso' },
    400: errorSchemas.validationError,
    401: errorSchemas.unauthorized,
    403: errorSchemas.forbidden,
    404: errorSchemas.notFound,
  },
};

export const deleteExamSchema = {
  summary: 'Excluir prova',
  description: 'Remove uma prova e todos os seus dados associados. Somente o proprietário pode excluir.',
  tags: ['Exams'],
  security: bearerSecurity,
  params: uuidParamSchema,
  response: {
    204: { type: 'null' as const, description: 'Prova removida com sucesso' },
    401: errorSchemas.unauthorized,
    403: errorSchemas.forbidden,
    404: errorSchemas.notFound,
  },
};

export const addQuestionToExamSchema = {
  summary: 'Adicionar questão à prova',
  description: 'Associa uma questão existente à prova em uma posição específica.',
  tags: ['Exam Questions'],
  security: bearerSecurity,
  params: uuidParamSchema,
  body: {
    type: 'object' as const,
    required: ['questionId', 'position'] as const,
    properties: {
      questionId: { type: 'string' as const, format: 'uuid', description: 'UUID da questão' },
      position: { type: 'integer' as const, minimum: 1, description: 'Posição na prova (1-based)' },
    },
  },
  response: {
    201: {
      type: 'object' as const,
      description: 'Questão adicionada',
      properties: { success: { type: 'boolean' as const, example: true } },
    },
    400: errorSchemas.validationError,
    401: errorSchemas.unauthorized,
    403: errorSchemas.forbidden,
    404: errorSchemas.notFound,
  },
};

export const batchAddQuestionsSchema = {
  summary: 'Adicionar múltiplas questões à prova',
  description: 'Associa várias questões de uma vez à prova em suas respectivas posições.',
  tags: ['Exam Questions'],
  security: bearerSecurity,
  params: uuidParamSchema,
  body: {
    type: 'object' as const,
    required: ['questions'] as const,
    properties: {
      questions: {
        type: 'array' as const,
        minItems: 1,
        items: {
          type: 'object' as const,
          required: ['questionId', 'position'] as const,
          properties: {
            questionId: { type: 'string' as const, format: 'uuid' },
            position: { type: 'integer' as const, minimum: 1 },
          },
        },
      },
    },
  },
  response: {
    201: {
      type: 'object' as const,
      description: 'Questões adicionadas em lote',
      properties: {
        success: { type: 'boolean' as const },
        added: { type: 'number' as const },
      },
    },
    400: errorSchemas.validationError,
    401: errorSchemas.unauthorized,
    403: errorSchemas.forbidden,
  },
};

export const removeQuestionFromExamSchema = {
  summary: 'Remover questão da prova',
  description: 'Desassocia uma questão da prova (sem excluir a questão).',
  tags: ['Exam Questions'],
  security: bearerSecurity,
  params: {
    type: 'object' as const,
    required: ['id', 'questionId'] as const,
    properties: {
      id: { type: 'string' as const, format: 'uuid', description: 'UUID da prova' },
      questionId: { type: 'string' as const, format: 'uuid', description: 'UUID da questão' },
    },
  },
  response: {
    204: { type: 'null' as const, description: 'Questão removida da prova' },
    401: errorSchemas.unauthorized,
    404: errorSchemas.notFound,
  },
};

export const reorderExamQuestionsSchema = {
  summary: 'Reordenar questões da prova',
  description: 'Redefine a ordem das questões dentro da prova.',
  tags: ['Exam Questions'],
  security: bearerSecurity,
  params: uuidParamSchema,
  body: {
    type: 'object' as const,
    required: ['questions'] as const,
    properties: {
      questions: {
        type: 'array' as const,
        items: {
          type: 'object' as const,
          required: ['questionId', 'position'] as const,
          properties: {
            questionId: { type: 'string' as const, format: 'uuid' },
            position: { type: 'integer' as const, minimum: 1 },
          },
        },
      },
    },
  },
  response: {
    204: { type: 'null' as const, description: 'Questões reordenadas' },
    400: errorSchemas.validationError,
    401: errorSchemas.unauthorized,
  },
};

export const shuffleExamSchema = {
  summary: 'Embaralhar prova',
  description: 'Cria uma nova versão embaralhada da prova.',
  tags: ['Exam Versions'],
  security: bearerSecurity,
  params: uuidParamSchema,
  body: {
    type: 'object' as const,
    required: ['versionName'] as const,
    properties: {
      versionName: { type: 'string' as const, description: 'Nome da versão (ex: "Versão A")' },
    },
  },
  response: {
    201: { ...examVersionObject, description: 'Versão embaralhada criada' },
    400: errorSchemas.validationError,
    401: errorSchemas.unauthorized,
    404: errorSchemas.notFound,
  },
};

export const generateVersionsSchema = {
  summary: 'Gerar múltiplas versões',
  description: 'Gera N versões embaralhadas da prova automaticamente (máx. 26).',
  tags: ['Exam Versions'],
  security: bearerSecurity,
  params: uuidParamSchema,
  body: {
    type: 'object' as const,
    required: ['count'] as const,
    properties: {
      count: { type: 'integer' as const, minimum: 1, maximum: 26, description: 'Quantidade de versões a gerar' },
    },
  },
  response: {
    201: successWrapper(
      { type: 'array' as const, items: examVersionObject },
      'Versões geradas com sucesso',
    ),
    400: errorSchemas.validationError,
    401: errorSchemas.unauthorized,
    404: errorSchemas.notFound,
    422: errorSchemas.businessRule,
  },
};

export const finalizeExamSchema = {
  summary: 'Finalizar prova',
  description: 'Bloqueia a prova para edição, marcando-a como finalizada.',
  tags: ['Exam Versions'],
  security: bearerSecurity,
  params: uuidParamSchema,
  response: {
    201: successWrapper(
      { type: 'object' as const, additionalProperties: true },
      'Prova finalizada com sucesso',
    ),
    401: errorSchemas.unauthorized,
    404: errorSchemas.notFound,
    422: errorSchemas.businessRule,
  },
};

export const duplicateExamSchema = {
  summary: 'Duplicar prova',
  description: 'Cria uma cópia completa da prova (incluindo questões) para o usuário autenticado.',
  tags: ['Exams'],
  security: bearerSecurity,
  params: uuidParamSchema,
  body: {
    type: 'object' as const,
    properties: {
      newTitle: { type: 'string' as const, description: 'Título da cópia (opcional)' },
    },
  },
  response: {
    201: {
      type: 'object' as const,
      description: 'Prova duplicada com sucesso',
      additionalProperties: true,
    },
    401: errorSchemas.unauthorized,
    404: errorSchemas.notFound,
  },
};

export const previewExamSchema = {
  summary: 'Pré-visualizar prova',
  description: 'Retorna uma pré-visualização formatada da prova ou de uma versão específica.',
  tags: ['Exams'],
  security: bearerSecurity,
  params: uuidParamSchema,
  querystring: {
    type: 'object' as const,
    properties: {
      versionId: { type: 'string' as const, format: 'uuid', description: 'UUID da versão (opcional)' },
    },
  },
  response: {
    200: {
      type: 'object' as const,
      description: 'Dados para pré-visualização',
      properties: {
        title: { type: 'string' as const },
        subject: { type: 'string' as const },
        versionLabel: { type: 'string' as const, nullable: true },
        questions: {
          type: 'array' as const,
          items: {
            type: 'object' as const,
            properties: {
              number: { type: 'integer' as const },
              statement: { type: 'string' as const },
              alternatives: {
                type: 'array' as const,
                items: {
                  type: 'object' as const,
                  properties: {
                    letter: { type: 'string' as const },
                    text: { type: 'string' as const },
                  },
                },
              },
            },
          },
        },
      },
    },
    401: errorSchemas.unauthorized,
    404: errorSchemas.notFound,
  },
};

export const validateExamSchema = {
  summary: 'Validar prova',
  description: 'Verifica se a prova está completa e pronta para finalização.',
  tags: ['Exams'],
  security: bearerSecurity,
  params: uuidParamSchema,
  response: {
    200: successWrapper(
      { type: 'object' as const, additionalProperties: true },
      'Resultado da validação',
    ),
    401: errorSchemas.unauthorized,
    404: errorSchemas.notFound,
  },
};

export const examStatsSchema = {
  summary: 'Estatísticas da prova',
  description: 'Retorna estatísticas como total de questões, distribuição de dificuldade etc.',
  tags: ['Exams'],
  security: bearerSecurity,
  params: uuidParamSchema,
  response: {
    200: successWrapper(
      { type: 'object' as const, additionalProperties: true },
      'Estatísticas da prova',
    ),
    401: errorSchemas.unauthorized,
    404: errorSchemas.notFound,
  },
};

const ecoModeEnum = ['normal', 'save-paper', 'save-ink', 'eco-max', 'accessibility'] as const;

export const exportPdfSchema = {
  summary: 'Exportar prova em PDF',
  description: 'Gera e retorna o arquivo PDF da prova (ou de uma versão específica).',
  tags: ['Exam Export'],
  security: bearerSecurity,
  params: uuidParamSchema,
  querystring: {
    type: 'object' as const,
    properties: {
      versionId: { type: 'string' as const, format: 'uuid', description: 'UUID da versão (opcional)' },
      includeAnswerKey: { type: 'string' as const, enum: ['true', 'false'], description: 'Incluir gabarito no final?' },
      ecoMode: { type: 'string' as const, enum: [...ecoModeEnum], default: 'normal', description: 'Modo de economia' },
    },
  },
  response: {
    200: {
      type: 'string' as const,
      format: 'binary',
      description: 'Arquivo PDF da prova',
    },
    401: errorSchemas.unauthorized,
    404: errorSchemas.notFound,
    500: errorSchemas.internalError,
  },
};

export const answerKeySchema = {
  summary: 'Exportar gabarito em PDF',
  description: 'Gera e retorna o gabarito da prova (ou de uma versão) em formato PDF.',
  tags: ['Exam Export'],
  security: bearerSecurity,
  params: uuidParamSchema,
  querystring: {
    type: 'object' as const,
    properties: {
      versionId: { type: 'string' as const, format: 'uuid', description: 'UUID da versão (opcional)' },
      ecoMode: { type: 'string' as const, enum: [...ecoModeEnum], default: 'normal', description: 'Modo de economia' },
    },
  },
  response: {
    200: {
      type: 'string' as const,
      format: 'binary',
      description: 'Arquivo PDF do gabarito',
    },
    401: errorSchemas.unauthorized,
    404: errorSchemas.notFound,
    500: errorSchemas.internalError,
  },
};

export const ecoModesSchema = {
  summary: 'Listar modos de economia',
  description: 'Retorna os modos de economia disponíveis para exportação PDF.',
  tags: ['Exam Export'],
  security: bearerSecurity,
  response: {
    200: {
      type: 'object' as const,
      description: 'Lista de modos disponíveis',
      properties: {
        modes: {
          type: 'array' as const,
          items: {
            type: 'object' as const,
            additionalProperties: true,
          },
        },
      },
    },
    401: errorSchemas.unauthorized,
  },
};
