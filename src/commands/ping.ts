import { APIInteraction, ApplicationCommandType, Context, InteractionResponseType, Status } from "../deps.ts";

export default {
  data: {
    name: "ping",
    description: "🍥゛Ping! Pong!",
    dm_permission: false
  },
  execute(ctx: Context, interaction: APIInteraction): void {
    const ms = BigInt(interaction.id) >> 22n;
    const timestamp = (new Date(Number(ms) + 1420070400000))
    ctx.response.body = {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: { content: `🦦゛Pong! ${Date.now() - timestamp[Symbol.toPrimitive]('number')}ms` }
    };
    ctx.response.type = "json";
    ctx.response.status = Status.OK;
  }
}
