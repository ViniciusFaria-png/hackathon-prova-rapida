import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastify from 'fastify';
import { env } from './env';
import { alternativeRoutes } from './http/controllers/alternative/route';
import { examRoutes } from './http/controllers/exams/route';
import { questionRoutes } from './http/controllers/question/route';
import { userRoutes } from './http/controllers/user/routes';
import { globalErrorHandler } from './utils/global-error-handler';

export const app = fastify();

app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
});


app.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
});

app.setErrorHandler(globalErrorHandler);

// Registrar rotas
app.register(userRoutes);
app.register(questionRoutes);
app.register(examRoutes);
app.register(alternativeRoutes);
