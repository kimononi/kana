import { APIUserApplicationCommandInteractionData, ApplicationCommandType, Context } from "../deps.ts";

export default {
  data: {
    name: "Confess",
    description: "",
    type: ApplicationCommandType.User,
    dm_permission: false
  },
  async execute(ctx: Context, interaction: APIUserApplicationCommandInteractionData): void {}
}
