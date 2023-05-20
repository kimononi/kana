import { APIChatInputApplicationCommandInteractionData, ApplicationCommandOptionType, ChannelType, Context, InteractionResponseType, PermissionFlagsBits, Status } from "../deps.ts";

export default {
  data: {
    name: "config",
    description: "🍥゛Kustomisasi pengaturan bot untuk server ini",
    dm_permission: false,
    options: [
      {
        name: "confess-channel",
        description: "🍥゛Atur tempat confess di server ini",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          { name: "channel", description: "mau ditaruh di channel mana nih kack.", type: ApplicationCommandOptionType.Channel, channel_types: [ChannelType.GuildText] }
        ]
      }
    ]
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
        type: InteractionResponseType.DeferredChannelMessageWithSource
      }
    }
  }
}
