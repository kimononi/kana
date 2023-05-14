import { APIApplicationCommandInteraction, Context, InteractionType } from "../deps.ts";
import * as commands from "../commands/mod.ts";
export default {
  type: InteractionType.ApplicationCommand,
  async execute(ctx: Context, interaction: APIApplicationCommandInteraction): Promise<void> {
    const cmds = Object.values(commands);
    console.log(cmds, interaction.name);
    const command = cmds.find(cmd => cmd.default.data.name === interaction.data.name).default;
    
    if (command) return await command.execute(ctx, interaction);
  }
}
