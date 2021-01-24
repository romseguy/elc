import { extendTheme } from "@chakra-ui/react";

// Global style overrides
import styles from "./styles.js";

// Foundational style overrides
// import border from "./borders"

// Component style overrides
// https://chakra-ui.com/docs/theming/component-style
import { Button, Divider, Select } from "./components";

const overrides = {
  // config: {
  // useSystemColorMode: true
  // initialColorMode: "dark"
  // },
  styles,
  // borders,
  // Other foundational style overrides go here
  components: {
    Button,
    // Divider,
    Select
    // Other components go here
  }
};

export default extendTheme(overrides);
