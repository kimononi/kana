import { APIUserApplicationCommandInteractionData, ApplicationCommandType, Context, InteractionResponseType, MessageFlags, MongoClient, RouteBases, Routes, Snowflake } from "../deps.ts";

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
    
    const data = mongo.database("guild").collection<Config>("configuration").findOne({ _id: interaction.guild_id });
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
      console.log((await confess.json()))
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

interface Config {
  _id: Snowflake;
  confessChannel: Snowflake;
}
