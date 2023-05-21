import { APIChatInputApplicationCommandInteractionData, ApplicationCommandType, ApplicationCommandOptionType, ChannelType, Context, InteractionResponseType, MongoClient, PermissionFlagsBits, RouteBases, Routes, Snowflake, Status } from "../deps.ts";

export default {
  data: {
    name: "config",
    description: "🍥゛Kustomisasi pengaturan bot untuk server ini",
    type: ApplicationCommandType.ChatInput,
    dm_permission: false,
    options: [
      {
        name: "confess-channel",
        description: "🍥゛Atur tempat confess di server ini",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          { name: "channel", description: "🍥゛Pilih channel untuk dijadikan mading", type: ApplicationCommandOptionType.Channel, channel_types: [ChannelType.GuildText] }
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
      const mongo = new MongoClient();
      await mongo.connect(Deno.env.get("MONGO_URI"));
    
      const confessChannel = interaction.data.options[0].options[0].value;
    
      const coll = mongo.database("guild").collection<Config>("configuration");
      await coll.updateOne({ _id: interaction.guild_id }, { $set: { confessChannel } }, { upsert: true });
    
      ctx.response.body = {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: { content: `sip! sekarang channel confess ny di <#${confessChannel}> ya.` }
      };
    }
  }
}

interface Config {
  _id: Snowflake;
  confessChannel: Snowflake;
}
