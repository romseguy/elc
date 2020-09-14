import { theme } from "@chakra-ui/core";

export default {
  ...theme,
  fonts: {
    body:
      '-apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  },
  // fonts: {
  //   body: "system-ui, sans-serif",
  //   heading: "Georgia, serif",
  //   mono: "Menlo, monospace",
  // },
  light: {
    color: theme.colors.gray[700],
    bg: theme.colors.gray[400],
    borderColor: theme.colors.gray[200],
    placeholderColor: theme.colors.gray[500],
  },
  dark: {
    color: theme.colors.whiteAlpha[900],
    bg: theme.colors.gray[700],
    borderColor: theme.colors.whiteAlpha[300],
    placeholderColor: theme.colors.whiteAlpha[400],
  },
  // breakpoints: ["30em", "48em", "62em", "80em"],
  //   colors: {
  //     ...theme.colors,
  //     brand: {
  //       900: "#1a365d",
  //       800: "#153e75",
  //       700: "#2a69ac",
  //     },
  //   },
  //   fonts: {
  //     heading: '"Avenir Next", sans-serif',
  //     body: "system-ui, sans-serif",
  //     mono: "Menlo, monospace",
  //   },
  //   fontSizes: {
  //     xs: "0.75rem",
  //     sm: "0.875rem",
  //     md: "1rem",
  //     lg: "1.125rem",
  //     xl: "1.25rem",
  //     "2xl": "1.5rem",
  //     "3xl": "1.875rem",
  //     "4xl": "2.25rem",
  //     "5xl": "3rem",
  //     "6xl": "4rem",
  //   },
};
