import { APIModalSubmission, Context, InteractionType } from "../deps.ts";
import * as modals from "../modals/mod.ts";

export default {
  type: InteractionType.ModalSubmit,
  async execute(ctx: Context, interaction: APIModalSubmission): Promise<any> {
    const modal = Object.values(modals).map(mdl => mdl.default.data.custom_id === interaction.custom_id).default;
    if (modal) return await modal.execute(ctx, interaction);
  }
}
