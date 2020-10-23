import theme from "@chakra-ui/theme";
import { mode } from "@chakra-ui/theme-tools";

const formStyles = (props) => ({
  ".chakra-form__error-message": {
    color: "red.600"
  },
  ".react-select-container": {
    ".react-select__control": {
      backgroundColor: mode("white", "whiteAlpha.100")(props),
      //border: 0,
      borderColor: mode("gray.200", "whiteAlpha.100")(props),
      ".react-select__placeholder": {
        color: mode("gray.400", "gray.400")(props)
      }
    },

    ".react-select__multi-value": {
      backgroundColor: mode("gray.400", "whiteAlpha.400")(props),
      borderRadius: "md",
      ".react-select__multi-value__label": {
        color: mode("black", "white")(props)
      },
      ".react-select__multi-value__remove": {
        ":hover": {
          cursor: "pointer",
          color: "red",
          borderRadius: "md",
          backgroundColor: mode("black", "white")(props)
        }
      }
    },

    ".react-select__clear-indicator": {
      color: mode("black", "white")(props)
    },
    ".react-select__dropdown-indicator": {
      color: mode("black", "white")(props)
    },

    ".react-select__menu": {
      ".react-select__menu-list": {
        backgroundColor: mode("orange.300", "black")(props),
        color: mode("black", "white")(props),
        ".react-select__option": {
          backgroundColor: mode("white", "gray.700")(props),
          "&:hover": {
            cursor: "pointer",
            backgroundColor: mode("orange.200", "gray.500")(props),
            color: mode("black", "white")(props)
            //color: mode("white", "black")(props)
          }
        }
      }
    }
  }
});

export default {
  global: (props) => {
    const customGlobalStyles = {
      //...theme.styles.global(props),
      "html, body, #__next": {
        lineHeight: "normal",
        height: "100%",
        backgroundColor: mode("orange.50", "gray.600")(props),
        color: mode("black", "white")(props)
      },
      "body, #__next": {
        display: "flex",
        flexDirection: "column"
      },
      ...formStyles(props)
    };

    return customGlobalStyles;
  }
};
