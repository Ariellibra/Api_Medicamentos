const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://api-medicamentos.libradev.com.ar",
    setupNodeEvents(on, config) {
      
    },
  },
});
