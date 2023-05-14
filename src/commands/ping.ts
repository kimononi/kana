import { APIInteraction, ApplicationCommandType, Context, InteractionResponseType, Status } from "../deps.ts";

export default {
  data: {
    name: "ping",
    description: "Ping! Pongu!"
  },
  execute(ctx: Context, interaction: APIInteraction): void {
    ctx.response.body = {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: { content: `Pongu! ${(Number(interaction.id) >> 22) + 1420070400000}ms` }
    };
    ctx.response.type = "json";
    ctx.response.status = Status.OK;
  }
}
