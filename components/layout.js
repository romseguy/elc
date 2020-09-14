import { useColorMode, Button, Box, Heading, useTheme } from "@chakra-ui/core";
import { Header } from "./header";
import { Nav } from "./nav";
import { Footer } from "./footer";

export default function Layout({ children }) {
  const { colorMode, toggleColorMode } = useColorMode();
  const theme = useTheme();

  return (
    <>
      <Box as={Button} onClick={toggleColorMode}></Box>

      <Header />

      <Nav />

      <Box
        as="main"
        flex="1 0 auto"
        mx={10}
        mb={20}
        p={5}
        rounded="lg"
        bg={colorMode === "dark" ? theme.dark.bg : theme.light.bg}
        style={{ filter: "brightness(140%)" }}
      >
        {children}
      </Box>

      <Footer />
    </>
  );
}
