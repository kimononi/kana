import { APIPingInteraction, Context, InteractionResponseType, InteractionType, Status } from "../deps.ts";

export default {
  type: InteractionType.Ping,
  execute(ctx: Context, interaction: APIPingInteraction): void {
    ctx.response.body = { type: InteractionResponseType.Pong };
    ctx.response.type = "json";
    ctx.response.status = Status.OK;
  }
}
