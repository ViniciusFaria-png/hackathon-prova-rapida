import { FastifyInstance } from "fastify";
import {
    changePasswordSchema,
    createUserSchema,
    deleteUserSchema,
    findAllUsersSchema,
    findUserByIdSchema,
    logoutSchema,
    meSchema,
    signinSchema,
    updateMeSchema,
    updateUserSchema,
} from "../../../schemas/user/user.schemas";
import { jwtAuth } from "../../middleware/jwt-auth";
import { changePassword } from "./change-password";
import { create } from "./create";
import { remove } from "./delete";
import { findAll } from "./find-all";
import { findById } from "./find-by-id";
import { logout } from "./logout";
import { me } from "./me";
import { signin } from "./signin";
import { update } from "./update";
import { updateMe } from "./update-me";

export async function userRoutes(app: FastifyInstance) {
  app.post("/users", { schema: createUserSchema }, create);
  app.post("/auth/login", { schema: signinSchema }, signin);

  app.post("/auth/logout", { schema: logoutSchema, onRequest: [jwtAuth] }, logout);
  app.get("/users/me", { schema: meSchema, onRequest: [jwtAuth] }, me);
  app.put("/users/me", { schema: updateMeSchema, onRequest: [jwtAuth] }, updateMe);
  app.put("/users/me/password", { schema: changePasswordSchema, onRequest: [jwtAuth] }, changePassword);

  app.get("/user", { schema: findAllUsersSchema, onRequest: [jwtAuth] }, findAll);
  app.get("/user/:id", { schema: findUserByIdSchema, onRequest: [jwtAuth] }, findById);
  app.put("/user/:id", { schema: updateUserSchema, onRequest: [jwtAuth] }, update);
  app.delete("/user/:id", { schema: deleteUserSchema, onRequest: [jwtAuth] }, remove);
}

