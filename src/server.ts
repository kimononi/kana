import { Application, InteractionType, Router, sign, Status, STATUS_TEXT } from "./deps.ts";
import * as events from "./events/mod.ts";

const router = new Router();
router.post("/", async (ctx) => {
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
  } else {
    const evts = Object.values(events).map(evt => evt.default);
    const event = evts.find(evt => evt.type === InteractionType.Ping);

    console.log(evts, event);
    if (event) return await event.execute(ctx, body);
  }
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: 8080 });

function hexEncode(hex: string): Uint8Array {
  console.log(hex);
  return new Uint8Array(
    hex.match(/.{1,2}/g).map(ctx => parseInt(ctx, 16))
  );
}
