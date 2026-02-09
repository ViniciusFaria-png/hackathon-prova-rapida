import { bearerSecurity, errorSchemas, uuidParamSchema } from '../common.schemas';

const userObject = {
  type: 'object' as const,
  properties: {
    id: { type: 'string' as const, format: 'uuid' },
    name: { type: 'string' as const },
    email: { type: 'string' as const, format: 'email' },
    created_at: { type: 'string' as const, format: 'date-time' },
    updated_at: { type: 'string' as const, format: 'date-time' },
  },
};

const userWithoutPassword = {
  type: 'object' as const,
  properties: {
    id: { type: 'string' as const, format: 'uuid' },
    name: { type: 'string' as const },
    email: { type: 'string' as const, format: 'email' },
    created_at: { type: 'string' as const, format: 'date-time' },
    updated_at: { type: 'string' as const, format: 'date-time' },
  },
};

export const signinSchema = {
  summary: 'Autenticar usuário',
  description: 'Realiza login com email e senha, retornando um token JWT válido por 7 dias.',
  tags: ['Auth'],
  body: {
    type: 'object' as const,
    required: ['email', 'password'] as const,
    properties: {
      email: { type: 'string' as const, format: 'email', description: 'Email do usuário' },
      password: { type: 'string' as const, minLength: 1, description: 'Senha do usuário' },
    },
  },
  response: {
    200: {
      type: 'object' as const,
      description: 'Login realizado com sucesso',
      properties: {
        user: {
          type: 'object' as const,
          properties: {
            id: { type: 'string' as const, format: 'uuid' },
            name: { type: 'string' as const },
            email: { type: 'string' as const, format: 'email' },
          },
        },
        token: { type: 'string' as const, description: 'Token JWT' },
        message: { type: 'string' as const, example: 'Login realizado com sucesso' },
      },
    },
    400: errorSchemas.validationError,
    401: errorSchemas.unauthorized,
    500: errorSchemas.internalError,
  },
};

export const logoutSchema = {
  summary: 'Encerrar sessão',
  description: 'Realiza logout do usuário autenticado.',
  tags: ['Auth'],
  security: bearerSecurity,
  response: {
    200: {
      type: 'object' as const,
      description: 'Logout realizado com sucesso',
      properties: {
        message: { type: 'string' as const, example: 'Logout realizado com sucesso' },
      },
    },
    401: errorSchemas.unauthorized,
  },
};

export const createUserSchema = {
  summary: 'Criar novo usuário',
  description: 'Registra um novo usuário no sistema.',
  tags: ['Users'],
  body: {
    type: 'object' as const,
    required: ['name', 'email', 'password'] as const,
    properties: {
      name: { type: 'string' as const, description: 'Nome completo do usuário' },
      email: { type: 'string' as const, format: 'email', description: 'Email único' },
      password: { type: 'string' as const, minLength: 6, description: 'Senha (mín. 6 caracteres)' },
    },
  },
  response: {
    201: {
      type: 'object' as const,
      description: 'Usuário criado com sucesso',
      properties: {
        id: { type: 'string' as const, format: 'uuid' },
        email: { type: 'string' as const, format: 'email' },
      },
    },
    400: errorSchemas.validationError,
    500: errorSchemas.internalError,
  },
};

export const meSchema = {
  summary: 'Obter perfil do usuário autenticado',
  description: 'Retorna os dados do usuário logado (sem senha).',
  tags: ['Users'],
  security: bearerSecurity,
  response: {
    200: {
      ...userWithoutPassword,
      description: 'Dados do perfil',
    },
    401: errorSchemas.unauthorized,
  },
};

export const updateMeSchema = {
  summary: 'Atualizar perfil próprio',
  description: 'Permite ao usuário autenticado atualizar nome e/ou email.',
  tags: ['Users'],
  security: bearerSecurity,
  body: {
    type: 'object' as const,
    properties: {
      name: { type: 'string' as const, description: 'Novo nome' },
      email: { type: 'string' as const, format: 'email', description: 'Novo email' },
    },
    minProperties: 1,
  },
  response: {
    200: {
      type: 'object' as const,
      description: 'Perfil atualizado',
      properties: {
        message: { type: 'string' as const, example: 'Perfil atualizado com sucesso' },
        user: userWithoutPassword,
      },
    },
    400: errorSchemas.validationError,
    401: errorSchemas.unauthorized,
  },
};

export const changePasswordSchema = {
  summary: 'Alterar senha',
  description: 'Altera a senha do usuário autenticado, exigindo a senha atual.',
  tags: ['Users'],
  security: bearerSecurity,
  body: {
    type: 'object' as const,
    required: ['currentPassword', 'newPassword'] as const,
    properties: {
      currentPassword: { type: 'string' as const, description: 'Senha atual' },
      newPassword: { type: 'string' as const, minLength: 6, description: 'Nova senha (mín. 6 caracteres)' },
    },
  },
  response: {
    200: {
      type: 'object' as const,
      description: 'Senha alterada com sucesso',
      properties: {
        message: { type: 'string' as const, example: 'Senha alterada com sucesso' },
      },
    },
    400: {
      type: 'object' as const,
      description: 'Senha atual incorreta ou dados inválidos',
      properties: {
        message: { type: 'string' as const },
      },
    },
    401: errorSchemas.unauthorized,
    404: errorSchemas.notFound,
  },
};

export const findAllUsersSchema = {
  summary: 'Listar todos os usuários',
  description: 'Retorna a lista completa de usuários cadastrados.',
  tags: ['Users'],
  security: bearerSecurity,
  response: {
    200: {
      type: 'object' as const,
      description: 'Lista de usuários',
      properties: {
        users: {
          type: 'array' as const,
          items: userObject,
        },
      },
    },
    401: errorSchemas.unauthorized,
    500: errorSchemas.internalError,
  },
};

export const findUserByIdSchema = {
  summary: 'Buscar usuário por ID',
  description: 'Retorna os dados de um usuário específico pelo UUID.',
  tags: ['Users'],
  security: bearerSecurity,
  params: uuidParamSchema,
  response: {
    200: {
      type: 'object' as const,
      description: 'Dados do usuário',
      properties: {
        user: userObject,
      },
    },
    400: errorSchemas.validationError,
    401: errorSchemas.unauthorized,
    404: errorSchemas.notFound,
  },
};

export const updateUserSchema = {
  summary: 'Atualizar usuário por ID',
  description: 'Atualiza email e/ou senha de um usuário pelo UUID.',
  tags: ['Users'],
  security: bearerSecurity,
  params: uuidParamSchema,
  body: {
    type: 'object' as const,
    properties: {
      email: { type: 'string' as const, format: 'email' },
      password: { type: 'string' as const, minLength: 6 },
    },
    minProperties: 1,
  },
  response: {
    200: {
      type: 'object' as const,
      description: 'Usuário atualizado',
      properties: {
        user: userObject,
      },
    },
    400: errorSchemas.validationError,
    401: errorSchemas.unauthorized,
    404: errorSchemas.notFound,
  },
};

export const deleteUserSchema = {
  summary: 'Remover usuário por ID',
  description: 'Exclui permanentemente um usuário pelo UUID.',
  tags: ['Users'],
  security: bearerSecurity,
  params: uuidParamSchema,
  response: {
    204: { type: 'null' as const, description: 'Usuário removido com sucesso' },
    400: errorSchemas.validationError,
    401: errorSchemas.unauthorized,
    404: errorSchemas.notFound,
  },
};
