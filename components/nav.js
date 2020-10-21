import { useState } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { signIn, signOut } from "next-auth/client";
import { useSession } from "utils/useAuth";
import md5 from "blueimp-md5";
import tw, { styled, css } from "twin.macro";
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
  useColorModeValue,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Switch,
  FormErrorMessage
} from "@chakra-ui/core";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { Link } from "components";
import { ErrorMessageText } from "./error-message-text";

const linkList = css`
  a {
    ${tw`mr-4`}
  }
`;

export const Nav = (props) => {
  const [session] = useSession();
  const { toggleColorMode } = useColorMode();
  const icon = useColorModeValue(<MoonIcon />, <SunIcon />);

  // login form
  const {
    control,
    register,
    handleSubmit,
    watch,
    errors,
    setError,
    clearErrors
  } = useForm({
    mode: "onChange"
  });
  const togglePassword = watch("togglePassword", false);
  const [isLoading, setIsLoading] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: false });
  const onLoginClick = async (e) =>
    process.env.NEXT_PUBLIC_IS_TEST ? await signIn("test-auth") : onOpen();

  const onChange = (e) => {
    clearErrors("formErrorMessage");
  };

  const onSubmit = async (formData) => {
    const { username, password, email } = formData;
    setIsLoading(true);

    try {
      if (togglePassword) {
        await signIn("credentials", { username, password });
      } else {
        await signIn("email", { email });
      }
    } catch (error) {
      setError("formErrorMessage", error);
    }
  };

  const styles = css`
    ${useColorModeValue(
      //tw`h-24 bg-gradient-to-r from-red-600 via-white to-purple-600`,
      tw`h-24 bg-gradient-to-b from-orange-100 via-orange-400 to-orange-100`,
      tw`h-24 bg-gradient-to-b from-gray-700 via-gray-900 to-gray-700`
    )}
  `;

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      {...props}
      css={styles}
    >
      <Box css={linkList} ml={10}>
        {session ? (
          <>
            <Link href="/fiches">Élèves</Link>
            <Link href="/competences">Compétences</Link>
            <Link href="/ateliers">Ateliers</Link>
            <Link href="/observations">Observations</Link>
            <Link href="/parents">Parents</Link>
          </>
        ) : (
          <></>
        )}
      </Box>

      {session ? (
        <Menu>
          <MenuButton mr={10}>
            <Avatar
              src={
                session.user.image
                  ? session.user.image
                  : !process.env.NEXT_PUBLIC_OFFLINE
                  ? `https://www.gravatar.com/avatar/${md5(
                      session.user.email
                    )}?d=identicon`
                  : ""
              }
              w="48px"
              h="48px"
            />
          </MenuButton>
          <MenuList border={0} p={0}>
            <MenuItem>Paramètres</MenuItem>
            <MenuItem onClick={toggleColorMode}>{icon}</MenuItem>
            <MenuItem onClick={() => signOut()}>Déconnexion</MenuItem>
          </MenuList>
        </Menu>
      ) : (
        <Box mr={10}>
          <Button variant="outline" onClick={onLoginClick}>
            Connexion
          </Button>
        </Box>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay>
          <ModalContent>
            <ModalHeader onClick={toggleColorMode}>Connexion</ModalHeader>
            <ModalCloseButton />
            <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
              <ModalBody>
                {togglePassword && (
                  <FormControl
                    id="username"
                    isRequired
                    isInvalid={!!errors["username"]}
                    ml={5}
                    mb={5}
                  >
                    <FormLabel>Nom d'utilisateur</FormLabel>

                    <Input
                      name="username"
                      ref={register({
                        required: "Veuillez saisir un nom d'utilisateur"
                      })}
                    />
                    <FormErrorMessage>
                      <ErrorMessage errors={errors} name="username" />
                    </FormErrorMessage>
                  </FormControl>
                )}

                {!togglePassword && (
                  <FormControl
                    id="email"
                    isRequired
                    isInvalid={!!errors["email"]}
                    m={5}
                    mt={0}
                  >
                    <FormLabel>Adresse email</FormLabel>
                    <Input
                      name="email"
                      placeholder="votre-adresse-email@gmail.com"
                      ref={register({
                        required: "Veuillez saisir un email",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Adresse email invalide"
                        }
                      })}
                    />
                    <FormErrorMessage>
                      <ErrorMessage errors={errors} name="email" />
                    </FormErrorMessage>
                  </FormControl>
                )}

                <FormControl id="togglePassword" ml={5} display="inline-flex">
                  <FormLabel>Mot de passe</FormLabel>
                  <Switch
                    name="togglePassword"
                    ref={register}
                    id="togglePassword"
                  />
                </FormControl>

                {togglePassword && (
                  <FormControl
                    id="password"
                    ml={5}
                    isRequired
                    isInvalid={!!errors["password"]}
                  >
                    <Input
                      name="password"
                      ref={register({
                        required: "Veuillez saisir un mot de passe"
                      })}
                      type="password"
                    />
                    <FormErrorMessage>
                      <ErrorMessage errors={errors} name="password" />
                    </FormErrorMessage>
                  </FormControl>
                )}

                <ErrorMessage
                  errors={errors}
                  name="formErrorMessage"
                  render={({ message }) => (
                    <Stack isInline p={5} mb={5} shadow="md" color="red.500">
                      <WarningIcon boxSize={5} />
                      <Box>
                        <ErrorMessageText>{message}</ErrorMessageText>
                      </Box>
                    </Stack>
                  )}
                />
              </ModalBody>

              <ModalFooter>
                <Button
                  colorScheme="blue"
                  type="submit"
                  isLoading={isLoading}
                  isDisabled={Object.keys(errors).length > 0}
                >
                  Connexion
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </Flex>
  );
};
