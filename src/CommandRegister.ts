import { REST } from "@discordjs/rest";
import { Routes } from "discord.js";
import { config } from "dotenv";
import fs from "fs";

config();

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) {
  throw new Error("TOKEN 환경 변수가 설정되지 않았습니다.");
}
const CLIENT_ID = process.env.CLIENT_ID;
if (!CLIENT_ID) {
  throw new Error("TOKEN 환경 변수가 설정되지 않았습니다.");
}

const commands: Array<any> = [];
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js") && !file.startsWith("!"));
const contextCommandFiles = fs
  .readdirSync("./contextMenu")
  .filter((file) => file.endsWith(".js") && !file.startsWith("!"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}
for (const file of contextCommandFiles) {
  const command = require(`./contextMenu/${file}`);
  commands.push(command.data.toJSON());
}
const rest: REST = new REST({ version: "10" }).setToken(BOT_TOKEN);

(async () => {
  try {
    console.log("커맨드 리로드 중");

    await rest.put(Routes.applicationCommands(CLIENT_ID), {
      body: commands,
    });

    console.log("커맨드 리로드 성공");
  } catch (error) {
    console.error(error);
  }
})();
