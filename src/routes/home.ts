import { Context, OAuth2Routes, OAuth2Scopes, RouteBases, Routes, Status } from "../deps.ts";

export default {
  path: "/",
  method: "GET",
  async middleware(ctx: Context): Promise<void> {
    const scopes = [OAuth2Scopes.Identify];
    
    const redirectURI = new URL(OAuth2Routes.authorizationURL);
    redirectURI.searchParams.set("client_id", Deno.env.get("DISCORD_ID"));
    redirectURI.searchParams.set("redirect_uri", ctx.request.url.origin + "/auth");
    redirectURI.searchParams.set("response_type", "code");
    redirectURI.searchParams.set("scope", scopes.join(" "));
    
    const access_token = await ctx.cookies.get("access_token");
    const refresh_token = await ctx.cookies.get("refresh_token");
    
    if (!access_token || !refresh_token) {
      ctx.response.redirect(redirectURI);
    } else {
      const user = await fetch(RouteBases.api + Routes.user("@me"), {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      const data = await user.json();
    
      ctx.response.body = data;
      ctx.status = Status.OK;
    }
  }
}
