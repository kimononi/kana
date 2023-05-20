import { APIChatInputApplicationCommandInteractionData, Context, InteractionResponseType, PermissionsFlagsBits, Status } from "../deps.ts";

export default {
  data: {
    name: "config",
    description: "Utak atik dulu g sih 🥦",
    dm_permission: false
  },
  async execute(ctx: Context, interaction: APIChatInputApplicationCommandInteractionData): Promise<void> {
    ctx.response.status = StatusOK;
    ctx.response.type = "json";
    
    if ((interaction.member.permissions & PermissionsFlagsBits.ManageGuild) !== PermissionsFlagsBits.ManageGuild) {
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
