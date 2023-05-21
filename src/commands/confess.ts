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
    
    const confessChannel = mongo.database("guild").collection<Config>("config").findOne({ _id: interaction.guild_id });
    if (!confessChannel) {
      ctx.response.body = {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          flags: MessageFlags.Ephemeral,
          content: `🍥゛Admin disini belum ngasih tau gwe channel confess dimane`
        }
      };
    } else {
      // const confessResult = await fetch(RouteBases.api + Routes.channelMessage());
      ctx.response.body = {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          flags: MessageFlags.Ephemeral,
          content: `🍥゛Ciailah, ngebet amat pengen confess, sabar dikit nape, lagi di bikin sistem nye`
        }
      };
    }
  }
}
