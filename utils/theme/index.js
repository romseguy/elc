import theme from "@chakra-ui/theme";
import { extendTheme } from "@chakra-ui/core";
import { mode } from "@chakra-ui/theme-tools";
import { Button } from "./components";

theme.breakpoints = ["30em", "48em", "62em", "80em"]; // @todo should be fixed by @chakra-ui/theme

const customTheme = {
  ...theme,
  components: {
    ...theme.components,
    // Button,
  },
  styles: {
    ...theme.styles,
    global: (props) => {
      props.colorMode = "dark";

      const customGlobalStyles = {
        ...theme.styles.global(props),
        "html, body, #__next": {
          lineHeight: "normal",
          height: "100%",
          backgroundColor: mode("whiteAlpha.500", "gray.800")(props),
          color: mode("black", "white")(props),
        },
        "body, #__next": {
          display: "flex",
          flexDirection: "column",
        },
        label: {
          marginBottom: "1rem",
        },
        "input, select": {
          padding: ".5rem",
          marginLeft: ".5rem",
          marginBottom: "1rem",
          color: "gray.900",
        },
        "input::placeholder": {
          color: "gray.600",
        },
        ".chakra-form__error-message": {
          color: "red.600",
        },
      };

      return customGlobalStyles;
    },
  },
  config: {
    // ...theme.config,
    // useSystemColorMode: false,
    // initialColorMode: "light",
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
  dark: {
    color: theme.colors.whiteAlpha[900],
    bg: theme.colors.gray[700],
    borderColor: theme.colors.whiteAlpha[300],
    placeholderColor: theme.colors.whiteAlpha[400],
    hover: {
      bg: theme.colors.gray[800],
    },
    // @todo chakra-ui should fix this
    select: {
      bg: "#505c73",
    },
  },
  light: {
    color: theme.colors.gray[700],
    bg: theme.colors.gray[400],
    borderColor: theme.colors.gray[800],
    placeholderColor: theme.colors.gray[500],
    hover: {
      bg: theme.colors.gray[300],
    },
  },
};

export default customTheme;
