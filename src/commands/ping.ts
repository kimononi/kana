import { APIInteraction, ApplicationCommandType, Context, InteractionResponseType, Status } from "../deps.ts";

export default {
  data: {
    name: "ping",
    description: "Ping! Pongu!"
  },
  execute(ctx: Context, interaction: APIInteraction): void {
    ctx.response.body = {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: { content: "Pongu!" }
    };
    ctx.response.type = "json";
    ctx.response.status = Status.OK;
  }
}
