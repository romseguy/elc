import { extendTheme } from "@chakra-ui/core";

// Global style overrides
import styles from "./styles.js";

// Foundational style overrides
// import border from "./borders"

// Component style overrides
import { Button } from "./components";

const overrides = {
  styles,
  // borders,
  // Other foundational style overrides go here
  components: {
    Button,
    // Other components go here
  },
};

export default extendTheme(overrides);

/*
const mode = (light, dark) => (props) => dark;

theme.breakpoints = ["30em", "48em", "62em", "80em"];

theme.breakpoints = {
  sm: "30em",
  md: "48em",
  lg: "62em",
  xl: "80em",
};

const customTheme = {
config: {
  ...theme.config,
  useSystemColorMode: false,
  initialColorMode: "light",
},
colors: {
  ...theme.colors,
  black: "#16161D",
  select: {
    900: "#505C73",
  },
},
fonts: {
  ...theme.fonts,
  body: "system-ui, sans-serif",
  heading: "Georgia, serif",
  mono: "Menlo, monospace",
},
};

export default customTheme;
*/
