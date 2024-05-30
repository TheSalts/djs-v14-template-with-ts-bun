import fs from "fs";
import path from "path";
import Discord from "discord.js";

module.exports = {
  /**
   * @description read file and if file does not exist, write file
   * @param path 파일 위치
   * @returns
   */
  readFile: function (path: string): object | any {
    if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify([]));
    let read = fs.readFileSync(path, "utf8");
    return JSON.parse(read);
  },
  /**
   * @description set language
   * @param {string | Discord.Interaction.locale | Discord.User.locale} locale user locale: ex) "ko"
   * @returns {}
   */
  setLang: function (locale: string): null {
    let dirpath = path.join(__dirname, "..", "lang");
    let dir = fs.readdirSync(dirpath);

    for (const file of dir) {
      if (locale === file.trimEnd().replace(".json", "")) {
        const File = require(`${dirpath}/${file}`);
        return File;
      }
    }
    return null;
  },
};
