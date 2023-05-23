import { Context, OAuth2Routes, OAuth2Scopes, RouteBases, Routes, Status, STATUS_TEXT } from "../deps.ts";
import * as routes from "./mod.ts";
import config from "../config.json" assert { type: "json" };

export default {
  path: "/",
  strict: true,
  method: "GET",
  async middleware(ctx: Context): Promise<void> {
    const auth = await authorize(ctx);
    if (!auth) {
      const redirectURI = authorizeURL(ctx);
      console.log(redirectURI);
      ctx.response.redirect(authorizeURL);
    } else {
      ctx.response.body = JSON.stringify(auth.valid 
        ? Object.values(routes).filter(route => !route.default.strict).map(route => ctx.request.url.origin + route.default.path)
        : auth.output, null, " ");
    }
  }
}

interface ValidateResult {
  valid: boolean;
  output?: { code: Status, message: STATUS_TEXT };
}
    
export function authorizeURL(ctx: Context): URL {
  const scopes = [OAuth2Scopes.Identify];
    
  const redirectURI = new URL(OAuth2Routes.authorizationURL);
  redirectURI.searchParams.set("client_id", Deno.env.get("DISCORD_ID"));
  redirectURI.searchParams.set("redirect_uri", ctx.request.url.origin + "/auth");
  redirectURI.searchParams.set("response_type", "code");
  redirectURI.searchParams.set("scope", scopes.join(" "));
    
  return redirectURI;
};

export async function authorize(ctx: Context): Promise<ValidateResult | void> {
  const scopes = [OAuth2Scopes.Identify];
  
  const access_token = await ctx.cookies.get("access_token");
  const refresh_token = await ctx.cookies.get("refresh_token");
    
  if (!access_token || !refresh_token) {
    return;
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
        return;
        else return validate(refreshData);
    } else {
      return validate(data);
    }
  }
}

function validate(user: APIUser): ValidateResult {
  return config.devs.includes(user.id)
    ? { valid: true }
    : { valid: false, output: {code: Status.Unauthorized, message: STATUS_TEXT[`${Status.Unauthorized}`]} };
}
