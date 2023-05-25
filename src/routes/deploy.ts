import { Context, RouteBases, Routes, Status, STATUS_TEXT } from "../deps.ts";
import * as commands from "../commands/mod.ts";
import { authorize, authorizeURL } from "./home.ts";

export default {
  path: "/deploy",
  strict: false,
  method: "GET",
  async middleware(ctx: Context): Promise<void> {
    ctx.response.type = "json";
    const auth = await authorize(ctx);
    if (!auth) {
      ctx.response.redirect(authorizeURL(ctx.request.url));
    } else if (!auth.valid) {
      ctx.response.body = auth.output;
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
