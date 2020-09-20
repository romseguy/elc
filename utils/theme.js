import { theme as chakraTheme } from "@chakra-ui/core";

const theme = {
  ...chakraTheme,
  colors: {
    ...chakraTheme.colors,
    black: "#16161D",
    select: {
      900: "#505C73",
    },
  },
  fonts: {
    ...chakraTheme.fonts,
    body:
      '-apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  },
};

theme.light = {
  color: theme.colors.gray[700],
  bg: theme.colors.gray[400],
  borderColor: theme.colors.gray[800],
  placeholderColor: theme.colors.gray[500],
  hover: {
    bg: theme.colors.gray[300],
  },
};

theme.dark = {
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
};

export default theme;
