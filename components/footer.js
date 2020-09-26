import { version } from "../package.json";
import { Box, useColorModeValue, useTheme } from "@chakra-ui/core";
import { styled } from "twin.macro";

const Menu = styled.ul`
  padding: 0;
  list-style: none;
`;

const MenuItem = styled.li`
  display: inline-block;
  margin-right: 1rem;
`;

export const Footer = (props) => {
  const bg = useColorModeValue("gray.400", "gray.700");

  return (
    <Box
      as="footer"
      py={5}
      bg={bg}
      style={{ filter: "brightness(120%)" }}
      {...props}
    >
      <Menu>
        <MenuItem>
          <em>{version}</em>
        </MenuItem>
      </Menu>
    </Box>
  );
};
