export const Button = {
  // The styles all button have in common
  baseStyle: ({ colorMode }) => ({
    fontWeight: "bold",
    textTransform: "uppercase",
  }),
  // Two sizes: sm and md
  sizes: {
    sm: {
      fontSize: "12px",
      padding: "22px",
    },
    md: {
      fontSize: "16px",
      padding: "44x",
    },
  },
  // Two variants: outline and solid
  variants: {
    outline: {
      border: "2px solid",
      borderColor: "green.500",
    },
    solid: {
      bg: "green.500",
      color: "white",
    },
  },
  // The default size and variant values
  defaultProps: {
    size: "md",
    variant: "outline",
  },
};
