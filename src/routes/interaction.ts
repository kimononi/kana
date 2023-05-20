import { Context, sign, Status, STATUS_TEXT } from "../deps.ts";
import * as events from "../events/mod.ts";

export default {
  path: "/"
  method: "POST"
  async middleware(ctx: Context): Promise<any> {
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
      const interaction = JSON.parse(body);
      const event = Object.values(events).find(evt => evt.default.type === interaction.type).default;
      if (event) return await event.execute(ctx, interaction);
    }
  }
}
    
function hexEncode(hex: string): Uint8Array {
  return new Uint8Array(
    hex.match(/.{1,2}/g).map(ctx => parseInt(ctx, 16))
  );
}
