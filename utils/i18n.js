const i18next = require("i18next");
const loadLocales = require("./loadLocales");
const path = require("path");

async function initializeI18n() {
  const resources = await loadLocales(path.join(__dirname, "../locales"));

  try {
    await i18next.init({
      lng: "en",
      fallbackLng: "en",
      resources,
    });

    // Kiểm tra xem phương thức `t` có sẵn hay không
    if (typeof i18next.t !== "function") {
      console.error("🔴 i18next.t is not a function");
    } else {
      console.log("🟢 i18next initialized successfully");
    }
  } catch (error) {
    console.error("Error initializing i18next:", error);
  }
}

initializeI18n().catch((err) =>
  console.error("🔴 Error during i18next initialization:", err)
);

module.exports = i18next;
