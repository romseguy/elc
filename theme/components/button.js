import { mode } from "@chakra-ui/theme-tools";

export const Button = {
  baseStyle: (props) => {
    let base = {
      textTransform: "uppercase",
      borderRadius: "lg",
    };

    if (props.type === "submit") {
      base = {
        ...base,
      };
    }

    return base;
  },
  sizes: {
    sm: {
      fontSize: "sm",
      padding: ".5rem",
    },
    md: {
      fontSize: "md",
      padding: ".5rem",
    },
  },
  variants: {
    outline: {
      border: "1px solid",
    },
  },
  defaultProps: {
    size: "sm",
    colorScheme: "green",
  },
};
