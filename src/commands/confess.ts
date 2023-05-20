import { APIUserApplicationCommandInteractionData, ApplicationCommandType, Context } from "../deps.ts";

export default {
  data: {
    name: "confess",
    description: "",
    type: ApplicationCommandType.User
  },
  async execute(ctx: Context, interaction: APIUserApplicationCommandInteractionData): void {}
}
