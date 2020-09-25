import theme from "@chakra-ui/theme";
import { extendTheme } from "@chakra-ui/core";
import { mode } from "@chakra-ui/theme-tools";
import { Button } from "./components";

theme.breakpoints = ["30em", "48em", "62em", "80em"]; // @todo should be fixed by @chakra-ui/theme

const inputStyles = {
  input: {
    color: "gray.800",
    width: "50%",
    padding: ".5rem",
    borderRadius: ".3rem",
  },
  "input::placeholder": {
    color: "gray.500",
  },
};

const selectStyles = {
  ".react-select-container": {
    width: "50%",

    ".react-select__multi-value": {
      backgroundColor: "gray.600",
      borderRadius: ".3rem",
      ".react-select__multi-value__label": {
        color: "white",
      },
      ".react-select__multi-value__remove": {
        ":hover": {
          backgroundColor: "gray.600",
        },
      },
    },

    ".react-select__dropdown-indicator": {
      color: "black",
    },

    ".react-select__menu": {
      "*": {
        padding: 0,
        color: "black",
        backgroundColor: "white",
        ":hover": {
          cursor: "pointer",
          backgroundColor: "black",
          color: "white",
        },
      },
    },
  },
};

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
          marginBottom: ".5rem",
        },
        ".chakra-form__error-message": {
          color: "red.600",
        },
        ...inputStyles,
        ...selectStyles,
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
