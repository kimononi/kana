import { APIUserApplicationCommandInteractionData, ApplicationCommandType, ComponentType, Context, InteractionResponseType, MessageFlags, MongoClient, RouteBases, Routes, Snowflake, TextInputStyle } from "../deps.ts";

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
    
    const data = await mongo.database("guild").collection<Config>("configuration").findOne({ _id: interaction.guild_id });
    if (!data) {
      ctx.response.body = {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          flags: MessageFlags.Ephemeral,
          content: `🍥゛Admin disini belum ngasih tau gwe channel confess dimane`
        }
      };
    } else {
      ctx.response.body = {
        type: InteractionResponseType.Modal,
        data: {
          custom_id: "confess",
          title: "🦦゛Tulis surat mu (*´ω｀*)",
          components: [
            {
              type: ComponentType.ActionRow,
              components: [
                { type: ComponentType.TextInput, label: `🍥゛Monggo di isi surat e`, placeholder: `Apa yang mau kamu sampein ke {user}?`, style: TextInputStyle.Paragraph, custom_id: interaction.target_id }
              ]
            }
          ]
        }
      };
    }
  }
}

interface Config {
  _id: Snowflake;
  confessChannel: Snowflake;
}
