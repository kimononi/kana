import { APIUserApplicationCommandInteractionData, ApplicationCommandType, Context, InteractionResponseType, MessageFlags, MongoClient, RouteBases, Routes } from "../deps.ts";

export default {
  data: {
    name: "Confess",
    description: "",
    type: ApplicationCommandType.User,
    dm_permission: false
  },
  async execute(ctx: Context, interaction: APIUserApplicationCommandInteractionData): Promise<void> {
    const mongo = new MongoClient();
    await mongo.connect(Deno.env.get("MONGO_URI"));
    
    const data = mongo.database("guild").collection<Config>("config").findOne({ _id: interaction.guild_id });
    if (!data) {
      ctx.response.body = {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          flags: MessageFlags.Ephemeral,
          content: `🍥゛Admin disini belum ngasih tau gwe channel confess dimane`
        }
      };
    } else {
      const confess = await fetch(RouteBases.api + Routes.channelMessages(data.confessChannel), {
        method: "POST",
        headers: { Authorization: `Bot ${Deno.env.get("DISCORD_TOKEN")}`, "Content-Type": "application/json"  },
        body: JSON.stringify({
          
        })
      })
      console.log(confess);
      ctx.response.body = {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          flags: MessageFlags.Ephemeral,
          content: `🍥゛Cek logs.`
        }
      };
    }
  }
}
