import { APIInteraction, ApplicationCommandType, Context, InteractionResponseType, Status } from "../deps.ts";

export default {
  data: {
    name: "ping",
    description: "Ping! Pongu!"
  },
  execute(ctx: Context, interaction: APIInteraction): void {
    ctx.response.body = {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: { content: `Pongu! ${Date.now() - (new Date(Number(BigInt(interaction.id) >> 22n) + 1420070400000))[Symbol.toPrimitive]('number')]}ms` }
    };
    ctx.response.type = "json";
    ctx.response.status = Status.OK;
  }
}
