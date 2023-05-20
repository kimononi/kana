import { Application, Router } from "./deps.ts";
import * as routes from "./routes/mod.ts";

const router = new Router();

for (const { method, path, middleware } from Object.values(routes).map(ctx => ctx.default)) {
  router.add(method, path, middleware);
}

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: 8080 });

function hexEncode(hex: string): Uint8Array {
  return new Uint8Array(
    hex.match(/.{1,2}/g).map(ctx => parseInt(ctx, 16))
  );
}
