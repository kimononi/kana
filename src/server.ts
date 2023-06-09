import { Application, Router } from "./deps.ts";
import * as routes from "./routes/mod.ts";

const router = new Router();

for (const { method, path, middleware } of Object.values(routes).map(ctx => ctx.default)) {
  router.add(method, path, middleware);
}

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: 8080 });
