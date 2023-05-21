import { APIModalSubmitInteraction, CDNRoutes, Context, InteractionResponseType, MessageFlags, MongoClient, RouteBases, Routes, Snowflake, Status } from "../deps.ts";

export default {
  custom_id: "confess",
  async execute(ctx: Context, interaction: APIModalSubmitInteraction): Promise<void> {
    ctx.response.type = "json";
    ctx.response.status = Status.OK;
    
    const input = interaction.data.components[0].components[0];
    const targetData = await fetch(RouteBases.api + Routes.user(input.custom_id), {
      headers: { Authorization: `Bot ${Deno.env.get("DISCORD_TOKEN")}` }
    });
    const target = await targetData.json();
    
    const mongo = new MongoClient();
    await mongo.connect(Deno.env.get("MONGO_URI"));
    
    const data = await mongo.database("guild").collection<Config>("configuration").findOne({ _id: interaction.guild_id });
    
    const avatar = RouteBases.cdn + (target.avatar ? CDNRoutes.userAvatar(target.id, target.avatar, (target.avatar.startsWith("a_") ? "gif" : "png")) : CDNRoutes.defaultUserAvatar(Number(BigInt(target.id) >> 22n) % 5));
    const messageData = await fetch(RouteBases.api + Routes.channelMessages(data.confessChannel), {
      method: "POST",
      headers: { Authorization: `Bot ${Deno.env.get("DISCORD_TOKEN")}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [
          {
            color: 0xFEE1B5,
            author: { name: `💌゛To: ${target.discriminator === "0" ? target.username : `${target.username}#${target.discriminator}`} (${input.custom_id})`, icon_url: avatar },
            description: input.value
          }
        ]
      })
    });
    const message = await messageData.json();
    
    ctx.response.body = {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        flags: MessageFlags.Ephemeral,
        content: `Surat mu udah dikirim ya. (https://discord.com/channels/${interaction.guild_id}/${message.channel_id}/${message.id})`
      }
    };
  }
}

interface Config {
  _id: Snowflake;
  confessChannel: Snowflake;
}
