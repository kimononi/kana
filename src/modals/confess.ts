import { APIModalSubmitInteraction, Context, MongoClient, RouteBases, Routes, Snowflake } from "../deps.ts";

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
    
    const avatar = RouteBases.api + ();
    const messageData = await fetch(RouteBases.api + Routes.channelMessages(data.confessChannel), {
      method: "POST",
      headers: { Authorization: `Bot ${Deno.env.get("DISCORD_TOKEN")}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [
          
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
