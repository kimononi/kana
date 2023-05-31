import { APIInteraction, ApplicationCommandType, Context, InteractionResponseType, Status } from "../deps.ts";

export default {
  data: {
    name: "hello",
    description: "🍥゛Say hello!",
    type: ApplicationCommandType.ChatInput,
    dm_permission: false
  },
  execute(ctx: Context, interaction: APIInteraction): void {
    ctx.response.body = {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: { content: `Hello ${interaction.member.user.username} >//<` }
    };
    ctx.response.type = "json";
    ctx.response.status = Status.OK;
  }
}
