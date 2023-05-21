import { APIModalSubmitInteraction, CDNRoutes, Context, MongoClient, RouteBases, Routes, Snowflake } from "../deps.ts";

export default {
  custom_id: "confess",
  async execute(ctx: Context, interaction: APIModalSubmitInteraction): Promise<void> {
    const targetData = await fetch(RouteBases.api + Routes.user(interaction.data.components[0].components[0].custom_id), {
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
          color: 0xFFFFFF,
          author: { name: `💌゛To: ${target.username + (target.discriminator === "0" ? "" : target.discriminator)}`, icon_url: avatar },
          description: `{value}`
        ]
      })
    });
    const message = await messageData.json();
  }
}

interface Config {
  _id: Snowflake;
  confessChannel: Snowflake;
}
