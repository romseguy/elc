import { description } from "package.json";
import { useColorMode, Button, Box, Heading } from "@chakra-ui/core";
import theme from "utils/theme";
import Header from "./header";
import Footer from "./footer";
import Link from "next/link";

export default function Layout({ children }) {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      <Button onClick={toggleColorMode}></Button>
      <Box
        py={5}
        textAlign="center"
        bg={colorMode === "dark" ? theme.dark.bg : theme.light.bg}
        style={{ filter: "brightness(120%)" }}
      >
        <Heading as="h1">
          <Link href="/">
            <a>{description}</a>
          </Link>
        </Heading>
      </Box>

      <Header />

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
