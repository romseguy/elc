import tw, { css } from "twin.macro";
import {
  useColorMode,
  Box,
  IconButton,
  useColorModeValue,
  Flex
} from "@chakra-ui/core";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { Header } from "./header";
import { Nav } from "./nav";
import { Footer } from "./footer";

export const Layout = ({ children }) => {
  const { toggleColorMode } = useColorMode();
  const icon = useColorModeValue(<MoonIcon />, <SunIcon />);
  const styles = css`
    ${useColorModeValue(tw`bg-orange-300`, tw`bg-orange-600`)}
  `;

  return (
    <>
      {/* <IconButton icon={icon} onClick={toggleColorMode} /> */}

      <Header />

      <Nav />

      <Box as="main" flex="1 0 auto" p={5} /* css={styles} */>
        {children}
      </Box>

      <Footer />
    </>
  );
};
