import { FastifyInstance } from "fastify";
import { jwtAuth } from "../../middleware/jwt-auth";
import { changePassword } from "./change-password";
import { create } from "./create";
import { deleteUserSchema, remove } from "./delete";
import { findAll, findAllUsersSchema } from "./find-all";
import { findById, findUserByIdSchema } from "./find-by-id";
import { logout } from "./logout";
import { me } from "./me";
import { signin, signinSchema } from "./signin";
import { update, updateUserSchema } from "./update";
import { updateMe } from "./update-me";

export async function userRoutes(app: FastifyInstance) {
  app.post("/users", create);
  app.post("/auth/login", { schema: signinSchema }, signin);
  
  app.post("/auth/logout", { onRequest: [jwtAuth] }, logout);
  app.get("/users/me", { onRequest: [jwtAuth] }, me);
  app.put("/users/me", { onRequest: [jwtAuth] }, updateMe);
  app.put("/users/me/password", { onRequest: [jwtAuth] }, changePassword);

  app.get("/user", { schema: findAllUsersSchema, onRequest: [jwtAuth] }, findAll);
  app.get("/user/:id", { schema: findUserByIdSchema, onRequest: [jwtAuth] }, findById);
  app.put("/user/:id", { schema: updateUserSchema, onRequest: [jwtAuth] }, update);
  app.delete("/user/:id", { schema: deleteUserSchema, onRequest: [jwtAuth] }, remove);
}

