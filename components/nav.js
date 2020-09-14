import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/client";
import md5 from "blueimp-md5";

import {
  Button,
  Box,
  Flex,
  Link as CLink,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  MenuDivider,
  MenuOptionGroup,
  MenuItemOption,
  useColorMode,
  Icon,
  Avatar,
} from "@chakra-ui/core";

const MenuItems = ({ children }) => (
  <Text mt={{ base: 4, md: 0 }} mr={6} display="block">
    {children}
  </Text>
);

const LoginButton = (props) => {
  return (
    <Button
      bg="transparent"
      border="1px"
      onClick={(e) => {
        e.preventDefault();
        signIn();
      }}
      {...props}
    >
      Connexion
    </Button>
  );
};

export const Nav = (props) => {
  const [session, loading] = useSession();
  const { colorMode, toggleColorMode } = useColorMode();
  const [show, setShow] = React.useState(false);
  const handleToggle = () => setShow(!show);

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      my={5}
      {...props}
    >
      <Box
        display={{ sm: show ? "block" : "none", md: "flex" }}
        width={{ sm: "full", md: "auto" }}
        alignItems="center"
        flexGrow={1}
        ml={10}
      >
        {session && (
          <MenuItems>
            <Link href="/fiches">
              <CLink>Fiches</CLink>
            </Link>
          </MenuItems>
        )}
      </Box>
      <Box display={{ sm: "block", md: "none" }} onClick={handleToggle}>
        <svg
          fill="white"
          width="12px"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
        </svg>
      </Box>
      {!session && (
        <Box
          display={{ sm: show ? "block" : "none", md: "block" }}
          mt={{ base: 4, md: 0 }}
        >
          <LoginButton mr={10} />
        </Box>
      )}
      {session && (
        <Menu>
          <MenuButton mr={10}>
            <Avatar
              src={
                session.user.image ||
                `https://www.gravatar.com/avatar/${md5(
                  session.user.email
                )}?d=identicon`
              }
              size="md"
            />
          </MenuButton>
          <MenuList border={0} p={0}>
            <MenuItem>Paramètres</MenuItem>
            <MenuItem onClick={toggleColorMode}>
              {colorMode === "light" ? (
                <Icon name="moon" />
              ) : (
                <Icon name="sun" />
              )}
            </MenuItem>
            <MenuItem onClick={() => signOut()}>Déconnexion</MenuItem>
          </MenuList>
        </Menu>
      )}
    </Flex>
  );
};