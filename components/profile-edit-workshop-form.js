import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  useDisclosure
} from "@chakra-ui/core";
import { WarningIcon } from "@chakra-ui/icons";
import { DatePicker } from "components";
import { format, subYears } from "date-fns";
import { ErrorMessageText } from "./error-message-text";

export const ProfileEditWorkshopForm = ({
  currentWorkshopRef,
  setCurrentWorkshopRef
}) => {
  if (!currentWorkshopRef) return null;

  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: false });
  const [isLoading, setIsLoading] = useState(false);
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
  useEffect(() => {
    if (currentWorkshopRef) onOpen();
    else onClose();
  }, [currentWorkshopRef]);

  const onChange = (e) => {
    clearErrors("formErrorMessage");
  };
  const onSubmit = async (formData) => {};
  const onModalClose = () => setCurrentWorkshopRef();

  return (
    <Modal isOpen={isOpen} onClose={onModalClose}>
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>Modification de l'atelier</ModalHeader>
          <ModalCloseButton />
          <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              <FormControl
                id="name"
                isRequired
                isInvalid={!!errors["name"]}
                ml={5}
                mb={5}
              >
                <FormLabel>Nom</FormLabel>

                <Input
                  name="name"
                  ref={register({ required: true })}
                  defaultValue={currentWorkshopRef.workshop.name}
                />
                <FormErrorMessage>
                  <ErrorMessage
                    errors={errors}
                    name="name"
                    message="Veuillez saisir un nom d'atelier"
                  />
                </FormErrorMessage>
              </FormControl>

              <FormControl
                id="started"
                isInvalid={!!errors["started"]}
                m={5}
                mt={0}
              >
                <FormLabel>Date de début</FormLabel>
                <Controller
                  name="started"
                  control={control}
                  defaultValue={currentWorkshopRef.started || ""}
                  render={(props) => (
                    <DatePicker
                      minDate={subYears(new Date(), 1)}
                      maxDate={new Date()}
                      placeholderText={format(new Date(), "dd/MM/yyyy")}
                      {...props}
                    />
                  )}
                />
                <FormErrorMessage>
                  <ErrorMessage errors={errors} name="started" />
                </FormErrorMessage>
              </FormControl>

              <ErrorMessage
                errors={errors}
                name="formErrorMessage"
                render={({ message }) => (
                  <Stack isInline p={5} mb={5} shadow="md" color="red.600">
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
                Modifier
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
