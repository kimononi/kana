import { Context, OAuth2Routes, OAuth2Scopes, RouteBases, Routes, Status, STATUS_TEXT } from "../deps.ts";
import * as routes from "./mod.ts";
import config from "../config.json" assert { type: "json" };

export default {
  path: "/",
  strict: true,
  method: "GET",
  async middleware(ctx: Context): Promise<void> {
    
  }
}

export async function authorize(ctx: Context): Promise<Context> {
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
    const rawData = await fetch(RouteBases.api + Routes.user("@me"), {
      headers: { Authorization: `Bearer ${access_token}` }
    });
    const data = await rawData.json();
    
    if ("code" in data) {
      const body = new URLSearchParams();
      body.append("client_id", Deno.env.get("DISCORD_ID"));
      body.append("client_secret", Deno.env.get("DISCORD_SECRET"));
      body.append("grant_type", "refresh_token");
      body.append("refresh_token", refresh_token);
    
      const refresh = await fetch(OAuth2Routes.tokenURL, {
        method: "POST",
        headers: { Authorization: `Bot ${Deno.env.get("DISCORD_TOKEN")}`, "Content-Type": "application/x-www-form-urlencoded" },
        body
      });
      const refreshData = await refresh.json();
    
      if ("error" in refreshData) 
        ctx.response.redirect(redirectURI);
        else ctx.response.body = refreshData;
    } else {
      ctx.response.body = data;
    }
  }
}

async function validate(user: APIUser): <{valid: boolean, output?: any}> {
  return config.devs.includes(user.id)
    ? { valid: true }
    : { valid: false, output: {code: Status.Unauthorized, message: STATUS_TEXT[`${Status.Unauthorized}`]} };
}
