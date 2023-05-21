import { APIModalSubmitInteraction, Context, InteractionType } from "../deps.ts";
import * as modals from "../modals/mod.ts";

export default {
  type: InteractionType.ModalSubmit,
  async execute(ctx: Context, interaction: APIModalSubmitInteraction): Promise<any> {
    const modal = Object.values(modals).map(modal => modal.default.custom_id === interaction.data.custom_id).default;
    console.log(modal);
    
    if (modal) return await modal.execute(ctx, interaction);
  }
}
