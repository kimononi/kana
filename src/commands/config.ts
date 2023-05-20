import { APIChatInputApplicationCommandInteractionData, Context, InteractionResponseType, PermissionFlagsBits, Status } from "../deps.ts";

export default {
  data: {
    name: "config",
    description: "Utak atik dulu g sih 🥦",
    dm_permission: false
  },
  async execute(ctx: Context, interaction: APIChatInputApplicationCommandInteractionData): Promise<void> {
    ctx.response.status = Status.OK;
    ctx.response.type = "json";
    
    if ((BigInt(interaction.member.permissions) & PermissionFlagsBits.ManageGuild) !== PermissionFlagsBits.ManageGuild) {
      ctx.response.body = {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: "minimal punya izin `Kelola Server` deck."
        }
      };
    } else {
      ctx.response.body = {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: "new feature coming soon (\\*´ω｀\\*)"
        }
      }
    }
  }
}
