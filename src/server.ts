import { Application, InteractionType, Router, Routes, RouteBases, sign, Status, STATUS_TEXT } from "./deps.ts";
import * as commands from "./commands/mod.ts";
import * as events from "./events/mod.ts";

const router = new Router();

router.get("/", (ctx) => {
  if (!ctx.request.url.includes(Deno.env.get("DENO_DEPLOYMENT_ID"))) {
    const statusCode = Status.Unauthorized;
    ctx.response.body = { code: statusCode, message: STATUS_TEXT[`${statusCode}`] };
    ctx.response.status = statusCode;
    ctx.response.type = "json";
  } else {
    const response = await fetch(RouteBases + Routes.applicationCommands(Deno.env.get("DISCORD_ID")), {
      method: "PUT"
      headers: { Authorization: `Bot ${Deno.env.get("DISCORD_TOKEN")}`, "Content-Type": "application/json" },
      body: JSON.stringify(Object.values(commands).map(cmd => cmd.default.data))
    });
    const result = await response.json();

    ctx.response.body = result;
    ctx.response.status = response.statusCode;
    ctx.response.type = "json";
  }
});

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
    ctx.response.body = { code: statusCode, message: STATUS_TEXT[`${statusCode}`] };
    ctx.response.status = statusCode;
    ctx.response.type = "json";
  } else {
    const event = Object.values(events).map(evt => evt.default).find(evt => evt.type === InteractionType.Ping);
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
