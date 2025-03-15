const path = require("path");

module.exports = {
  entry: "./src/app.js", // Adjust if your entry file is different
  output: {
    path: path.resolve(__dirname, "dist"), // ✅ Ensure output goes to 'dist/'
    filename: "bundle.js",
  },
  mode: "production",
};
