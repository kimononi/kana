import { Context, OAuth2Routes, RouteBases, Routes, Status } from "../deps.ts";

export default {
  path: "/auth",
  method: "GET",
  async middleware(ctx: Context): Promise<void> {
    const body = new URLSearchParams();
    body.append("client_id", Deno.env.get("DISCORD_ID"));
    body.append("client_secret", Deno.env.get("DISCORD_SECRET"));
    body.append("grant_type", "authorization_code");
    body.append("code", ctx.request.url.searchParams.get("code"));
    body.append("redirect_uri", ctx.request.url.origin + ctx.request.url.pathname);
   
    const auth = await fetch(OAuth2Routes.tokenURL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body
    });
    const token = await auth.json();
    
    const authenticatedUserData = await fetch(RouteBases.api + Routes.user("@me"), {
      headers: { Authorization: `Bearer ${token.access_token}` }
    });
    const user = await authenticatedUserData.json();
    
    ctx.cookies.set("user_id", user.id);
    ctx.cookies.set("access_token", token.access_token);
    ctx.cookies.set("refresh_token", token.refresh_token);
    
    ctx.response.body = "🦦゛Kembali ke page awal.."
    ctx.response.type = "text";
    ctx.response.status = Status.OK;
  }
}
