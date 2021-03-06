const withFonts = require("next-fonts");
const withReactSvg = require("next-react-svg");
const path = require("path");

module.exports = withFonts(
  withReactSvg({
    include: path.resolve(__dirname, "assets", "svg"),
    webpack(config, { isServer }) {
      if (!isServer) {
        // Fixes npm packages that depend on `fs` module
        config.node = {
          fs: "empty"
        };
      }
      return config;
    }
  })
);
