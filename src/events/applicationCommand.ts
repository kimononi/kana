import { APIApplicationCommandInteraction, Context, InteractionType } from "../deps.ts";
import * as commands from "../commands/mod.ts";

export default {
  type: InteractionType.ApplicationCommand,
  async execute(ctx: Context, interaction: APIApplicationCommandInteraction): Promise<void> {
    const command = Object.values(commands).find(cmd => cmd.default.data.name === interaction.data.name && cmd.default.data.type === interaction.data.type).default;
    if (command) return await command.execute(ctx, interaction);
  }
}
