import { APIUserApplicationCommandInteractionData, ApplicationCommandType, ComponentType, Context, InteractionResponseType, MessageFlags, MongoClient, Snowflake, Status, TextInputStyle } from "../deps.ts";

export default {
  data: {
    name: "Confess",
    description: "",
    type: ApplicationCommandType.User,
    dm_permission: false
  },
  async execute(ctx: Context, interaction: APIUserApplicationCommandInteractionData): Promise<void> {
    ctx.response.type = "json";
    ctx.response.status = Status.OK;
    
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
      const target = Object.values(interaction.data.resolved.users)[0];
      if (target.bot) {
        ctx.response.body = {
          type: InteractionResponseType.ChannelMessageWithSource,
          data: {
            flags: MessageFlags.Ephemeral,
            content: `🗿゛Kocak amat sih lu dek, confess ke bot`
          }
        };
      } else if (target.id === interaction.member.user.id) {
        ctx.response.body = {
          type: InteractionResponseType.ChannelMessageWithSource,
          data: {
            flags: MessageFlags.Ephemeral,
            content: `🥺゛Kamu sendiri ya? sini aku peyuk..`
          }
        };
      } else {
        const handleRegex = /^[A-Za-z0-9_]{1,15}$/;
      
        ctx.response.body = {
          type: InteractionResponseType.Modal,
          data: {
            custom_id: "confess",
            title: "🦦゛Tulis surat mu (*´ω｀*)",
            components: [
              {
                type: ComponentType.ActionRow,
                components: [
                  { type: ComponentType.TextInput, label: `🍥゛Monggo di isi surat e`, placeholder: `Apa yang mau kamu sampein ke @${handleRegex.test(target.username) ? target.username + (target.discriminator || "") : `user${target.id}`}?`, style: TextInputStyle.Paragraph, custom_id: interaction.data.target_id }
                ]
              }
            ]
          }
        };
      }
    }
  }
}

interface Config {
  _id: Snowflake;
  confessChannel: Snowflake;
}
