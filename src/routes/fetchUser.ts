import { Context, RouteBases, Routes, Status, STATUS_TEXT } from "../deps.ts";
import { Context, RouteBases, Routes, Status, STATUS_TEXT } from "../deps.ts";

export default {
  path: "/users/:userId",
  method: "GET",
  async middleware(ctx: Context): Promise<void> {
    ctx.response.type = "json";

    if (!ctx.request.url.host.includes(Deno.env.get("DENO_DEPLOYMENT_ID"))) {
      const statusCode = Status.Unauthorized;
      ctx.response.body = { code: statusCode, message: STATUS_TEXT[`${statusCode}`] };
      ctx.response.status = statusCode;
    } else {
      const response = await fetch(RouteBases.api + Routes.user(ctx.params.userId), {
        headers: { Authorization: `Bot ${Deno.env.get("DISCORD_TOKEN")}` }
      });
      const result = await response.json();

      ctx.response.body = JSON.stringify(result, null, "  ");
      ctx.response.status = Status.OK;
    }
  }
}
