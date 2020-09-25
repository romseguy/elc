import { signIn, signOut, useSession } from "next-auth/client";
import md5 from "blueimp-md5";

import tw, { styled } from "twin.macro";
import {
  Button,
  Box,
  Flex,
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
  Avatar,
} from "@chakra-ui/core";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { Link } from "./link";

const MenuItems = ({ children }) => {
  const W = styled(Text)`
    a {
      ${tw`mr-4`}
    }
  `;
  return (
    <W mt={{ base: 4, md: 0 }} mr={6} display="block">
      {children}
    </W>
  );
};

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
            <Link href="/fiches">Élèves</Link>
            <Link href="/competences">Compétences</Link>
            <Link href="/parents">Parents</Link>
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
              w="48px"
              h="48px"
            />
          </MenuButton>
          <MenuList border={0} p={0} style={{ zIndex: "99999" }}>
            {/* should be fixed in chakra-ui 1.0 */}
            <MenuItem>Paramètres</MenuItem>
            <MenuItem onClick={toggleColorMode}>
              {!colorMode || colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            </MenuItem>
            <MenuItem onClick={() => signOut()}>Déconnexion</MenuItem>
          </MenuList>
        </Menu>
      )}
    </Flex>
  );
};
