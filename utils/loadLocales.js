const fs = require("fs");
const path = require("path");

async function loadLocales(localesDir) {
  const resources = {};

  try {
    const languages = await fs.promises.readdir(localesDir);

    for (const lng of languages) {
      const langPath = path.join(localesDir, lng);
      if (!(await fs.promises.stat(langPath)).isDirectory()) continue;

      const files = await fs.promises.readdir(langPath);
      for (const file of files) {
        if (file.endsWith(".json")) {
          const namespace = path.basename(file, ".json");
          const filePath = path.join(langPath, file);

          try {
            const content = JSON.parse(
              await fs.promises.readFile(filePath, "utf8")
            );
            if (!resources[lng]) resources[lng] = {};
            resources[lng][namespace] = content;
          } catch (err) {
            console.error(`Error reading or parsing file ${filePath}:`, err);
          }
        }
      }
    }
  } catch (err) {
    console.error("Error reading locales directory:", err);
  }

  return resources;
}

module.exports = loadLocales;
