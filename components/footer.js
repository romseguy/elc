import Link from "next/link";
import styles from "./footer.module.css";
import { version } from "../package.json";
import { Box, useColorMode } from "@chakra-ui/core";
import theme from "utils/theme";

export default function Footer() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Box
      as="footer"
      py={5}
      bg={colorMode === "dark" ? theme.dark.bg : theme.light.bg}
      style={{ filter: "brightness(120%)" }}
    >
      <ul className={styles.navItems}>
        <li className={styles.navItem}>
          <em>{version}</em>
        </li>
      </ul>
    </Box>
  );
}
