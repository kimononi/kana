import { Context, RouteBases, Routes, Status, STATUS_TEXT } from "../deps.ts";
import * as commands from "../commands/mod.ts";

export default {
  path: "/",
  method: "GET",
  async middleware(ctx: Context): Promise<void> {
    ctx.response.type = "json";

    if (!ctx.request.url.host.includes(Deno.env.get("DENO_DEPLOYMENT_ID"))) {
      const statusCode = Status.Unauthorized;
      ctx.response.body = { code: statusCode, message: STATUS_TEXT[`${statusCode}`] };
      ctx.response.status = statusCode;
    } else {
      const response = await fetch(RouteBases.api + Routes.applicationCommands(Deno.env.get("DISCORD_ID")), {
        method: "PUT",
        headers: { Authorization: `Bot ${Deno.env.get("DISCORD_TOKEN")}`, "content-type": "application/json" },
        body: JSON.stringify(Object.values(commands).map(cmd => cmd.default.data))
      });
      const result = await response.json();

      ctx.response.body = JSON.stringify(result, null, "  ");
      ctx.response.status = Status.OK;
    }
  }
}
