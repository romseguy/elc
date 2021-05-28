import { version } from "package.json";
import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import tw, { styled, css } from "twin.macro";
import { Link } from "components";

const Menu = styled.div`
  display: block;
  padding: 0;
`;

const MenuRight = styled.div`
  display: flex;
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
      justifyContent="space-between"
      py={5}
      px={10}
      {...props}
      css={styles}
    >
      <Menu>
        <Link href="/admin">Administration</Link>
      </Menu>
      <MenuRight>
        <Link href="https://github.com/romseguy/elc">{version}</Link>@
        {process.env.NEXT_PUBLIC_VERCEL_ENV === undefined
          ? "local"
          : process.env.NEXT_PUBLIC_VERCEL_ENV}
      </MenuRight>
    </Flex>
  );
};
