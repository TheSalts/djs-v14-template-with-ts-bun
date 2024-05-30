import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
// const util = require("../util/util");

module.exports = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Pong!"),
  async execute(interaction: CommandInteraction) {
    // const lang = util.setLang(interaction.locale);
    await interaction.reply("Pong!");
  },
};
