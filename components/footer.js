import { version } from "../package.json";
import { Box, Flex, useColorModeValue } from "@chakra-ui/core";
import tw, { styled, css } from "twin.macro";

const Menu = styled.ul`
  padding: 0;
  list-style: none;
`;

const MenuItem = styled.li`
  display: inline-block;
  margin-right: 1rem;
`;

export const Footer = (props) => {
  const bg = useColorModeValue("gray.400", "gray.600");
  const styles = css`
    ${useColorModeValue(
      tw`h-24 bg-gradient-to-b from-orange-100 via-orange-400 to-orange-100`,
      tw`h-24 bg-gradient-to-b from-gray-700 via-gray-900 to-gray-700`
    )}
  `;

  return (
    <Flex
      as="footer"
      alignItems="center"
      justifyContent="center"
      py={5}
      {...props}
      css={styles}
    >
      <Menu>
        <MenuItem>
          <em>{version}</em>
        </MenuItem>
      </Menu>
    </Flex>
  );
};
