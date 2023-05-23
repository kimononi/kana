import { Context, RouteBases, Routes, Status, STATUS_TEXT } from "../deps.ts";
import { authorize, authorizeURL } from "./home.ts";

export default {
  path: "/users/:userId",
  strict: false,
  method: "GET",
  async middleware(ctx: Context): Promise<void> {
    ctx.response.type = "json";

    const auth = await authorize(ctx);
    if (!auth) {
      const redirectURI = authorizeURL(ctx.request.url);
      ctx.response.redirect(redirectURI);
    } else if (!auth.valid) {
      ctx.response.body = auth.output;
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
