import {
  useColorMode,
  Box,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/core";
import { Header } from "./header";
import { Nav } from "./nav";
import { Footer } from "./footer";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

export default function Layout({ children }) {
  const { toggleColorMode } = useColorMode();
  const bg = useColorModeValue("gray.400", "gray.700");
  const icon = useColorModeValue(<MoonIcon />, <SunIcon />);

  return (
    <>
      {/* <IconButton icon={icon} onClick={toggleColorMode} /> */}

      <Header />

      <Nav />

      <Box
        as="main"
        flex="1 0 auto"
        mx={10}
        mb={20}
        p={5}
        rounded="lg"
        bg={bg}
        style={{ filter: "brightness(140%)" }}
      >
        {children}
      </Box>

      <Footer />
    </>
  );
}
