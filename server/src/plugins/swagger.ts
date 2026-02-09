import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import type { FastifyInstance } from 'fastify';
import { env } from '../env';

export async function swaggerPlugin(app: FastifyInstance): Promise<void> {
  await app.register(fastifySwagger, {
    openapi: {
      openapi: '3.0.3',
      info: {
        title: 'Prova Rápida API',
        description:
          'API para gerenciamento de provas, questões, alternativas e usuários. ' +
          'Permite criar, editar e exportar provas em PDF com suporte a múltiplas versões embaralhadas.',
        version: '1.0.0',
        contact: {
          name: 'Prova Rápida Team',
        },
      },
      servers: [
        {
          url: `http://localhost:${env.PORT}`,
          description: 'Servidor de desenvolvimento',
        },
      ],
      tags: [
        { name: 'Auth', description: 'Autenticação e gerenciamento de sessão' },
        { name: 'Users', description: 'Gerenciamento de usuários' },
        { name: 'Questions', description: 'CRUD de questões' },
        { name: 'Alternatives', description: 'CRUD de alternativas de uma questão' },
        { name: 'Exams', description: 'CRUD de provas' },
        { name: 'Exam Questions', description: 'Operações de questões dentro de uma prova' },
        { name: 'Exam Versions', description: 'Embaralhamento, versões e finalização de provas' },
        { name: 'Exam Export', description: 'Exportação de provas e gabaritos em PDF' },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Token JWT obtido via POST /auth/login',
          },
        },
      },
    },
  });

  await app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
      persistAuthorization: true,
      displayRequestDuration: true,
    },
    staticCSP: true,
  });
}
