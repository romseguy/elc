import { description } from "package.json";
import {
  Box,
  Heading,
  useColorMode,
  useColorModeValue,
  useTheme,
} from "@chakra-ui/core";
import { Link } from "./link";

export const Header = (props) => {
  const bg = useColorModeValue("gray.400", "gray.700");

  return (
    <Box
      as="header"
      py={5}
      textAlign="center"
      bg={bg}
      style={{ filter: "brightness(120%)" }}
      {...props}
    >
      <Heading as="h1">
        <Link href="/">{description}</Link>
      </Heading>
    </Box>
  );
};
