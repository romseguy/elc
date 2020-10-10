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
import { handleError } from "utils/form";

export const ProfileEditWorkshopForm = ({
  currentWorkshopRef,
  setCurrentWorkshopRef,
  selectedProfile
}) => {
  if (!currentWorkshopRef || !currentWorkshopRef.workshop) return null;

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
  const onSubmit = async (formData) => {
    setIsLoading(true);
    const { workshop } = currentWorkshopRef;

    if (formData.completed)
      workshop.skills.forEach((skill) =>
        selectedProfile.addSkill({
          _id: skill._id,
          workshop,
          date: formData.completed
        })
      );

    currentWorkshopRef.fromUi(formData);
    const { data, error } = await selectedProfile.update();
    if (error) handleError(error);
    setIsLoading(false);
    setCurrentWorkshopRef();
  };
  const onModalClose = () => {};
  const started = watch("started", currentWorkshopRef.started);
  const completed = watch("completed", currentWorkshopRef.completed);

  return (
    <Modal isOpen={isOpen} onClose={onModalClose}>
      <ModalOverlay>
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              <FormControl
                id="name"
                isInvalid={!!errors["name"]}
                ml={5}
                mb={5}
                isDisabled
              >
                <FormLabel>Nom de l'atelier</FormLabel>

                <Input
                  name="name"
                  ref={register()}
                  defaultValue={currentWorkshopRef.workshop.name}
                />
                <FormErrorMessage>
                  <ErrorMessage errors={errors} name="name" />
                </FormErrorMessage>
              </FormControl>

              <FormControl
                id="started"
                isInvalid={!!errors["started"]}
                m={5}
                mt={0}
              >
                <FormLabel>Date à laquelle l'atelier a été commencé</FormLabel>
                <Controller
                  name="started"
                  control={control}
                  defaultValue={currentWorkshopRef.started || null}
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

              <FormControl
                id="completed"
                isInvalid={!!errors["completed"]}
                isDisabled={!started}
                m={5}
                mt={0}
              >
                <FormLabel>Date à laquelle l'atelier a été terminé</FormLabel>
                <Controller
                  name="completed"
                  control={control}
                  defaultValue={currentWorkshopRef.completed || null}
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
                  <ErrorMessage errors={errors} name="completed" />
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
                {completed
                  ? "Terminer l'atelier"
                  : started
                  ? "Commencer l'atelier"
                  : "Modifier"}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
