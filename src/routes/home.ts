import { Context, OAuth2Routes, OAuth2Scopes } from "../deps.ts";

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
    
    console.log(redirectURI);
    console.log(ctx.cookies.entries());
    
    if (!ctx.cookies.has("access_token") || !ctx.cookies.has("refresh_token")) {
      ctx.response.redirect(redirectURI);
    } else {
      
    }
  }
}
