import { Application, Router, sign, Status, STATUS_TEXT } from "./deps.ts";

const router = new Router();
router.post("/", (ctx) => {
  const timestamp = ctx.request.headers.get("X-Signature-Timestamp");
  const signature = ctx.request.headers.get("X-Signature-Ed25519");
  const body = await ctx.request.body({ type: "text" }).value;

  const valid = sign.detached.verify(
    new TextEncoder().encode(timestamp + body),
    hexEncode(signature),
    hexEncode(Deno.env.get("DISCORD_PUBLIC_KEY"))
  );

  if (!valid) {
    const statusCode = Status.Unauthorized;
    ctx.response.body = STATUS_TEXT[statusCode];
    ctx.response.status = statusCode;
  }
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
