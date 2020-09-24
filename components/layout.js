import { useColorMode, Box, useTheme, IconButton } from "@chakra-ui/core";
import { Header } from "./header";
import { Nav } from "./nav";
import { Footer } from "./footer";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

export default function Layout({ children }) {
  const { colorMode, toggleColorMode } = useColorMode();
  const theme = useTheme()[colorMode || "light"];

  return (
    <>
      {/* <IconButton
        icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
        onClick={toggleColorMode}
      /> */}

      <Header />

      <Nav />

      <Box
        as="main"
        flex="1 0 auto"
        mx={10}
        mb={20}
        p={5}
        rounded="lg"
        bg={theme.bg}
        style={{ filter: "brightness(140%)" }}
      >
        {children}
      </Box>

      <Footer />
    </>
  );
}
