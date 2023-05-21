import { Context, OAuth2Routes, Status } from "../deps.ts";

export default {
  path: "/auth",
  method: "GET",
  async middleware(ctx: Context): Promise<void> {
    const auth = await fetch(OAuth2Routes.tokenURL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: JSON.stringify({
        "client_id": Deno.env.get("DISCORD_ID"),
        "client_secret": Deno.env.get("DISCORD_SECRET"),
        "grant_type": "authorization_code",
        code: ctx.request.url.searchParams.get("code")
      })
    });
    const { access_token, refresh_token } = await auth.json();
    
    ctx.cookies.set("access_token", access_token);
    ctx.cookies.set("refresh_token", refresh_token);
    
    ctx.response.body = { access_token, refresh_token };
    ctx.response.type = "json";
    ctx.response.status = Status.OK;
  }
}
