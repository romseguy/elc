import theme from "@chakra-ui/theme";
import { mode } from "@chakra-ui/theme-tools";

const formStyles = (props) => ({
  ".chakra-form__error-message": {
    color: "red.600",
  },
  ".react-select-container": {
    ".react-select__control": {
      backgroundColor: mode("white", "gray.600")(props),
      border: 0,
    },

    ".react-select__multi-value": {
      backgroundColor: mode("gray.400", "gray.700")(props),
      borderRadius: "md",
      ".react-select__multi-value__label": {
        color: mode("black", "white")(props),
      },
      ".react-select__multi-value__remove": {
        ":hover": {
          cursor: "pointer",
          color: "red",
          borderRadius: "md",
          backgroundColor: mode("black", "white")(props),
        },
      },
    },

    ".react-select__clear-indicator": {
      color: mode("black", "white")(props),
    },
    ".react-select__dropdown-indicator": {
      color: mode("black", "white")(props),
    },

    ".react-select__menu": {
      ".react-select__menu-list": {
        backgroundColor: "black",
        color: "white",
        ".react-select__option": {
          backgroundColor: "black",
          "&:hover": {
            cursor: "pointer",
            backgroundColor: "white",
            color: "black",
          },
        },
      },
    },
  },
});

export default {
  global: (props) => {
    const customGlobalStyles = {
      //...theme.styles.global(props),
      "html, body, #__next": {
        lineHeight: "normal",
        height: "100%",
        backgroundColor: mode("white", "gray.800")(props),
        color: mode("black", "white")(props),
      },
      "body, #__next": {
        display: "flex",
        flexDirection: "column",
      },
      ...formStyles(props),
    };

    return customGlobalStyles;
  },
};