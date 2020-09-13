import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/client";
import md5 from "blueimp-md5";
import { Avatar } from "evergreen-ui";

import {
  Button,
  Box,
  Flex,
  Heading,
  Image,
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
} from "@chakra-ui/core";

const MenuItems = ({ children }) => (
  <Text mt={{ base: 4, md: 0 }} mr={6} display="block">
    {children}
  </Text>
);

const LoginButton = () => {
  return (
    <Button
      bg="transparent"
      border="1px"
      onClick={(e) => {
        e.preventDefault();
        signIn();
      }}
    >
      Connexion
    </Button>
  );
};

export default function Header(props) {
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
      {session && (
        <Menu>
          <MenuButton mx={5}>
            {/* <Image
                  src={session.user.image}
                  fallbackSrc={`https://www.gravatar.com/avatar/${md5(
                    session.user.email
                  )}?d=identicon`}
                  alt="avatar"
                  width="40px"
                  height="40px"
                /> */}
            <Avatar
              src={
                session.user.image ||
                `https://www.gravatar.com/avatar/${md5(
                  session.user.email
                )}?d=identicon`
              }
              size={40}
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
      <Box
        display={{ sm: show ? "block" : "none", md: "flex" }}
        width={{ sm: "full", md: "auto" }}
        alignItems="center"
        flexGrow={1}
      >
        <MenuItems>
          <Link href="/fiches">
            <CLink>Fiches</CLink>
          </Link>
        </MenuItems>
      </Box>
      {!session && (
        <Box
          display={{ sm: show ? "block" : "none", md: "block" }}
          mt={{ base: 4, md: 0 }}
        >
          <LoginButton />
        </Box>
      )}
    </Flex>
  );

  return (
    <header>
      <noscript>
        <style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
      </noscript>

      <div className={styles.signedInStatus}>
        <p
          className={`nojs-show ${
            !session && loading ? styles.loading : styles.loaded
          }`}
        >
          {!session && (
            <>
              <span className={styles.notSignedInText}>
                Veuillez vous identifier pour accéder à toutes les
                fonctionnalités
              </span>
              <Link href={`/api/auth/signin`}>
                <Button
                  className={styles.buttonPrimary}
                  appearance="primary"
                  onClick={(e) => {
                    e.preventDefault();
                    signIn();
                  }}
                >
                  Connexion
                </Button>
              </Link>
            </>
          )}
          {session && (
            <>
              <span
                style={{
                  backgroundImage: `url(${
                    session.user.image
                      ? session.user.image
                      : `https://www.gravatar.com/avatar/${md5(
                          session.user.email
                        )}?d=identicon`
                  })`,
                }}
                className={styles.avatar}
              />
              <span className={styles.signedInText}>
                <small>Bienvenue,</small>
                <br />
                <strong>{session.user.email || session.user.name}</strong>
              </span>
              <Link href={`/api/auth/signout`}>
                <Button
                  className={styles.button}
                  onClick={(e) => {
                    e.preventDefault();
                    signOut();
                  }}
                >
                  Déconnexion
                </Button>
              </Link>
            </>
          )}
        </p>
      </div>
      <nav>
        <ul className={styles.navItems}>
          <li className={styles.navItem}>
            <Link href="/">
              <a>Public</a>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/fiches">
              <a>Fiches</a>
            </Link>
          </li>
          <li className={styles.navItem}></li>
        </ul>
      </nav>
    </header>
  );
}
