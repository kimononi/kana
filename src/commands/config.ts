import { APIChatInputApplicationCommandInteractionData, ApplicationCommandOptionType, ChannelType, Context, InteractionResponseType, MongoClient, PermissionFlagsBits, RouteBases, Routes, Snowflake, Status } from "../deps.ts";

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
      ctx.response.body = { type: InteractionResponseType.DeferredChannelMessageWithSource };
    
      const mongo = new MongoClient();
      await mongo.connect(Deno.env.get("MONGO_URI"));
    
      const channels = interaction.data.resolved.channels;
      return console.log(channels);
    
      const coll = mongo.database("guild").collection<Config>("configuration");
      await coll.updateOne({ _id: interaction.guild_id }, { $set: { confessChannel: channel } }, { upsert: true });
    
      await fetch(RouteBases.api + Routes.webhookMessage(interaction.id, interaction.token, "@original"), {
        method: "PATCH",
        headers: { Authorization: `Bot ${Deno.env.get("DISCORD_TOKEN")}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `sip! sekarang channel confess ny di <#${channel}> ya.`
        })
      })
    }
  }
}

interface Config {
  _id: Snowflake;
  confessChannel: Snowflake;
}
