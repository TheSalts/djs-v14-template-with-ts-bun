import fs from "fs";
import path from "path";
import {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
  Interaction,
} from "discord.js";
import type { Command } from "./types";
import { config } from "dotenv";

config();

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  throw new Error("TOKEN 환경 변수가 설정되지 않았습니다.");
}

class CustomClient extends Client {
  commands: Collection<string, Command>;

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildIntegrations,
      ],
      partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.Reaction,
        Partials.Message,
        Partials.ThreadMember,
        Partials.User,
        Partials.GuildScheduledEvent,
      ],
    });
    this.commands = new Collection<string, Command>();
  }
}

const client = new CustomClient();

const commandFiles = fs
  .readdirSync(path.join(__dirname, "commands"))
  .filter(
    (file) =>
      file.endsWith(".ts") || (file.endsWith(".js") && !file.startsWith("!"))
  );

for (const file of commandFiles) {
  import(`${__dirname}/commands/${file}`)
    .then((command) => {
      client.commands.set(command.data.name, command);
    })
    .catch((err) => {
      console.error(`Error loading command ${file}:`, err);
    });
}

const contextCommandFiles = fs
  .readdirSync(path.join(__dirname, "contextMenu"))
  .filter(
    (file) =>
      file.endsWith(".ts") || (file.endsWith(".js") && !file.startsWith("!"))
  );

for (const file of contextCommandFiles) {
  import(`${__dirname}/contextMenu/${file}`)
    .then((command) => {
      client.commands.set(command.data.name, command);
    })
    .catch((err) => {
      console.error(`Error loading context command ${file}:`, err);
    });
}

client.once("ready", () => {
  console.log("Command Ready!");
});

client.on("interactionCreate", async (interaction: Interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
  }
});

client.login(BOT_TOKEN).catch((err) => {
  console.error("Error logging in:", err);
});
