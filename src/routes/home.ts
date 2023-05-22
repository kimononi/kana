import { Context } from "../deps.ts";

export default {
  path: "/",
  method: "GET",
  async middleware(ctx: Context): Promise<void> {
    const redirectURI = ctx.request.url.origin + "/auth";
    
    if (!ctx.cookies.has("access_token") || !ctx.cookies.has("refresh_token")) {
      ctx.response.redirect(redirectURI);
    } else {
    
    }
  }
}
