import { ContextMenuCommandBuilder } from "@discordjs/builders";
import {
  ApplicationCommandType,
  MessageContextMenuCommandInteraction,
} from "discord.js";
// const util = require("../util/util");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("ping")
    .setType(ApplicationCommandType.Message),
  async execute(interaction: MessageContextMenuCommandInteraction) {
    // const lang = util.setLang(interaction.locale);
    await interaction.reply("Pong!");
  },
};
