import { description } from "package.json";
import { Box, Heading, useColorMode, useTheme } from "@chakra-ui/core";
import Link from "next/link";

export const Header = (props) => {
  const theme = useTheme();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box
      py={5}
      textAlign="center"
      bg={colorMode === "dark" ? theme.dark.bg : theme.light.bg}
      style={{ filter: "brightness(120%)" }}
      {...props}
    >
      <Heading as="h1">
        <Link href="/">
          <a>{description}</a>
        </Link>
      </Heading>
    </Box>
  );
};
