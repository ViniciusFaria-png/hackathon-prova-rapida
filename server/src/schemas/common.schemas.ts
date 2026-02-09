const zodValidationIssueSchema = {
  type: 'object' as const,
  properties: {
    code: { type: 'string' as const },
    expected: { type: 'string' as const },
    received: { type: 'string' as const },
    path: { type: 'array' as const, items: { type: 'string' as const } },
    message: { type: 'string' as const },
  },
  required: ['code', 'path', 'message'] as const,
};

export const errorSchemas = {
  validationError: {
    type: 'object' as const,
    description: 'Erro de validação nos dados enviados',
    properties: {
      success: { type: 'boolean' as const, example: false },
      message: { type: 'string' as const, example: 'Validation error' },
      error: { type: 'object' as const, additionalProperties: true },
    },
    required: ['message'] as const,
  },

  unauthorized: {
    type: 'object' as const,
    description: 'Token JWT ausente ou inválido',
    properties: {
      message: { type: 'string' as const, example: 'Unauthorized' },
    },
    required: ['message'] as const,
  },

  forbidden: {
    type: 'object' as const,
    description: 'Sem permissão para acessar este recurso',
    properties: {
      success: { type: 'boolean' as const, example: false },
      message: { type: 'string' as const, example: 'Forbidden' },
    },
    required: ['message'] as const,
  },

  notFound: {
    type: 'object' as const,
    description: 'Recurso não encontrado',
    properties: {
      success: { type: 'boolean' as const, example: false },
      message: { type: 'string' as const, example: 'Resource not found' },
    },
    required: ['message'] as const,
  },

  businessRule: {
    type: 'object' as const,
    description: 'Regra de negócio violada',
    properties: {
      success: { type: 'boolean' as const, example: false },
      message: { type: 'string' as const },
    },
    required: ['message'] as const,
  },

  internalError: {
    type: 'object' as const,
    description: 'Erro interno do servidor',
    properties: {
      message: { type: 'string' as const, example: 'Erro interno do servidor' },
      error: { type: 'string' as const },
    },
    required: ['message'] as const,
  },
} as const;

export const uuidParamSchema = {
  type: 'object' as const,
  properties: {
    id: { type: 'string' as const, format: 'uuid', description: 'Identificador UUID do recurso' },
  },
  required: ['id'] as const,
};

export const paginationQuerySchema = {
  type: 'object' as const,
  properties: {
    page: { type: 'string' as const, description: 'Número da página (começa em 1)' },
    limit: { type: 'string' as const, description: 'Itens por página' },
  },
};

export const bearerSecurity = [{ bearerAuth: [] }];
