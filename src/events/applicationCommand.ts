import { APIApplicationCommandInteraction, Context, InteractionType } from "../deps.ts";
import * as commands from "../commands/mod.ts";
export default {
  type: InteractionType.ApplicationCommand,
  execute(ctx: Context, interaction: APIApplicationCommandInteraction): void {
    const command = Object.values(commands).map(cmd => cmd.default.data.name === interaction.data.name);
    if (command) await command.execute(ctx, interaction);
  }
}
