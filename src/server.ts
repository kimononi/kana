import { Application, Router } from "./deps.ts";

const router = new Router();
router.post("/", (ctx) => {
  
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: 8080 });

function hexEncode(hex: string): Uint8Array {
  return new Uint8Array(
    hex.match(/.{1,2}/).map(ctx => parseInt(ctx, 16))
  );
}
